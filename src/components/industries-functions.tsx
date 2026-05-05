"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SplitWords } from "@/components/split-words";
import { surfaceRevealEnterTransition } from "@/lib/surface-reveal-motion";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

type FunctionItem = Readonly<{
  label: string;
  detail: string;
}>;

type IndustryColumn = Readonly<{
  title: string;
  items: ReadonlyArray<FunctionItem>;
}>;

const itemDetails: Record<string, string> = {
  Product: "Product leaders spanning discovery, roadmap strategy, and execution for growth and platform programs.",
  "Software engineers": "Individual contributors and engineering leads across backend, frontend, mobile, and distributed systems.",
  "Design & UX": "Design, UX research, and content design talent focused on measurable customer outcomes.",
  Data: "Data engineering, analytics, and data science specialists for insight, modeling, and decision support.",
  "AI/ML": "Applied AI and machine learning practitioners from model delivery to production-grade MLOps.",
  DevOps: "DevOps talent improving release velocity, deployment reliability, and infrastructure automation.",
  "Platform / SRE": "Platform engineering and SRE leaders focused on reliability, scalability, and developer productivity.",
  Security: "Security experts across product security, cloud security, governance, and incident response.",
  "Solutions Architecture": "Solutions architects who bridge enterprise client needs with scalable technical design.",
  "QA & SDET": "Quality engineers and SDETs building robust automation, coverage strategy, and release confidence.",
  "Technical Program Management": "TPM leaders coordinating cross-functional delivery across engineering and business teams.",
  "GTM Leadership": "Go-to-market leaders across revenue, operations, and commercial strategy for scaling organizations.",
  CTO: "CTOs and senior technical executives who define architecture, engineering culture, and innovation strategy.",
  Associates: "High-performing associates across transactional, advisory, and specialist legal disciplines.",
  "Senior Associates": "Senior associates ready to lead mandates, mentor teams, and deepen client relationships.",
  Counsel: "Counsel-level lawyers bringing domain depth, risk judgment, and partner-facing capability.",
  "Of Counsel": "Of Counsel appointments for niche expertise and strategic legal coverage across practice groups.",
  Partners: "Partner-level talent with proven client books, market credibility, and leadership capacity.",
  "Practice Group Leaders": "Practice leaders who drive team performance, standards, and long-term growth strategy.",
  "General Counsel": "General Counsel and deputy GC leaders covering enterprise legal strategy and governance.",
  "Corporate & M&A": "Corporate and M&A specialists across deal execution, due diligence, structuring, and negotiation.",
  Litigation: "Litigation talent covering dispute strategy, case management, and courtroom-ready execution.",
  "Regulatory & Compliance": "Regulatory and compliance experts for policy controls, supervision, and risk mitigation.",
  "IP & Technology Transactions": "IP and technology transactions lawyers handling licensing, data, and commercial agreements.",
  "Paralegals & Specialists": "Paralegals and legal operations specialists providing critical drafting and case support.",
  "Private Banking": "Private banking leaders delivering high-touch advisory and complex client relationship management.",
  "Investment Banking": "Investment banking professionals across advisory, origination, and capital formation.",
  "Markets & Trading": "Markets and trading talent in sales, execution, structuring, and risk-aware decision making.",
  "Asset Management": "Asset management leaders across portfolio strategy, product, and institutional investor coverage.",
  "Wealth Management": "Wealth management specialists serving HNW/UHNW clients with long-horizon advisory models.",
  "Risk & Compliance": "Risk and compliance talent across governance frameworks, controls testing, and regulatory assurance.",
  "Client Advisory": "Client advisory professionals blending financial expertise with relationship-led growth.",
  "Corporate Development": "Corporate development leaders for strategic planning, deal pipeline, and integration support.",
  "Treasury & FP&A": "Treasury and FP&A talent driving liquidity planning, forecasting, and performance management.",
  "M&A": "M&A specialists spanning origination, transaction execution, and post-deal value realization.",
  VC: "Venture capital talent across investment, portfolio support, and platform leadership functions.",
  PE: "Private equity professionals across investing, operations, and portfolio transformation initiatives.",
};

const toFunctionItems = (labels: ReadonlyArray<string>): ReadonlyArray<FunctionItem> =>
  labels.map((label) => ({
    label,
    detail:
      itemDetails[label] ??
      "This function is covered by our retained search process with calibration against role scope, market context, and team fit.",
  }));

const columns: ReadonlyArray<IndustryColumn> = [
  {
    title: "Technology",
    items: toFunctionItems([
      "Product",
      "Software engineers",
      "Design & UX",
      "Data",
      "AI/ML",
      "DevOps",
      "Platform / SRE",
      "Security",
      "Solutions Architecture",
      "QA & SDET",
      "Technical Program Management",
      "GTM Leadership",
      "CTO",
    ]),
  },
  {
    title: "Legal",
    items: toFunctionItems([
      "Associates",
      "Senior Associates",
      "Counsel",
      "Of Counsel",
      "Partners",
      "Practice Group Leaders",
      "General Counsel",
      "Corporate & M&A",
      "Litigation",
      "Regulatory & Compliance",
      "IP & Technology Transactions",
      "Paralegals & Specialists",
    ]),
  },
  {
    title: "Finance",
    items: toFunctionItems([
      "Private Banking",
      "Investment Banking",
      "Markets & Trading",
      "Asset Management",
      "Wealth Management",
      "Risk & Compliance",
      "Client Advisory",
      "Corporate Development",
      "Treasury & FP&A",
      "M&A",
      "VC",
      "PE",
    ]),
  },
];

