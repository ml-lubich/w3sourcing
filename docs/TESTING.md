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

Behavioral check: discovers static `page.tsx`/`page.jsx` (and `page.ts`/`page.mdx`) under `src/app`, builds production output, starts `next start` on an ephemeral port, and GETs each route. It also GETs crawler and preview assets that must render in production: `/opengraph-image`, `/llms.txt`, `/robots.txt`, `/sitemap.xml`, `/images/favicon/site.webmanifest`, `/images/favicon/favicon.ico`, `/images/favicon/favicon-32x32.png`, and `/images/favicon/apple-touch-icon.png`. Fails on HTTP **404** or **500+**.

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
- **`src/components/stats-contract.test.ts`** keeps the Outcomes section on the requested visible metrics (`500+`, `98%`, `45+`, `7 days`) and locks the cards to render final values directly, with no zero-reset counter path.
- **`src/components/trusted-by-contract.test.ts`** also keeps the two marquee rows on disjoint company lists and verifies the lower row keeps reverse-direction motion.
- **`src/lib/hero-accent-line-contract.test.ts`** keeps the hero rotating accent as one `SplitWords` phrase so it does not regress into separately wrapped line fragments.
- **`src/lib/split-words-hydration-contract.test.ts`** locks the unconditional `!motionMounted` guard for `SplitWords` and `SplitWordsRich`, including the `animate={false}` path that previously caused hydration drift.

## 2026-05-04 Hero accent visibility contract

- **`src/lib/hero-accent-line-contract.test.ts`** also locks the hero rotating accent copy to use a solid semantic accent in light mode and reserve clipped transparent gradient text for dark mode only, preventing the accent phrase under “Executive search for” from disappearing on the light canvas.
- **`src/lib/hero-accent-line-contract.test.ts`** rejects rotating accent fragments that start with “for”, preventing the rendered hero headline from duplicating the fixed “Executive search for” preposition.

## 2026-05-04 Trusted-by marquee contract

- **`src/components/trusted-by-contract.test.ts`** parses the `topRowCompanies` and `bottomRowCompanies` source arrays to ensure company names and domains do not overlap between visible rows, then checks that the shared `MarqueeTrack` keeps the lower row reversed and offset for opposite-direction/intersecting motion.

## 2026-05-04 Hero accent theme contrast contract

- Supersedes the preceding hero accent visibility note: **`src/lib/hero-accent-line-contract.test.ts`** now locks the behavior that the rotating hero phrase has visible text color in both light and dark themes and rejects clipped/transparent text, so the phrase remains readable through the nested `SplitWords` word spans without coupling the contract to one exact color token.

## 2026-05-04 Favicon asset contract

- **`src/lib/favicon-assets-contract.test.ts`** locks the rule that site favicon metadata, Apple touch icons, Android/PWA icons, and the web manifest all resolve to `public/images/favicon/`. It also verifies the dynamic App Router icon routes stay removed and no `favicon`-named source image remains elsewhere under `public/images/`.

## 2026-05-04 SEO preview rendering contract

- **`src/lib/favicon-assets-contract.test.ts`** now verifies platform favicon PNG dimensions exactly match the advertised sizes and that `favicon.ico` contains multiple icon entries.
- **`src/lib/seo-preview-contract.test.ts`** locks the SEO/social preview contract: root metadata uses the canonical site base, favicon manifest, shortcut icon, 1200x630 Open Graph PNG, Twitter summary-large image, indexable robots metadata, and viewport theme colors. It also locks that `robots.ts` allows all crawlers, common AI crawlers are explicitly allowed, `/llms.txt` exists, and the production route smoke includes crawler/preview assets, so social previews and favicon/manifest routes are rendered during deploy verification.

## 2026-05-04 Decorative rail SVG contract

- **`src/components/practice-areas-contract.test.ts`** and **`src/components/why-w3-contract.test.ts`** verify practice-area and Why W3 SVG rails stay separate from photo cards and remain visual-only, with no embedded `<text>` labels or aggressive mandate-style copy inside the decorative SVG component.

## 2026-05-04 Practice Area Photo Contract

- **`src/components/practice-areas-contract.test.ts`** locks the practice-area media rule: the three recruitment cards keep their real photos and do not import or render `PracticeAreaAnimatedArt` / `section-animated-art` over those photo headers.

## 2026-05-04 Photo And SVG Separation Contracts

- **`src/components/practice-areas-contract.test.ts`** now locks the updated rule that practice-area cards keep photos and `PracticeAreaAnimatedArt` in separate regions, with the animated art inside `.practice-card-art-panel` after the photo header.
- **`src/components/why-w3-contract.test.ts`** locks the same separation for Why W3 cards: the photo header contains the real image and scrim, while `WhyW3AnimatedArt` lives in `.why-card-art-panel` below the photo.

## 2026-05-04 Section-Level SVG Rail Contracts

- **`src/components/practice-areas-contract.test.ts`** now locks the stricter rule that animated practice-area SVGs live in `.practice-area-art-rail` before the photo card grid, with no `.practice-card-art-panel` inside the cards.
- **`src/components/why-w3-contract.test.ts`** locks the same rule for Why W3: animated SVGs live in `.why-w3-art-rail` before the photo card grid, with no `.why-card-art-panel` inside the cards.

## 2026-05-04 Feature Workflow Photo Contract

- **`src/components/feature-tabs-contract.test.ts`** locks that Source & engage, Qualify & assess, and Place & integrate each keep their workflow photo, including `/images/perry_assets/4.png` for the Qualify & assess assessment panel.

## 2026-05-04 Decorative Rail Visibility Contract

- **`src/components/practice-areas-contract.test.ts`** and **`src/components/why-w3-contract.test.ts`** lock that rail SVGs use `.section-deco-art-svg--rail`, and the Why W3 rail no longer carries a clipped icon-chip overlay.

## 2026-05-04 People Photo Crop Contract

- **`src/components/people-photo-object-contract.test.ts`** locks the shared `.people-photo-object` focal-point utility and verifies the photo-backed content modules use it with `object-cover`.
- The same contract also locks `.people-photo-object--headroom` for Why W3 images that need extra top headroom in constrained card crops.

## 2026-05-04 Readable Process Photo Contract

- **`src/components/how-it-works-contract.test.ts`** locks that How We Work keeps animated SVG process art in a separate rail and does not layer `StepArt` directly over process photos.

## 2026-05-04 Stock Photo And Header Opacity Contracts

- **`src/components/practice-areas-contract.test.ts`**, **`src/components/how-it-works-contract.test.ts`**, and **`src/components/feature-tabs-contract.test.ts`** lock the requested local stock-photo replacements for Legal Recruitment, Transparent Process & Collaboration, Source leaders others miss, and Offers and onboarding that stick.
- **`src/lib/header-opacity-contract.test.ts`** locks the navbar as frosted at the top of the page by rejecting the old `--header-glass: 0` transparent state.

## 2026-05-04 Public Asset Structure Contract

- **`src/lib/public-assets-contract.test.ts`** locks the Next.js public asset convention: active UI images stay under `public/images/`, source `/images/...` URLs resolve to real files, and the `public/` root is reserved for routable machine files plus the `images/` directory.
