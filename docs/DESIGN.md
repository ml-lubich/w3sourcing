# Design specification

## Table of contents

- [Direction](#direction)
- [Voice, narrative, and the human element](#voice-narrative-and-the-human-element)
- [Layout](#layout)
- [Typography](#typography)
- [Liquid glass (surfaces)](#liquid-glass-surfaces)
- [Color](#color)
- [Components](#components)
- [Tailwind arbitrary classes](#tailwind-arbitrary-classes)
- [Motion](#motion)
- [Theme](#theme)
- [Responsive](#responsive)
- [May 2026 startup market refresh](#may-2026-startup-market-refresh)
- [May 2026 gradient discipline](#may-2026-gradient-discipline)
- [May 2026 trusted-by mark refresh](#may-2026-trusted-by-mark-refresh)
- [May 2026 stats-to-comparison spacing](#may-2026-stats-to-comparison-spacing)
- [May 2026 typography refresh](#may-2026-typography-refresh)
- [May 2026 typography revert](#may-2026-typography-revert)
- [May 2026 trusted-by borderless icons](#may-2026-trusted-by-borderless-icons)
- [May 2026 section boundary blend](#may-2026-section-boundary-blend)
- [Contact deprecation](#2026-05-04-contact-deprecation)
- [May 2026 trusted-by chrome-free icons](#may-2026-trusted-by-chrome-free-icons)
- [Implementation corrections](#2026-05-04-implementation-corrections)
- [Hero accent light mode contrast](#2026-05-04-hero-accent-light-mode-contrast)
- [Trusted-by marquee row motion](#2026-05-04-trusted-by-marquee-row-motion)
- [Footer maker credit icon](#2026-05-04-footer-maker-credit-icon)

## Direction

The site should read as a **credible, modern executive-recruitment brand (2026)**: generous whitespace, restrained color, strong typographic hierarchy, and product-style polish. Visual reference: enterprise recruiting SaaS and category leaders that emphasize clarity and trust (for example landing patterns with bold section headlines, alternating light sections, a prominent primary CTA, a social proof band, and a substantial FAQ block).

## Voice, narrative, and the human element

Recruitment products range from fully automated sourcing to high-touch retained search. **W3’s story sits in the human-led territory**: judgment over noise, relationships that survive a single hire, and discretion for candidates and clients alike. Copy may contrast that stance with **over-reliance on AI or keyword matching**—tools lack taste and accountability for who truly belongs in senior roles—but keep the tone factual and confident, not anti-technology. Marketing copy and UI framing should reinforce that positioning without sounding sentimental or vague.

**Practical implications for the site:**

- **Headlines and body** should acknowledge real stakes—leadership gaps, regulatory context in legal and finance, pace of change in technology—while staying concise. Prefer concrete verbs (identify, engage, shortlist, advise) over empty superlatives.
- **The comparison matrix** (`#compare`) is deliberately honest: W3 is not scored as perfect on every row. Named columns (including modern talent platforms and categories such as **Paraform**, LinkedIn, hireEZ, Gem, Findem, and job boards) give visitors a mental map of the market; the narrative is “fit and trade-offs,” not “we beat everyone at everything.”
- **Motion and glass surfaces** are there to support readability and hierarchy, not to perform busyness. If an animation competes with the sentence someone is trying to read, it should be dialed back or gated behind `prefers-reduced-motion` / the narrow-viewport rules already used in the hero and stats.
- **Hero and practice-area demos** use illustrative avatars and pipeline labels as **UI metaphors**, not live metrics or real candidate data. That restraint is part of trust: the site should never pretend to show proprietary placements in real time.

When in doubt, ask whether the page would feel appropriate if a GC, CTO, or managing partner read it on a phone between meetings. If the answer is no, simplify the layout or soften the tone.

## Layout

- Single column centered content; max width ~7xl for sections.
- Section vertical rhythm: large padding on desktop; consistent `section-padding` scale.
- Hero: single focal headline, supporting line, two CTAs, one primary visual (card or preview), optional subtle background wash (no noisy glass stacks).

## Typography

- **UI / body:** Geist Sans for a sharper product-native feel: cleaner, less rounded, and closer to modern founder tools than generic SaaS templates.
- **Display headings:** Instrument Serif for `h1` / `h2` only. Keep it restrained and editorial, with regular weight and no negative tracking, so the site feels more Claude / Paraform / Opus-adjacent without becoming fashion-editorial.
- **Secondary text:** Muted slate; avoid long lines without max-width. Body secondary token `--text-secondary` targets ~7:1 on white in light mode.
- **Marketing sections:** Prefer a slightly tighter scale than hero display copy—section titles roughly `text-2xl`–`lg:text-4xl`, supporting paragraphs `text-sm`–`text-[0.9375rem]`, and frosted chips/eyebrows at ~`text-[11px]` with wide tracking—so dense blocks stay readable next to `.glass-panel` surfaces.

## Liquid glass (surfaces)

- **Global canvas:** `body.liquid-page-canvas` (root layout) paints a **fixed, layered radial wash** (accent + cyan, theme-aware) over `background-color` so all routes share one refractive depth field. Inner pages use **`main` with transparent fill** where appropriate so the same canvas reads through; frosted bands and cards blur against it.
- **Panels:** `.glass-panel`, `.glass-panel-strong` (hero preview), and **`.glass-panel-liquid`** (dense stacks such as Industries): frosted translucency, gradient fill, elevation, border, inset specular, optional `::before` wash. **`.glass-panel-liquid`** favors a **light-edge** treatment (stronger blur/saturation, softer border, accent + cyan radials). **Compact chrome:** `.glass-chip` (pills, icon controls, tab rails) and `.glass-control` (form fields).
- **Card hover lift:** On **fine pointers** and when `prefers-reduced-motion` is off, `.glass-panel` / `.glass-panel-liquid` translate up slightly (`--surface-card-hover-lift` in `globals.css`, aligned with `SURFACE_CARD_HOVER_LIFT_PX` in `surface-reveal-motion.ts`). Pills, small links, and non-card chrome opt out with **`.glass-panel--chrome`** / **`.glass-panel-liquid--chrome`**. Framer-driven shells that already own `transform` use **`surfaceCardWhileHover(liteMotion)`** so hover lift is not blocked by inline styles.
- **Section bands:** `.section-band-glass` / `.section-band-glass-muted` are **frosted strips** over the global canvas, replacing flat `bg-surface` / `bg-gray-light` alternation on the home page while keeping rhythm. Pair with `.section-glass-ambient` where orbs apply.
- **Sections:** `.section-glass-ambient` adds large blurred orbs; inner `.section-glass-inner` keeps copy above the wash. Ambient layers stay **`overflow: visible`** so washes blend across bands.
- **Motion / a11y:** `body`, `.glass-panel`, `.glass-panel-liquid`, `.glass-chip`, and `.glass-control` use ~450ms theme easing; `prefers-reduced-motion` disables those transitions. **Readability:** translucency stays tuned for body copy; primary CTAs may remain **filled accent** where contrast demands it.

## Color

- **Background:** Off-white / white alternation; avoid heavy navy page wash.
- **Text:** Slate-900 primary; slate-500/600 secondary.
- **Accent:** Single indigo/violet primary for links, focus rings, and primary buttons.
- **Supporting hues:** Use sparingly (success green for checks only); avoid rainbow section badges.
- **Theme:** Light is default. Dark mode toggles via header control, persists in `localStorage` (`w3-theme`), and respects `prefers-color-scheme` until the user chooses. `ThemeProvider` applies `class="dark"` on `<html>`; **`/w3-theme-boot.js`** is loaded with **`next/script`** **`strategy="beforeInteractive"`** in **`app/layout.tsx` `<head>`** so it runs before hydration (no raw `<script src>` in the tree—avoids React 19 “script while rendering” warnings). Semantic tokens (`--background`, `--surface`, `--primary`, etc.) remap under `.dark` in `globals.css`.
- **Light mode contrast (diagrams + cards):** Practice / Why / Process card headers use **translucent radial scrims** (`.pa-card-header-scrim`, `.why-card-header-scrim`, `.step-card-header-scrim`) so decorative SVG strokes are not covered by an opaque white veil. `.section-deco-art-svg` uses **ink-forward `currentColor`** (more `--primary`) in light only; dark mode keeps the prior accent-forward mix. Small **Lucide** marks with `.section-card-icon-glow` use a **lighter-specific pulse** (`section-card-icon-glow-pulse-light`) plus **`text-accent-hover`** on frosted chips where the mark should read clearly on white.

## Components

- **Floating back-to-top:** Fixed bottom-right on the home page (`sm` and up); appears after the user scrolls past ~600px. Pill control with border + translucent fill (theme-aware); label **Back to top** with an upward arrow; invokes the shared snappy scroll to `y=0` and clears the hash (see `scrollToPageTop` in `src/lib/scroll-to-section.ts`).
- **Header:** Fixed; **borderless** frosted shell (gradient fill + `backdrop-filter` blur) with strength `--header-glass`. **At scroll top** (`data-at-top`), tint is removed and `--header-glass` is **0** so the bar is **fully transparent** over the hero (no faux black bar); after the user scrolls past a small threshold (~12px), it returns to **full frost** on all routes for readability. After the user scrolls down past ~72px, the bar **slides up** (hidden) until they **scroll up** again; within ~12px of the top and while the mobile menu is open it stays visible. Primary CTA visible on desktop. Scroll-spy syncs the nav to section anchors (`#practice-areas`, `#process`, etc.) using the computed `scroll-padding-top` on `html` (same value as `--header-scroll-offset`) plus a modest buffer (~24px) so the highlighted item matches the section below the bar despite subpixel layout; main content sections and `#features` also set `scroll-margin-top` to that offset; same-page jumps use a **short capped ease-out** scroll (~200–420ms by travel distance, faster than native `scroll-behavior: smooth` on long distances) via `window.scrollTo` frame steps, still accounting for computed `scroll-padding-top` and the target’s `scroll-margin-top` so the bar clears reliably (some engines mis-align `scrollIntoView` with root padding). Plain `href="#…"` links are handled globally (`SnappyInPageAnchorClicks`), including **Skip to main** (`#main-content`): scripted snappy scroll, **`syncHash: false`** (clean URL), then delayed focus on `<main tabIndex={-1}>`. During programmatic jumps, scroll-spy updates are briefly suppressed so the active label does not revert to the previous section while scrolling. **Clicking** a section link sets the active nav item immediately so the label matches the user’s choice while smooth scrolling is in progress; direct email contact CTAs are outside scroll-spy state. `scrollend` re-runs scroll-spy so manual scrolling keeps state accurate. The active item uses accent color, soft text glow, and a centered gradient “reflection” underline (desktop only; mobile keeps glow, hides the underline to avoid clashing with rounded link rows). **Section navigation (desktop + mobile + footer):** Hash targets are handled in JS—same-page `scrollIntoView` with history `replaceState`. From non-home routes, `router.push("/#…")` is unreliable (the App Router often drops the hash); the link handler instead stashes the target id in `sessionStorage`, runs `router.push("/", { scroll: false })`, and the home page consumes that stash on mount (double `requestAnimationFrame` before scroll) or falls back to `location.hash` for direct visits. Shared helpers live in `src/lib/scroll-to-section.ts`. **Desktop row:** The header bar and middle nav use `min-w-0`; avoid a tight artificial `max-width` on the link cluster, and use horizontal scrolling (`overflow-x-auto`) when the mid band is narrower than the links so items are not painted under the theme toggle or email CTA (later siblings paint above and steal clicks, which looks like the wrong section). **Mobile sheet:** Uses **opaque `var(--surface)`** (`bg-surface` + inline fill) (not `.section-band-glass`) and a **`min-height` down to the dynamic viewport** so open-menu navigation never shows page content bleeding through, on any scroll position; the **desktop** header shell stays as described above. **Motion:** the sheet animates **height only**—**no `opacity`** on the panel—so Framer does not dim the whole layer (which previously read as translucency over the hero). Tapping a section link closes the menu; same-page jumps use a short deferred scroll so the target is not lost when the overlay closes.
- **Buttons:** Primary filled accent with soft colored shadow; secondary uses glass/elevated surface (shadow-first, not outline borders).
- **Cards:** White or tinted surface, **shadow-led depth**; avoid heavy `border` rings on chrome—rounded-2xl and hover lift where appropriate.
- **Footer:** Theme-aware footer using `--footer` (light: muted slate band; dark: near-black slate) with `text-foreground` / semantic muted links—same column layout and legal links to `/privacy` (Privacy Policy) and `/terms` (Terms of Use) via **`next/link`** so internal navigation stays in the App Router (avoids full document loads and flaky back/forward-cache repaints with Framer viewport animations). On **`pageshow`** with **`event.persisted`**, layout runs **`BfCacheViewportRevive`**: a one-frame scroll nudge to re-trigger IntersectionObserver; **`ThemeProvider`** also reapplies the stored/system theme class on the same event. **Entrance:** column grid + bottom legal row use **`motion`** fade/slide from **`useInView`** (stacked with home-page **`ScrollReveal`** wrapper for the whole footer). **CTA strip** above the footer uses the same token-driven band (light gradient + accent wash; dark retains the deep indigo/slate treatment). Legal pages reuse `Header` and `Footer` with `sectionLinksFromRoot` so anchor links resolve to `/#…` on the home page. LinkedIn icon opens `https://www.linkedin.com/in/perrybarrow/` in a new tab (`noopener`, `noreferrer`). Below the copyright row, a centered credit reads **Made with love by Misha Lubich**, linking to `https://mishalubich.com` in a new tab (`noopener`, `noreferrer`).
- **404 (global):** App Router root `not-found.tsx` is the default for unknown routes; it wraps `LegalPageShell` (skip link, header, footer), uses a centered `.glass-panel` with soft accent glows, primary/secondary CTAs to `/` and `mailto:info@w3sourcing.com`, and metadata `robots: noindex` so stray URLs are not indexed.
- **How it works (`#process`):** Four-step journey on a glass-ambient section with a **slate-tinted band** (`gray-light` / `surface` mix) behind the stack so light mode is not flat white-on-white. Per-step cards use `.glass-panel`. **Step** header wireframes share the same **`section-deco-art-svg`** treatment as practice / why-W3 (accent-forward `currentColor`, glow, SMIL dashes/pulses when motion is allowed) so diagrams stay prominent in **both themes**. Arrow markers use per-card unique IDs to avoid duplicate `id`s in the DOM. Lucide icons use **accent in light / white in dark** on bordered frosted chips with **`section-card-icon-glow`**; desktop row with chevrons; mobile timeline with gradient spine. Motion: staggered fade-up; respect `prefers-reduced-motion`.
- **Comparison (`#compare`):** Eyebrow, intro explaining honest scoring, pill CTAs (“Jump to the matrix” → `#compare-matrix`, “Talk to us” → `mailto:info@w3sourcing.com`), two pull quotes, then a **wide comparison matrix** (horizontal scroll on narrow viewports): sticky first “Feature” column; **one data column at a time** carries an accent wash—**auto-cycles** (~2.8s) once the **matrix card** intersects the viewport, and **hover / keyboard focus** on a column header (or hovering body cells in that column) moves the highlight for scanning; auto-rotation pauses under **`prefers-reduced-motion`**; horizontal scroll-into-view uses smooth scrolling except when reduced motion or the **lite-motion** viewport tier applies. Additional columns for named platform categories (e.g. LinkedIn, hireEZ, Gem, Findem, Paraform, job boards) with sub-hints. Cells use **green check**, **amber minus (partial)**, **red X**; W3 is not all-green (e.g. automation scale and self-serve pricing rows credit tools). Matrix includes a row for **remote, hybrid & distributed mandates** (W3 strong; tooling columns partial). Legend row + illustrative footnote including note that large retained firms also cover many human rows. **Motion:** the home page wraps the whole section in **`ScrollReveal`** once so the band does not appear before inner blocks; **intro, CTAs, quotes, matrix intro, matrix shell, and closing** still each use **`ScrollReveal`** so sub-blocks fade as you scroll. **`SplitWords`** gates use **`useInView`** per block. The compare **`h2`** uses **two stacked `SplitWords` lines** (neutral first line, accent second) instead of **`SplitWordsRich`**, so the flex tile layout does not stack one word per line inside a narrow `h2`.
- **Trusted-by:** Dual **borderless** marquee rows on **`bg-transparent`** over the **global liquid canvas** only—**no** extra radial wash on this band (a local wash parallaxed against `background-attachment: fixed` on the body read as a hard horizontal slab while scrolling). **Quiet social proof:** wordmarks + small Lucide category glyphs use **`text-text-secondary`** in light and **`text-muted`** in dark, with master **opacity** ~**0.56** (light) / ~**0.38** (dark) so the strip stays legible on the pale canvas without loud chrome; **hover** on the section (`group/trusted-marquee`) lifts opacity for pointer devices; **`@media (hover: none)`** holds a slightly higher baseline so touch users are not stuck dim. **No** surface grid in this band—integration is **edge dissolution** only. **Integration:** horizontal **`mask-image`** (10% / 90% ramps) with **`mask-size: 100% 100%`** and **`mask-repeat: no-repeat`** (incl. WebKit prefixes) so fades stay even while scrolling; **narrow edge scrims** use a simple **`from-background` → `transparent`** two-stop gradient (avoid heavy **`via-*`** slabs over the fixed canvas). **Motion:** slow, stately CSS **`transform` marquee** (~78s / ~96s rows). Icons are decorative, not official brand logos. **Entrance:** eyebrow + rows stagger on intersection; `.trusted-by-fade` under `prefers-reduced-motion`. **Performance:** `animation-play-state` pauses off-screen; reduced motion disables marquee keyframes globally.
- **Leadership / founder (`#leadership`):** Rendered after **Trusted-by** and before **Practice areas**. **Header** and **footer** nav include a **Leadership** item targeting this id (same hash / `/#leadership` behaviour as other sections from non-home routes). The section uses a client `FounderSpotlight` shell with an SSR-safe Framer mount gate and a server `FounderSpotlightCard` for stable copy. The portrait is a `ResilientImage` / `next/image` fill inside a circular frame, layered above the panel wash. The **`#leadership`** **`h2`** uses static lines so SSR and hydration share identical text nodes. Short **principal-led** positioning copy and a **LinkedIn** link (`noopener`, `noreferrer`). Section uses **`section-band-glass`** + **`section-glass-ambient`**; inner card uses **`surfaceRevealEnterTransition`** + **`surfaceCardWhileHover`** on fine pointers.
- **Practice areas (`#practice-areas`):** Three-column cards with canonical copy aligned to the public site: VC-backed technology (explicit **software engineers** through leadership; on-site, hybrid, remote), legal (US/UK firms, associate–partner), banking & finance (IB, corporate finance, risk & compliance). The **eyebrow**, **section headline**, and **card `<h3>` titles** use the default **`SplitWords` / `SplitWordsRich` bubble** (spring + scale/rotate; see Motion). **Card body** copy uses a short **fade-up** (or fade-only on **lite-motion**) after the section **`visible`** gate so paragraphs do not pop in statically beside animated titles. The headline uses a fixed prefix plus a **rotating accent phrase** (~4.2s, after the block is in view): Technology leadership; Legal leadership; Banking & Finance leadership; then the combined “three high-impact domains.” — `SplitWords` on the prefix and each accent swap (`splitTextDecorative` where tiles are `aria-hidden`); `AnimatePresence` crossfade on the accent; `sr-only` + `aria-live="polite"` carries the full sentence. Each card adds a **gradient header** with **inline SVG** (tech pipeline, legal columns, finance bars + trend) and light **SMIL** motion in view when `prefers-reduced-motion` is off (`section-animated-art` + `PracticeAreaAnimatedArt`). Header diagrams use **semantic `currentColor`** via `.section-deco-art-svg` (**primary-leaning mix in light**, accent-leaning in dark), a **soft accent `drop-shadow`**, and (when motion is allowed) a **breathing glow**; **translucent scrim** (`.pa-card-header-scrim`) replaces an opaque white radial fade so lines remain visible. **Desktop fine-pointer hover:** each practice card sits in a perspective shell and uses **pointer-driven 3D tilt + light Z lift** (Framer springs), gated off for **lite-motion** (narrow viewport or `prefers-reduced-motion`) and for **coarse/touch** primary pointers (`matchMedia('(hover: hover) and (pointer: fine)')`).
- **Why W3 (`#why-w3`):** Four pillars in a 2×2 grid: deep domain expertise; global reach with US/UK/EU/UAE/Asia; human-led relationships; ethics & confidentiality. Gradient header art per pillar (network, globe + equator, partnership arc, shield + scales) with **SMIL** motion gated like practice areas; **Lucide** icon remains on a frosted chip over the art (`WhyW3AnimatedArt`). Icons on the chip use the same **`section-card-icon-glow`** pulse as other small inline **SVG / Lucide** marks where emphasis helps scanning. **Pillar body** paragraphs use the same **fade / lite-motion** pattern as practice-area cards.
- **Industries & functions (`#industries`):** Three role-list columns (Technology, Legal, Finance). Technology explicitly includes **software engineers**; intro copy states on-site, hybrid, and remote coverage. Section uses alternating gray-light band with a **slightly larger ambient wash** (`section-industries-ambient`). Column shells use **`.glass-panel-liquid`**: higher blur/saturation, **low-contrast hairline** edge, dual radial accent/cyan wash via `::before` (not heavy 1px box borders). Row items are **borderless frosted tiles** (translucent fill + inset specular); **pointer hover** (and matching bullet emphasis) applies the accent glow ring—**no** scroll-progress spotlight. **Entrance:** **`IntersectionObserver`** + intro **`opacity`/`translateY`** (like other bands); column shells use staggered **`motion.li`** fade-up; **`SplitWords`** uses **`useSplitWordsAnimate(visible)`** so titles do not run on initial page load. Cards are **equal height** on desktop with **space distributed** between rows so short columns do not leave a dead band. Slight **`motion-safe:hover:scale-[1.02]`** on rows when `prefers-reduced-motion` is off.
- **Registered details:** Canonical addresses and Singapore UEN/EA live in `src/content/offices.ts`; reused in `Contact` and `Footer`.
- **Accessibility:** First focusable control on the home page is a “Skip to main content” link targeting `#main-content` on `<main>` (**`tabIndex={-1}`** so it can receive focus after the scripted scroll). Snappy in-page clicks scroll the landmark with **`scrollToSectionId(..., { syncHash: false })`** so the address bar stays **`/terms`**, **`/privacy`**, etc.—not **`#main-content`**; a small client helper strips a lone **`#main-content`** hash on load for legacy/bookmark URLs.

## Tailwind arbitrary classes

Inside arbitrary square brackets, **commas are special** (they separate multiple values). For **`shadow-[…]`** (especially with `dark:` / other variants), avoid commas in color functions entirely: use modern **`rgb(r_g_b_/_a)`** with underscores for spaces (for example `shadow-[0_20px_50px_rgb(15_23_42_/_0.05)]`). Backslash-escaped commas in `rgba(…)` are not reliable with Tailwind v4’s compiler and can emit corrupted CSS that fails PostCSS / `lightningcss` (parse errors against `globals.css`). Unescaped commas also break compilation.

## Motion

- **SSR / hydration:** The app wraps routed content in **`AppMotionConfig`** (`src/components/app-motion-config.tsx`), which sets Framer **`MotionConfig`** to **`reducedMotion="never"`** until a layout effect runs, then **`"user"`**. Framer’s `useReducedMotion()` reads a ref that is **`null` on the server** but a boolean on the client; without this gate, `motion` can emit different trees on the first pass and trigger hydration mismatches (`glass-panel` class strings, footer `motion` shells, etc.) while app-level hooks already pin reduced-motion to a safe default.
- Scroll reveal and light transitions; no distracting loops on critical reading paths. **Below the fold**, major blocks (FAQ list, closing CTA, testimonial slider + controls, how-we-work step copy) use **`motion`** entrances tied to the same section visibility / reduced-motion rules as headings so copy does not “pop” while titles fade.
- **Below-the-fold sections** on the home page are wrapped in **`ScrollReveal`**: one **`whileInView`** animation per band (`once: true`, ~**5%** intersection + a modest **positive bottom root margin** so bands begin fading slightly before they fully enter, reducing a late “pop”); opacity uses a **softer ease-in-out** (`SURFACE_REVEAL_OPACITY_EASE` in `surface-reveal-motion.ts`) than slide/position so the fade reads as **gradual**, while **`translateY`** on **`sm` and up** keeps the shared **`SURFACE_REVEAL_EASE`**; **`max-width: 639px`** stays **fade-only** (**≥~0.52s**); **desktop** **≥~0.62s** for durations aligned with cards/panels. **`prefers-reduced-motion`** keeps **opacity-only** (**no `translateY`**, **~0.45s**) with the same soft opacity ease.
- **Hero lead column (copy + CTAs above the mock):** Do **not** wrap the block in a **CSS `opacity`** transition on the same element that contains **`SplitWords`** and Framer-driven children (opacity multiplies and weakens per-word stagger). Use **`translateY` only** (or per-child motion) for the page-in lift. Primary and secondary CTAs use **staggered** `motion.a` children after subcopy, with **`delayChildren`** aligned after headline motion.
- **Headline motion (site-wide default — GoPerfect-style bubble):** **`SplitWords`** / **`SplitWordsRich`** defer **`motion.span`** until after **`useLayoutEffect`** (SSR + first client paint use plain full-line copy in the same wrapper tag) so Framer does not emit divergent inline styles on hydrate under Turbopack/React 19; then per-word motion runs as before. **`SplitWords`** and **`SplitWordsRich`** default to **`variant="hero"`**: per-word **spring + scale/rotate** into place (shared spring constants in `split-words.tsx`; **no CSS `blur()` on word layers** — WebKit smears composited text over **`backdrop-filter`** parents). **Narrow viewport (≤639px):** the same default **`hero`** path automatically uses **mask-rise + opacity only** (same family as **`textLoad`**: `TEXT_LOAD_EASE`, shorter stagger cap) — **no** global edits at call sites. **≤639px** section bands and **`glass-panel*`** shells also **omit `backdrop-filter`** (fills unchanged) so **`SplitWords`** headings stay sharp on iOS while static paragraphs were already unaffected. **Gate `animate={false}`:** components still render the **per-word flex tile DOM** (not a single plain-string node) with words in the **hidden** mask state and **`duration: 0`** until the gate flips—**avoids layout pop** when switching to staggered motion. **Enforcement:** heading **`animate`** flags go through **`useSplitWordsAnimate(gate)`** (`src/lib/use-split-words-animate.ts`) so **narrow viewports do not disable** word stagger — only **`prefers-reduced-motion`** yields plain copy. Clip wrappers **`gsap_split_word_clip`**, tiles **`gsap_split_word`** / **`gsap_split_word{n}`**. **`splitTextDecorative`** when **`sr-only`** + **`aria-live`** carry the full sentence. **`gsapWordIndexStart`** stays continuous across accent lines. **Hero mock toolbar** uses **`variant="chrome"`** (see narrow rules below). **`variant="textLoad"`** is optional (Y-mask + **`TEXT_LOAD_EASE`** only, no bubble). **Legal** **`h1`/`h2`:** **`AnimatedLegalHeading`** (scroll **`useInView`**, same bubble). **Footer / contact** **`h4`:** **`SplitWords`** with footer/contact visibility gates.
- **Scroll titles and card subheads:** Section **`<h2>`–`<h4>`** when used as titles use **`SplitWords`** or **`SplitWordsRich`** with the **same default bubble** in view. **`SplitWordsRich`** accepts **`animate`** and optional **`gsapWordIndexStart`**. Default **`phraseWidth="fill"`** uses a **full-width `flex` row** with **`flex-wrap`** and **`column-gap`** so lines wrap like normal copy (avoiding **`inline-flex` + `w-max` + `wrap`**, which shrink-to-fits to the widest word and stacks one word per line). **`phraseWidth="flow"`** is for a **long inline prefix** before another **`SplitWords`** (e.g. practice-area intro): **`inline-flex`** + **`flex-wrap`** + **`max-w-full`** **without** **`w-max`**, so shrink-to-fit uses the heading width and wrapping matches normal paragraph flow while the spring bubble motion stays per-word. **`phraseWidth="fit"`** + **`flex-nowrap`** keeps a **short** phrase beside sibling tiles (rotating accent clause, stats headline prefix + accent, **`variant="chrome"`** mock titles). **Centered headings** (`text-center` on the band): add **`justify-center`** on **`SplitWords` / `SplitWordsRich`**; **mixed alignment** (e.g. left on mobile, centered from **`sm`**) uses **`justify-start sm:justify-center`** on those instances.
- **Hero product mock:** On enter-view: chrome title word stagger (neutral workspace + pipeline framing, no “live” claims), scrollable candidate list with gentle auto-scroll to the focused row (**only while the mock stays in view**—intersection is not `once: true`, so timers stop after scroll-away; list follow uses the inner list’s `scrollTop` / `scrollTo`, not `scrollIntoView`, so the **page** does not jump back toward the hero), **one pipeline stage label per candidate row** (from mock `restingStage`: Screen, Interview, or Shortlist) with a subtle pill emphasis on the focused row only—no multi-stage stepper or cycling labels on that row. When focus moves, the stage cell **crossfades** (opacity + light `rotateX` + blur), matching the stats card-flip language; with `prefers-reduced-motion`, the pill toggles without motion. Candidate row stagger, fit bar width animation. **Row chrome:** focused and unfocused candidate rows use the shared **`rounded-row-highlight`** radius from `@theme` in `globals.css` (14px squircle-style corner), a **left border** for the accent stripe (not an inset box-shadow), and **no negative horizontal margin** inside the scroll area so rounded corners are not clipped by `overflow-x-hidden`. When the focused row changes, the accent background and stripe **crossfade** (opacity on a dedicated overlay; shorter duration under **lite-motion**), so the selector does not snap on/off. The mock role title, subtitle, and shortlist rows advance together after each full pass through the shortlist (demo only). **Default demo rows** use vendored 96×96 crops under `public/images/demo-avatars/` (same-origin, no remote CDN), rendered with **`next/image`**, **`sizes="28px"`**, and **`loading="lazy"`** so the optimizer picks tiny widths. Rows may omit `avatarSrc`, or a portrait load may fail; both cases use a neutral **silhouette placeholder** at `public/images/avatar-placeholder.svg` (**`unoptimized`** for SVG). Portraits remain illustrative only. No animated KPI counters in the hero card.
- **Stats (`#stats`):** Two rotating metric sets (about every 5.2s) while the section is in view: `AnimatePresence` crossfade with light `rotateX` + blur for a card-flip feel; counters replay per stage. **Metric tiles** gate **Framer entrance + count-up** on a latched **first-intersection** flag (not per-tile `IntersectionObserver`) so tiles do not animate in while off-screen. No eyebrow pill above the heading. With `prefers-reduced-motion`, only the first set shows (no auto-rotation); transitions are opacity-only.
- **Reduced motion:** `prefers-reduced-motion` uses static **`SplitWords`** copy (no word stagger). **`ScrollReveal`** and **card/panel** Framer entrances still use a **short opacity-only** blend (**~0.45s**, no vertical travel on section bands). **Global CSS** also sets `scroll-behavior: auto`, disables `.animate-marquee` and `.animate-pop-scale`, and stops hero ambient keyframes (orb float, card shimmer, live dot pulse) so purely CSS-driven loops respect the user preference.
- **Feature tabs (`#features`):** Enter-view uses **`useInView`** plus **ease `[0.16, 1, 0.3, 1]`** on the copy column, badge scale-in, and description fade-up. **Tab row:** **`LayoutGroup`** + **`layoutId`** sliding pill surface between segment buttons (spring on desktop, short tween when **lite-motion**). **Panel:** crossfade with light **blur** settle on desktop; **lite-motion** is opacity-only. **Subhead** tab titles use **`SplitWords`** **`variant="textLoad"`** (mask-rise, editorial tier under the main **`SplitWordsRich`** bubble headline). **Bullets:** staggered **`motion.li`** + check **spring** on desktop; narrow / **lite-motion** uses a static list. **Glass stack:** inactive rows ease **scale**/**opacity**; active row gets a thin **accent ring** and icon chip **spring** scale; **focus-visible** ring for keyboard.
- **Narrow viewport (≤639px, below Tailwind `sm`):** Hero **pipeline mock** still uses **`liteMotion`** for heavy flourishes: no 3D/blur stage flip on the focused row (pill toggle only), instant fit % / bar widths, instant list follow inside the mock (no smooth list scroll), shorter entrance transitions, no status-dot `animate-ping`, static gradient orbs (no Framer drift), row advance interval 4s instead of 3.2s, and a **static middot** between mock chrome phrases instead of a springy dot. **Per-word copy** (hero display lines, mock chrome titles, section/legal/footer headings) still uses **`SplitWords`** / **`useSplitWordsAnimate`** unless **`prefers-reduced-motion`**. Stats: first metric set only (no auto-rotation), opacity-only grid transitions. **CSS:** `hero-orb` float and `hero-card-shimmer::after` infinite animations are disabled at this breakpoint.
- **Ambient:** Radial washes, `hero-surface-grid` / `hero-dot-noise`, `hero-orb` float, `hero-card-shimmer` on the preview card (orb float + card shimmer suppressed on narrow viewports; see above).

## Theme

- **Light / dark:** User toggle persists in `localStorage` (`w3-theme`); `document.documentElement` gets class `dark`. Tailwind uses `@custom-variant dark` aligned with that class. CSS variables in `globals.css` drive surfaces, borders, and accent for both themes. **`/public/w3-theme-boot.js`** is injected via **`next/script`** **`beforeInteractive`** in **`app/layout.tsx`** so the stored preference applies before first paint to limit flash.

## Responsive

- Mobile-first; nav collapses to sheet; touch targets adequate; marquee/logos remain readable.

## May 2026 Startup Market Refresh

- Light mode should feel sharper and more venture-market native: bright white-blue canvas, faint product grid, crisp blue accent, and shadow-led surfaces that read like a modern operator dashboard rather than traditional agency collateral.
- Homepage framing can explicitly reference accelerator-backed, VC-backed, founder, and operator contexts where it is truthful. Keep the tone high-trust and concise; avoid pretending W3 is a software product or making unverified fund affiliation claims.
- Shared surface tokens in `globals.css` remain the source of visual personality. Prefer tuning `--accent`, `body.liquid-page-canvas`, `.glass-panel`, `.glass-chip`, and section bands before adding one-off section chrome.
- Use Lucide icons for CTA affordances where available, and keep Framer motion purposeful: word reveals, card entrance, and dashboard micro-interactions should support a sleek startup-grade feel without competing with copy.

## May 2026 Gradient Discipline

- Gradients should read as one restrained system, not scattered decoration. Global page depth comes from `body.liquid-page-canvas`; card header washes use `.surface-gradient-field` plus named tones (`--venture`, `--process`, `--trust`, `--finance`); the closing CTA uses `.section-cta-gradient`.
- Avoid adding new arbitrary `from-* via-* to-*` recipes for large surfaces. New gradients belong in `globals.css` as semantic utilities unless they are tiny functional chrome such as progress bars, divider lines, masks, or active-state glints.
- Keep opacity low and stops broad. 2026 treatment is atmospheric continuity, crisp surfaces, and readable text—not loud multi-color panels.

## May 2026 Trusted-By Mark Refresh

- Trusted-by company items use real domain favicon/logo images (`www.google.com/s2/favicons`) in compact glass logo tiles, with two-letter monograms only as load-failure fallbacks. Logo images are decorative because the adjacent company name is the accessible text. Animation timing remains CSS-class based and follows the existing paused-off-screen and reduced-motion behavior.

## May 2026 Stats-to-Comparison Spacing

- The stats band uses compact vertical padding and a low minimum card-stage height so the rotating card grid does not leave a large empty tail before the comparison section. The comparison intro uses compact top padding after stats, and its first headline animates on mount so the heading never reserves blank space while the body copy is already visible.

## May 2026 Typography Refresh

- Display typography now uses Geist Sans for `h1` / `h2` as well as UI copy. The brand direction is founder-tool / Vercel-adjacent rather than editorial: broader, cleaner, and more venture-native, with strong weights and no negative tracking.
- Avoid reintroducing narrow or serif-led display faces for primary section headlines unless the brand direction changes again. Keep type refinement in weight, rhythm, and spacing rather than a separate fashion/editorial font.

## May 2026 Typography Revert

- Supersedes the preceding Typography Refresh note: restore the original committed pairing of Geist Sans for UI/body copy and Instrument Serif for `h1` / `h2` display headings. This is the preferred refined executive-tech look for the current brand direction.

## May 2026 Trusted-By Borderless Icons

- Trusted-by company icon tiles remain compact glass-backed logo holders, but the tile itself is borderless in both light and dark themes. Depth should come from translucent fill and shadow only, so the favicon image never appears boxed by an outline.

## May 2026 Section Boundary Blend

- Full-width glass section bands must fade their own fill at the top and bottom edges so adjacent sections dissolve into the shared liquid canvas instead of forming hard horizontal rifts. Keep the fade tokenized in `globals.css` via `--section-band-edge-fade`; avoid one-off opaque top/bottom slabs on individual sections.

## 2026-05-04 Contact Deprecation

- The home-page contact form is deprecated and should not be part of the visible scroll narrative.
- Header, hero, comparison, 404, and final CTA contact affordances should read as direct email actions and link to `mailto:info@w3sourcing.com` instead of `#contact`.
- Footer continues to surface the registered office details and direct email address; do not add a footer `#contact` anchor while the form remains deprecated.
- Full-width section bands should not apply `backdrop-filter` to the entire section rectangle. Keep frosted blur on cards, chips, and local surfaces; section-wide bands use translucent gradient washes only, because an element-wide backdrop filter starts and stops as a visible rectangular seam while scrolling.
- Header branding uses the cropped `logo_w3_sourcing_wordmark.png` asset. Keep the navy source color in light mode and invert it to white in dark mode so the mark always matches the active theme contrast.

## May 2026 Trusted-By Chrome-Free Icons

- Supersedes the preceding trusted-by icon tile note: company favicons render without a surrounding tile, border, shadow, or background fill. Keep the icon footprint stable for marquee rhythm, but do not add visible chrome around the image itself.

## 2026-05-04 Implementation Corrections

- Leadership (`#leadership`) is rendered by a client `FounderSpotlight` shell with an SSR-safe mount gate for Framer motion, plus a server `FounderSpotlightCard` for stable copy. Do not describe it as a fully client-only `next/dynamic({ ssr: false })` block unless the implementation changes back.
- The founder portrait uses `ResilientImage` with `next/image` fill inside a circular frame, not a native `<img>`. Keep the wrapper isolated above glass-panel washes so the portrait is never hidden by blend layers.
- Header branding uses `ResilientImage` for `/images/logo_w3_sourcing_wordmark.png`; light mode keeps the source navy mark and dark mode applies `brightness-0 invert`.
- Trusted-by rendering is isolated behind `TrustedByClient`, a client wrapper that disables SSR for the marquee body. This is the client-only hydration boundary for the social-proof strip, not Leadership.
- The closing CTA has no secondary anchor to `#contact`; its only visible action is direct email.

## 2026-05-04 Hero Accent Light Mode Contrast

- The hero rotating accent phrase under “Executive search for” uses solid `text-accent` in light mode. Gradient clipped transparent text is dark-mode-only, because light mode must not depend on background clipping for essential headline readability.

## 2026-05-04 Trusted-by Marquee Row Motion

- Trusted-by marquee rows use disjoint company pools so the same organization does not repeat across both visible rows. Any duplicate DOM entries exist only as the hidden second copy required for the seamless CSS loop.
- The lower row moves in the opposite direction from the upper row and starts offset, creating intersecting motion without mirroring the same company sequence.

## 2026-05-04 Favicon Brand Source

- Browser, Apple touch, Android/PWA, and `.ico` favicon assets use the W3 logo mark, not a generated text badge or the full horizontal wordmark.
- Canonical favicon files and the source logo live under `public/images/favicon/` only. Do not add alternate favicon source images elsewhere in `public/images/`; regenerate the sized favicon assets from `public/images/favicon/logo.png` when the mark changes.
- App metadata should reference `/images/favicon/site.webmanifest`, `/images/favicon/favicon.ico`, `/images/favicon/favicon-32x32.png`, `/images/favicon/favicon-16x16.png`, and `/images/favicon/apple-touch-icon.png` directly.

## 2026-05-04 Hero Accent Theme Contrast

- Supersedes the preceding hero accent contrast note: the hero rotating accent phrase must render as visibly colored text in both light and dark themes. Do not use `bg-clip-text` or transparent text for this phrase, because the glyphs are nested inside per-word `SplitWords` spans and clipped parent backgrounds can make the headline disappear.

## 2026-05-04 Venture Copy Refresh

- Homepage copy may lean harder into VC-backed, fund-backed, portfolio-company, founder-led, growth-stage, and operator language where it describes the technology practice or the cross-market buyer context. Keep claims generic and positioning-led unless a specific client relationship is verified.
- The venture vocabulary should support the existing premium executive-search voice: concise, credible, and human-led. Do not turn W3 into a software-product narrative or over-index on startup slang at the expense of legal and finance trust.

## 2026-05-04 Hero Brand Copy Refresh

- Supersedes hero wording references that mention the prior prefix sentence. The current hero display treatment is a two-line brand headline: line one "W3" and line two "Sourcing".
- Supporting hero copy should use the positioning sentence: "Global recruitment excellence for technology, legal, and finance leaders - human-led judgment on who truly fits, for organisations across the US, UK, EU, UAE, and Asia."
- Keep the existing accent-line implementation contract (`accentFrame.line1` + `accentFrame.line2` as one `SplitWords` phrase) so animation structure and test coverage remain stable while copy evolves.

## 2026-05-04 Practice Area Photo Headers

- Supersedes prior practice-area header notes that described inline SVG diagrams over the card media. Practice-area cards are photo-backed and must not place animated SVG art above those photos.
- Keep the three card images as the visible media: business team around a laptop for VC & Growth Technology, Perry Barrow event-stage photo for Legal, and Perry Barrow networking photo for Banking & Finance.
- Maintain the theme-aware gradient overlay and `.pa-card-header-scrim` only for readability and edge blending; do not reintroduce `PracticeAreaAnimatedArt` into `practice-areas.tsx` while these cards use real photos.

## 2026-05-04 Photo And SVG Separation

- Supersedes the preceding prohibition on `PracticeAreaAnimatedArt` in `practice-areas.tsx`: animated SVG art may remain, but only in a separate non-photo art panel below the image header.
- `PracticeAreas` uses `.practice-card-art-panel`; `WhyW3` uses `.why-card-art-panel`. Neither component should render `PracticeAreaAnimatedArt` or `WhyW3AnimatedArt` inside the photo header that contains `ResilientImage`.

## 2026-05-04 Footer Maker Credit Icon

- The footer maker credit reads as “Made with love by Misha Lubich” but renders the love mark as a small neutral Lucide heart icon, not a red emoji. Keep the Misha Lubich link pointed at `https://mishalubich.com` with `noopener` and `noreferrer`.

## 2026-05-04 American Startup Copy Voice

- Public-facing copy should sound like a refined Silicon Valley partner to VC-backed founders, operators, and growth teams: clear, calm, useful, and human. It can be casual in rhythm, but it should not become slangy or cute.
- Use American English in new marketing copy: “rigor,” “behavior,” “organization,” “caliber,” and “inquiry.” Do not introduce British or Singaporean phrasing when writing new public copy.
- Avoid unfriendly or high-pressure language. Words and constructions such as “mandate,” “deserves,” “beat automation,” “high-stakes mandate,” “candid feasibility,” and “principal-led judgment should beat...” can read cold, aggressive, or adversarial in CTA and card copy.
- Prefer modern startup-market phrasing: “role,” “search,” “team build,” “next stage of growth,” “founder-led,” “operator,” “portfolio company,” “market map,” “clear signal,” “practical next steps,” “thoughtful calibration,” “trusted introductions,” “build with confidence,” and “scale the team.”
- CTAs should invite, not pressure. Preferred patterns include “Start a conversation,” “Tell us what you are building,” “Share the role,” “Talk through the search,” and “Map the market.” Avoid framing that implies the reader is failing unless they act.
- Comparisons with automation should stay generous and current: tools can widen reach and speed up workflows; W3 adds human context, relationship trust, and judgment where senior hiring needs nuance. Do not write anti-technology copy or make the site sound hostile to AI.
- The voice should still feel premium for legal and finance readers. Startup-native phrasing must be balanced with discretion, clarity, and credibility so the brand does not read like a casual SaaS landing page.
- Photo headers keep real photography as the dominant visual. SVG diagrams provide secondary motion in their own gradient strip so they do not obscure faces, events, or team imagery.

## 2026-05-04 Section-Level SVG Rails

- Supersedes the preceding card-level art-panel note: animated SVGs are decoupled from photo cards entirely and live in standalone section-level rails.
- `PracticeAreas` renders `PracticeAreaAnimatedArt` inside `.practice-area-art-rail` before the card grid; `WhyW3` renders `WhyW3AnimatedArt` inside `.why-w3-art-rail` before its card grid.
- Photo cards should contain the photo header, scrim, title, and copy only. Do not add animated SVG panels back into individual photo cards.

## 2026-05-04 Feature Workflow Photos

- All three `FeatureTabs` workflow sections are photo-backed: Source & engage uses `/images/perry_assets/13.png`, Qualify & assess uses `/images/perry_assets/4.png`, and Place & integrate uses `/images/perry_assets/18.png`.
- The Qualify & assess photo should read as a candidate assessment / interview discussion, matching the section copy around technical assessment, culture mapping, and rigorous evaluation.
- Decorative rail SVGs are visual only: no embedded text labels, no marketing copy, and no terminology such as “mandate.” The rails should read as polished product-style signal graphics, while the surrounding card headings carry the actual copy.

## 2026-05-04 Decorative Rail Visibility

- Decorative SVG rails use `.section-deco-art-svg--rail` so the artwork is brighter and larger than the smaller card-header diagrams.
- Do not place icon chips, badges, or photo thumbnails inside the decorative rail cards. They can be clipped by the rail container and make the artwork look blocked or obstructed.

## 2026-05-04 People Photo Focal Point

- Photo-backed content modules use `.people-photo-object` with `object-cover` so constrained cards crop toward the upper third of the image instead of cutting through heads and faces.
- On narrow viewports, `.people-photo-object` shifts the focal point slightly higher (`center 28%`) to preserve people in shorter mobile crops.
