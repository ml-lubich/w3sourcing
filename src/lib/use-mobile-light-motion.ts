"use client";

import { useLayoutEffect, useState } from "react";

/** Viewports below Tailwind `sm` (640px): prefer lighter motion for performance. */
export const MOBILE_LIGHT_MOTION_MEDIA = "(max-width: 639px)";

export function useMobileLightMotion(): boolean {
  const [narrow, setNarrow] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia(MOBILE_LIGHT_MOTION_MEDIA);
    const sync = (): void => {
      setNarrow(mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- gate mq results until after first layout
    setHydrated(true);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return hydrated ? narrow : false;
}
