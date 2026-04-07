import { spawn, type ChildProcess } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pageDirToUrlPath } from "../src/lib/page-dir-to-url-path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(REPO_ROOT, "src", "app");
const READY_MS = 90_000;
const FETCH_TIMEOUT_MS = 15_000;

async function getFreePort(): Promise<number> {
  return await new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      server.close(() => {
        if (addr && typeof addr === "object") {
          resolve(addr.port);
          return;
        }
        reject(new Error("Could not allocate port"));
      });
    });
    server.on("error", reject);
  });
}

async function collectPageDirs(dir: string): Promise<string[]> {
  const dirs: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      //
      dirs.push(...(await collectPageDirs(full)));
    } else if (
      ent.isFile() &&
      (ent.name === "page.tsx" ||
        ent.name === "page.jsx" ||
        ent.name === "page.mdx" ||
        ent.name === "page.ts")
    ) {
      dirs.push(dir);
    }
  }
  return dirs;
}

async function discoverRoutes(): Promise<string[]> {
  const pageDirs = await collectPageDirs(APP_DIR);
  const urls = new Set<string>();
  for (const d of pageDirs) {
    const u = pageDirToUrlPath(APP_DIR, d);
    if (u) urls.add(u);
  }
  return [...urls].sort((a, b) => a.localeCompare(b));
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForReady(
  port: number,
  label: string,
  getServerExitCode: () => number | null,
): Promise<void> {
  const started = Date.now();
  const url = `http://127.0.0.1:${port}/`;
  while (Date.now() - started < READY_MS) {
    const early = getServerExitCode();
    if (early !== null) {
      throw new Error(`${label} exited early with code ${String(early)}`);
    }
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(2000),
      });
      // Any HTTP status means the TCP listener is accepting (including 500 during boot).
      if (res.status >= 100 && res.status <= 599) return;
    } catch {
      //
    }
    await sleep(400);
  }
  throw new Error(`${label} did not become ready on port ${port} within ${READY_MS}ms`);
}

async function fetchStatus(port: number, pathname: string): Promise<number> {
  const url = `http://127.0.0.1:${port}${pathname}`;
  const res = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  return res.status;
}

function killTree(proc: ChildProcess): void {
  try {
    proc.kill("SIGTERM");
  } catch {
    //
  }
}

async function runSmoke(mode: "dev" | "start"): Promise<void> {
  const routes = await discoverRoutes();
  if (routes.length === 0) {
    throw new Error(`No routes discovered under ${APP_DIR}`);
  }

  const port = await getFreePort();
  const nextBin = path.join(REPO_ROOT, "node_modules", ".bin", "next");
  const cmd =
    mode === "dev"
      ? [nextBin, "dev", "-p", String(port), "-H", "127.0.0.1"]
      : [nextBin, "start", "-p", String(port), "-H", "127.0.0.1"];

  if (mode === "start") {
    const skipBuild =
      process.env.SMOKE_SKIP_BUILD === "1" ||
      process.env.SMOKE_SKIP_BUILD === "true";
    if (skipBuild) {
      try {
        await stat(path.join(REPO_ROOT, ".next", "BUILD_ID"));
      } catch {
        throw new Error(
          "SMOKE_SKIP_BUILD is set but .next output is missing; run build first",
        );
      }
    } else {
      const build = spawn("bun", ["run", "build"], {
        cwd: REPO_ROOT,
        stdio: "inherit",
        env: process.env,
      });
      const code = await new Promise<number>((resolve) => {
        build.on("exit", (c) => resolve(c ?? 1));
      });
      if (code !== 0) {
        throw new Error(`next build failed with exit ${code}`);
      }
    }
  }

  const child = spawn(cmd[0], cmd.slice(1), {
    cwd: REPO_ROOT,
    // `next start` exits immediately if stdout/stderr are fully closed (`ignore`). Drain pipes
    // instead of letting them fill (which would also deadlock the process).
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env },
  });
  child.stdout.on("data", () => {});
  child.stderr.on("data", () => {});

  let serverExitCode: number | null = null;
  child.on("exit", (code) => {
    serverExitCode = code ?? 1;
  });

  try {
    await waitForReady(
      port,
      mode === "dev" ? "next dev" : "next start",
      () => serverExitCode,
    );

    const failures: string[] = [];
    for (const pathname of routes) {
      const status = await fetchStatus(port, pathname);
      if (status === 404 || status >= 500)
        failures.push(`${pathname} -> ${String(status)}`);
    }

    if (failures.length > 0) {
      throw new Error(
        `Smoke failed (404 or 5xx):\n${failures.map((l) => `- ${l}`).join("\n")}`,
      );
    }

    console.log(`smoke-no-404: OK (${String(routes.length)} routes, mode=${mode})`);
  } finally {
    killTree(child);
    await sleep(500);
  }
}

// Default `start`: avoids Next.js single-dev-server lock when a dev server is already running.
const modeEnv = process.env.SMOKE_MODE;
const mode: "dev" | "start" =
  modeEnv === "dev" ? "dev" : "start";

try {
  await runSmoke(mode);
} catch (err: unknown) {
  console.error(err);
  process.exit(1);
}
