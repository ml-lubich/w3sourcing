"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useLayoutEffect, useState } from "react";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";

/** GSAP power3.out–like easing for per-word Y-mask (`variant="textLoad"` only). */
export const TEXT_LOAD_EASE = [0.215, 0.61, 0.355, 1] as const;

/** Spring + scale/rotate “bubble in” (default headings). No CSS `filter: blur()` on text — WebKit + `backdrop-filter` parents smear composited word layers. */
const BUBBLE_SPRING = {
  type: "spring" as const,
  stiffness: 340,
  damping: 22,
  mass: 0.64,
};

type SplitWordsProps = {
  text: string;
  className?: string;
  /**
   * `fill` (default): full row width so `flex-wrap` breaks like normal copy (avoids one-word-per-line shrink-to-fit).
   * `fit`: shrink to phrase width + `nowrap` for short tiles beside sibling copy.
   * `flow`: inline shrink-to-fit + `flex-wrap` + `max-w-full` (no `w-max`) so long prefixes wrap in paragraph flow before a sibling phrase.
   */
  phraseWidth?: "fit" | "fill" | "flow";
  /** Legacy: offsets the stagger index (use `delayStart` for time-based delay). */
  wordIndexOffset?: number;
  /**
   * 0-based offset into the headline’s word list for `gsap_split_word{n}` class suffixes
   * (matches GSAP SplitText-style `gsap_split_word1`, `gsap_split_word2`, … across joined lines).
   */
  gsapWordIndexStart?: number;
  /** Seconds between consecutive words. */
  stagger?: number;
  /** Seconds before the first word of this phrase begins. */
  delayStart?: number;
  as?: "span" | "h1" | "h2" | "p";
  /** Default `hero`: spring bubble (marketing headings). `chrome`: toolbar. `textLoad`: Y-mask only. */
  variant?: "hero" | "chrome" | "textLoad";
  /** When false, render plain text (no mask animation). */
  animate?: boolean;
  /**
   * When true, each animated word gets `aria-hidden="true"` (use only with a parallel `sr-only` /
   * `aria-live` string for the same sentence—e.g. hero / practice-area headings).
   */
  splitTextDecorative?: boolean;
};

