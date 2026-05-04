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
