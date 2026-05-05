import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const componentsDir = import.meta.dirname;

describe("how it works photo contract", () => {
  const src = readFileSync(path.join(componentsDir, "how-it-works.tsx"), "utf8");

  test("keeps process photos readable and animated SVG art separate", () => {
    expect(src).toContain("process-art-rail");
    expect(src).toContain('className="section-deco-art-svg--rail"');
    expect(src).toContain('className="people-photo-object object-cover"');
    expect(src).toContain("relative h-44 overflow-hidden sm:h-48");
    expect(src).not.toContain("<StepArt variant={v} idSuffix={`${step.n}`} animate={inView && !reduced} />");
  });
});