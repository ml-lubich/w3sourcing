"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe2, Handshake, Scale, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SplitWords } from "@/components/split-words";
import { WhyW3AnimatedArt } from "@/components/section-animated-art";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import { surfaceRevealEnterTransition } from "@/lib/surface-reveal-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

type WhyArt = "expertise" | "global" | "relationship" | "ethics";

type Pillar = {
  title: string;
  body: string;
  Icon: LucideIcon;
  art: WhyArt;
  accent: string;
};

const pillars: Pillar[] = [
  {
    title: "Deep Domain Expertise",
    body:
      "Our consultants bring sector-specific insight and market knowledge to every engagement—context, calibration, and advocacy that spreadsheets and models cannot replicate—so placements land faster and hold longer.",
    Icon: Sparkles,
    art: "expertise",
    accent: "from-violet-500/22 to-accent/18",
  },
  {
    title: "Global Reach, Local Insight",
    body:
      "With active search capabilities across the U.S., U.K., EU, UAE, and Asia, we understand region-specific talent dynamics while delivering a seamless cross-border recruitment experience.",
    Icon: Globe2,
    art: "global",
    accent: "from-accent/24 to-cyan-500/16",
  },
  {
    title: "Human-Led & Relationship-Driven",
    body:
      "We prioritise consultation and collaboration over transactional hiring. Tools can rank keywords; they do not have taste, feel, or responsibility for your reputation—our partners do, with clients and candidates alike.",
    Icon: Handshake,
    art: "relationship",
    accent: "from-cyan-500/14 to-accent/20",
  },
  {
    title: "Commitment to Ethics & Confidentiality",
    body:
      "We operate with the highest professional and ethical standards. Protecting confidential candidate and client information is core to how we work, and we uphold fair, inclusive, and non-discriminatory recruitment practices.",
    Icon: Scale,
    art: "ethics",
    accent: "from-accent/20 to-emerald-500/12",
  },
];

export function WhyW3() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useHydrationSafeReducedMotion();
  const narrowViewport = useMobileLightMotion();
  const liteMotion = reduced || narrowViewport;
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
      id="why-w3"
      className="section-padding section-glass-ambient section-band-glass"
      aria-labelledby="why-w3-heading"
    >
      <div className="section-glass-inner mx-auto max-w-7xl px-6">
        <div
          className={`max-w-2xl mx-auto text-center mb-14 md:mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2
            id="why-w3-heading"
            className="w-full text-2xl font-extrabold tracking-[-0.02em] text-primary dark:text-white sm:text-3xl md:text-[2.25rem] leading-[1.2]"
          >
            <SplitWords
              as="span"
              text="Why W3 Sourcing?"
              className="justify-center"
              stagger={0.04}
              delayStart={0.05}
              animate={headingSplit}
            />
          </h2>
        </div>

        <ul className="grid sm:grid-cols-2 gap-6 lg:gap-8 list-none p-0 m-0">
          {pillars.map((pillar, i) => (
            <motion.li
              key={pillar.title}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={
                visible
                  ? { opacity: 1, y: 0 }
                  : reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: 20 }
              }
              transition={surfaceRevealEnterTransition(liteMotion, reduced, { delay: 0.06 * i })}
            >
              <article className="glass-panel flex h-full flex-col overflow-hidden rounded-2xl">
                <div
                  className={`relative h-28 shrink-0 overflow-hidden bg-gradient-to-br ${pillar.accent} via-surface/30 dark:via-slate-900/25 to-transparent sm:h-32`}
                >
                  <WhyW3AnimatedArt
                    variant={pillar.art}
                    idSuffix={`w3-${i}`}
                    animate={visible && !reduced}
                  />
                  <div className="why-card-header-scrim pointer-events-none absolute inset-0" aria-hidden />
                  <div className="absolute bottom-3 left-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/85 text-accent-hover shadow-[0_4px_16px_rgb(15_23_42_/_0.08)] backdrop-blur-md dark:border-transparent dark:bg-white/[0.1] dark:text-accent dark:shadow-[0_6px_20px_rgb(0_0_0_/_0.35)]">
                      <pillar.Icon className="size-[1.15rem] section-card-icon-glow" strokeWidth={2} aria-hidden />
                    </span>
                  </div>
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="mb-1.5 text-base font-bold tracking-tight text-primary dark:text-white">
                    <SplitWords
                      as="span"
                      text={pillar.title}
                      stagger={0.038}
                      delayStart={0.02}
                      animate={headingSplit}
                    />
                  </h3>
                  <motion.p
                    className="text-xs leading-relaxed text-text-secondary dark:text-slate-400 sm:text-[13px]"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: liteMotion ? 0 : 10 }}
                    animate={
                      visible
                        ? { opacity: 1, y: 0 }
                        : reduced
                          ? { opacity: 0 }
                          : { opacity: 0, y: liteMotion ? 0 : 10 }
                    }
                    transition={surfaceRevealEnterTransition(liteMotion, reduced, {
                      delay: 0.14 + i * 0.06,
                    })}
                  >
                    {pillar.body}
                  </motion.p>
                </div>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
