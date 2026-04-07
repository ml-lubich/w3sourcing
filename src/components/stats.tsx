"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const statStages = [
  [
    { value: 500, suffix: "+", label: "Placements delivered", color: "text-accent" },
    { value: 98, suffix: "%", label: "Client retention", color: "text-success" },
    { value: 45, suffix: "+", label: "Countries covered", color: "text-primary dark:text-white" },
    { value: 14, suffix: " days", label: "Avg. time to shortlist", color: "text-muted" },
  ],
  [
    { value: 12, suffix: "+", label: "Years in retained search", color: "text-accent" },
    { value: 48, suffix: "h", label: "First slate turnaround", color: "text-success" },
    { value: 200, suffix: "+", label: "Active hiring partnerships", color: "text-primary dark:text-white" },
    { value: 3, suffix: "", label: "Avg. finalists per role", color: "text-muted" },
  ],
];

const FLIP_MS = 5200;
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
  const [count, setCount] = useState(0);
  const [popped, setPopped] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (!sectionVisible || triggered.current) return;
    triggered.current = true;
    const duration = 2000;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCount(value);
        setPopped(true);
        setTimeout(() => setPopped(false), 400);
      }
    };

    const t = window.setTimeout(() => requestAnimationFrame(tick), delay);
    return () => window.clearTimeout(t);
  }, [sectionVisible, value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={
        sectionVisible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 20, scale: 0.98 }
      }
      transition={{
        duration: liteMotion ? SURFACE_REVEAL_DURATION_LITE : SURFACE_REVEAL_DURATION_FULL,
        ease,
        delay: delay / 1000,
      }}
      whileHover={surfaceCardWhileHover(liteMotion)}
      className="glass-panel rounded-2xl p-8 text-center [transform-style:preserve-3d]"
    >
      <div
        className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 tabular-nums ${color} ${
          popped ? "animate-pop-scale" : ""
        }`}
      >
        {count}
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
  const [stage, setStage] = useState(0);
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

  useEffect(() => {
    if (!visible || liteMotion) return;
    const id = window.setInterval(() => {
      setStage((s) => (s + 1) % statStages.length);
    }, FLIP_MS);
    return () => window.clearInterval(id);
  }, [visible, liteMotion]);

  const activeStage = liteMotion ? 0 : stage;
  const stats = statStages[activeStage];

  const flipTransition = liteMotion
    ? { duration: 0.01 }
    : { duration: SURFACE_REVEAL_DURATION_FULL, ease };

  return (
    <section id="stats" className="section-padding section-band-glass-muted overflow-hidden">
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
            Retained search for teams where every hire shapes the trajectory of the business—and where only people, not
            prompts, should decide who belongs in the room.
          </p>
        </div>

        <div className="relative min-h-[320px] sm:min-h-[280px] perspective-[1200px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeStage}
              initial={
                liteMotion
                  ? { opacity: 0, rotateX: 0, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, rotateX: 14, y: 8, filter: "blur(4px)" }
              }
              animate={{
                opacity: 1,
                rotateX: 0,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={
                liteMotion
                  ? { opacity: 0, rotateX: 0, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, rotateX: -12, y: -6, filter: "blur(6px)" }
              }
              transition={flipTransition}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 [transform-style:preserve-3d]"
            >
              {stats.map((stat, i) => (
                <AnimatedCounter
                  key={`${activeStage}-${stat.label}`}
                  value={stat.value}
                  suffix={stat.suffix}
                  color={stat.color}
                  label={stat.label}
                  delay={i * 120}
                  sectionVisible={cardsRevealed}
                  liteMotion={liteMotion}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
