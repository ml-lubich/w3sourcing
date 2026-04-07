"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import { surfaceCardWhileHover, surfaceRevealEnterTransition } from "@/lib/surface-reveal-motion";

export function FounderSpotlight({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  /** Framer SSR vs first client paint can diverge; render static `<article>` until mounted. */
  const [motionReady, setMotionReady] = useState(false);
  const reduced = useHydrationSafeReducedMotion();
  const narrowViewport = useMobileLightMotion();
  const liteMotion = reduced || narrowViewport;

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- enable Framer only after mount; avoids SSR/hydration drift
    setMotionReady(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="leadership"
      className="section-padding section-band-glass section-glass-ambient"
      aria-labelledby="leadership-heading"
      suppressHydrationWarning
    >
      <div className="section-glass-inner mx-auto max-w-7xl px-6">
        <div
          className={`mb-10 text-center transition-all duration-700 sm:mb-12 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <span className="glass-chip mb-4 inline-block rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Leadership
          </span>
          <h2
            id="leadership-heading"
            className="text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl"
          >
            <span className="text-primary dark:text-white">Principal-led </span>
            <span className="text-accent">from day one</span>
          </h2>
        </div>

        {motionReady ? (
          <motion.article
            className="glass-panel mx-auto max-w-4xl overflow-hidden rounded-2xl"
            initial={reduced ? false : { opacity: 0, y: liteMotion ? 10 : 18 }}
            animate={
              visible || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: liteMotion ? 10 : 18 }
            }
            transition={surfaceRevealEnterTransition(liteMotion, reduced, { delay: reduced ? 0 : 0.06 })}
            whileHover={surfaceCardWhileHover(liteMotion)}
          >
            {children}
          </motion.article>
        ) : (
          <article
            className="glass-panel mx-auto max-w-4xl overflow-hidden rounded-2xl"
            style={
              reduced
                ? undefined
                : visible || reduced
                  ? { opacity: 1, transform: "translateY(0px)" }
                  : { opacity: 0, transform: `translateY(${liteMotion ? 10 : 18}px)` }
            }
          >
            {children}
          </article>
        )}
      </div>
    </section>
  );
}
