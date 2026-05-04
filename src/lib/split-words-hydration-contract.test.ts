import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const componentsDir = path.join(import.meta.dirname, "..", "components");

/**
 * Guards against hydration-mismatch regressions in SplitWords and SplitWordsRich.
 *
 * Both components render Framer `motion.*` elements whose inline-style serialization
 * differs between server and client. They must gate ALL motion rendering behind
 * `!motionMounted` (a `useLayoutEffect` flag), regardless of the `animate` prop value.
 *
 * Historical regression: SplitWordsRich used `if (shouldAnimate && !motionMounted)`
 * which skipped the guard when `animate={false}`. Framer still emits differing
 * inline styles in that branch, causing a tree-level hydration warning.
 */
describe("split-words hydration guards", () => {
  const src = readFileSync(path.join(componentsDir, "split-words.tsx"), "utf8");

  test("SplitWordsRich mounts unconditionally on !motionMounted (no shouldAnimate condition)", () => {
    // The correct guard: bare `!motionMounted` check
    expect(src).toMatch(/if\s*\(\s*!motionMounted\s*\)/);
  });

  test("SplitWordsRich guard does NOT depend on shouldAnimate", () => {
    // The old buggy guard would have combined shouldAnimate with !motionMounted
    expect(src).not.toMatch(/if\s*\(\s*shouldAnimate\s*&&\s*!motionMounted\s*\)/);
  });

  test("SplitWords also guards on bare !motionMounted", () => {
    // SplitWords has its own `if (!motionMounted)` block; verify it exists
    const mountedGuards = [...src.matchAll(/if\s*\(\s*!motionMounted\s*\)/g)];
    // One for SplitWords, one for SplitWordsRich
    expect(mountedGuards.length).toBeGreaterThanOrEqual(2);
  });

  test("useLayoutEffect drives the motionMounted flag", () => {
    // Must use useLayoutEffect (not useEffect) so the flag fires before paint
    expect(src).toContain("useLayoutEffect");
    expect(src).not.toMatch(/useEffect\s*\(\s*\(\s*\)\s*=>\s*\{[\s\S]*?setMotionMounted/);
  });
});