const rowIdle =
  "text-text-secondary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.52)] bg-white/[0.34] dark:bg-white/[0.05] dark:text-slate-400 dark:shadow-[inset_0_1px_0_0_color-mix(in_srgb,white_9%,transparent)]";

const rowHoverLight =
  "hover:bg-gradient-to-br hover:from-accent/[0.14] hover:to-accent/[0.06] hover:text-primary hover:shadow-[inset_0_1px_0_0_color-mix(in_srgb,white_52%,transparent),0_0_0_1px_color-mix(in_srgb,var(--accent)_22%,transparent),0_14px_38px_-14px_color-mix(in_srgb,var(--accent)_38%,transparent)]";

const rowHoverDark =
  "dark:hover:from-accent/24 dark:hover:to-accent/[0.08] dark:hover:text-white dark:hover:shadow-[inset_0_1px_0_0_color-mix(in_srgb,white_14%,transparent),0_0_0_1px_color-mix(in_srgb,var(--accent)_28%,transparent),0_16px_44px_-16px_color-mix(in_srgb,var(--accent)_36%,transparent)]";

export function IndustriesFunctions() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [expandedItemKey, setExpandedItemKey] = useState<string | null>(null);
  const narrowViewport = useMobileLightMotion();
  const reduced = useHydrationSafeReducedMotion();
  const liteMotion = narrowViewport;
  const headingSplit = useSplitWordsAnimate(visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="industries"
      className="section-padding section-glass-ambient section-industries-ambient section-band-glass-muted"
      aria-labelledby="industries-heading"
    >
      <div className="section-glass-inner mx-auto max-w-7xl px-6">
        <div
          className={`max-w-3xl mx-auto text-center mb-14 md:mb-16 transition-all ease-out ${
            liteMotion ? "duration-300" : "duration-700"
          } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2
            id="industries-heading"
            className="text-2xl font-extrabold tracking-tight text-primary dark:text-white sm:text-3xl md:text-[2.25rem] leading-[1.2]"
          >
            <SplitWords
              as="span"
              text="Industries & Functions"
              className="justify-center"
              stagger={0.04}
              delayStart={0.05}
              animate={headingSplit}
            />
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary dark:text-slate-400 sm:text-[0.9375rem]">
            We recruit on-site, hybrid, and remote roles across sectors and functions—lists help; shortlists still need
            expert judgment—including but not limited to:
          </p>
        </div>

        <div className="m-0 grid grid-cols-1 gap-5 p-0 md:grid-cols-3 md:items-stretch md:gap-6 lg:gap-7">
          {columns.map((col, i) => (
            <motion.article
              key={col.title}
              className="min-h-0"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: liteMotion ? 8 : 20 }}
              animate={
                visible
                  ? { opacity: 1, y: 0 }
                  : reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: liteMotion ? 8 : 20 }
              }
              transition={surfaceRevealEnterTransition(liteMotion, reduced, {
                delay: visible ? 0.06 * i : 0,
              })}
            >
              <div className="glass-panel-liquid flex h-full min-h-[16.5rem] flex-col rounded-[1.65rem] p-4 sm:min-h-[17rem] sm:p-5 md:min-h-full">
                <h3 className="relative mb-3.5 shrink-0 pb-3 text-base font-bold tracking-tight text-primary after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-gradient-to-r after:from-transparent after:via-gray-border/35 after:to-transparent after:content-[''] dark:text-white dark:after:via-white/14">
                  <SplitWords
                    as="span"
                    text={col.title}
                    stagger={0.038}
                    delayStart={0.02}
                    animate={headingSplit}
                  />
                </h3>
                <ul className="m-0 flex flex-1 list-none flex-col justify-between gap-1.5 p-0 sm:gap-2">
                  {col.items.map((item) => {
                    const itemKey = `${col.title}:${item.label}`;
                    const expanded = expandedItemKey === itemKey;
                    const detailId = `industries-detail-${col.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${item.label
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}`;

                    return (
                    <li
                      key={item.label}
                      className={`group relative overflow-hidden rounded-row-highlight text-xs leading-snug transition-[color,background-color,box-shadow,transform] duration-200 motion-safe:hover:scale-[1.02] sm:text-[13px] ${rowIdle} ${rowHoverLight} ${rowHoverDark}`}
                    >
                      <button
                        type="button"
                        className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 px-3 py-3 text-left sm:min-h-12 sm:px-[0.8rem]"
                        onClick={() => setExpandedItemKey(expanded ? null : itemKey)}
                        aria-controls={detailId}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/45 shadow-none transition-[background-color,box-shadow] group-hover:bg-accent group-hover:shadow-[0_0_8px_color-mix(in_srgb,var(--accent)_55%,transparent)]"
                            aria-hidden
                          />
                          <span className="font-medium leading-snug">{item.label}</span>
                        </span>
                        <span
                          className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-secondary/80 dark:text-slate-400"
                          aria-hidden
                        >
                          {expanded ? "Hide" : "Details"}
                        </span>
                      </button>
                      {expanded ? (
                        <p
                          id={detailId}
                          className="mx-3 mb-3 border-t border-gray-border/35 pt-2 text-[11.5px] leading-relaxed text-text-secondary dark:border-white/10 dark:text-slate-300 sm:mx-[0.8rem] sm:text-[12px]"
                        >
                          {item.detail}
                        </p>
                      ) : null}
                    </li>
                    );
                  })}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
