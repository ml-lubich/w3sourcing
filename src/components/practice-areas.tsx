"use client";

import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplitWords } from "@/components/split-words";
import { PracticeAreaAnimatedArt } from "@/components/section-animated-art";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import { usePointerTilt3d } from "@/lib/use-pointer-tilt-3d";
import { surfaceRevealEnterTransition } from "@/lib/surface-reveal-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

const stageEase = [0.22, 1, 0.36, 1] as const;

const PRACTICE_INTRO_PREFIX =
  "At W3 Sourcing, we specialise in identifying, engaging, and placing top-tier talent across ";

/** Rotating closers (after prefix); parallel to hero sector frames + combined line. */
const PRACTICE_INTRO_ACCENTS = [
  "Technology leadership.",
  "Legal leadership.",
  "Banking & Finance leadership.",
  "three high-impact domains.",
] as const;

const practiceIntroRotateMs = 4200;

const areas = [
  {
    title: "VC-Backed Technology Recruitment",
    body:
      "We partner with venture-backed and high-growth tech companies to build exceptional teams—from software engineers through senior leadership—for on-site, hybrid, and remote mandates. Technical screens can narrow lists; we add the instinct for who will lead, scale culture, and endure—globally.",
    art: "tech" as const,
    accent: "from-violet-500/25 to-accent/20",
  },
  {
    title: "Legal Recruitment",
    body:
      "Serving top U.S. and U.K. law firms, we recruit outstanding legal professionals from associate through partner levels. Practitioner insight and network access meet human judgment on who can carry the book—not keyword similarity alone.",
    art: "legal" as const,
    accent: "from-slate-500/15 to-accent/22",
  },
  {
    title: "Banking & Finance Recruitment",
    body:
      "For global financial institutions and multinational corporations, we provide specialist recruitment support across investment banking, corporate finance, risk and compliance, and related disciplines. Regulated, high-stakes mandates need partners who read risk and calibre—not algorithms optimising for volume.",
    art: "finance" as const,
    accent: "from-emerald-500/12 to-accent/22",
  },
];

type PracticeAreaDef = (typeof areas)[number];

function PracticeAreaCard(props: {
  area: PracticeAreaDef;
  index: number;
  visible: boolean;
  headingSplit: boolean;
  liteMotion: boolean;
  reduced: boolean;
  artAnimate: boolean;
}) {
  const { area, index: i, visible, headingSplit, liteMotion, reduced, artAnimate } = props;
  const tiltEnabled = !liteMotion;
  const tilt = usePointerTilt3d({ enabled: tiltEnabled, maxTiltDeg: 7, liftPx: 14 });

  const tiltMotion = tiltEnabled
    ? {
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        z: tilt.translateZ,
        transformStyle: "preserve-3d" as const,
      }
    : undefined;

  return (
    <motion.li
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={
        visible
          ? { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 24 }
      }
      transition={surfaceRevealEnterTransition(liteMotion, reduced, { delay: 0.08 * i })}
    >
      <div className="h-full [perspective:1100px]">
        <motion.div
          className="h-full will-change-transform"
          style={tiltMotion}
          {...(tiltEnabled ? tilt.pointerHandlers : {})}
        >
          <article className="glass-panel flex h-full flex-col overflow-hidden rounded-2xl shadow-[0_20px_48px_rgb(15_23_42_/_0.05)] dark:shadow-[0_24px_60px_rgb(0_0_0_/_0.3)] transition-[box-shadow,transform] duration-300 ease-out hover:shadow-[0_28px_56px_rgb(15_23_42_/_0.09)] dark:hover:shadow-[0_32px_72px_rgb(0_0_0_/_0.38)]">
            <div
              className={`relative h-32 shrink-0 overflow-hidden bg-gradient-to-br ${area.accent} via-surface/30 dark:via-slate-900/25 to-transparent sm:h-36`}
            >
              <PracticeAreaAnimatedArt variant={area.art} idSuffix={`pa-${i}`} animate={artAnimate} />
              <div className="pa-card-header-scrim pointer-events-none absolute inset-0" aria-hidden />
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="mb-2.5 text-base font-bold tracking-tight text-primary dark:text-white">
                <SplitWords
                  as="span"
                  text={area.title}
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
                  delay: 0.12 + i * 0.06,
                })}
              >
                {area.body}
              </motion.p>
            </div>
          </article>
        </motion.div>
      </div>
    </motion.li>
  );
}

export function PracticeAreas() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [introIndex, setIntroIndex] = useState(0);
  const reduced = useHydrationSafeReducedMotion();
  const narrowViewport = useMobileLightMotion();
  const liteMotion = reduced || narrowViewport;
  const headingSplit = useSplitWordsAnimate(visible);
  const practiceArtAnimate = visible && !reduced;

  const accentPhrase = PRACTICE_INTRO_ACCENTS[introIndex];
  const practiceIntroSr = `${PRACTICE_INTRO_PREFIX}${accentPhrase}`;
  const practiceIntroPrefixWordCount = PRACTICE_INTRO_PREFIX.trim().split(/\s+/).length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setIntroIndex((i) => (i + 1) % PRACTICE_INTRO_ACCENTS.length);
    }, practiceIntroRotateMs);
    return () => window.clearInterval(id);
  }, [visible]);

  return (
    <section
      ref={ref}
      id="practice-areas"
      className="section-padding section-glass-ambient section-band-glass-muted"
      aria-labelledby="practice-areas-heading"
    >
      <div className="section-glass-inner mx-auto max-w-7xl px-6">
        <div
          className={`max-w-3xl mx-auto text-center mb-14 md:mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.14em] text-muted mb-3 flex justify-center"
            aria-label="What we do"
          >
            <SplitWords
              as="span"
              text="What we do"
              className="justify-center"
              stagger={0.042}
              delayStart={0}
              animate={headingSplit}
              splitTextDecorative
            />
          </p>
          <h2
            id="practice-areas-heading"
            className="text-2xl font-extrabold tracking-tight text-primary dark:text-white sm:text-3xl md:text-[2.25rem] leading-[1.2]"
          >
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              {practiceIntroSr}
            </span>
            <span aria-hidden className="block w-full max-w-full text-left sm:text-center">
              <SplitWords
                as="span"
                phraseWidth="flow"
                splitTextDecorative
                text={PRACTICE_INTRO_PREFIX.trim()}
                className="justify-start sm:justify-center"
                stagger={0.038}
                delayStart={0.04}
                animate={headingSplit}
              />{" "}
              <span className="inline-block min-h-[1.35em] align-top text-left sm:text-center">
                <AnimatePresence initial={false} mode="wait">
                  <motion.span
                    key={introIndex}
                    className="inline-block text-accent"
                    initial={liteMotion ? undefined : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={liteMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{
                      duration: liteMotion ? 0 : 0.36,
                      ease: [...stageEase],
                    }}
                  >
                    <SplitWords
                      as="span"
                      phraseWidth="fit"
                      splitTextDecorative
                      text={accentPhrase}
                      className="justify-start sm:justify-center text-accent"
                      gsapWordIndexStart={practiceIntroPrefixWordCount}
                      stagger={0.036}
                      delayStart={0.08}
                      animate={headingSplit}
                    />
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </h2>
        </div>

        <ul className="grid md:grid-cols-3 gap-6 lg:gap-8 list-none p-0 m-0">
          {areas.map((area, i) => (
            <PracticeAreaCard
              key={area.title}
              area={area}
              index={i}
              visible={visible}
              headingSplit={headingSplit}
              liteMotion={liteMotion}
              reduced={reduced}
              artAnimate={practiceArtAnimate}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
