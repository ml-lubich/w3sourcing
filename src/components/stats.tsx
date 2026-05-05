"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SplitWords } from "@/components/split-words";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import {
  SURFACE_REVEAL_DURATION_FULL,
  SURFACE_REVEAL_DURATION_LITE,
  surfaceCardWhileHover,
} from "@/lib/surface-reveal-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

const STATS_HEADLINE_PREFIX = "Outcomes hiring leaders";
const STATS_HEADLINE_PREFIX_WORD_COUNT = STATS_HEADLINE_PREFIX.trim().split(/\s+/).length;

const outcomeStats = [
  { value: 500, suffix: "+", label: "Placements delivered", color: "text-accent" },
  { value: 98, suffix: "%", label: "Client retention", color: "text-success" },
  { value: 45, suffix: "+", label: "Countries covered", color: "text-primary dark:text-white" },
  { value: 7, suffix: " days", label: "Avg. time to signal", color: "text-muted" },
];
const ease = [0.22, 1, 0.36, 1] as const;

function AnimatedCounter({
  value,
  suffix,
  color,
  label,
  delay,
  sectionVisible,
  liteMotion,
}: {
  value: number;
  suffix: string;
  color: string;
  label: string;
  delay: number;
  sectionVisible: boolean;
  liteMotion: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 1, y: liteMotion ? 0 : 20, scale: liteMotion ? 1 : 0.98 }}
      animate={
        sectionVisible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 1, y: liteMotion ? 0 : 20, scale: liteMotion ? 1 : 0.98 }
      }
      transition={{
        duration: liteMotion ? SURFACE_REVEAL_DURATION_LITE : SURFACE_REVEAL_DURATION_FULL,
        ease,
        delay: delay / 1000,
      }}
      whileHover={surfaceCardWhileHover(liteMotion)}
      className="glass-panel stats-outcome-card rounded-2xl p-8 text-center [transform-style:preserve-3d]"
    >
      <div
        className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 tabular-nums ${color}`}
      >
        {value}
        {suffix}
      </div>
      <div className="text-text-secondary text-sm font-medium">{label}</div>
    </motion.div>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [headlineRevealed, setHeadlineRevealed] = useState(false);
  const [cardsRevealed, setCardsRevealed] = useState(false);
  const reduceMotion = useHydrationSafeReducedMotion();
  const narrowViewport = useMobileLightMotion();
  const liteMotion = reduceMotion || narrowViewport;
  const headingSplit = useSplitWordsAnimate(headlineRevealed);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHeadlineRevealed(true);
          setCardsRevealed(true);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" className="section-band-glass-muted overflow-hidden py-10 md:pt-14 md:pb-8">
      <div ref={ref} className="mx-auto max-w-7xl px-6">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary dark:text-white tracking-tight leading-[1.15]">
            <span className="mx-auto inline-flex max-w-full flex-wrap items-baseline justify-center gap-x-[0.18em]">
              <SplitWords
                as="span"
                phraseWidth="fit"
                text={STATS_HEADLINE_PREFIX}
                className="justify-center"
                stagger={0.045}
                animate={headingSplit}
              />
              <span className="text-accent">
                <SplitWords
                  as="span"
                  phraseWidth="fit"
                  text="measure"
                  className="justify-center text-accent"
                  gsapWordIndexStart={STATS_HEADLINE_PREFIX_WORD_COUNT}
                  delayStart={0.42}
                  stagger={0.06}
                  animate={headingSplit}
                />
              </span>
            </span>
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Retained search for companies where one senior hire can bend the trajectory—and where people, not prompts,
            decide who belongs in the room.
          </p>
        </div>

        <div className="relative min-h-[160px] sm:min-h-[150px] perspective-[1200px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 [transform-style:preserve-3d]">
            {outcomeStats.map((stat, i) => (
              <AnimatedCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                color={stat.color}
                label={stat.label}
                delay={i * 120}
                sectionVisible={cardsRevealed}
                liteMotion={liteMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
