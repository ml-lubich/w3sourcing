import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const componentsDir = import.meta.dirname;
const src = readFileSync(path.join(componentsDir, "w3-approach.tsx"), "utf8");

describe("W3 approach narrative contract", () => {
  test("is a client component", () => {
    expect(src).toContain('"use client"');
  });

  test("opens on the misconception hook", () => {
    expect(src.toLowerCase()).toContain("what most people get wrong");
  });

  test("frames the story as myth vs reality across multiple beats", () => {
    expect(src).toContain("myth");
    expect(src).toContain("reality");
    // A beats/chapters array drives the narrative.
    expect(src).toMatch(/const (beats|chapters|story)\b/);
  });

  test("carries the AI-leveraged-yet-human-led thesis in concrete terms", () => {
    const lower = src.toLowerCase();
    expect(lower).toContain("market mapping");
    expect(lower).toMatch(/judgment|judgement/);
    expect(lower).toContain("accountab");
  });

  test("reuses the site's motion + reveal primitives", () => {
    expect(src).toMatch(/ScrollReveal|SplitWords|framer-motion/);
  });

  test("ends on the established CTA pattern (LinkedIn + live jobs)", () => {
    expect(src).toContain("PERRY_LINKEDIN_URL");
    expect(src).toContain('"/jobs"');
  });

  test("the chapter spine is scroll-driven", () => {
    expect(src).toContain("useScroll");
    expect(src).toContain("spineScaleY");
  });

  test("nodes sit above the drawn line (opaque backing + z-order)", () => {
    // The icon/number rail is lifted above the absolute spine…
    expect(src).toMatch(/relative z-10 flex items-center gap-4/);
    // …and each node carries an opaque backing so the line threads *behind*
    // it instead of showing through the translucent glass or bisecting text.
    expect(src).toContain("bg-background");
    // Per-beat connectors only show on mobile; the spine owns md+.
    expect(src).toContain("md:hidden");
  });
});

describe("homepage wires in both new sections", () => {
  const page = readFileSync(path.join(componentsDir, "..", "app", "page.tsx"), "utf8");
  test("W3Approach and ExpertiseStorm are rendered on the home page", () => {
    expect(page).toContain("W3Approach");
    expect(page).toContain("ExpertiseStorm");
  });
});
