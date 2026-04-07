"use client";

import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";

/**
 * Per-word heading animation runs when `gate` is true (e.g. section in view).
 * Narrow / “lite” viewports do not disable this; only `prefers-reduced-motion` does.
 */
export function useSplitWordsAnimate(gate: boolean): boolean {
  const reduced = useHydrationSafeReducedMotion();
  return gate && !reduced;
}
