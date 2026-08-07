import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

import { areaCluster, expertiseAreas, expertiseClusters } from "@/content/expertise-areas";

import { keepOutOfTitleBand } from "./expertise-storm";

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

/* ── 2026-08-07 map overhaul: density, keep-out band, click-to-open panel ── */

describe("W3 map layout", () => {
  test("pushes a pill out of the centre band instead of parking it on the edge", () => {
    // Clamping to the band edge parked a whole tier on one line, where the
    // pills then overlapped each other on the way past.
    const a = keepOutOfTitleBand(10, -120);
    const b = keepOutOfTitleBand(40, -120);
    expect(Math.abs(a)).toBeGreaterThanOrEqual(92);
    expect(Math.abs(b)).toBeGreaterThanOrEqual(92);
    expect(a).not.toBe(b);
  });

  test("reflects toward its own tier's side of the title", () => {
    expect(keepOutOfTitleBand(20, -120)).toBeLessThan(0);
    expect(keepOutOfTitleBand(-20, 120)).toBeGreaterThan(0);
  });

  test("leaves an offset that already clears the band alone", () => {
    expect(keepOutOfTitleBand(-180, -120)).toBe(-180);
  });
});

describe("W3 map density and panel content", () => {
  test("carries enough areas to read as a dense field", () => {
    expect(expertiseAreas.length).toBeGreaterThanOrEqual(60);
  });

  test("every area resolves to the cluster its panel names", () => {
    for (const area of expertiseAreas) {
      expect(areaCluster.get(area)).toBeDefined();
    }
    expect(areaCluster.get("Litigation")?.label).toBe("Legal");
  });

  test("clusters stay non-empty so a panel always has siblings to offer", () => {
    for (const cluster of expertiseClusters) {
      expect(cluster.items.length).toBeGreaterThan(1);
    }
  });
});

describe("W3 map interaction contract", () => {
  test("pills are real buttons that open a panel, not decoration", () => {
    expect(src).toContain("openPill");
    expect(src).toContain('role="dialog"');
    // The field freezes while a panel is open so the panel stays on its pill.
    expect(src).toContain("pausedRef.current = open !== null");
  });

  test("the panel closes on Escape and on a press outside it", () => {
    expect(src).toContain('event.key === "Escape"');
    expect(src).toContain("setOpen(null)");
    expect(src).toContain("event.stopPropagation()");
  });

  test("the panel is opaque, not the frosted panel used elsewhere", () => {
    const css = readFileSync(
      path.join(componentsDir, "..", "app", "globals.css"),
      "utf8",
    );
    expect(src).not.toContain("expertise-panel glass-panel");
    expect(css).toContain(".expertise-panel");
    expect(css).toContain("background-color: var(--surface)");
  });
});
