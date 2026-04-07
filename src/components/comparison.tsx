"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Check, Minus, X } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SplitWords } from "@/components/split-words";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

const MATRIX_AUTO_INTERVAL_MS = 2800;

type CompareCell = "yes" | "partial" | "no";

type MatrixRow = {
  feature: string;
  w3: CompareCell;
  /** LinkedIn, hireEZ, Gem, Findem, Paraform, job boards */
  platforms: CompareCell[];
};

const platformColumns: { id: string; label: string; hint: string }[] = [
  { id: "linkedin", label: "LinkedIn", hint: "Recruiter & Jobs" },
  { id: "hireez", label: "hireEZ", hint: "AI sourcing" },
  { id: "gem", label: "Gem", hint: "Recruiting CRM" },
  { id: "findem", label: "Findem", hint: "Talent data" },
  { id: "paraform", label: "Paraform", hint: "Recruiter network" },
  { id: "jobboards", label: "Job boards", hint: "Posts & inbound" },
];

const MATRIX_DATA_COLUMN_COUNT = 1 + platformColumns.length;

const matrixRows: MatrixRow[] = [
  {
    feature: "Principal-led partner owns the mandate end-to-end",
    w3: "yes",
    platforms: ["no", "no", "no", "no", "partial", "no"],
  },
  {
    feature: "Human-in-the-loop judgment on every shortlist",
    w3: "yes",
    platforms: ["partial", "partial", "partial", "partial", "partial", "no"],
  },
  {
    feature: "Confidential, sensitive, or board-level searches",
    w3: "yes",
    platforms: ["partial", "no", "partial", "partial", "partial", "no"],
  },
  {
    feature: "Trusted outreach to passive executives",
    w3: "yes",
    platforms: ["yes", "yes", "partial", "yes", "yes", "no"],
  },
  {
    feature: "Culture & leadership fit beyond keywords",
    w3: "yes",
    platforms: ["no", "partial", "yes", "yes", "partial", "no"],
  },
  {
    feature: "Curated shortlists over profile or applicant volume",
    w3: "yes",
    platforms: ["no", "partial", "partial", "partial", "partial", "no"],
  },
  {
    feature: "Depth in Technology, Legal & Finance leadership",
    w3: "yes",
    platforms: ["no", "partial", "no", "partial", "partial", "no"],
  },
  {
    feature: "Multi-region hiring coverage",
    w3: "yes",
    platforms: ["yes", "yes", "yes", "yes", "yes", "yes"],
  },
  {
    feature: "Remote, hybrid & distributed mandates with retained judgment",
    w3: "yes",
    platforms: ["partial", "partial", "partial", "partial", "partial", "partial"],
  },
  {
    feature: "Automation at scale (enrichment, campaigns, pipelines)",
    w3: "partial",
    platforms: ["yes", "yes", "yes", "yes", "yes", "partial"],
  },
  {
    feature: "Self-serve platform: seats, posts, or usage-based pricing",
    w3: "no",
    platforms: ["yes", "yes", "yes", "yes", "yes", "yes"],
  },
];

const pullQuotes = [
  {
    quote:
      "They understood our culture from day one and delivered three exceptional engineering leaders within six weeks.",
    name: "Sarah Chen",
    title: "CTO, Series B Fintech",
  },
  {
    quote:
      "The level of discretion and market knowledge they bring to partner-level searches is unmatched.",
    name: "James Morrison",
    title: "Managing Partner, Magic Circle Firm",
  },
];

function matrixHeadClass(active: boolean): string {
  const base =
    "py-4 px-2 sm:px-3 text-center align-top text-xs sm:text-sm font-bold transition-[background-color,border-color,color] duration-300 ease-out border-x w-[88px] sm:w-[100px]";
  if (active) {
    return `${base} text-accent bg-accent/[0.12] dark:bg-accent/18 border-accent/25`;
  }
  return `${base} text-text-secondary bg-gray-light/70 dark:bg-gray-light/40 border-transparent`;
}

