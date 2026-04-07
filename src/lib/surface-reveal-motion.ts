/**
 * Durations and ease for scroll-into-view reveals on cards, panels, imagery,
 * and other non-typographic surfaces. Keeps entrances perceptibly gradual (≥~0.5s
 * on full and narrow viewports) while staying lighter under reduced motion.
 */
export const SURFACE_REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

/** Softer ease-in-out for opacity on section `ScrollReveal` — avoids a harsh “snap” at the start of the fade. */
export const SURFACE_REVEAL_OPACITY_EASE = [0.42, 0, 0.58, 1] as const;

export type SurfaceRevealEase = typeof SURFACE_REVEAL_EASE;

/** Desktop / full motion: opacity ± subtle Y. */
export const SURFACE_REVEAL_DURATION_FULL = 0.62;
/** Narrow viewport (lite motion tier): fade-forward, same floor. */
export const SURFACE_REVEAL_DURATION_LITE = 0.52;
/** `prefers-reduced-motion`: opacity only, still blended (not a hard pop). */
export const SURFACE_REVEAL_DURATION_REDUCED = 0.45;

/** Pixels lifted on fine-pointer hover for Framer surfaces that own `transform`. Matches CSS `--surface-card-hover-lift`. */
export const SURFACE_CARD_HOVER_LIFT_PX = 5 as const;

/**
 * Hover lift for `motion.*` nodes: CSS `.glass-panel:hover` cannot win over Framer’s inline `transform`.
 * Gate with the same `liteMotion` tier as other surface motion (narrow viewport or reduced motion).
 */
export function surfaceCardWhileHover(
  liteMotion: boolean,
):
  | { y: number; transition: { duration: number; ease: SurfaceRevealEase } }
  | undefined {
  if (liteMotion) return undefined;
  return {
    y: -SURFACE_CARD_HOVER_LIFT_PX,
    transition: { duration: 0.28, ease: SURFACE_REVEAL_EASE },
  };
}

export function surfaceRevealEnterTransition(
  liteMotion: boolean,
  reducedMotion: boolean,
  extra?: { delay?: number },
): { duration: number; ease: SurfaceRevealEase; delay?: number } {
  const delay = extra?.delay;
  if (reducedMotion) {
    return delay === undefined
      ? { duration: SURFACE_REVEAL_DURATION_REDUCED, ease: SURFACE_REVEAL_EASE }
      : { duration: SURFACE_REVEAL_DURATION_REDUCED, ease: SURFACE_REVEAL_EASE, delay };
  }
  const duration = liteMotion ? SURFACE_REVEAL_DURATION_LITE : SURFACE_REVEAL_DURATION_FULL;
  return delay === undefined
    ? { duration, ease: SURFACE_REVEAL_EASE }
    : { duration, ease: SURFACE_REVEAL_EASE, delay };
}
