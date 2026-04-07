# W3 Sourcing

Next.js marketing site. **Use [Bun](https://bun.sh) for all installs and scripts** (see `packageManager` in `package.json`).

## Setup (step by step)

1. Install Bun (version aligned with `packageManager` in `package.json` when possible).
2. From the repo root: `bun install`
3. `bun run dev` — opens the URL Next prints (default port **3000**, or the next free port if 3000 is taken; use `bun run dev -- -p 0` for an OS-assigned port). A **second** `next dev` for the same folder is not allowed by Next 16; this repo stops the previous dev server (using `.next/dev/lock`) before starting, so `bun run dev` is safe to re-run. To disable that, set `W3_REPLACE_NEXT_DEV=0`. Other scripts (`build`, `start`, `lint`) still use `exec-in-repo-root` so they work from a parent directory.

## Scripts

| Command                    | Purpose                                                         |
| -------------------------- | --------------------------------------------------------------- |
| `bun run dev`              | Development server                                              |
| `bun run build`            | Production build                                                |
| `bun run start`            | Serve production build                                          |
| `bun run lint`             | ESLint                                                          |
| `bun run test`             | Unit tests (`src/`) + TypeScript check                          |
| `bun run smoke:routes`     | Route smoke (default: build + `next start`)                     |
| `bun run smoke:routes:dev` | Route smoke against `next dev` (avoid if dev server is running) |
| `bun run smoke:routes:ci`  | Smoke after an existing build (`SMOKE_SKIP_BUILD=1`)            |

## Deploy on Vercel (step by step)

1. Push the repo; ensure **`bun.lock`** is committed and there is **no** root `package-lock.json`.
2. Import the project in [Vercel](https://vercel.com/new); defaults should pick up **`vercel.json`** (`bun install --frozen-lockfile`, then `bun run build`).
3. Confirm in the deployment build log that dependencies install with **Bun**.

More detail: **`docs/DEPLOYMENT.md`**.