function matrixHeadW3Class(active: boolean): string {
  const base =
    "py-4 px-3 text-center align-top text-sm font-bold transition-[background-color,border-color,color] duration-300 ease-out border-x w-[100px] sm:w-[112px]";
  if (active) {
    return `${base} text-accent bg-accent/[0.12] dark:bg-accent/18 border-accent/25`;
  }
  return `${base} text-text-secondary bg-gray-light/70 dark:bg-gray-light/40 border-transparent`;
}

function matrixBodyCellClass(active: boolean): string {
  const base =
    "py-3.5 px-2 sm:px-3 align-middle text-center transition-[background-color,border-color] duration-300 ease-out border-x";
  if (active) {
    return `${base} bg-accent/[0.1] dark:bg-accent/16 border-accent/22`;
  }
  return `${base} bg-transparent border-transparent`;
}

function matrixBodyW3Class(active: boolean): string {
  const base =
    "py-3.5 px-3 align-middle text-center transition-[background-color,border-color] duration-300 ease-out border-x";
  if (active) {
    return `${base} bg-accent/[0.1] dark:bg-accent/16 border-accent/22`;
  }
  return `${base} bg-transparent border-transparent`;
}

function CompareIcon({ value }: { value: CompareCell }) {
  if (value === "yes") {
    return (
      <span
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400"
        aria-label="Yes — typically strong"
      >
        <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300"
        aria-label="Partial — depends on setup"
      >
        <Minus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
      </span>
    );
  }
  return (
    <span
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/12 text-red-600 dark:bg-red-400/15 dark:text-red-400"
      aria-label="No — not the core strength of this model"
    >
      <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
    </span>
  );
}

const COMPARE_HEADLINE_LINE1 = "A full matrix—";
const COMPARE_HEADLINE_LINE1_WORDS = COMPARE_HEADLINE_LINE1.trim().split(/\s+/).length;

