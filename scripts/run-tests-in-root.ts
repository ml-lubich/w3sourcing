import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(repoRoot);

const steps: readonly (readonly string[])[] = [
  ["bun", "test", "./src"],
  ["bunx", "tsc", "--noEmit"],
];

for (const argv of steps) {
  const [cmd, ...args] = argv;
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: false });
  if (result.status === null || result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
  }
}
