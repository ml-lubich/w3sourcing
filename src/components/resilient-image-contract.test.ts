import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const componentsDir = import.meta.dirname;

describe("resilient image contract", () => {
  const resilientImageSrc = readFileSync(path.join(componentsDir, "resilient-image.tsx"), "utf8");
  const headerSrc = readFileSync(path.join(componentsDir, "header.tsx"), "utf8");
  const heroSrc = readFileSync(path.join(componentsDir, "hero.tsx"), "utf8");
  const founderSrc = readFileSync(path.join(componentsDir, "founder-spotlight-card.tsx"), "utf8");

  test("keeps shimmer skeleton visible while an image is loading or failed", () => {
    expect(resilientImageSrc).toContain("data-image-skeleton");
    expect(resilientImageSrc).toContain("!currentStatus.isLoaded || currentStatus.hasFailed");
    expect(resilientImageSrc).toContain("setStatus({ src, isLoaded: false, hasFailed: true })");
    expect(resilientImageSrc).toContain("onError?.(event)");
  });

  test("uses the resilient wrapper for user-visible site images", () => {
    expect(headerSrc).toContain("<ResilientImage");
    expect(heroSrc).toContain("<ResilientImage");
    expect(founderSrc).toContain("<ResilientImage");
  });

  test("uses a theme-aware header wordmark", () => {
    expect(headerSrc).toContain('src="/images/logo_w3_sourcing_wordmark.png"');
    expect(headerSrc).toContain("dark:brightness-0 dark:invert");
  });
});
