"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SplitWords } from "@/components/split-words";
import { surfaceRevealEnterTransition } from "@/lib/surface-reveal-motion";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

const columns = [
  {
    title: "Technology",
    items: [
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
    ],
  },
  {
    title: "Legal",
    items: [
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
    ],
  },
  {
    title: "Finance",
    items: [
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
    ],
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

        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3 md:items-stretch md:gap-6 lg:gap-7">
          {columns.map((col, i) => (
            <motion.li
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
              <article className="glass-panel-liquid flex h-full min-h-[16.5rem] flex-col rounded-[1.65rem] p-4 sm:min-h-[17rem] sm:p-5 md:min-h-full">
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
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className={`group relative rounded-row-highlight px-3 py-2 text-xs leading-snug transition-[color,background-color,box-shadow,transform] duration-200 motion-safe:hover:scale-[1.02] sm:px-[0.8rem] sm:text-[13px] ${rowIdle} ${rowHoverLight} ${rowHoverDark}`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/45 shadow-none transition-[background-color,box-shadow] group-hover:bg-accent group-hover:shadow-[0_0_8px_color-mix(in_srgb,var(--accent)_55%,transparent)]"
                          aria-hidden
                        />
                        <span className="font-medium">{item}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
