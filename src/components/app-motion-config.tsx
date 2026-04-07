"use client";

import { MotionConfig } from "framer-motion";
import { useLayoutEffect, useState, type ReactNode } from "react";

/**
 * Framer's `useReducedMotion()` seeds from `prefersReducedMotion.current`, which is
 * `null` during SSR but a boolean on the client's first pass — that can desync `motion`
 * output before paint. Gate real `prefers-reduced-motion` until after layout so SSR and
 * the hydrating render stay aligned, then honour the user's OS setting.
 */
export function AppMotionConfig({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] =
    useState<"never" | "user">("never");
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration gate
    setReducedMotion("user");
  }, []);
  return (
    <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
  );
}
