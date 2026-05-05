"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
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
import { ResilientImage } from "@/components/resilient-image";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

type PipelineStage = "Screen" | "Interview" | "Shortlist";
type FitPct = 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96;

const stageEase = [0.22, 1, 0.36, 1] as const;
const stageFlipDuration = 0.42;
/** Candidate row accent fill + stripe: opacity crossfade when focus advances (shorter under lite-motion). */
const rowHighlightFade = { full: 0.32, lite: 0.14 } as const;

type MockRow = {
  label: string;
  fit: FitPct;
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
  { line1: "VC-backed", line2: "operators" },
  { line1: "portfolio-scale", line2: "leaders" },
  { line1: "Legal & Finance", line2: "operators" },
  { line1: "founder-led", line2: "markets" },
] as const;

const accentRotateMs = 4200;
const HERO_SEARCH_BURST_DURATION_MS = 1500;
const HERO_SEARCH_BURST_LABELS = [
  "+1 hired",
  "+1 shortlist",
  "+1 intro",
  "+1 interview",
  "+1 mandate",
] as const;

type HeroSearchBurstTone = "success" | "accent" | "sky";

type HeroSearchBurst = {
  id: number;
  label: (typeof HERO_SEARCH_BURST_LABELS)[number];
  x: number;
  y: number;
  rotate: number;
  delay: number;
  tone: HeroSearchBurstTone;
};

const HERO_SEARCH_BURST_TONES: readonly HeroSearchBurstTone[] = [
  "success",
  "accent",
  "sky",
  "accent",
];

function heroBurstToneClass(tone: HeroSearchBurstTone): string {
  if (tone === "success") {
    return "bg-emerald-500/95 text-white shadow-[0_10px_26px_rgb(5_150_105_/_0.35)]";
  }
  if (tone === "sky") {
    return "bg-sky-500/95 text-white shadow-[0_10px_26px_rgb(14_165_233_/_0.34)]";
  }
  return "bg-accent/95 text-white shadow-[0_10px_26px_color-mix(in_srgb,var(--accent)_42%,transparent)]";
}

const FIT_BAR_WIDTH_CLASS_BY_PCT: Record<FitPct, string> = {
  89: "w-[89%]",
  90: "w-[90%]",
  91: "w-[91%]",
  92: "w-[92%]",
  93: "w-[93%]",
  94: "w-[94%]",
  95: "w-[95%]",
  96: "w-[96%]",
};

