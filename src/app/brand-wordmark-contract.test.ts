import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const appDir = import.meta.dirname;

describe("brand wordmark image routes", () => {
  const brandWordmarkSrc = readFileSync(path.join(appDir, "brand-wordmark.ts"), "utf8");
  const openGraphSrc = readFileSync(path.join(appDir, "opengraph-image.tsx"), "utf8");

  test("loads the canonical wordmark asset", () => {
    expect(brandWordmarkSrc).toContain("logo_w3_sourcing_wordmark.png");
    expect(openGraphSrc).toContain("loadBrandWordmarkDataUrl");
    expect(openGraphSrc).toContain("<img");
  });

  test("does not use the old generated text-only social brand treatment", () => {
    expect(openGraphSrc).not.toContain(">\n            W3 Sourcing\n          </div>");
  });
});
