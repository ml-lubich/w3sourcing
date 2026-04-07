import { describe, expect, test } from "bun:test";

import {
  SURFACE_CARD_HOVER_LIFT_PX,
  SURFACE_REVEAL_DURATION_FULL,
  SURFACE_REVEAL_DURATION_LITE,
  SURFACE_REVEAL_DURATION_REDUCED,
  SURFACE_REVEAL_OPACITY_EASE,
  surfaceCardWhileHover,
  surfaceRevealEnterTransition,
} from "./surface-reveal-motion";

describe("SURFACE_REVEAL_OPACITY_EASE", () => {
  test("is a cubic-bezier tuple for scroll-band opacity fades", () => {
    expect(SURFACE_REVEAL_OPACITY_EASE).toHaveLength(4);
    expect(SURFACE_REVEAL_OPACITY_EASE[0]).toBeLessThan(SURFACE_REVEAL_OPACITY_EASE[2]);
  });
});

describe("surfaceRevealEnterTransition", () => {
  test("full and lite durations stay at or above the gradual floor", () => {
    expect(SURFACE_REVEAL_DURATION_LITE).toBeGreaterThanOrEqual(0.5);
    expect(SURFACE_REVEAL_DURATION_FULL).toBeGreaterThanOrEqual(0.5);
  });

  test("reduced motion uses a shorter but still blended duration", () => {
    expect(SURFACE_REVEAL_DURATION_REDUCED).toBeGreaterThanOrEqual(0.4);
    expect(SURFACE_REVEAL_DURATION_REDUCED).toBeLessThan(SURFACE_REVEAL_DURATION_LITE);
  });

  test("forwards optional delay", () => {
    expect(surfaceRevealEnterTransition(false, false, { delay: 0.1 })).toEqual({
      duration: SURFACE_REVEAL_DURATION_FULL,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1,
    });
  });
});

describe("surfaceCardWhileHover", () => {
  test("lite motion tier skips hover lift", () => {
    expect(surfaceCardWhileHover(true)).toBeUndefined();
  });

  test("full motion returns negative y matching CSS lift token", () => {
    expect(surfaceCardWhileHover(false)).toEqual({
      y: -SURFACE_CARD_HOVER_LIFT_PX,
      transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
    });
  });
});
