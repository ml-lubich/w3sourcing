import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const componentsDir = import.meta.dirname;

describe("practice areas visual contract", () => {
  const src = readFileSync(path.join(componentsDir, "practice-areas.tsx"), "utf8");

  test("keeps recruitment photos and animated SVG art in separate section regions", () => {
    expect(src).toContain("<ResilientImage");
    expect(src).toContain('photoAlt: "Business team collaborating around a laptop"');
    expect(src).toContain('photoAlt: "Business event stage photo with Perry Barrow and partners"');
    expect(src).toContain('photoAlt: "Networking photo with Perry Barrow and guest in blue suit"');
    expect(src).toContain('className="people-photo-object object-cover"');
    expect(src).toContain("practice-area-art-rail");
    expect(src).not.toContain("practice-card-art-panel");
    expect(src).toContain("<PracticeAreaAnimatedArt");
    expect(src).toContain('className="section-deco-art-svg--rail"');
    expect(src.indexOf("practice-area-art-rail")).toBeLessThan(src.indexOf("grid md:grid-cols-3"));
  });

  test("keeps decorative rail SVGs unlabeled", () => {
    const artSrc = readFileSync(path.join(componentsDir, "section-animated-art.tsx"), "utf8");

    expect(artSrc).not.toContain("<text");
    expect(artSrc).not.toContain("mandate");
  });
});