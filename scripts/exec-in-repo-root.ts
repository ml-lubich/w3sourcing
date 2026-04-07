import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(repoRoot);

const command = process.argv[2];
const args = process.argv.slice(3);
if (command === undefined) {
  console.error("exec-in-repo-root: missing command (e.g. bun --bun next dev)");
  process.exit(1);
}

const result = spawnSync(command, args, { stdio: "inherit", shell: false });
process.exit(result.status === null ? 1 : result.status);
