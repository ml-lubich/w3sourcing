import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const componentsDir = import.meta.dirname;

describe("feature tabs media contract", () => {
  const src = readFileSync(path.join(componentsDir, "feature-tabs.tsx"), "utf8");

  test("keeps all three feature workflow sections photo-backed", () => {
    expect(src).toContain('id: "source"');
    expect(src).toContain('photoSrc: "/images/perry_assets/13.png"');
    expect(src).toContain('photoAlt: "Executive sourcing conversation at a business event"');

    expect(src).toContain('id: "screen"');
    expect(src).toContain('photoSrc: "/images/perry_assets/4.png"');
    expect(src).toContain('photoAlt: "Recruitment assessment discussion in an office"');

    expect(src).toContain('id: "place"');
    expect(src).toContain('photoSrc: "/images/perry_assets/18.png"');
    expect(src).toContain('photoAlt: "Professional onboarding and client partnership photo"');
  });
});