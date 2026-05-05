import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const componentsDir = import.meta.dirname;

describe("why W3 visual contract", () => {
  const src = readFileSync(path.join(componentsDir, "why-w3.tsx"), "utf8");

  test("keeps photos and animated SVG art in separate section regions", () => {
    expect(src).toContain("<ResilientImage");
    expect(src).toContain('photoAlt: "Boardroom strategy meeting photo"');
    expect(src).toContain('photoAlt: "International business networking event photo"');
    expect(src).toContain('photoAlt: "Interview meeting photo with three professionals"');
    expect(src).toContain('photoAlt: "Professional conference conversation photo"');
    expect(src).toContain('className="people-photo-object object-cover"');
    expect(src).toContain("why-w3-art-rail");
    expect(src).not.toContain("why-card-art-panel");
    expect(src).toContain("<WhyW3AnimatedArt");
    expect(src).toContain('className="section-deco-art-svg--rail"');
    expect(src).not.toContain("section-card-icon-glow\" strokeWidth={2} aria-hidden />\n                </span>\n              </div>\n            </motion.li>");
    expect(src.indexOf("why-w3-art-rail")).toBeLessThan(src.indexOf("grid sm:grid-cols-2"));
  });

  test("keeps decorative rail SVGs visual instead of copy-bearing", () => {
    const artSrc = readFileSync(path.join(componentsDir, "section-animated-art.tsx"), "utf8");

    expect(artSrc).not.toContain("<text");
    expect(artSrc).not.toContain("Consultation");
    expect(artSrc).not.toContain("Confidentiality · fair");
  });
});