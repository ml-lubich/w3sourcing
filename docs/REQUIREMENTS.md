# Product requirements (marketing site)

This document captures **what the public site must do** and **what it must not claim**, so engineers, designers, and copywriters stay aligned. It is not a contract template; it is the single place we record product-level expectations for this repository.

## Goals

The site exists to **build trust and prompt qualified enquiries** for W3 Sourcing’s executive recruitment work across technology, legal, and banking and finance. A successful visit leaves the reader with a clear sense of **who you serve**, **how you work**, **why you are credible**, and **how to start a conversation**.

We optimise for **clarity and calm**, not for gimmicks. The experience should feel worthy of the mandates W3 represents: senior hires, sensitive processes, and long-term relationships.

## Functional requirements

- **Single-page home** at `/` with the section order defined in `docs/OVERVIEW.md`, including anchors used by the header, comparison sub-anchors, and legal/footer links.
- **Legal pages** at `/privacy` and `/terms`, sharing header and footer behaviour with the home page so section links resolve correctly when the reader is not on `/`.
- **Contact section** at `#contact` with name, email, intent selector, message, and **frontend-only** submit behaviour (success state without a backend until explicitly integrated).
- **Registered-office and contact details** surfaced in the contact block and footer, sourced from `src/content/offices.ts` so copy does not drift.
- **Theme switching** between light and dark, with persistence and first-paint behaviour as described in `docs/OVERVIEW.md` and `docs/DESIGN.md`.
- **Accessibility baseline**: skip link to main content, semantic landmarks, `aria-live` where hero and rotating copy update, and respect for `prefers-reduced-motion` on animated passages.

## Content and positioning

- **Practice-area narrative** must remain aligned with the three pillars: technology (including software engineering through leadership; on-site, hybrid, remote), legal (US and UK firms, associate through partner), banking and finance (IB, corporate finance, risk and compliance).
- **Why W3** and **how it works** must continue to emphasise **domain depth**, **global reach**, **human-led relationships**, and **ethics / confidentiality** as first-class themes—not afterthoughts.
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
