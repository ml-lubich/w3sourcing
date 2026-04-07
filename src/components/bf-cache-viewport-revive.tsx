"use client";

import { useLayoutEffect } from "react";
import { runBfCacheScrollNudge } from "@/lib/bf-cache-scroll-nudge";

/**
 * After back/forward cache restore, Framer's viewport observers may not re-fire
 * immediately; a tiny scroll round-trip forces IntersectionObserver/layout without
 * a full reload.
 */
export function BfCacheViewportRevive() {
  useLayoutEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) runBfCacheScrollNudge(window);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
