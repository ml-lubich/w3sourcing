# Product requirements (marketing site)

This document captures **what the public site must do** and **what it must not claim**, so engineers, designers, and copywriters stay aligned. It is not a contract template; it is the single place we record product-level expectations for this repository.

## Table of contents

- [Goals](#goals)
- [Functional requirements](#functional-requirements)
- [Content and positioning](#content-and-positioning)
- [Non-goals (current codebase)](#non-goals-current-codebase)
- [Quality bar](#quality-bar)
- [Contact deprecation](#2026-05-04-contact-deprecation)
- [Current product requirements](#2026-05-04-current-product-requirements)

## Goals

The site exists to **build trust and prompt qualified enquiries** for W3 Sourcing’s executive recruitment work across technology, legal, and banking and finance. A successful visit leaves the reader with a clear sense of **who you serve**, **how you work**, **why you are credible**, and **how to start a conversation**.

We optimise for **clarity and calm**, not for gimmicks. The experience should feel worthy of the mandates W3 represents: senior hires, sensitive processes, and long-term relationships.

## Functional requirements

- **Single-page home** at `/` with the section order defined in `docs/OVERVIEW.md`, including anchors used by the header, comparison sub-anchors, and legal/footer links.
- **Legal pages** at `/privacy` and `/terms`, sharing header and footer behaviour with the home page so section links resolve correctly when the reader is not on `/`.
- **First-time-reader navigation**: README and canonical docs must expose a table of contents or document map so someone opening the project can find setup, requirements, design, testing, and deployment without hunting.
- **Site navigation** must make the primary home sections, legal pages, and direct email contact reachable from header/footer patterns; non-home section links must route back to the home page and land on the intended section.
- **Registered-office and contact details** surfaced in the footer, sourced from `src/content/offices.ts` so copy does not drift.
- **Footer structure**: the footer opens on a W3-blue contact band (the ask), then five columns whose headings share one baseline — brand, Company, Practices, Explore, Offices — then a compact legal bar. Link columns are built from one shared component so a long list next to a short one can never leave a divider rule running past empty space.
- **Theme switching** between light and dark, with persistence and first-paint behaviour as described in `docs/OVERVIEW.md` and `docs/DESIGN.md`.
- **Accessibility baseline**: skip link to main content, semantic landmarks, `aria-live` where hero and rotating copy update, and respect for `prefers-reduced-motion` on animated passages.

## Content and positioning

- **Practice-area narrative** must remain aligned with the three pillars: technology (including software engineering through leadership; on-site, hybrid, remote), legal (US and UK firms, associate through partner), banking and finance (IB, corporate finance, risk and compliance).
- **Why W3** and **how it works** must continue to emphasise **domain depth**, **global reach**, **human-led relationships**, and **ethics / confidentiality** as first-class themes—not afterthoughts.
- **Mandate details** such as remote/hybrid/on-site expectations, relocation, compensation, vacation/leave, or other benefits may appear only when supplied by the client or another approved source; do not invent employment terms for marketing polish.
- **Comparison content** may name competitor categories and platforms (including **Paraform** and other tools in the matrix) and must remain **honest about partial scores** where automation or self-serve strengths belong to software.
- **Human-led positioning** is explicit where copy contrasts **principal judgment, taste, and accountability** with **software- or AI-only** hiring workflows—without claiming humans are infallible or that tools have no role.

## Non-goals (current codebase)

- No authenticated client or candidate portal in this repo.
- No server-side form handling, CRM sync, or analytics pipeline is specified here; adding them is a separate integration task and should update this document when behaviour changes.
- No claim of real-time placement data, live shortlists, or production KPIs in the hero or stats mock unless backed by a real data source and legal review.

## Quality bar

- **Visual and verbal consistency**: typography, spacing, and tone should feel like one brand from hero to footer.
- **Performance-sensitive motion**: hero and stats follow the narrow-viewport and reduced-motion rules in `docs/DESIGN.md` so the site stays usable on phones and for motion-sensitive users.
- **Documentation parity**: when routes, section IDs, theme handling, or form behaviour change, update `docs/OVERVIEW.md`, this file, and `docs/DESIGN.md` in the same change set where applicable.

## 2026-05-04 Contact Deprecation

- The home-page contact form is deprecated and must not be rendered in the primary home-page flow.
- Primary contact actions must use direct email via `mailto:info@w3sourcing.com`.
- No new form handling, CRM sync, or frontend-only fake-submit state should be added unless a future requirement explicitly reintroduces a contact workflow.

## 2026-05-04 Current Product Requirements

- The deprecated `#contact` form requirement is superseded: the public journey must not expose a fake-submit contact form while no backend, CRM sync, or third-party form service exists.
- The home page must include a **Leadership** section (`#leadership`) between Trusted-by and Practice areas, and section navigation must resolve this anchor from both home and legal pages.
- Direct contact CTAs must be email-first and point to `mailto:info@w3sourcing.com`; privacy-specific legal contact copy may use the legal contact address defined in `src/content/privacy-policy.ts`.
- The privacy page must render the structured policy content from `src/content/privacy-policy.ts` rather than duplicating long-form legal copy in the route component.
- Brand imagery must remain resilient: visible site images should use the shared `ResilientImage` contract when a loading skeleton or failure-preserving fallback is required.

## 2026-07-29 Jobs Explorer Requirements

- `/jobs` must provide free-text search plus role-group, workplace, sector, and visa-availability filters without exposing client identifiers.
- Each public job card must have a stable link target and a share action with clipboard fallback, without exposing client identifiers.
- Sharing a role, emailing Perry about it, or opening his LinkedIn from a card mints a unique referral code (`/r/<code>`). Opening that link counts one person once. `/admin` → Referrals is the ledger Perry uses to pay the 10% commission for candidates who came through the site. The code is also written into the email subject so the sender can be matched. The ATS link stays server-side; the referral hop never redirects to it.
- Job results must load progressively as the reader scrolls, without numbered pagination or a manual load-more button.
- Progressive batches must show non-content shimmer placeholders while loading, and reduced-motion preferences must be respected.
- Posted dates may determine result order but must not be rendered on public job cards.
- The W3 map (`#expertise`, lg+) must read as a dense field: no pill may sweep through the centre title's keep-out band, and scatter that lands inside it is reflected outward rather than clamped to the edge (clamping parks a tier on one line, where pills overlap). Pills are real buttons; clicking one freezes the field and flips out an opaque panel anchored to that pill, naming its practice, its sibling areas, and a link to live roles. Escape or a press outside closes it.

## 2026-08-06 Self-Serve Jobs Management Requirements

Perry publishes and closes roles himself; adding a role must never require a developer, a commit, or a deploy.

- The editor lives at `/admin` behind a single shared login (`ADMIN_EMAIL` + `ADMIN_PASSWORD`). It must be `noindex`, unlinked from public navigation, and must re-check the session inside every mutating server action — the page-level check is not access control.
- Roles can be added **one at a time** through a form, or in bulk by **CSV** (file upload or pasted rows). Only the role title is required; every other field is optional and may be left blank.
- CSV headers are matched by alias (`job title`, `location`, `comp`, … all resolve), unknown columns are ignored and reported, and unreadable rows are reported by line number instead of being silently dropped. Slashed dates are read day-first (Singapore and London convention), never month-first, unless only month-first is possible.
- Rows carrying an ATS link that already exists update that role in place rather than creating a duplicate, so a refreshed export can be re-imported safely.
- Any role can be flagged a **hot job**. Hot roles carry a badge on the public card and sort above everything else, newest-first ordering applying within each group.
- Closed roles are removed outright from `/admin`; the public board must reflect an add, edit, removal, or hot flag immediately, not on the next deploy.
- Roles can be retired **in bulk**, never only one at a time. The roles list carries per-row checkboxes and a **Select all** that spans the whole current search result — not merely the rows scrolled into view — and removes the selection in one confirmed step.
- A CSV import may **replace the board**: it upserts every row in the file, then removes every role the file no longer lists. This is Perry's weekly rhythm — the Paraform export *is* the live board, so roles that were filled or pulled come down in the same step that adds the new ones. The option is opt-in; a plain import still only adds and updates.
- Replacing must never be reachable by accident. A CSV that parses to zero usable rows is a bad upload, not an instruction to clear the site, so the import returns before the removal pass; and the removal pass itself treats an empty batch as "remove nothing".
- Every role has its own public address (`/jobs#job-<ref>`, from `jobPermalink`). Opening one **highlights that card**: an accent border with a glow that pulses once and settles, from the browser's own `:target` — so the card stays marked while the visitor reads it, and reduced motion keeps the border without the pulse. Both the admin row and the public card copy it straight to the clipboard on one press — no OS share sheet — and confirm with a green "Link copied" for about two seconds.
- `/admin` carries the site's own chrome: the wordmark links back to the public site, the light/dark toggle is present, and the sign-in card is centred rather than pinned to the top left.
- `/admin` offers a **Dashboard** view alongside the roles list: live/hot/recent counts, roles posted per month, and rankings by group, sector, and location. Each chart answers a magnitude question, so each is a single series in one hue — no colour carries identity. Ranking labels stay on one line (long names shorten with an ellipsis; the full name is on the label and in the bar tooltip) and the chart grows with the number of rows so neighbouring categories do not collide.
- `/admin` offers a **Referrals** view: every code issued from the live board or from the editor's copy button, with the role, channel, issue time, distinct people, and the last visitor id. That ledger is the record for the 10% site commission.
- The admin roles list loads a page at a time as the editor scrolls, the same way the public board does; a new search restarts at the first page.
- The same selection drives hot flags: shift-click extends a range across rows, and one flame button applies to whatever is selected. That button is tri-state like a bold control — filled when every selected role is hot, half-filled ("Partly hot") on a mixed selection, empty otherwise — and a mixed or empty selection turns them all hot on the first press. Toggles paint immediately and settle when the server confirms.
- The CSV import carries an optional "mark every imported role as hot" checkbox; a `hot` column in the file still flags rows on its own.
- `/admin` offers an **Assistant** view: a question box over a digest of the live board (facet counts plus the most recent roles). Replies render as formatted text — bold and lists, not raw asterisks — and each block eases in. Reduced motion shows the reply at once. It is admin-only — the digest carries client names, so the answer never leaves the signed-in page — and it degrades to a plain message when no OpenRouter key is set.
- Job cards (public and admin) carry a per-discipline icon derived from the role title, not one shared briefcase.
- Public job cards tilt in 3D toward the pointer. The angles come from one delegated handler writing CSS variables, never a spring per card, and the effect is off under `prefers-reduced-motion` and for non-mouse pointers.
- The privacy contract from the Jobs Explorer requirements still holds for every route into the data: company, website, ATS link, tagline, and free-text visa notes stay server-side, whether a role came from the Paraform export, the form, or a CSV.

## 2026-05-04 American Startup Voice Requirement

- New public marketing copy must use refined American English and a current VC-backed technology / startup-market voice.
- Avoid aggressive, cold, or overly traditional executive-search phrasing such as “mandate,” “your next inflection point deserves,” “beat automation,” or language that sounds like pressure, judgment, or a formal retained-search brief.
- Prefer warm, concise phrases that feel native to Silicon Valley operators and founders: “start a conversation,” “next stage of growth,” “founder-led teams,” “portfolio companies,” “practical next steps,” “clear signal,” “market map,” “operator judgment,” “build the team,” and “scale with confidence.”
- Keep the tone premium and trustworthy. Startup language should feel modern and casual, but not slangy, gimmicky, regional, Singaporean, or British in spelling or idiom.
