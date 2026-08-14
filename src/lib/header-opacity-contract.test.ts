import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const globalsSrc = readFileSync(path.join(repoRoot, "src", "app", "globals.css"), "utf8");

/** The `[data-at-top]` block only — the scrolled bar keeps its own rules. */
const barBlock = globalsSrc.slice(
  globalsSrc.indexOf(".header-bar[data-at-top] {"),
  globalsSrc.indexOf(".header-bar > * {"),
);

describe("header bar contract", () => {
  test("carries nothing at all over the hero film", () => {
    // Any tint here reads as a dark band across the top of the footage.
    expect(barBlock).toContain("--header-glass: 0");
    expect(barBlock).toContain(".header-bar[data-at-top]::before");
    expect(barBlock).toMatch(/\.header-bar\[data-at-top\]::before \{\s*opacity: 0;/);
  });

  test("becomes the blue gradient bar once scrolled past the hero", () => {
    expect(barBlock).toContain(".header-bar:not([data-at-top])::before");
    expect(barBlock).toContain("linear-gradient");
    expect(barBlock).toContain("var(--accent)");
  });

  test("keeps its chrome white on the blue bar and over the film", () => {
    expect(barBlock).toContain(".header-bar:not([data-at-top]) .header-wordmark");
    expect(barBlock).toContain(".header-bar[data-at-top] .header-wordmark");
  });

  test("never paints the bar's white onto the open mobile menu", () => {
    // The menu is a solid surface of its own; white on it is invisible in light.
    expect(barBlock).toContain(".header-bar .header-mobile-menu .nav-link-section");
  });
});
