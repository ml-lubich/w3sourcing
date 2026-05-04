# W3Sourcing — Project overview

## Table of contents

- [Purpose](#purpose)
- [Brand and audience](#brand-and-audience)
- [Tech stack](#tech-stack)
- [Routes](#routes)
- [Home page section order](#home-page-section-order)
- [Contact deprecation](#2026-05-04-contact-deprecation)
- [Commands](#commands)
- [Repository conventions](#repository-conventions)
- [Notes for contributors and tooling](#notes-for-contributors-and-tooling)
- [Current implementation snapshot](#2026-05-04-current-implementation-snapshot)

## Purpose

This repository is the marketing front end for **W3 Sourcing**: a global executive recruitment firm operating across technology, legal, and banking and finance. The product is a **single, scroll-based landing experience** that should feel as careful and deliberate as a senior search mandate—clear structure, calm motion, and copy that honours the fact that hiring is never only software; it is judgment, relationships, and discretion.

There is **no application server or database** in this repo. The site is built for **static hosting** (for example Vercel): fast pages, predictable behaviour, and minimal moving parts behind the scenes.

## Brand and audience

W3 speaks to **VC-backed technology companies**, **elite law firms**, and **global financial institutions**. The tone is **professional, premium, and trustworthy**, with a **human centre**: the site should never read as a faceless tool vendor, and copy may name **principal judgment and taste** as what software alone cannot substitute for on senior hires. Partnership, confidentiality, and cross-border reach are part of the story, not bolt-on adjectives.

Canonical registration and office details used in the UI live in `src/content/offices.ts` and align with public information published at w3sourcing.com (including Singapore UEN and EA where shown).

## Tech stack

- **Framework:** Next.js 16 (App Router, TypeScript, React 19).
- **Styling:** Tailwind CSS v4 with project tokens in `src/app/globals.css`. The main stylesheet imports Tailwind via a path under `node_modules/` (not the bare `tailwindcss` package name) so resolution never depends on a flaky working directory. `postcss.config.mjs` still sets `@tailwindcss/postcss` `base` to the project root. `dev` uses `scripts/run-next-dev.ts`: it `cd`s to the repo root, stops an existing Next 16 dev server holding `.next/dev/lock` (unless `W3_REPLACE_NEXT_DEV=0`), then runs `next dev`. Other primary scripts use `scripts/exec-in-repo-root.ts` (and `scripts/run-tests-in-root.ts` for `test`) so `build` / `start` / `lint` / `test` run with the repo as cwd even when Bun is invoked from a parent folder.
- **Motion:** Framer Motion for section and hero polish, with reduced-motion and narrow-viewport safeguards documented in `docs/DESIGN.md`.
- **Icons:** Lucide React (tree-shaken via `experimental.optimizePackageImports` in `next.config.ts`).
- **Performance (home):** `src/app/page.tsx` is a Server Component. Hash / pending section scrolling is client-only (`src/components/home-hash-scroll.tsx`). Below-the-fold sections are loaded with `next/dynamic` into separate chunks; **Header**, **Hero**, **Trusted By**, and **Floating CTA** stay statically imported for first paint. Hero demo avatars use `next/image` (local SVG placeholder is `unoptimized`).
- **Theme:** Custom `ThemeProvider` in `src/components/theme-provider.tsx` (not `next-themes`). User choice is stored under `localStorage` key `w3-theme`; `next/script` with `strategy="beforeInteractive"` loads `/w3-theme-boot.js` from `app/layout.tsx` so `class="dark"` on `<html>` matches storage / `prefers-color-scheme` before first paint.
- **Package manager:** Bun (`bun install`, `bun run`, `bunx`); `package.json` includes `packageManager` for tooling alignment.
- **Deployment:** Vercel with Bun for install and build (`vercel.json`, `docs/DEPLOYMENT.md`).

## Routes

| Path       | Purpose |
| ---------- | ------- |
| `/`        | Home: full landing with all sections and header/footer section navigation (see below). |
| `/privacy` | Privacy policy (uses `LegalPageShell`; header/footer with root section links). |
| `/terms`   | Terms of use (same shell pattern). |

Contact is **direct email-first** in the current public journey: header, hero, comparison, 404, footer, and final CTA actions should resolve to `mailto:info@w3sourcing.com`. The deprecated `#contact` form component remains in the tree for implementation history only.

## Home page section order

The visible sequence in `src/app/page.tsx` is:

1. Hero (with pipeline-style preview and accessibility affordances described in `docs/DESIGN.md`).
2. Trusted-by (marquee social proof).
3. Leadership / founder (`#leadership`).
4. Practice areas (`#practice-areas`).
5. Why W3 (`#why-w3`).
6. How it works (`#process`).
7. Industries and functions (`#industries`).
8. Feature tabs / methodology (`#features`).
9. Stats (`#stats`).
10. Comparison (`#compare`, matrix anchor `#compare-matrix`).
11. Testimonials (`#testimonials`).
12. FAQ (`#faq`).
13. CTA banner (closing strip before the footer).

The main navigation in `Header` links a subset of these anchors (leadership, practices, process, methodology, results, compare, clients, FAQ) plus direct email contact. Other sections remain discoverable by scroll and through in-page cross-links.

## 2026-05-04 Contact Deprecation

The previous home-page `#contact` form is deprecated and no longer rendered in the primary user journey. Header, hero, comparison, 404, footer, and final CTA contact actions should send users directly to `mailto:info@w3sourcing.com`; the old `src/components/contact.tsx` component remains in the tree only as deprecated implementation history until a later cleanup task removes it.

**Floating control** (`FloatingCTA`) is present on the home layout (sm+): after ~600px scroll it shows **Back to top**, which scrolls to the document top and clears the URL hash using the same capped ease as in-page section jumps (`src/lib/scroll-to-section.ts`).

## Commands

- `bun run dev` — development server.
- `bun run build` — production build.
- `bun run start` — serve the production build locally (after `build`).
- `bun run lint` — ESLint.
- `bun run test` — unit tests under `src/` plus `tsc --noEmit` (see `docs/TESTING.md`).
- `bun run smoke:routes` — route smoke (build + production server + GET each route); variants `smoke:routes:dev` and `smoke:routes:ci` are documented in `docs/TESTING.md`.

**Before you commit:** run **`bun run test`** locally when you change app or lib code; Vercel runs **`bun run ci`** and **`bun run smoke:routes:ci`** on deploy (see `docs/TESTING.md`).

## Repository conventions

- File and folder naming: **kebab-case** where applicable for new routes and components.
- Commits: **Conventional Commits**-style messages.

## Notes for contributors and tooling

Before changing routing, metadata, or App Router structure, confirm patterns against the **installed** Next.js version (this project tracks Next 16.x). Design intent, motion rules, and component-level behaviour are specified in `docs/DESIGN.md`. Product-level expectations and constraints are summarised in `docs/REQUIREMENTS.md`.

## 2026-05-04 Current Implementation Snapshot

- The home page now renders **Leadership** (`#leadership`) after Trusted-by and before Practice areas. Header and footer navigation include Leadership.
- The home page no longer renders the deprecated `Contact` section. Direct contact actions use `mailto:info@w3sourcing.com` from the header, hero, comparison, 404, footer, and closing CTA.
- The current home sequence is: Hero, Trusted-by, Leadership, Practice areas, Why W3, How it works, Industries and functions, Feature tabs, Stats, Comparison, Testimonials, FAQ, CTA banner, Footer.
- `TrustedByClient` is statically imported by the home page but disables SSR for the marquee implementation with `next/dynamic({ ssr: false })` inside the client wrapper.
- User-visible images use `ResilientImage` where they need a persistent shimmer skeleton and load-failure handling: header wordmark, hero avatars, trusted-by logos, and the founder portrait.
- `/privacy` is content-driven from `src/content/privacy-policy.ts`; the page renders the full DPA-style policy, schedules, contact email, and office addresses from that typed content module.
