export type BfCacheTheme = "light" | "dark";

export type BfCacheThemeSyncDeps = Readonly<{
  readTheme: () => BfCacheTheme;
  applyClass: (theme: BfCacheTheme) => void;
  setThemeState: (theme: BfCacheTheme) => void;
}>;

/**
 * Handles `pageshow` after back/forward cache: reapplies stored/system theme so
 * `document.documentElement` cannot drift from React state.
 */
export function createBfCacheThemePageShowHandler(
  deps: BfCacheThemeSyncDeps,
): (event: Pick<PageTransitionEvent, "persisted">) => void {
  return (event) => {
    if (!event.persisted) return;
    const next = deps.readTheme();
    deps.setThemeState(next);
    deps.applyClass(next);
  };
}
