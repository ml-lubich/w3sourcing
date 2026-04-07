"use client";

import Image from "next/image";
import { useRef, useEffect, useState, useMemo } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useSpring,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { SplitWords } from "@/components/split-words";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

type PipelineStage = "Screen" | "Interview" | "Shortlist";

const stageEase = [0.22, 1, 0.36, 1] as const;
const stageFlipDuration = 0.42;
/** Candidate row accent fill + stripe: opacity crossfade when focus advances (shorter under lite-motion). */
const rowHighlightFade = { full: 0.32, lite: 0.14 } as const;

type MockRow = {
  label: string;
  fit: number;
  restingStage: PipelineStage;
  /** Omit when there is no candidate photo; a generic silhouette is shown. */
  avatarSrc?: string;
  avatarAlt: string;
};

const GENERIC_AVATAR_SRC = "/images/avatar-placeholder.svg";

type MockSearch = {
  title: string;
  subtitle: string;
  rows: MockRow[];
};

/** Local demo headshots (vendored 96×96 crops; Unsplash IDs previously used for some rows returned 404 via imgix). */
const DEMO_AVATAR = (file: string) => `/images/demo-avatars/${file}`;

/** Hero accent lines: cycle sector-specific appeals, then the combined positioning line. */
const HERO_ACCENT_FRAMES = [
  { line1: "for Technology", line2: "leaders" },
  { line1: "for Legal", line2: "leaders" },
  { line1: "for Finance", line2: "leaders" },
  { line1: "for Tech, Legal & Finance", line2: "leaders" },
] as const;

const accentRotateMs = 4200;

/** Demo searches: title/subtitle and shortlist rotate together after each full row cycle. */
const MOCK_SEARCHES: MockSearch[] = [
  {
    title: "VP Engineering — EMEA",
    subtitle: "Technology leadership · Confidential search",
    rows: [
      {
        label: "A. Chen",
        fit: 93,
        restingStage: "Shortlist",
        avatarSrc: DEMO_AVATAR("a-chen.jpg"),
        avatarAlt: "Demo portrait, East Asian-presenting professional",
      },
      {
        label: "M. Okonkwo",
        fit: 94,
        restingStage: "Screen",
        avatarSrc: DEMO_AVATAR("m-okonkwo.jpg"),
        avatarAlt: "Demo portrait, Black-presenting professional",
      },
      {
        label: "J. Patel",
        fit: 95,
        restingStage: "Interview",
        avatarSrc: DEMO_AVATAR("j-patel.jpg"),
        avatarAlt: "Demo portrait, South Asian-presenting professional",
      },
      {
        label: "S. Lindqvist",
        fit: 96,
        restingStage: "Screen",
        avatarSrc: DEMO_AVATAR("s-lindqvist.jpg"),
        avatarAlt: "Demo portrait, woman-presenting professional",
      },
      {
        label: "R. Okada",
        fit: 91,
        restingStage: "Interview",
        avatarSrc: DEMO_AVATAR("r-okada.jpg"),
        avatarAlt: "Demo portrait, East Asian-presenting professional",
      },
    ],
  },
  {
    title: "General Counsel — FinTech",
    subtitle: "Legal leadership · Regulated markets",
    rows: [
      {
        label: "K. Osei",
        fit: 92,
        restingStage: "Interview",
        avatarSrc: DEMO_AVATAR("k-osei.jpg"),
        avatarAlt: "Demo portrait, Black-presenting professional",
      },
      {
        label: "L. Fontaine",
        fit: 95,
        restingStage: "Screen",
        avatarSrc: DEMO_AVATAR("l-fontaine.jpg"),
        avatarAlt: "Demo portrait, European-presenting professional",
      },
      {
        label: "H. Nakamura",
        fit: 90,
        restingStage: "Shortlist",
        avatarSrc: DEMO_AVATAR("h-nakamura.jpg"),
        avatarAlt: "Demo portrait, East Asian-presenting professional",
      },
      {
        label: "T. Brennan",
        fit: 94,
        restingStage: "Screen",
        avatarSrc: DEMO_AVATAR("t-brennan.jpg"),
        avatarAlt: "Demo portrait, man-presenting professional",
      },
    ],
  },
  {
    title: "Managing Director — M&A",
    subtitle: "Investment banking · London coverage",
    rows: [
      {
        label: "E. Vasquez",
        fit: 91,
        restingStage: "Screen",
        avatarSrc: DEMO_AVATAR("e-vasquez.jpg"),
        avatarAlt: "Demo portrait, Latine-presenting professional",
      },
      {
        label: "N. Haddad",
        fit: 96,
        restingStage: "Interview",
        avatarSrc: DEMO_AVATAR("n-haddad.jpg"),
        avatarAlt: "Demo portrait, MENA-presenting professional",
      },
      {
        label: "P. Sørensen",
        fit: 93,
        restingStage: "Shortlist",
        avatarSrc: DEMO_AVATAR("p-sorensen.jpg"),
        avatarAlt: "Demo portrait, Nordic-presenting professional",
      },
      {
        label: "I. Mensah",
        fit: 94,
        restingStage: "Interview",
        avatarSrc: DEMO_AVATAR("i-mensah.jpg"),
        avatarAlt: "Demo portrait, woman-presenting professional",
      },
      {
        label: "Y. Park",
        fit: 89,
        restingStage: "Screen",
        avatarSrc: DEMO_AVATAR("y-park.jpg"),
        avatarAlt: "Demo portrait, East Asian-presenting woman",
      },
    ],
  },
];

