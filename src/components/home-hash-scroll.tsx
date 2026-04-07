"use client";

import { useEffect } from "react";
import {
  clearPendingSectionScroll,
  peekPendingSectionScroll,
  scrollToSectionId,
} from "@/lib/scroll-to-section";

/**
 * Handles `/#section` and cross-route pending scroll after paint (layout / fonts).
 */
export function HomeHashScroll() {
  useEffect(() => {
    const pending = peekPendingSectionScroll();
    let id: string | undefined;
    if (pending) {
      id = pending;
    } else {
      const raw = window.location.hash;
      if (!raw || raw === "#") return;
      try {
        id = decodeURIComponent(raw.slice(1));
      } catch {
        id = raw.slice(1);
      }
    }
    if (!id) return;

    const sectionId = id;
    const hadPending = pending !== null;
    let cancelled = false;
    const scrollWhenReady = () => {
      if (cancelled) return;
      const ok = scrollToSectionId(sectionId);
      if (ok && hadPending) clearPendingSectionScroll();
    };
    const raf1 = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollWhenReady);
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf1);
    };
  }, []);

  return null;
}
