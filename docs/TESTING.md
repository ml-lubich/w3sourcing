# Testing

## Table of contents

- [Local quick check (default `test`)](#local-quick-check-default-test)
- [Route smoke (no 404 / no 5xx)](#route-smoke-no-404--no-5xx)
- [Vercel (deploy CI)](#vercel-deploy-ci)
- [Image loading skeletons](#image-loading-skeletons)
- [Current contract tests added for recent regressions](#current-contract-tests-added-for-recent-regressions)
- [Hero accent visibility contract](#2026-05-04-hero-accent-visibility-contract)
- [Trusted-by marquee contract](#2026-05-04-trusted-by-marquee-contract)

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

`vercel.json` runs **`bun run ci`** (`lint` + `test` + `build`), then **`bun run smoke:routes:ci`**. The smoke script sets **`SMOKE_SKIP_BUILD=1`** so the smoke step reuses the build output from the build step (no duplicate `next build`). Install uses **`bun install --frozen-lockfile`** with **`HUSKY=0`** (see `docs/DEPLOYMENT.md`).

If a deployment fails at the smoke step, check the build logs for the `smoke-no-404` error (404/5xx on a discovered route).

## Image loading skeletons

- **`src/components/resilient-image-contract.test.ts`** locks the shared **`ResilientImage`** contract: user-visible images keep a shimmer skeleton while loading, leave it visible after a load failure, and preserve caller-provided **`onError`** handling for fallbacks such as hero demo avatars.

## Current contract tests added for recent regressions

- **`src/components/trusted-by-contract.test.ts`** keeps trusted-by company icons chrome-free: no border, background tile, or shadow reappears around favicon images.
- **`src/components/trusted-by-contract.test.ts`** also keeps the two marquee rows on disjoint company lists and verifies the lower row keeps reverse-direction motion.
- **`src/lib/hero-accent-line-contract.test.ts`** keeps the hero rotating accent as one `SplitWords` phrase so it does not regress into separately wrapped line fragments.
- **`src/lib/split-words-hydration-contract.test.ts`** locks the unconditional `!motionMounted` guard for `SplitWords` and `SplitWordsRich`, including the `animate={false}` path that previously caused hydration drift.

## 2026-05-04 Hero accent visibility contract

- **`src/lib/hero-accent-line-contract.test.ts`** also locks the hero rotating accent copy to use a solid semantic accent in light mode and reserve clipped transparent gradient text for dark mode only, preventing the accent phrase under “Executive search for” from disappearing on the light canvas.

## 2026-05-04 Trusted-by marquee contract

- **`src/components/trusted-by-contract.test.ts`** parses the `topRowCompanies` and `bottomRowCompanies` source arrays to ensure company names and domains do not overlap between visible rows, then checks that the shared `MarqueeTrack` keeps the lower row reversed and offset for opposite-direction/intersecting motion.

## 2026-05-04 Hero accent theme contrast contract

- Supersedes the preceding hero accent visibility note: **`src/lib/hero-accent-line-contract.test.ts`** now locks the behavior that the rotating hero phrase has visible text color in both light and dark themes and rejects clipped/transparent text, so the phrase remains readable through the nested `SplitWords` word spans without coupling the contract to one exact color token.

## 2026-05-04 Favicon asset contract

- **`src/lib/favicon-assets-contract.test.ts`** locks the rule that site favicon metadata, Apple touch icons, Android/PWA icons, and the web manifest all resolve to `public/images/favicon/`. It also verifies the dynamic App Router icon routes stay removed and no `favicon`-named source image remains elsewhere under `public/images/`.
