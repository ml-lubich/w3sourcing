import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

import { expertiseAreas, expertiseClusters } from "@/content/expertise-areas";

const componentsDir = import.meta.dirname;
const src = readFileSync(path.join(componentsDir, "expertise-storm.tsx"), "utf8");

describe("expertise storm data", () => {
  test("exposes a meaningful flat list of competency areas", () => {
    expect(expertiseAreas.length).toBeGreaterThanOrEqual(30);
  });

  test("flat list is de-duplicated", () => {
    expect(new Set(expertiseAreas).size).toBe(expertiseAreas.length);
  });

  test("clusters cover recruiting areas, not dev skills", () => {
    const labels = expertiseClusters.map((c) => c.label);
    expect(labels).toContain("Engineering");
    expect(labels).toContain("Legal");
    expect(labels).toContain("Finance");
    // W3's signature "how we work" capabilities are represented.
    const allItems = expertiseClusters.flatMap((c) => c.items);
    expect(allItems).toContain("Market Mapping");
    expect(allItems).toContain("AI-Assisted Sourcing");
    expect(allItems).toContain("Human-Led Judgment");
  });
});

describe("expertise storm component contract", () => {
  test("is a client component sourcing pills from the shared data", () => {
    expect(src).toContain('"use client"');
    expect(src).toContain("expertiseAreas");
    expect(src).toContain("expertiseClusters");
  });

  test("desktop-only: gated by a matchMedia lg query, not css-only hiding", () => {
    expect(src).toContain("matchMedia");
    expect(src).toContain("(min-width: 1024px)");
  });

  test("drives one shared angle via a single rAF loop, cancelled on unmount", () => {
    expect(src).toContain("--storm-angle");
    expect(src).toContain("requestAnimationFrame");
    expect(src).toContain("cancelAnimationFrame");
  });

  test("respects reduced motion for the idle drift", () => {
    expect(src).toMatch(/prefers-reduced-motion|useHydrationSafeReducedMotion|reduce/);
  });

  test("is SSR-safe: deterministic jitter, no Math.random / Date.now in render", () => {
    expect(src).not.toContain("Math.random");
    expect(src).not.toContain("Date.now");
    expect(src).toContain("Math.sin");
  });

  test("renders a static clustered fallback for non-desktop viewports", () => {
    expect(src).toMatch(/expertiseClusters\.map/);
    expect(src).toContain("glass-chip");
  });

  test("pills translate but never rotate (labels stay upright)", () => {
    expect(src).not.toContain("rotate(");
  });
});

describe("expertise storm styling hooks", () => {
  const css = readFileSync(path.join(componentsDir, "..", "app", "globals.css"), "utf8");
  test("namespaced storm classes exist and use the trig placement", () => {
    expect(css).toContain(".expertise-storm");
    expect(css).toContain(".expertise-orbit-item");
    expect(css).toContain("--storm-angle");
    expect(css).toContain("cos(");
    expect(css).toContain("sin(");
  });

  test("the storm transform never rotates pills (labels stay upright)", () => {
    // The transform is authored in CSS, so guard it where it actually lives.
    const stormBlock = css.slice(css.indexOf(".expertise-storm"));
    expect(stormBlock).not.toContain("rotate(");
  });

  test("depth cue is transform/opacity only — no per-frame filter animation", () => {
    const stormBlock = css.slice(css.indexOf(".expertise-storm"));
    // filter:brightness() driven by the per-frame --d forces re-rasterization.
    expect(stormBlock).not.toMatch(/filter:\s*brightness/);
  });
});
