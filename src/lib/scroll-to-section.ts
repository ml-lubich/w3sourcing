const PENDING_SECTION_KEY = "w3:scrollToSection";

const SCROLL_SPY_SUPPRESS_MS = 950;
/** Short cap keeps long jumps from feeling sluggish; min avoids micro-jitter. */
const SNAPPY_SCROLL_MIN_MS = 200;
const SNAPPY_SCROLL_MAX_MS = 420;
const SNAPPY_MS_PER_PX = 0.34;

/** While true, `Header` scroll-spy must not overwrite the user's chosen nav item (smooth scroll is in-flight). */
let scrollSpySuppressUntilMs = 0;

let scrollAnimFrameId = 0;

export function isScrollSpySuppressed(): boolean {
  return typeof performance !== "undefined" && performance.now() < scrollSpySuppressUntilMs;
}

function armScrollSpySuppress(): void {
  if (typeof performance === "undefined" || typeof window === "undefined") return;
  scrollSpySuppressUntilMs = performance.now() + SCROLL_SPY_SUPPRESS_MS;
  window.setTimeout(() => {
    scrollSpySuppressUntilMs = 0;
  }, SCROLL_SPY_SUPPRESS_MS);
}

function readCssPx(el: Element, prop: keyof CSSStyleDeclaration): number {
  const raw = getComputedStyle(el)[prop];
  const n = Number.parseFloat(String(raw));
  return Number.isFinite(n) ? n : 0;
}

function prefersReducedMotion(): boolean {
  return (
    typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function computeSnappyScrollDurationMs(deltaY: number): number {
  const d = Math.abs(deltaY);
  return Math.min(SNAPPY_SCROLL_MAX_MS, Math.max(SNAPPY_SCROLL_MIN_MS, d * SNAPPY_MS_PER_PX));
}

function cancelWindowScrollAnimation(): void {
  if (typeof window === "undefined" || scrollAnimFrameId === 0) return;
  window.cancelAnimationFrame(scrollAnimFrameId);
  scrollAnimFrameId = 0;
}

/** Eased window scroll: faster than native `behavior: "smooth"` on long distances. */
function scrollWindowToYSnappy(targetY: number): void {
  if (typeof window === "undefined") return;
  cancelWindowScrollAnimation();
  const startY = window.scrollY;
  const delta = targetY - startY;
  if (Math.abs(delta) < 0.5) {
    window.scrollTo(0, targetY);
    return;
  }
  const durationMs = computeSnappyScrollDurationMs(delta);
  const t0 = performance.now();

  const step = (now: number): void => {
    const elapsed = now - t0;
    const t = Math.min(1, elapsed / durationMs);
    const eased = 1 - (1 - t) ** 3;
    window.scrollTo(0, startY + delta * eased);
    if (t < 1) {
      scrollAnimFrameId = window.requestAnimationFrame(step);
    } else {
      scrollAnimFrameId = 0;
      window.scrollTo(0, targetY);
    }
  };
  scrollAnimFrameId = window.requestAnimationFrame(step);
}

export function stashPendingSectionScroll(id: string): void {
  try {
    sessionStorage.setItem(PENDING_SECTION_KEY, id);
  } catch {
    //
  }
}

export function peekPendingSectionScroll(): string | null {
  try {
    const v = sessionStorage.getItem(PENDING_SECTION_KEY);
    return v && v.length > 0 ? v : null;
  } catch {
    return null;
  }
}

export function clearPendingSectionScroll(): void {
  try {
    sessionStorage.removeItem(PENDING_SECTION_KEY);
  } catch {
    //
  }
}

/** Scroll to `id` and sync the URL hash. Returns whether an element was found. */
export function scrollToSectionId(id: string): boolean {
  let decoded: string;
  try {
    decoded = decodeURIComponent(id);
  } catch {
    decoded = id;
  }
  const el = document.getElementById(decoded);
  if (!el) return false;

  armScrollSpySuppress();

  const html = document.documentElement;
  const scrollPaddingTop = readCssPx(html, "scrollPaddingTop");
  const pad = scrollPaddingTop > 0 ? scrollPaddingTop : 88;
  const scrollMarginTop = readCssPx(el, "scrollMarginTop");
  const rect = el.getBoundingClientRect();
  const y = rect.top + window.scrollY - scrollMarginTop - pad;
  const top = Math.max(0, y);
  if (prefersReducedMotion()) {
    cancelWindowScrollAnimation();
    window.scrollTo(0, top);
  } else {
    scrollWindowToYSnappy(top);
  }
  window.history.replaceState(null, "", `#${id}`);
  return true;
}

/** Scroll to top of the document; clears hash. Uses the same capped ease as section jumps. */
export function scrollToPageTop(): void {
  if (typeof window === "undefined") return;
  armScrollSpySuppress();
  if (prefersReducedMotion()) {
    cancelWindowScrollAnimation();
    window.scrollTo(0, 0);
  } else {
    scrollWindowToYSnappy(0);
  }
  const nextUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, "", nextUrl);
}
