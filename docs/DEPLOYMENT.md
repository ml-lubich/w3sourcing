# Deployment

## Toolchain

- **Package manager:** **Bun** only for install and scripts. Keep **`bun.lock`** in the repo; do **not** add `package-lock.json` (or other lockfiles) at the project root, or Vercel may infer npm instead of Bun.
- **`package.json`** declares `"packageManager": "bun@…"` for Corepack-aligned tooling.

## Local

1. Install [Bun](https://bun.sh) (match the `packageManager` version when practical).
2. `bun install`
3. `bun run dev` — development server.
4. `bun run build` — production build (same path Vercel uses).

## SEO (canonical URL)

Search metadata (Open Graph, Twitter cards, `sitemap.xml`, `robots.txt`, and JSON-LD) resolve absolute URLs from **`NEXT_PUBLIC_SITE_URL`**.

1. In Vercel → Project → **Settings → Environment Variables**, set **`NEXT_PUBLIC_SITE_URL`** to your primary public origin (example: `https://www.w3sourcing.com`). Include the scheme (`https://`); a trailing slash is optional.
2. Optionally set **`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`** to the content value from Google Search Console (the string inside the `content` attribute of the meta tag), so the verified ownership tag is emitted.

If `NEXT_PUBLIC_SITE_URL` is unset, the app falls back to **`VERCEL_URL`** on Vercel deployments, then to **`w3sourcing.com`** for local or other environments—set the variable in production so canonicals and the sitemap match your live domain.

## Vercel

1. Connect the Git repository; root directory = repo root (where `package.json` and `bun.lock` live).
2. **`vercel.json`** sets **`installCommand`** to `bun install --frozen-lockfile` and **`buildCommand`** to `bun run lint && bun run build && bun run smoke:routes:ci` so installs and builds use Bun, lint runs before the production build, and each deployment validates routes without a second `next build` (see `docs/TESTING.md`).
3. In the Vercel dashboard, avoid overriding Install Command / Build Command unless they stay Bun-equivalent (otherwise you can undo `vercel.json`).
4. Deploy; in build logs, confirm the install step runs **`bun install`** (frozen lockfile) and the build step completes the route smoke.

### Tailwind v4 and the production CSS bundle

`src/app/globals.css` imports Tailwind with **`@import "tailwindcss" source("../..");`** so class detection is anchored at the **app root** (relative to the stylesheet), not only `process.cwd()`. If that import used the default base and the build’s working directory did not match the app root, Tailwind could emit a tiny CSS chunk with almost no utilities—pages would look unstyled on Vercel while `bun run build` looked fine locally. After changing Tailwind entry or app layout paths, keep that `source(..)` segment aligned with the repo layout.

## CI (GitHub Actions)

**`.github/workflows/ci.yml`** runs on pushes and pull requests to `main` / `master`: `bun install --frozen-lockfile`, then **`bun run ci`** (`lint` + `test` + `build`), then **`bun run smoke:routes:ci`** so PRs match the same gates as Vercel’s build command (minus duplicate `lint` on Vercel’s side, which still runs in the Vercel build step).

Install sets **`HUSKY=0`** so Husky does not run during CI install.
