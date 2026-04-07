"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useLayoutEffect, useState } from "react";
import {
  SURFACE_REVEAL_DURATION_FULL,
  SURFACE_REVEAL_DURATION_LITE,
  SURFACE_REVEAL_DURATION_REDUCED,
  SURFACE_REVEAL_EASE,
  SURFACE_REVEAL_OPACITY_EASE,
  surfaceRevealEnterTransition,
} from "@/lib/surface-reveal-motion";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";

export type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Section enter: fade (+ subtle rise when not lite-motion). Durations match
 * `surface-reveal-motion` (~0.52s narrow / ~0.62s desktop; ~0.45s reduced).
 */
export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const [clientMotionReady, setClientMotionReady] = useState(false);
  const reducedMotion = useHydrationSafeReducedMotion();
  const mobileLight = useMobileLightMotion();

  useLayoutEffect(() => {
    // `whileInView` + IO rootMargin must not run until after mount; also keeps SSR,
    // first client pass, and Framer opacity/transform serialization aligned (see footer gate).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount gate (mirrors footer `clientMotionReady`)
    setClientMotionReady(true);
  }, []);

  if (!clientMotionReady) {
    return <div className={className}>{children}</div>;
  }

  const lite = mobileLight;
  /** Pixels only — some engines reject `%` / non-px lengths for IntersectionObserver rootMargin. */
  const viewport = { once: true, amount: 0.05, margin: "0px 0px 120px 0px" as const };

  const opacityTransition = {
    duration: reducedMotion
      ? SURFACE_REVEAL_DURATION_REDUCED
      : lite
        ? SURFACE_REVEAL_DURATION_LITE
        : SURFACE_REVEAL_DURATION_FULL,
    ease: SURFACE_REVEAL_OPACITY_EASE,
  } as const;

  /** Reduced motion: opacity-only — avoids travel while keeping a visible blend-in. */
  if (reducedMotion) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={opacityTransition}
        viewport={viewport}
      >
        {children}
      </motion.div>
    );
  }

  const yTravel = lite ? 0 : 14;
  const slideTransition = surfaceRevealEnterTransition(lite, false);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: yTravel }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        opacity: opacityTransition,
        y: { duration: slideTransition.duration, ease: SURFACE_REVEAL_EASE },
      }}
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}
