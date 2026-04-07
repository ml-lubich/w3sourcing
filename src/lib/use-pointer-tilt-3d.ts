"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

const SPRING = { stiffness: 420, damping: 32, mass: 0.52 } as const;
const FINE_HOVER_MEDIA = "(hover: hover) and (pointer: fine)";

export function clientPointToCardTilt(
  clientX: number,
  clientY: number,
  rect: Pick<DOMRectReadOnly, "left" | "top" | "width" | "height">,
  maxDeg: number
): { rotateX: number; rotateY: number } {
  const nx = (clientX - rect.left) / rect.width;
  const ny = (clientY - rect.top) / rect.height;
  return {
    rotateY: (nx - 0.5) * 2 * maxDeg,
    rotateX: -(ny - 0.5) * 2 * maxDeg,
  };
}

function useMatchMediaHydrated(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia(query);
    const sync = (): void => {
      setMatches(mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- gate mq results until after first layout
    setHydrated(true);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return hydrated && matches;
}

export type PointerTilt3dMotion = {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  translateZ: MotionValue<number>;
  pointerHandlers: {
    onPointerEnter: (e: ReactPointerEvent<HTMLElement>) => void;
    onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void;
    onPointerLeave: (e: ReactPointerEvent<HTMLElement>) => void;
  };
};

export function usePointerTilt3d(options: {
  enabled: boolean;
  maxTiltDeg?: number;
  liftPx?: number;
}): PointerTilt3dMotion {
  const { enabled: motionAllowed, maxTiltDeg = 6.5, liftPx = 12 } = options;
  const fineHover = useMatchMediaHydrated(FINE_HOVER_MEDIA);
  const enabled = motionAllowed && fineHover;

  const targetRx = useMotionValue(0);
  const targetRy = useMotionValue(0);
  const targetZ = useMotionValue(0);
  const rotateX = useSpring(targetRx, SPRING);
  const rotateY = useSpring(targetRy, SPRING);
  const translateZ = useSpring(targetZ, { ...SPRING, stiffness: 480, damping: 36 });

  const onPointerEnter = useCallback((): void => {
    if (!enabled) return;
    targetZ.set(liftPx);
  }, [enabled, liftPx, targetZ]);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) return;
      const el = e.currentTarget;
      const t = clientPointToCardTilt(e.clientX, e.clientY, el.getBoundingClientRect(), maxTiltDeg);
      targetRx.set(t.rotateX);
      targetRy.set(t.rotateY);
    },
    [enabled, maxTiltDeg, targetRx, targetRy]
  );

  const onPointerLeave = useCallback((): void => {
    targetRx.set(0);
    targetRy.set(0);
    targetZ.set(0);
  }, [targetRx, targetRy, targetZ]);

  return {
    rotateX,
    rotateY,
    translateZ,
    pointerHandlers: { onPointerEnter, onPointerMove, onPointerLeave },
  };
}
