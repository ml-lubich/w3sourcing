import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const src = readFileSync(path.join(import.meta.dirname, "header.tsx"), "utf8");

/**
 * The desktop nav used to appear at `md` (768px). Nine links plus the theme
 * toggle and a wide CTA do not fit until ~1280px, so between those widths the
 * link row clipped mid-word ("Co…" for Compare) and ran under the toggle.
 */
describe("header breakpoint contract (no clipped nav row)", () => {
  test("nav, CTA, hamburger, and sheet all switch at xl, not md", () => {
    expect(src).toContain("hidden xl:flex");
    expect(src).toContain("hidden xl:inline-flex");
    expect(src.match(/xl:hidden/g)).toHaveLength(2);
  });

  test("no md-based visibility toggle remains in the header chrome", () => {
    expect(src).not.toContain("md:hidden");
    expect(src).not.toContain("hidden md:flex");
    expect(src).not.toContain("hidden md:inline-flex");
  });

  test("the desktop CTA uses the compact label so the row has room", () => {
    expect(src).toContain("DM us on LinkedIn");
  });
});
