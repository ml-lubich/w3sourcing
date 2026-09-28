# Deployment

## Table of contents

- [Toolchain](#toolchain)
- [Local](#local)
- [SEO (canonical URL)](#seo-canonical-url)
- [Vercel](#vercel)
- [Jobs database (Supabase)](#jobs-database-supabase)
- [CI (GitHub Actions)](#ci-github-actions)

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
2. **`vercel.json`** sets **`installCommand`** to `bun install --frozen-lockfile` and **`buildCommand`** to `bun run ci && bun run smoke:routes:ci` so installs and builds use Bun, every deployment runs lint, tests, the production build, and route smoke without a second `next build` (see `docs/TESTING.md`).
3. In the Vercel dashboard, avoid overriding Install Command / Build Command unless they stay Bun-equivalent (otherwise you can undo `vercel.json`).
4. Deploy; in build logs, confirm the install step runs **`bun install`** (frozen lockfile) and the build step completes tests plus route smoke. The route smoke includes `/opengraph-image`, `/llms.txt`, `/robots.txt`, `/sitemap.xml`, and key favicon/manifest assets so social previews, AI crawler discovery, and crawler routes are verified before Vercel publishes the deployment.

### Tailwind v4 and the production CSS bundle

`src/app/globals.css` imports Tailwind with **`@import "tailwindcss" source("../..");`** so class detection is anchored at the **app root** (relative to the stylesheet), not only `process.cwd()`. If that import used the default base and the build’s working directory did not match the app root, Tailwind could emit a tiny CSS chunk with almost no utilities—pages would look unstyled on Vercel while `bun run build` looked fine locally. After changing Tailwind entry or app layout paths, keep that `source(..)` segment aligned with the repo layout.

## Jobs database (Supabase)

`/jobs` and `/admin` read and write one Supabase table. Without these variables the app still builds and serves the committed Paraform export (`src/content/live-jobs.json`), and `/admin` renders a "not configured" panel instead of failing.

1. **Provision:** `vercel integration add supabase --no-claim` (accept the Marketplace terms in the browser the first time). This connects the resource to the project and injects `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and the `POSTGRES_*` connection strings across all environments.
2. **Set the editor sign-in:** `vercel env add ADMIN_EMAIL production` and `vercel env add ADMIN_PASSWORD production` (repeat for `preview` / `development`). This is the single shared login for `/admin` — Perry's address and a shared password. Changing either value signs every existing session out.
3. **Create the table and load the export:** `vercel env pull .env.local --yes` then `bun run jobs:seed`. The seed applies `supabase/schema.sql` (idempotent) and upserts every role by W3 reference.
4. Redeploy so the running functions pick up the new variables.

**Access model:** `jobs`, `job_referrals`, and `job_referral_clicks` have RLS enabled with **no policies**, so the anon key that ships to browsers cannot read or write them. Every query goes through the service-role key in server-only code (`src/lib/jobs-store.ts`, `src/lib/referrals-store.ts`), which must never be imported from a client component. `bun run jobs:seed` applies `supabase/schema.sql`, including the referral tables, so an existing project picks them up on the next seed.

## Admin assistant (OpenRouter)

The `/admin` **Assistant** view calls OpenRouter with the same cheap open-weight models as the candidate portal (`z-ai/glm-4.7-flash`, `deepseek/deepseek-v4-flash`, `qwen/qwen-2.5-7b-instruct`), trying each in turn until one answers.

- `OPENROUTER_API_KEY` — required for the view to answer; without it the panel reports that no key is set and nothing else breaks.
- `OPENROUTER_API_KEY_FALLBACK` — optional second key, tried when the first fails.
- `OPENROUTER_MODELS` — optional comma-separated override of the model chain.
- `OPENROUTER_BASE_URL` — optional; any OpenAI-compatible endpoint works.

Locally these come from `.env.local` (shared with `w3sourcing-candidate-portal`). For production: `vercel env add OPENROUTER_API_KEY production`. The key is read only in server-only code (`src/lib/ai.ts`) behind the admin session check.

## CI (GitHub Actions)

**`.github/workflows/ci.yml`** runs on pushes and pull requests to `main` / `master`: `bun install --frozen-lockfile`, then **`bun run ci`** (`lint` + `test` + `build`), then **`bun run smoke:routes:ci`** so PRs match the same gates as Vercel’s build command.

Install sets **`HUSKY=0`** so Husky does not run during CI install.
