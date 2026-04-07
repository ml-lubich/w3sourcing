import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const devLockPath = path.join(repoRoot, ".next", "dev", "lock");

function sleepSync(ms: number): void {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    /* wait */
  }
}

function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ESRCH") return false;
    throw e;
  }
}

function readDevLockPid(): number | null {
  try {
    const raw = fs.readFileSync(devLockPath, "utf8");
    const parsed = JSON.parse(raw) as { pid?: number };
    return typeof parsed.pid === "number" && Number.isFinite(parsed.pid)
      ? parsed.pid
      : null;
  } catch {
    return null;
  }
}

/**
 * Next.js 16 allows only one `next dev` per project directory (`.next/dev/lock`).
 * Auto-stop the previous dev server so `bun run dev` is repeatable without manual `kill`.
 * Set `W3_REPLACE_NEXT_DEV=0` to skip (you will get the stock Next error if one is already running).
 */
function stopPriorNextDevIfLocked(): void {
  if (process.env.W3_REPLACE_NEXT_DEV === "0") return;

  const pid = readDevLockPid();
  if (pid === null) return;

  if (!isProcessAlive(pid)) {
    try {
      fs.unlinkSync(devLockPath);
    } catch {
      //
    }
    return;
  }

  try {
    process.kill(pid, "SIGTERM");
  } catch {
    //
  }

  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline && isProcessAlive(pid)) {
    sleepSync(200);
  }

  if (isProcessAlive(pid)) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      //
    }
    sleepSync(300);
  }

  const lockDeadline = Date.now() + 5000;
  while (Date.now() < lockDeadline) {
    try {
      fs.readFileSync(devLockPath);
      sleepSync(100);
    } catch {
      return;
    }
  }

  try {
    fs.unlinkSync(devLockPath);
  } catch {
    //
  }
}

process.chdir(repoRoot);
stopPriorNextDevIfLocked();

const nextArgs = process.argv.slice(2);
const result = spawnSync("bun", ["--bun", "next", "dev", ...nextArgs], {
  stdio: "inherit",
  shell: false,
});
process.exit(result.status === null ? 1 : result.status);