export function SplitWords({
  text,
  className = "",
  phraseWidth = "fill",
  wordIndexOffset = 0,
  gsapWordIndexStart = 0,
  stagger = 0.055,
  delayStart = 0,
  as: Tag = "span",
  variant = "hero",
  animate: shouldAnimate = true,
  splitTextDecorative = false,
}: SplitWordsProps) {
  const reduceMotion = useHydrationSafeReducedMotion();
  const narrowViewport = useMobileLightMotion();
  const [motionMounted, setMotionMounted] = useState(false);
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- defer Framer until after hydration (SSR vs client style serialization)
    setMotionMounted(true);
  }, []);
  const words = text.trim().split(/\s+/);
  const chrome = variant === "chrome";
  const textLoad = variant === "textLoad";
  /** ≤639px: default `hero` uses mask-rise only (shorter stagger) — lighter than desktop bubble. */
  const heroLite = variant === "hero" && narrowViewport;
  const baseDelay = delayStart + wordIndexOffset * stagger;

  /** `prefers-reduced-motion`: plain copy only. */
  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  /**
   * Framer can emit different inline styles on the server vs the first client pass (e.g. numeric vs string
   * opacity). Render static copy until layout, then mount per-word motion — matches SSR + hydrates cleanly.
   * Applies whenever motion is not yet mounted (including `animate={false}`) so we never SSR `motion.*` here.
   */
  if (!motionMounted) {
    return <Tag className={className}>{text}</Tag>;
  }

  const flexGap = chrome ? "gap-x-[0.12em]" : "gap-x-[0.18em]";
  const fillRow = phraseWidth === "fill" && !chrome;
  const flowRow = phraseWidth === "flow" && !chrome;
  /**
   * `inline-flex` + `w-max` + `flex-wrap` resolves the row to min-content (widest word) and stacks one word per line.
   * Default `phraseWidth="fill"` uses a block-level `flex` row with `w-full` so wrapping matches normal headings.
   * `phraseWidth="fit"` + `nowrap` keeps short phrases beside sibling `SplitWords` (stats accent).
   * `phraseWidth="flow"` omits `w-max` so shrink-to-fit uses the parent width and `flex-wrap` lays out like normal copy.
   */
  const rowLayout = chrome
    ? ["inline-flex", "w-max", "max-w-full", "min-w-0", "flex-nowrap"]
    : fillRow
      ? ["flex", "w-full", "max-w-full", "min-w-0", "flex-wrap"]
      : flowRow
        ? ["inline-flex", "max-w-full", "min-w-0", "flex-wrap"]
        : ["inline-flex", "w-max", "max-w-full", "min-w-0", "flex-nowrap"];
  const composed = [...rowLayout, "items-baseline", flexGap, className].filter(Boolean).join(" ");

  const hiddenChrome = { y: "100%", opacity: 0, scale: 0.93 } as const;
  /** Explicit scale/rotate so a post-hydration switch from desktop → lite never leaves transform props stuck (Framer). */
  const hiddenLite = {
    y: "100%",
    opacity: 0,
    scale: 1,
    rotate: 0,
  } as const;
  const hiddenHero = {
    y: "122%",
    opacity: 0,
    scale: 0.86,
    rotate: -2.2,
  } as const;
  const hiddenState = chrome ? hiddenChrome : textLoad || heroLite ? hiddenLite : hiddenHero;

  const visibleChrome = { y: 0, opacity: 1, scale: 1 } as const;
  const visibleLite = { y: 0, opacity: 1, scale: 1, rotate: 0 } as const;
  const visibleHero = { y: 0, opacity: 1, scale: 1, rotate: 0 } as const;
  const visibleState = chrome ? visibleChrome : textLoad || heroLite ? visibleLite : visibleHero;

  return (
    <Tag className={composed}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="gsap_split_word_clip">
          <motion.span
            suppressHydrationWarning
            aria-hidden={splitTextDecorative ? true : undefined}
            className={`gsap_split_word gsap_split_word${gsapWordIndexStart + i + 1} will-change-transform`}
            initial={false}
            animate={shouldAnimate ? visibleState : hiddenState}
            transition={
              shouldAnimate
                ? chrome
                  ? {
                      type: "spring",
                      stiffness: 500,
                      damping: 28,
                      mass: 0.52,
                      delay: baseDelay + i * stagger,
                    }
                  : textLoad
                    ? {
                        duration: 0.68,
                        ease: [...TEXT_LOAD_EASE],
                        delay: baseDelay + i * stagger,
                      }
                    : heroLite
                      ? {
                          duration: 0.36,
                          ease: [...TEXT_LOAD_EASE],
                          delay: baseDelay + i * Math.min(stagger, 0.028),
                        }
                      : {
                          ...BUBBLE_SPRING,
                          delay: baseDelay + i * stagger,
                        }
                : { duration: 0 }
            }
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Single headline with per-segment color (e.g. neutral + accent), one continuous line wrap. */
export function SplitWordsRich({
  segments,
  className = "",
  phraseWidth = "fill",
  delayStart = 0,
  stagger = 0.048,
  animate: shouldAnimate = true,
  gsapWordIndexStart = 0,
}: {
  segments: { text: string; className?: string }[];
  className?: string;
  phraseWidth?: "fit" | "fill";
  delayStart?: number;
  stagger?: number;
  animate?: boolean;
  gsapWordIndexStart?: number;
}) {
  const reduceMotion = useHydrationSafeReducedMotion();
  const [motionMounted, setMotionMounted] = useState(false);
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- defer Framer until after hydration
    setMotionMounted(true);
  }, []);
  type Flat = { word: string; className?: string };
  const flat: Flat[] = [];
  for (const seg of segments) {
    for (const word of seg.text.trim().split(/\s+/)) {
      flat.push({ word, className: seg.className });
    }
  }
  const narrowViewport = useMobileLightMotion();
  const heroLite = narrowViewport;

  if (reduceMotion) {
    return (
      <span className={className}>
        {segments.map((s, i) => (
          <span key={i} className={s.className}>
            {s.text}
          </span>
        ))}
      </span>
    );
  }

  if (shouldAnimate && !motionMounted) {
    return (
      <span className={className}>
        {segments.map((s, i) => (
          <span key={i} className={s.className}>
            {s.text}
          </span>
        ))}
      </span>
    );
  }

  const fillRow = phraseWidth === "fill";
  const richLayout = fillRow
    ? ["flex", "w-full", "max-w-full", "min-w-0", "flex-wrap"]
    : ["inline-flex", "w-max", "max-w-full", "min-w-0", "flex-nowrap"];
  const richComposed = [...richLayout, "items-baseline", "gap-x-[0.18em]", className].filter(Boolean).join(" ");

  const hiddenRich = heroLite
    ? ({ y: "100%", opacity: 0, scale: 1, rotate: 0 } as const)
    : ({
        y: "122%",
        opacity: 0,
        scale: 0.86,
        rotate: -2.2,
      } as const);
  const visibleRichLite = { y: 0, opacity: 1, scale: 1, rotate: 0 } as const;
  const visibleRichFull = { y: 0, opacity: 1, scale: 1, rotate: 0 } as const;
  const visibleRich = heroLite ? visibleRichLite : visibleRichFull;

  return (
    <span className={richComposed}>
      {flat.map((item, i) => (
        <span key={`${item.word}-${i}`} className="gsap_split_word_clip">
          <motion.span
            className={`gsap_split_word gsap_split_word${gsapWordIndexStart + i + 1} will-change-transform ${item.className ?? ""}`}
            initial={false}
            animate={shouldAnimate ? visibleRich : hiddenRich}
            transition={
              shouldAnimate
                ? heroLite
                  ? {
                      duration: 0.36,
                      ease: [...TEXT_LOAD_EASE],
                      delay: delayStart + i * Math.min(stagger, 0.028),
                    }
                  : {
                      ...BUBBLE_SPRING,
                      delay: delayStart + i * stagger,
                    }
                : { duration: 0 }
            }
          >
            {item.word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function SplitLines({
  lines,
  lineClassName = "",
  wordLineDelays,
  stagger = 0.055,
}: {
  lines: string[];
  lineClassName?: string;
  /** Seconds before each line’s words start. */
  wordLineDelays?: number[];
  stagger?: number;
}): ReactNode {
  return lines.map((line, lineIndex) => (
    <span key={line} className={`block ${lineClassName}`}>
      <SplitWords
        as="span"
        text={line}
        delayStart={wordLineDelays?.[lineIndex] ?? lineIndex * 0.28}
        stagger={stagger}
      />
    </span>
  ));
}
