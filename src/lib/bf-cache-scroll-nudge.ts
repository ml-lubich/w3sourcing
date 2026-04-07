/**
 * Minimal `Window` surface for back/forward cache scroll revival (tests inject mocks).
 */
export type BfCacheScrollNudgeWindow = Pick<
  Window,
  "scrollX" | "scrollY" | "scrollTo" | "requestAnimationFrame"
>;

/**
 * After bfcache restore, nudge scroll by 1px and back so IntersectionObserver / Framer
 * `whileInView` observers re-run without a full reload.
 */
export function runBfCacheScrollNudge(w: BfCacheScrollNudgeWindow): void {
  const x = w.scrollX;
  const y = w.scrollY;
  w.requestAnimationFrame(() => {
    w.scrollTo(x, y + 1);
    w.requestAnimationFrame(() => {
      w.scrollTo(x, y);
    });
  });
}