export function Comparison() {
  const introRef = useRef<HTMLDivElement>(null);
  const matrixIntroRef = useRef<HTMLDivElement>(null);
  const matrixCardRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);
  const matrixScrollRef = useRef<HTMLDivElement>(null);
  const headerRefs = useRef<(HTMLTableCellElement | null)[]>([]);
  const [autoCol, setAutoCol] = useState(0);
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const headingId = useId();
  const reduced = useHydrationSafeReducedMotion();
  const narrowViewport = useMobileLightMotion();
  const liteMotion = reduced || narrowViewport;
  const activeCol = hoverCol ?? autoCol;

  const introInView = useInView(introRef, { once: true, amount: 0.14, margin: "0px 0px -48px 0px" });
  const matrixIntroInView = useInView(matrixIntroRef, { once: true, amount: 0.14, margin: "0px 0px -40px 0px" });
  const matrixCardInView = useInView(matrixCardRef, { once: true, amount: 0.12, margin: "0px 0px -32px 0px" });
  const closingInView = useInView(closingRef, { once: true, amount: 0.15, margin: "0px 0px -40px 0px" });

  const introHeadingAnimate = useSplitWordsAnimate(introInView);
  const matrixHeadingAnimate = useSplitWordsAnimate(matrixIntroInView);
  const closingHeadingAnimate = useSplitWordsAnimate(closingInView);

  useEffect(() => {
    if (!matrixCardInView || reduced || hoverCol !== null) return;
    const id = window.setInterval(() => {
      setAutoCol((c) => (c + 1) % MATRIX_DATA_COLUMN_COUNT);
    }, MATRIX_AUTO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [matrixCardInView, reduced, hoverCol]);

  useEffect(() => {
    if (!narrowViewport) return;
    const el = headerRefs.current[activeCol];
    if (!el) return;
    el.scrollIntoView({
      behavior: liteMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeCol, narrowViewport, liteMotion]);

  useEffect(() => {
    const node = matrixScrollRef.current;
    if (!node) return;
    const onFocusOut = (e: FocusEvent): void => {
      const next = e.relatedTarget;
      if (next instanceof Node && node.contains(next)) return;
      setHoverCol(null);
    };
    node.addEventListener("focusout", onFocusOut);
    return () => node.removeEventListener("focusout", onFocusOut);
  }, []);

  return (
    <section id="compare" className="section-padding section-band-glass">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal className="mb-10 lg:mb-12">
          <div ref={introRef} className="mx-auto max-w-2xl text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <span className="glass-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-text-secondary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-40 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Outcomes hiring leaders measure
              </span>
            </div>
            <p className="text-sm font-semibold text-accent mb-2 tracking-tight">
              W3 Sourcing vs popular recruiting platforms
            </p>
            <h2 id={headingId} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-[1.12]">
              <span className="block">
                <SplitWords
                  as="span"
                  text={COMPARE_HEADLINE_LINE1}
                  className="justify-center"
                  stagger={0.038}
                  delayStart={0.05}
                  animate={introHeadingAnimate}
                />
              </span>
              <span className="block mt-1 sm:mt-0">
                <SplitWords
                  as="span"
                  text="honest checks and crosses"
                  className="text-accent justify-center"
                  stagger={0.038}
                  delayStart={0.05 + COMPARE_HEADLINE_LINE1_WORDS * 0.038}
                  gsapWordIndexStart={COMPARE_HEADLINE_LINE1_WORDS}
                  animate={introHeadingAnimate}
                />
              </span>
            </h2>
            <p className="mt-4 text-text-secondary text-lg leading-relaxed">
              Leading tools earn their green cells on scale, automation, and self-serve pricing. They cannot own taste:
              knowing who is truly exceptional versus merely qualified, how someone will land with your culture, or when
              to walk away from a false positive. W3 is built for principal-led, human judgment when the hire is senior,
              nuanced, or confidential—the work that still needs experts, not a software-only supply chain.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-10">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
            <a
              href="#compare-matrix"
              className="glass-panel glass-panel--chrome inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-primary transition-all hover:text-accent"
            >
              Jump to the matrix
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_24px_rgb(79_70_229_/_0.28)] transition-colors hover:bg-accent-hover"
            >
              Talk to us
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-12">
          <div className="grid md:grid-cols-2 gap-4">
            {pullQuotes.map((q) => (
              <blockquote key={q.name} className="glass-panel rounded-2xl p-6 sm:p-8">
                <p className="text-primary font-medium leading-relaxed">&ldquo;{q.quote}&rdquo;</p>
                <footer className="mt-4 text-sm text-text-secondary">
                  <span className="font-semibold text-primary">{q.name}</span>
                  <span className="text-muted"> · {q.title}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-8">
          <div ref={matrixIntroRef} className="text-center">
            <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase px-3 py-1.5 rounded-lg bg-accent/10 text-accent mb-4">
              Compare
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight">
              <SplitWords
                as="span"
                text="Capability matrix"
                className="justify-center"
                stagger={0.04}
                delayStart={0.04}
                animate={matrixHeadingAnimate}
              />
            </h3>
            <p className="mt-3 text-text-secondary text-base max-w-2xl mx-auto">
              Scroll horizontally on smaller screens. Hover or focus a column header to highlight it; otherwise the
              accent column cycles so each provider is easy to scan. Amber means &ldquo;partly&rdquo;—often depends on
              your team, tier, or how you use the product.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-4">
          <div
            ref={matrixCardRef}
            id="compare-matrix"
            className="glass-panel rounded-2xl overflow-hidden"
            role="region"
            aria-labelledby={headingId}
          >
            <div
              ref={matrixScrollRef}
              className="overflow-x-auto"
              onMouseLeave={() => {
                setHoverCol(null);
              }}
            >
            <table className="w-full min-w-[920px] text-left border-collapse">
              <caption className="sr-only">
                Capability comparison: features as rows, providers as columns. One column is visually emphasized at a
                time.
              </caption>
              <thead>
                <tr className="border-b border-gray-border/50">
                  <th
                    scope="col"
                    className="sticky left-0 z-30 py-4 pl-5 sm:pl-6 pr-4 text-xs font-semibold uppercase tracking-wider text-muted bg-surface/80 dark:bg-surface/75 backdrop-blur-md border-r border-gray-border/45 text-left"
                  >
                    Feature
                  </th>
                  <th
                    ref={(el) => {
                      headerRefs.current[0] = el;
                    }}
                    scope="col"
                    className={`${matrixHeadW3Class(activeCol === 0)} cursor-pointer select-none`}
                    onMouseEnter={() => {
                      setHoverCol(0);
                    }}
                    tabIndex={0}
                    onFocus={() => {
                      setHoverCol(0);
                    }}
                  >
                    <span className="block">W3</span>
                    <span
                      className={`block text-[10px] font-semibold uppercase tracking-wide mt-0.5 ${
                        activeCol === 0 ? "text-accent/80" : "text-muted"
                      }`}
                    >
                      Sourcing
                    </span>
                  </th>
                  {platformColumns.map((col, i) => {
                    const idx = i + 1;
                    const active = activeCol === idx;
                    return (
                      <th
                        ref={(el) => {
                          headerRefs.current[idx] = el;
                        }}
                        key={col.id}
                        scope="col"
                        className={`${matrixHeadClass(active)} cursor-pointer select-none`}
                        onMouseEnter={() => {
                          setHoverCol(idx);
                        }}
                        tabIndex={0}
                        onFocus={() => {
                          setHoverCol(idx);
                        }}
                      >
                        <span className="block leading-tight">{col.label}</span>
                        <span className="block text-[10px] font-medium mt-1 leading-snug text-muted">
                          {col.hint}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {matrixRows.map((row) => (
                  <tr key={row.feature} className="border-b border-gray-border/45 last:border-0">
                    <th
                      scope="row"
                      className="sticky left-0 z-20 py-3.5 pl-5 sm:pl-6 pr-4 text-sm font-medium text-primary text-left align-middle max-w-[240px] sm:max-w-[280px] bg-surface/80 dark:bg-surface/75 backdrop-blur-md border-r border-gray-border/40 shadow-[4px_0_12px_-4px_rgb(15_23_42_/_0.08)] dark:shadow-[4px_0_12px_-4px_rgb(0_0_0_/_0.4)]"
                    >
                      {row.feature}
                    </th>
                    <td
                      className={matrixBodyW3Class(activeCol === 0)}
                      onMouseEnter={() => {
                        setHoverCol(0);
                      }}
                    >
                      <CompareIcon value={row.w3} />
                    </td>
                    {row.platforms.map((cell, i) => {
                      const idx = i + 1;
                      return (
                        <td
                          key={platformColumns[i].id}
                          className={matrixBodyCellClass(activeCol === idx)}
                          onMouseEnter={() => {
                            setHoverCol(idx);
                          }}
                        >
                          <CompareIcon value={cell} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 px-5 py-4 border-t border-gray-border/45 bg-gray-light/30 dark:bg-gray-light/20 text-xs text-muted">
            <span className="inline-flex items-center gap-2">
              <CompareIcon value="yes" />
              Strong fit
            </span>
            <span className="inline-flex items-center gap-2">
              <CompareIcon value="partial" />
              Partly / varies
            </span>
            <span className="inline-flex items-center gap-2">
              <CompareIcon value="no" />
              Not the core model
            </span>
          </div>

          <p className="px-5 sm:px-8 py-4 text-xs text-muted border-t border-gray-border/45 bg-gray-light/20 dark:bg-gray-light/15 leading-relaxed">
            Illustrative only. Product names refer to common categories of tools; features and plans change. Large
            retained search firms can match many human rows too—W3 differentiates on boutique, principal-led access,
            sector focus, and explicitly human discernment for leaders (not pattern-matched profiles alone). Validate any
            vendor with your own diligence.
          </p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-12">
          <div ref={closingRef} className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
              <SplitWords
                as="span"
                text="When the hire needs a person, not just a pipeline"
                className="justify-center"
                stagger={0.036}
                delayStart={0.03}
                animate={closingHeadingAnimate}
              />
            </h3>
            <p className="mt-3 text-text-secondary leading-relaxed">
              Use platforms for volume and automation; use W3 when you need discernment AI cannot provide—judgment,
              discretion, and one accountable partner who stands behind the shortlist.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-accent text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-[0_4px_24px_rgb(79_70_229_/_0.28)] transition-colors hover:bg-accent-hover"
              >
                Get in touch
              </a>
              <a
                href="#testimonials"
                className="inline-flex text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                Read client stories →
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
