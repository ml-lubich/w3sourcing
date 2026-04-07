/**
 * Footer uses `useInView`, which is false during SSR but may be true on the client's
 * first paint when the footer is already in the viewport. Framer `animate` must use
 * the same boolean on the server and on that first paint or hydration fails (and
 * blocks can remain invisible).
 */
export function isFooterScrollRevealVisible(params: Readonly<{
  clientMotionReady: boolean;
  inView: boolean;
  prefersReducedMotion: boolean;
}>): boolean {
  return (params.clientMotionReady && params.inView) || params.prefersReducedMotion;
}

/** Gate for `useSplitWordsAnimate`: must stay false until after mount for the same reason. */
export function isFooterSplitWordsGateOpen(params: Readonly<{
  clientMotionReady: boolean;
  inView: boolean;
}>): boolean {
  return params.clientMotionReady && params.inView;
}
