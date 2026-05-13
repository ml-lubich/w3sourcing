# W3 Sourcing

Next.js marketing site. **Use [Bun](https://bun.sh) for all installs and scripts** (see `packageManager` in `package.json`).

```mermaid
flowchart LR
    VISITOR(("👤<br/>Visitor"))
    NEXT{{"⚡ Next.js 16<br/>App Router · RSC"}}
    APP["📄 src/app/<br/>page · privacy · terms<br/>sitemap · robots · opengraph"]
    COMP["🧩 src/components/<br/>hero · sections · nav · footer"]
    CONTENT[("📝 src/content/<br/>copy · brand")]
    LIB["📚 src/lib/"]
    SMOKE["🔍 scripts/smoke-no-404.ts<br/>route smoke"]
    VERCEL[/"🌐 Vercel<br/>static + RSC"/]

    VISITOR --> NEXT
    NEXT --> APP
    APP --> COMP
    COMP --> CONTENT
    APP --> LIB
    NEXT --> VERCEL
    SMOKE -. validates .-> APP

    classDef io fill:#0e1116,stroke:#2f81f7,stroke-width:1.5px,color:#e6edf3;
    classDef brain fill:#161b22,stroke:#d29922,stroke-width:1.5px,color:#e6edf3;
    classDef tool fill:#161b22,stroke:#3fb950,stroke-width:1.5px,color:#e6edf3;
    classDef out fill:#0e1116,stroke:#a371f7,stroke-width:1.5px,color:#e6edf3;
    class VISITOR,CONTENT io;
    class NEXT brain;
    class APP,COMP,LIB,SMOKE tool;
    class VERCEL out;
```

## Table of contents

- [Quick orientation](#quick-orientation)
- [Request flow (sequence)](#request-flow-sequence)
- [Route smoke (algorithm)](#route-smoke-algorithm)
- [Setup (step by step)](#setup-step-by-step)
- [Scripts](#scripts)
- [Documentation map](#documentation-map)
- [Project layout](#project-layout)
- [Deploy on Vercel (step by step)](#deploy-on-vercel-step-by-step)

## Request flow (sequence)

```mermaid
sequenceDiagram
    participant V as visitor
    participant CDN as Vercel edge
    participant N as Next.js 16 RSC
    participant APP as src/app
    participant CMP as components
    participant C as src/content

    V->>CDN: GET /
    CDN->>N: render request
    N->>APP: route handler
    APP->>CMP: assemble sections
    CMP->>C: read copy / brand
    C-->>CMP: strings
    CMP-->>N: HTML stream
    N-->>CDN: streamed RSC
    CDN-->>V: HTML + assets
```

## Route smoke (algorithm)

```mermaid
flowchart LR
    A([bun run smoke:routes])
    B["build (unless SMOKE_SKIP_BUILD)"]
    C["start next start"]
    D["enumerate routes"]
    E{"per route"}
    F["GET URL"]
    G{"status == 200?"}
    H["record pass"]
    I["record fail"]
    J{"more routes?"}
    K{"any failures?"}
    L([exit 1])
    Z([exit 0])
    A --> B --> C --> D --> E --> F --> G
    G -- yes --> H --> J
    G -- no  --> I --> J
    J -- yes --> E
    J -- no  --> K
    K -- yes --> L
    K -- no  --> Z
```

## Quick orientation

This repo is a static Next.js marketing site for W3 Sourcing. If you are opening it cold, start with `docs/OVERVIEW.md`, then use the table below to jump into requirements, design, testing, or deployment.

The live site experience is intentionally navigable from the header and footer: home-page section links resolve through hash navigation, legal pages route to `/privacy` and `/terms`, and primary contact actions use direct email rather than a form.

## Setup (step by step)

1. Install Bun (version aligned with `packageManager` in `package.json` when possible).
2. From the repo root: `bun install`
3. `bun run dev` — opens the URL Next prints (default port **3000**, or the next free port if 3000 is taken; use `bun run dev -- -p 0` for an OS-assigned port). A **second** `next dev` for the same folder is not allowed by Next 16; this repo stops the previous dev server (using `.next/dev/lock`) before starting, so `bun run dev` is safe to re-run. To disable that, set `W3_REPLACE_NEXT_DEV=0`. Other scripts (`build`, `start`, `lint`) still use `exec-in-repo-root` so they work from a parent directory.

## Scripts

| Command                    | Purpose                                                         |
| -------------------------- | --------------------------------------------------------------- |
| `bun run dev`              | Development server                                              |
| `bun run build`            | Production build                                                |
| `bun run start`            | Serve production build                                          |
| `bun run lint`             | ESLint                                                          |
| `bun run test`             | Unit tests (`src/`) + TypeScript check                          |
| `bun run smoke:routes`     | Route smoke (default: build + `next start`)                     |
| `bun run smoke:routes:dev` | Route smoke against `next dev` (avoid if dev server is running) |
| `bun run smoke:routes:ci`  | Smoke after an existing build (`SMOKE_SKIP_BUILD=1`)            |

## Documentation map

| Document | Use it for |
| -------- | ---------- |
| `docs/OVERVIEW.md` | Project purpose, routes, section order, navigation behavior, and commands. |
| `docs/REQUIREMENTS.md` | Product requirements, content constraints, non-goals, and quality bar. |
| `docs/DESIGN.md` | Visual system, component behavior, motion rules, theme, and responsive notes. |
| `docs/TESTING.md` | Local checks, route smoke behavior, CI expectations, and image-loading contracts. |
| `docs/DEPLOYMENT.md` | Bun/Vercel deployment, SEO environment variables, and CI deployment gates. |

## Deploy on Vercel (step by step)

1. Push the repo; ensure **`bun.lock`** is committed and there is **no** root `package-lock.json`.
2. Import the project in [Vercel](https://vercel.com/new); defaults should pick up **`vercel.json`** (`bun install --frozen-lockfile`, then `bun run lint && bun run build && bun run smoke:routes:ci`).
3. Confirm in the deployment build log that dependencies install with **Bun**.

More detail: **`docs/DEPLOYMENT.md`**.

## Project layout

```
src/
  app/             # Next.js App Router (page, privacy, terms, sitemap, robots, OG)
  components/      # Hero, sections, nav, footer
  content/         # Marketing copy + brand assets
  lib/             # Shared helpers
scripts/           # Bun helpers — run-next-dev, smoke-no-404, exec-in-repo-root
docs/              # OVERVIEW · REQUIREMENTS · DESIGN · TESTING · DEPLOYMENT
public/            # Static assets
vercel.json        # Vercel build config
```