function stageTone(stage: string): string {
  if (stage === "Shortlist") return "text-success";
  if (stage === "Interview") return "text-accent";
  return "text-primary dark:text-slate-200";
}

function CandidateAvatarThumb({
  avatarSrc,
  avatarAlt,
  isActive,
}: {
  avatarSrc?: string;
  avatarAlt: string;
  isActive: boolean;
}) {
  const [loadFailed, setLoadFailed] = useState(false);
  const missingOrEmpty = avatarSrc === undefined || avatarSrc === "";
  const usingPlaceholder = loadFailed || missingOrEmpty;
  const resolvedSrc = usingPlaceholder ? GENERIC_AVATAR_SRC : avatarSrc;

  return (
    <div
      className={`relative w-7 h-7 shrink-0 overflow-hidden rounded-full ring-2 ring-white/50 dark:ring-white/10 transition-[box-shadow,ring-color] duration-300 ease-out ${
        isActive ? "ring-accent/50 dark:ring-accent/45 shadow-sm" : ""
      }`}
    >
      <Image
        src={resolvedSrc}
        alt=""
        width={28}
        height={28}
        className="h-full w-full object-cover"
        sizes="28px"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        unoptimized={resolvedSrc.endsWith(".svg")}
        onError={() => {
          if (!missingOrEmpty) setLoadFailed(true);
        }}
      />
      <span className="sr-only">
        {usingPlaceholder
          ? `${avatarAlt}. Generic silhouette placeholder (no photo).`
          : avatarAlt}
      </span>
    </div>
  );
}

