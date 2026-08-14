import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const globalsSrc = readFileSync(path.join(repoRoot, "src", "app", "globals.css"), "utf8");

/** The `[data-at-top]` block only — the scrolled bar keeps its own rules. */
const atTopBlock = globalsSrc.slice(
  globalsSrc.indexOf(".header-bar[data-at-top] {"),
  globalsSrc.indexOf(".header-bar > * {"),
);

describe("header opacity contract", () => {
  test("stays frosted once the page scrolls off the hero", () => {
    expect(globalsSrc).toContain("--header-glass: 1");
    expect(globalsSrc).toContain("backdrop-filter: blur(22px)");
  });

  test("goes fully transparent over the hero film instead", () => {
    // Glass over moving footage reads as a smear; the accent wash carries the
    // bar there and the frosted treatment returns on scroll.
    expect(atTopBlock).toContain("--header-glass: 0");
    expect(atTopBlock).toContain("backdrop-filter: none");
    expect(atTopBlock).toContain("var(--accent)");
  });

  test("keeps the wordmark and links readable on the film", () => {
    expect(atTopBlock).toContain(".header-bar[data-at-top] .header-wordmark");
    expect(atTopBlock).toContain(".header-bar[data-at-top] .nav-link-section");
  });
});
