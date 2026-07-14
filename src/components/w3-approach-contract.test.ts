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
});

describe("homepage wires in both new sections", () => {
  const page = readFileSync(path.join(componentsDir, "..", "app", "page.tsx"), "utf8");
  test("W3Approach and ExpertiseStorm are rendered on the home page", () => {
    expect(page).toContain("W3Approach");
    expect(page).toContain("ExpertiseStorm");
  });
});