function FitBar({
  pct,
  enabled,
  rowDelay,
  instant,
}: {
  pct: number;
  enabled: boolean;
  rowDelay: number;
  instant: boolean;
}) {
  const w = enabled ? `${pct}%` : "0%";
  return (
    <div className="hidden sm:block w-20 h-1.5 rounded-full bg-gray-border dark:bg-white/10 overflow-hidden">
      {instant ? (
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-indigo-400"
          style={{ width: w }}
        />
      ) : (
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-indigo-400"
          initial={{ width: "0%" }}
          animate={{ width: w }}
          transition={{ duration: 0.9, delay: rowDelay + 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </div>
  );
}

export function Hero() {
  const [visible, setVisible] = useState(false);
  const [accentIndex, setAccentIndex] = useState(0);
  const [searchIndex, setSearchIndex] = useState(0);
  const [activeRow, setActiveRow] = useState(0);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useHydrationSafeReducedMotion();
  const narrowViewport = useMobileLightMotion();
  const liteMotion = (reduceMotion ?? false) || narrowViewport;
  const splitWordsOn = useSplitWordsAnimate(true);
  /** Re-evaluate while scrolling: `once` would keep timers running off-screen; row `scrollIntoView` then pulls the window back toward the hero. */
  const dashboardInView = useInView(dashboardRef, { amount: 0.22 });

  const rowAdvanceMs = useMemo(() => (narrowViewport ? 4000 : 3200), [narrowViewport]);

  const accentFrame = HERO_ACCENT_FRAMES[accentIndex];
  const heroSrHeadline = `Global recruitment excellence ${accentFrame.line1} ${accentFrame.line2}`;

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setAccentIndex((i) => (i + 1) % HERO_ACCENT_FRAMES.length);
    }, accentRotateMs);
    return () => window.clearInterval(id);
  }, []);

  const currentSearch = MOCK_SEARCHES[searchIndex];
  const mockRows = currentSearch.rows;

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!dashboardInView) return;
    const len = MOCK_SEARCHES[searchIndex].rows.length;
    const searchCount = MOCK_SEARCHES.length;
    const id = window.setInterval(() => {
      setActiveRow((r) => {
        const lastIdx = len - 1;
        if (lastIdx >= 0 && r === lastIdx) {
          queueMicrotask(() => {
            setSearchIndex((i) => (i + 1) % searchCount);
          });
        }
        return (r + 1) % len;
      });
    }, rowAdvanceMs);
    return () => window.clearInterval(id);
  }, [dashboardInView, searchIndex, rowAdvanceMs]);

  const ctaListVariants = useMemo(
    () =>
      ({
        hidden: {},
        visible: {
          transition: {
            delayChildren: liteMotion ? 0 : 0.92,
            staggerChildren: liteMotion ? 0 : 0.09,
          },
        },
      }) as const,
    [liteMotion],
  );

  const ctaItemVariants = useMemo(
    () =>
      ({
        hidden: liteMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: liteMotion
            ? { duration: 0.15 }
            : { duration: 0.5, ease: stageEase },
        },
      }) as const,
    [liteMotion],
  );

  useEffect(() => {
    if (!dashboardInView) return;
    const root = listRef.current;
    if (!root) return;
    const row = root.querySelector<HTMLElement>(`[data-candidate-row="${activeRow}"]`);
    if (!row) return;
    const behavior: ScrollBehavior = liteMotion ? "auto" : "smooth";
    const pad = 4;
    const rootRect = root.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const delta =
      rowRect.top < rootRect.top
        ? rowRect.top - rootRect.top - pad
        : rowRect.bottom > rootRect.bottom
          ? rowRect.bottom - rootRect.bottom + pad
          : 0;
    if (delta !== 0) {
      root.scrollTo({ top: root.scrollTop + delta, behavior });
    }
  }, [activeRow, dashboardInView, searchIndex, liteMotion]);

  return (
    <section
      id="hero"
      className="relative hero-wash pt-28 pb-16 md:pt-36 md:pb-28 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {liteMotion ? (
          <>
            <div
              className={`hero-orb absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/[0.12] dark:bg-accent/20 blur-[100px] transition-opacity duration-200 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`hero-orb absolute top-40 -right-24 h-64 w-64 rounded-full bg-cyan-400/15 dark:bg-cyan-400/10 blur-[80px] transition-opacity duration-200 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`hero-orb absolute bottom-20 -left-16 h-56 w-56 rounded-full bg-violet-500/10 dark:bg-violet-400/15 blur-[72px] transition-opacity duration-200 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <>
            <motion.div
              className="hero-orb absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/[0.12] dark:bg-accent/20 blur-[100px]"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={visible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="hero-orb absolute top-40 -right-24 h-64 w-64 rounded-full bg-cyan-400/15 dark:bg-cyan-400/10 blur-[80px]"
              initial={{ opacity: 0, x: 40 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="hero-orb absolute bottom-20 -left-16 h-56 w-56 rounded-full bg-violet-500/10 dark:bg-violet-400/15 blur-[72px]"
              initial={{ opacity: 0, x: -40 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </>
        )}
        <div className="absolute inset-0 hero-surface-grid opacity-[0.55] dark:opacity-[0.45]" aria-hidden />
        <div className="absolute inset-0 hero-dot-noise" aria-hidden />
      </div>

      <div
        className={`relative z-10 mx-auto max-w-6xl px-6 text-center transition-transform duration-700 ease-out will-change-transform ${
          visible ? "translate-y-0" : "translate-y-6"
        }`}
      >
        <motion.div
          className="glass-panel glass-panel--chrome inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full shadow-sm"
          initial={liteMotion ? false : { opacity: 0, y: 16 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={
            liteMotion
              ? { duration: 0.15 }
              : { duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <span className="relative flex h-2 w-2">
            {!liteMotion ? (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-60" />
            ) : null}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success shadow-[0_0_10px_rgb(5_150_105_/_0.55)]" />
          </span>
          <span className="text-text-secondary dark:text-slate-300 text-sm font-medium tracking-wide">
            US · UK · EU · UAE · Asia · London · Singapore
          </span>
        </motion.div>

        <h1
          id="hero-heading"
          className="text-center text-[2.35rem] sm:text-5xl md:text-6xl lg:text-[3.85rem] font-extrabold text-primary dark:text-white leading-[1.26] sm:leading-[1.24] md:leading-[1.22] tracking-[-0.02em] mb-6 max-w-4xl mx-auto"
        >
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {heroSrHeadline}
          </span>
          <span className="block leading-[inherit]" aria-hidden>
            <SplitWords
              as="span"
              splitTextDecorative
              text="Global recruitment excellence"
              className="justify-center"
              stagger={0.048}
              delayStart={0.05}
              animate={splitWordsOn}
            />
          </span>
          <span
            className="block mt-3 sm:mt-4 text-accent leading-[1.32] sm:leading-[1.28] min-h-[2.6rem] sm:min-h-[2.35rem]"
            aria-hidden
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={accentIndex}
                className="block"
                initial={liteMotion ? undefined : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={liteMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{
                  duration: liteMotion ? 0 : 0.38,
                  ease: [...stageEase],
                }}
              >
                <span className="block">
                  <SplitWords
                    as="span"
                    splitTextDecorative
                    text={accentFrame.line1}
                    className="justify-center text-accent"
                    delayStart={0.08}
                    stagger={0.04}
                    animate={splitWordsOn}
                  />
                </span>
                <span className="block mt-2 sm:mt-2.5">
                  <SplitWords
                    as="span"
                    splitTextDecorative
                    text={accentFrame.line2}
                    className="justify-center text-accent"
                    gsapWordIndexStart={accentFrame.line1.split(/\s+/).length}
                    delayStart={0.08 + accentFrame.line1.split(/\s+/).length * 0.04}
                    stagger={0.04}
                    animate={splitWordsOn}
                  />
                </span>
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        <motion.p
          className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary dark:text-slate-400 leading-relaxed mb-10 font-medium"
          initial={liteMotion ? false : { opacity: 0, y: 14 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={
            liteMotion
              ? { duration: 0.15 }
              : { duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }
          }
        >
          Automation can surface names; it does not carry what outstanding leadership hires need—
          taste, instinct, and accountability. W3 Sourcing brings expert, human-led judgment to the work
          that cannot be automated, connecting exceptional talent with world-class organisations across
          the US, UK, EU, UAE, and Asia.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16 md:mb-20"
          variants={ctaListVariants}
          initial="hidden"
          animate={visible ? "visible" : "hidden"}
        >
          <motion.a
            href="#contact"
            variants={ctaItemVariants}
            className="w-full sm:w-auto bg-accent text-white font-semibold text-base py-3.5 px-8 rounded-xl shadow-[0_4px_24px_rgb(79_70_229_/_0.35)] dark:shadow-[0_4px_32px_rgb(99_102_241_/_0.35)] transition-all duration-200 hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.99] inline-flex items-center justify-center gap-2"
          >
            Get in touch
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
          <motion.a
            href="#practice-areas"
            variants={ctaItemVariants}
            className="glass-panel glass-panel--chrome w-full sm:w-auto text-primary dark:text-white font-semibold text-base py-3.5 px-8 rounded-xl transition-all duration-200 hover:text-accent hover:shadow-[0_12px_44px_rgb(15_23_42_/_0.1)] dark:hover:text-accent dark:hover:shadow-[0_16px_48px_rgb(0_0_0_/_0.45)]"
          >
            Explore our practice
          </motion.a>
        </motion.div>

        <motion.div
          ref={dashboardRef}
          className="mx-auto max-w-4xl perspective-[1200px]"
          initial={
            liteMotion
              ? false
              : { opacity: 0, y: 32, rotateX: 8 }
          }
          animate={dashboardInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={
            liteMotion
              ? { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
          }
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="hero-card-shimmer glass-panel glass-panel-strong relative rounded-2xl shadow-[0_28px_80px_rgb(15_23_42_/_0.08)] dark:shadow-[0_28px_90px_rgb(0_0_0_/_0.42)] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px z-10 bg-gradient-to-r from-transparent via-accent/35 to-transparent" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] via-transparent to-cyan-500/[0.04] pointer-events-none"
              initial={{ opacity: 0 }}
              animate={dashboardInView ? { opacity: 1 } : {}}
              transition={{ duration: liteMotion ? 0.2 : 1.2 }}
            />

            <div className="p-5 sm:p-8 flex flex-col relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400/90" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400/90" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400/90" />
                </div>
                <motion.div
                  className="flex-1 mx-3 h-8 sm:h-9 rounded-lg bg-gray-light dark:bg-white/[0.06] shadow-[0_2px_10px_rgb(15_23_42_/_0.06)] dark:shadow-[0_2px_14px_rgb(0_0_0_/_0.32)] flex items-center px-3 overflow-hidden min-w-0"
                  initial={{ opacity: 0.5 }}
                  animate={dashboardInView ? { opacity: 1 } : {}}
                >
                  <span className="flex min-w-0 items-center gap-2 truncate">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    <span className="flex min-w-0 flex-wrap items-baseline gap-x-[0.2em] text-left">
                      {dashboardInView ? (
                        <>
                          <SplitWords
                            as="span"
                            variant="chrome"
                            text="Search workspace"
                            stagger={0.034}
                            delayStart={0.06}
                            className="text-xs font-medium text-muted dark:text-slate-400"
                            animate={splitWordsOn}
                          />
                          {liteMotion ? (
                            <span className="text-xs font-medium text-muted/75 dark:text-slate-500">·</span>
                          ) : (
                            <motion.span
                              className="text-xs font-medium text-muted/75 dark:text-slate-500"
                              initial={{ opacity: 0, y: 5, scale: 0.92 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 440,
                                damping: 28,
                                delay: 0.2,
                              }}
                            >
                              ·
                            </motion.span>
                          )}
                          <SplitWords
                            as="span"
                            variant="chrome"
                            text="Pipeline view"
                            stagger={0.034}
                            delayStart={0.12}
                            className="text-xs font-semibold text-primary dark:text-white"
                            animate={splitWordsOn}
                          />
                        </>
                      ) : (
                        <span className="text-xs font-medium text-muted dark:text-slate-400 truncate">
                          Search workspace · Pipeline view
                        </span>
                      )}
                    </span>
                  </span>
                </motion.div>
              </div>

              <motion.div
                key={searchIndex}
                className="mb-4 rounded-xl bg-gray-light/40 dark:bg-white/[0.03] px-4 py-3 text-left shadow-[0_4px_16px_rgb(15_23_42_/_0.05)] dark:shadow-[0_6px_20px_rgb(0_0_0_/_0.25)]"
                initial={liteMotion ? false : { opacity: 0, y: 10 }}
                animate={dashboardInView ? { opacity: 1, y: 0 } : {}}
                transition={
                  liteMotion ? { duration: 0.15 } : { delay: 0.12, duration: 0.45 }
                }
              >
                <p className="text-xs font-semibold text-primary dark:text-white">{currentSearch.title}</p>
                <p className="text-[10px] sm:text-xs text-muted dark:text-slate-500 mt-0.5">
                  {currentSearch.subtitle}
                </p>
              </motion.div>

              <motion.div
                className="rounded-xl bg-gray-light/50 dark:bg-white/[0.03] p-3 sm:p-4 flex flex-col min-h-0 shadow-[0_6px_22px_rgb(15_23_42_/_0.06)] dark:shadow-[0_8px_28px_rgb(0_0_0_/_0.3)]"
                initial={liteMotion ? false : { opacity: 0, y: 12 }}
                animate={dashboardInView ? { opacity: 1, y: 0 } : {}}
                transition={
                  liteMotion ? { duration: 0.15 } : { delay: 0.35, duration: 0.5 }
                }
              >
                <div className="flex gap-3 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted dark:text-slate-500 pb-2 shrink-0 shadow-[0_10px_12px_-12px_rgb(15_23_42_/_0.12)] dark:shadow-[0_12px_14px_-14px_rgb(0_0_0_/_0.5)]">
                  <span className="flex-1 text-left">Candidate</span>
                  <span className="w-20 text-right hidden sm:block">Fit</span>
                  <span className="w-[6.25rem] sm:w-40 text-right">Stage</span>
                </div>
                <div
                  ref={listRef}
                  className="mt-2 max-h-[min(220px,42vh)] space-y-2.5 overflow-x-hidden overflow-y-auto scroll-smooth pr-1 [scrollbar-gutter:stable]"
                >
                {mockRows.map((row, idx) => {
                  const isActive = dashboardInView && activeRow === idx;
                  const rowHighlightDuration = liteMotion ? rowHighlightFade.lite : rowHighlightFade.full;
                  return (
                    <motion.div
                      key={`${searchIndex}-${idx}-${row.label}`}
                      data-candidate-row={idx}
                      className="relative text-xs sm:text-sm rounded-row-highlight border-l-[3px] border-transparent px-2 py-1.5"
                      initial={liteMotion ? false : { opacity: 0, x: -10 }}
                      animate={dashboardInView ? { opacity: 1, x: 0 } : {}}
                      transition={
                        liteMotion
                          ? { duration: 0 }
                          : {
                              delay: 0.42 + idx * 0.06,
                              duration: 0.4,
                              ease: [0.22, 1, 0.36, 1],
                            }
                      }
                    >
                      <motion.div
                        aria-hidden
                        className="pointer-events-none absolute top-0 bottom-0 -left-[3px] w-[calc(100%+3px)] rounded-row-highlight border-l-[3px] border-accent bg-accent/[0.06] dark:bg-accent/[0.1]"
                        initial={false}
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{
                          duration: rowHighlightDuration,
                          ease: [...stageEase],
                        }}
                      />
                      <div className="relative z-10 flex w-full min-w-0 items-center gap-3">
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <CandidateAvatarThumb
                          avatarSrc={row.avatarSrc}
                          avatarAlt={row.avatarAlt}
                          isActive={isActive}
                        />
                        <span className="truncate text-left font-medium text-primary dark:text-slate-200 text-[11px] sm:text-sm min-w-0 max-w-[5.5rem] sm:max-w-[7.5rem]">
                          {row.label}
                        </span>
                        <div className="flex-1 min-w-[1.5rem] h-2.5 rounded-full bg-slate-200/90 dark:bg-white/10 overflow-hidden">
                          {liteMotion ? (
                            <div
                              className="h-full rounded-full bg-slate-300/90 dark:bg-white/20"
                              style={{
                                width: dashboardInView ? `${38 + idx * 6}%` : "12%",
                              }}
                            />
                          ) : (
                            <motion.div
                              className="h-full rounded-full bg-slate-300/90 dark:bg-white/20"
                              initial={{ width: "12%" }}
                              animate={dashboardInView ? { width: `${38 + idx * 6}%` } : {}}
                              transition={{
                                duration: 0.85,
                                delay: 0.5 + idx * 0.07,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <div className="w-11 shrink-0 text-right sm:hidden font-semibold text-accent tabular-nums text-[11px]">
                        <FitPercent
                          value={row.fit}
                          enabled={dashboardInView}
                          delayMs={480 + idx * 90}
                          instant={liteMotion}
                        />
                      </div>
                      <div className="w-20 hidden sm:flex justify-end items-center gap-2">
                        <FitBar
                          pct={row.fit}
                          enabled={dashboardInView}
                          rowDelay={0.5 + idx * 0.09}
                          instant={liteMotion}
                        />
                        <span className="font-semibold text-accent tabular-nums w-9 text-right">
                          <FitPercent
                            value={row.fit}
                            enabled={dashboardInView}
                            delayMs={480 + idx * 90}
                            instant={liteMotion}
                          />
                        </span>
                      </div>
                      <div className="w-[6.25rem] sm:w-40 shrink-0 flex flex-col items-end justify-center min-h-[1.375rem] sm:min-h-[1.5rem] [perspective:480px] [transform-style:preserve-3d]">
                        {liteMotion ? (
                          <span
                            className={`text-right text-[10px] sm:text-xs font-semibold tabular-nums ${stageTone(row.restingStage)}`}
                          >
                            {isActive ? (
                              <span className="inline-flex rounded-md bg-accent/15 px-1.5 py-0.5 ring-1 ring-accent/30 dark:bg-accent/20">
                                {row.restingStage}
                              </span>
                            ) : (
                              row.restingStage
                            )}
                          </span>
                        ) : isActive ? (
                          <motion.span
                            key={`stage-focus-${searchIndex}-${idx}`}
                            initial={{
                              opacity: 0,
                              rotateX: 14,
                              y: 6,
                              filter: "blur(4px)",
                            }}
                            animate={{
                              opacity: 1,
                              rotateX: 0,
                              y: 0,
                              filter: "blur(0px)",
                            }}
                            transition={{ duration: stageFlipDuration, ease: stageEase }}
                            className={`inline-block text-right text-[10px] sm:text-xs font-semibold tabular-nums origin-[100%_50%] ${stageTone(row.restingStage)}`}
                          >
                            <span className="inline-flex rounded-md bg-accent/15 px-1.5 py-0.5 ring-1 ring-accent/30 dark:bg-accent/20">
                              {row.restingStage}
                            </span>
                          </motion.span>
                        ) : (
                          <span
                            className={`text-right text-[10px] sm:text-xs font-semibold tabular-nums ${stageTone(row.restingStage)}`}
                          >
                            {row.restingStage}
                          </span>
                        )}
                        {isActive ? (
                          <span className="sr-only">
                            Highlighted candidate {row.label}, stage {row.restingStage}.
                          </span>
                        ) : null}
                      </div>
                      </div>
                    </motion.div>
                  );
                })}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FitPercent({
  value,
  enabled,
  delayMs,
  instant,
}: {
  value: number;
  enabled: boolean;
  delayMs: number;
  instant: boolean;
}) {
  if (instant) {
    return <span className="tabular-nums">{enabled ? `${value}%` : "0%"}</span>;
  }
  return <FitPercentAnimated value={value} enabled={enabled} delayMs={delayMs} />;
}

function FitPercentAnimated({
  value,
  enabled,
  delayMs,
}: {
  value: number;
  enabled: boolean;
  delayMs: number;
}) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 120, damping: 24 });
  const rounded = useTransform(spring, (v) => `${Math.round(v)}%`);

  useEffect(() => {
    if (!enabled) return;
    const controlsRef: { current: ReturnType<typeof animate> | null } = { current: null };
    const t = window.setTimeout(() => {
      controlsRef.current = animate(mv, value, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    }, delayMs);
    return () => {
      window.clearTimeout(t);
      controlsRef.current?.stop();
    };
  }, [enabled, value, delayMs, mv]);

  return <motion.span>{rounded}</motion.span>;
}