function pipelinePreviewWidthClass(index: number, dashboardInView: boolean): string {
  if (!dashboardInView) return "w-[12%]";
  if (index === 0) return "w-[38%]";
  if (index === 1) return "w-[44%]";
  if (index === 2) return "w-[50%]";
  if (index === 3) return "w-[56%]";
  return "w-[62%]";
}

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
      className={`relative w-7 h-7 shrink-0 overflow-hidden rounded-full ring-2 ring-white/50 dark:ring-white/10 transition-[box-shadow,ring-color] duration-300 ease-out ${isActive ? "ring-accent/50 dark:ring-accent/45 shadow-sm" : ""
        }`}
    >
      <ResilientImage
        src={resolvedSrc}
        alt=""
        width={28}
        height={28}
        className="h-full w-full object-cover"
        wrapperClassName="relative block h-full w-full overflow-hidden rounded-full"
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
  pct: FitPct;
  enabled: boolean;
  rowDelay: number;
  instant: boolean;
}) {
  const w = enabled ? `${pct}%` : "0%";
  const widthClass = enabled ? FIT_BAR_WIDTH_CLASS_BY_PCT[pct] : "w-0";
  return (
    <div className="hidden sm:block w-20 h-1.5 rounded-full bg-gray-border dark:bg-white/10 overflow-hidden">
      {instant ? (
        <div
          className={`h-full rounded-full bg-gradient-to-r from-accent to-sky-400 ${widthClass}`}
        />
      ) : (
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-sky-400"
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
  const [searchBursts, setSearchBursts] = useState<HeroSearchBurst[]>([]);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const burstCounterRef = useRef(0);
  const burstTimersRef = useRef<number[]>([]);
  const reduceMotion = useHydrationSafeReducedMotion();
  const narrowViewport = useMobileLightMotion();
  const liteMotion = (reduceMotion ?? false) || narrowViewport;
  const splitWordsOn = useSplitWordsAnimate(true);
  /** Re-evaluate while scrolling: `once` would keep timers running off-screen; row `scrollIntoView` then pulls the window back toward the hero. */
  const dashboardInView = useInView(dashboardRef, { amount: 0.22 });

  const rowAdvanceMs = useMemo(() => (narrowViewport ? 4000 : 3200), [narrowViewport]);

  const accentFrame = HERO_ACCENT_FRAMES[accentIndex];
  const heroSrHeadline = `Global recruitment excellence ${accentFrame.line1} ${accentFrame.line2}`;

  const triggerSearchBurst = () => {
    const idBase = burstCounterRef.current;
    const bursts: HeroSearchBurst[] = Array.from({ length: 4 }, (_, index) => {
      const burstId = idBase + index;
      const driftXBase = [-72, -26, 24, 74][index] ?? 0;
      const driftXJitter = ((burstId % 3) - 1) * 7;
      const driftY = 54 + index * 9;
      return {
        id: burstId,
        label: HERO_SEARCH_BURST_LABELS[burstId % HERO_SEARCH_BURST_LABELS.length],
        x: driftXBase + driftXJitter,
        y: driftY,
        rotate: -11 + index * 7,
        delay: index * 0.05,
        tone: HERO_SEARCH_BURST_TONES[index % HERO_SEARCH_BURST_TONES.length],
      };
    });
    burstCounterRef.current += bursts.length;
    setSearchBursts((prev) => [...prev, ...bursts]);

    const removeTimer = window.setTimeout(() => {
      setSearchBursts((prev) => {
        const idsToRemove = new Set(bursts.map((burst) => burst.id));
        return prev.filter((burst) => !idsToRemove.has(burst.id));
      });
      burstTimersRef.current = burstTimersRef.current.filter((timerId) => timerId !== removeTimer);
    }, HERO_SEARCH_BURST_DURATION_MS + 150);

    burstTimersRef.current.push(removeTimer);
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setAccentIndex((i) => (i + 1) % HERO_ACCENT_FRAMES.length);
    }, accentRotateMs);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      for (const timerId of burstTimersRef.current) {
        window.clearTimeout(timerId);
      }
      burstTimersRef.current = [];
    };
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
              className={`hero-orb absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/[0.1] dark:bg-accent/20 blur-[100px] transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"
                }`}
            />
            <div
              className={`hero-orb absolute top-40 -right-24 h-64 w-64 rounded-full bg-cyan-400/15 dark:bg-cyan-400/10 blur-[80px] transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"
                }`}
            />
            <div
              className={`hero-orb absolute bottom-20 -left-16 h-56 w-56 rounded-full bg-sky-500/12 dark:bg-cyan-300/15 blur-[72px] transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"
                }`}
            />
          </>
        ) : (
          <>
            <motion.div
              className="hero-orb absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/[0.1] dark:bg-accent/20 blur-[100px]"
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
              className="hero-orb absolute bottom-20 -left-16 h-56 w-56 rounded-full bg-sky-500/12 dark:bg-cyan-300/15 blur-[72px]"
              initial={{ opacity: 0, x: -40 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </>
        )}
        <div className="absolute inset-0 hero-surface-grid opacity-[0.48] dark:opacity-[0.45]" aria-hidden />
        <div className="absolute inset-0 hero-dot-noise" aria-hidden />
      </div>

      <div
        className={`relative z-10 mx-auto max-w-6xl px-6 text-center transition-transform duration-700 ease-out will-change-transform ${visible ? "translate-y-0" : "translate-y-6"
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
          <Sparkles className="size-3.5 text-accent" strokeWidth={1.8} aria-hidden />
          <span className="text-text-secondary dark:text-slate-300 text-sm font-medium tracking-wide">
            Founder-market search · VC-backed · Legal · Finance
          </span>
        </motion.div>

        <h1
          id="hero-heading"
          className="text-center text-[2.65rem] sm:text-[3.45rem] md:text-[4.45rem] lg:text-[5.1rem] font-extrabold text-primary dark:text-white leading-[0.98] sm:leading-[0.98] md:leading-[0.96] tracking-[-0.02em] mb-6 max-w-5xl mx-auto"
        >
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {heroSrHeadline}
          </span>
          <span className="block leading-[inherit]" aria-hidden>
            <SplitWords
              as="span"
              splitTextDecorative
              text="Executive search for"
              className="justify-center"
              stagger={0.048}
              delayStart={0.05}
              animate={splitWordsOn}
            />
          </span>
          <span
            className="block mt-1 min-h-[2.45rem] text-[2rem] leading-[0.95] text-accent min-[380px]:text-[2.25rem] sm:mt-2 sm:min-h-[3.5rem] sm:text-[3.55rem] md:min-h-[4.3rem] md:text-[4.45rem] lg:min-h-[5rem] lg:text-[5.2rem]"
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
                <SplitWords
                  as="span"
                  splitTextDecorative
                  text={`${accentFrame.line1} ${accentFrame.line2}`}
                  phraseWidth="fit"
                  className="mx-auto justify-center whitespace-nowrap text-accent drop-shadow-[0_14px_34px_color-mix(in_srgb,var(--accent)_24%,transparent)] dark:text-cyan-200 dark:drop-shadow-[0_16px_36px_color-mix(in_srgb,var(--accent)_34%,transparent)]"
                  delayStart={0.08}
                  stagger={0.04}
                  animate={splitWordsOn}
                />
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
          Automation can surface names. Leadership hiring still depends on judgment, discretion,
          and accountability. W3 Sourcing helps VC-backed and growth-stage companies, portfolio teams,
          and high-trust legal and finance groups map markets, engage scarce leaders, and close the people who change the slope.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16 md:mb-20"
          variants={ctaListVariants}
          initial="hidden"
          animate={visible ? "visible" : "hidden"}
        >
          <motion.a
            href="mailto:info@w3sourcing.com"
            variants={ctaItemVariants}
            className="w-full sm:w-auto bg-accent text-white font-semibold text-base py-3.5 px-8 rounded-xl shadow-[0_8px_30px_color-mix(in_srgb,var(--accent)_42%,transparent)] transition-all duration-200 hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.99] inline-flex items-center justify-center gap-2"
          >
            Email us
            <ArrowRight className="size-5" strokeWidth={2} aria-hidden />
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
              className="absolute inset-0 bg-gradient-to-br from-accent/[0.05] via-transparent to-sky-500/[0.05] pointer-events-none"
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
                <div className="relative flex-1 mx-3 min-w-0">
                  <motion.div
                    className="h-8 sm:h-9 rounded-lg bg-gray-light dark:bg-white/[0.06] shadow-[0_2px_10px_rgb(15_23_42_/_0.06)] dark:shadow-[0_2px_14px_rgb(0_0_0_/_0.32)] flex items-center px-3 min-w-0 gap-2"
                    initial={{ opacity: 0.5 }}
                    animate={dashboardInView ? { opacity: 1 } : {}}
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
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
                    <button
                      type="button"
                      onClick={triggerSearchBurst}
                      className="group inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-accent/25 bg-white/70 text-[13px] leading-none shadow-[0_5px_14px_rgb(15_23_42_/_0.12)] transition-transform duration-150 hover:scale-[1.08] hover:border-accent/45 hover:bg-white active:scale-[0.97] dark:bg-white/[0.08] dark:hover:bg-white/[0.14]"
                      aria-label="Trigger shortlist wins"
                      title="Trigger shortlist wins"
                    >
                      <span aria-hidden>🔎</span>
                    </button>
                  </motion.div>

                  <div className="pointer-events-none absolute right-1 top-2 z-20" aria-hidden>
                    <AnimatePresence>
                      {searchBursts.map((burst) => (
                        <motion.span
                          key={burst.id}
                          className={`absolute right-0 top-0 inline-flex select-none whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold tracking-wide ${heroBurstToneClass(burst.tone)}`}
                          initial={{ opacity: 0, scale: 0.84, x: 0, y: 0, rotate: 0 }}
                          animate={
                            liteMotion
                              ? {
                                  opacity: [0, 1, 0],
                                  scale: [0.9, 1, 0.96],
                                  x: burst.x * 0.55,
                                  y: -24,
                                  rotate: burst.rotate * 0.35,
                                }
                              : {
                                  opacity: [0, 1, 1, 0],
                                  scale: [0.84, 1, 1, 0.95],
                                  x: burst.x,
                                  y: -burst.y,
                                  rotate: burst.rotate,
                                }
                          }
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: liteMotion ? 0.78 : 1.25,
                            delay: burst.delay,
                            times: liteMotion ? [0, 0.5, 1] : [0, 0.22, 0.78, 1],
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          {burst.label}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
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
                                  className={`h-full rounded-full bg-slate-300/90 dark:bg-white/20 ${pipelinePreviewWidthClass(idx, dashboardInView)}`}
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
