"use client";

import { useReducedMotion } from "framer-motion";
import { useLayoutEffect, useState } from "react";

/**
 * `useReducedMotion` can resolve differently on the server vs the first client pass,
 * which changes Framer markup (variants, reduced branches). Until layout effects run,
 * pin to `false` so SSR and the first client render stay aligned.
 */
export function useHydrationSafeReducedMotion(): boolean {
  const fmReduced = useReducedMotion() ?? false;
  const [hydrated, setHydrated] = useState(false);
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- align first client paint with SSR for Framer branches
    setHydrated(true);
  }, []);
  return hydrated ? fmReduced : false;
}
