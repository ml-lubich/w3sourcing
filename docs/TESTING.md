# Testing

## Local quick check (default `test`)

- **`bun run test`** runs `scripts/run-tests-in-root.ts`, which **`cd`s to the repo root** (same as other primary scripts), then runs **`bun test ./src`** and **`tsc --noEmit`**. Unit tests live next to source (for example `src/lib/*.test.ts`), assert observable behavior (inputs/outputs for navigation helpers and route mapping), and complete in milliseconds. **`clientPointToCardTilt`** (`client-point-to-card-tilt.test.ts`) locks the pointer-to-degrees math for practice-card 3D hover. **`surface-reveal-motion.test.ts`** locks minimum durations for shared card/section scroll reveals and **`surfaceCardWhileHover`** (Framer hover lift aligned with CSS card lift). **`footer-scroll-reveal-gate.test.ts`** locks the rule that footer scroll-reveal and split-word gates ignore **`useInView`** until after the client layout flag is set, matching SSR and preventing hydration mismatches on short pages (for example **`/privacy`**) and back navigation. **`bf-cache-scroll-nudge.test.ts`** / **`bf-cache-theme-pageshow.test.ts`** lock back/forward-cache helpers (scroll nudge + theme **`pageshow`** resync). **`root-theme-layout-contract.test.ts`** asserts **`ThemeProvider`** stays on **`useLayoutEffect`** only (no stray **`useEffect`** / ReferenceError) and the root layout uses **`next/script`** **`beforeInteractive`** for **`w3-theme-boot.js`** instead of a raw **`<script src>`** (React 19 warnings). Home page **`ScrollReveal`** defers **`whileInView`** until after a client layout flag and uses pixel-only IntersectionObserver margins so SSR, hydration, and scroll observers stay consistent. Heading word animation elsewhere is gated by **`useSplitWordsAnimate`** in components (verify in browser / accessibility with **`prefers-reduced-motion`**).
- **`bun run lint`** is stricter ESLint + Next rules; **`bun run ci`** runs **`lint`**, **`test`**, and **`build`** in one shot (same sequence as GitHub Actions before smoke). **`bun run precommit`** extends that with the route smoke step (matches what `.husky/pre-commit` runs).

**Note:** Run `bun test` with a path (as in the script). A bare `bun test` at the repo root can be slow while the runner scans the tree.

## Route smoke (no 404 / no 5xx)

Behavioral check: discovers static `page.tsx`/`page.jsx` (and `page.ts`/`page.mdx`) under `src/app`, builds production output, starts `next start` on an ephemeral port, and GETs each route. Fails on HTTP **404** or **500+**.

- **Pre-commit:** `.husky/pre-commit` runs **`bun run precommit`** — **`lint`**, **`test`** (includes **`tsc --noEmit`**), **`build`**, then **`smoke:routes:ci`** (reuses the fresh **`.next`** from **`build`**; fails immediately on any 404/5xx). Commits are blocked if this step fails.
- **Local before commit/PR:** run **`bun run test`** for a faster loop; full gate is **`bun run precommit`** or match CI with **`bun run ci`** then **`bun run smoke:routes:ci`**, GitHub Actions, or Vercel’s build pipeline.
- **Manual smoke**: `bun run smoke:routes` (default: build + `next start`). Faster iteration when no other dev server is needed: `bun run smoke:routes:dev` (`next dev`; only one dev server per app directory — conflicts if `bun run dev` is already running).

Dynamic segments (`[param]`), route groups `(name)`, and private `_segments` are skipped or handled as documented in `scripts/smoke-no-404.ts`.

## Vercel (deploy CI)

`vercel.json` runs **`bun run lint`**, then **`bun run build`**, then **`bun run smoke:routes:ci`**. The smoke script sets **`SMOKE_SKIP_BUILD=1`** so the smoke step reuses the build output from the build step (no duplicate `next build`). Install uses **`bun install --frozen-lockfile`** with **`HUSKY=0`** (see `docs/DEPLOYMENT.md`).

If a deployment fails at the smoke step, check the build logs for the `smoke-no-404` error (404/5xx on a discovered route).
