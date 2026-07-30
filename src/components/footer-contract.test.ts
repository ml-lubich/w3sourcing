import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const src = readFileSync(path.join(import.meta.dirname, "footer.tsx"), "utf8");

describe("footer spacing contract (tight vertical rhythm)", () => {
  test("uses a compact outer padding, not the airy py-16/py-20", () => {
    expect(src).toContain("py-12 md:py-14");
    expect(src).not.toContain("py-16 md:py-20");
  });

  test("pulls the bottom bar closer to the columns", () => {
    // Was mt-16 pt-8 — a large blank band above the copyright row.
    expect(src).toContain("mt-10 pt-6");
    expect(src).not.toContain("mt-16 pt-8");
  });

  test("keeps the credit line tight to the bar", () => {
    expect(src).toContain('className="mt-4 text-center"');
    expect(src).not.toContain('className="mt-6 text-center"');
  });
});

describe("footer column contract (even columns, no dead space)", () => {
  test("separates the four groups with vertical rules on desktop only", () => {
    expect(src.match(/md:border-l/g)).toHaveLength(3);
    expect(src).not.toContain("\nborder-l");
  });

  test("splits the long Company list into two sub-columns", () => {
    expect(src).toContain("md:grid-rows-5 md:grid-flow-col");
  });

  test("sets the office addresses side by side instead of stacked", () => {
    expect(src).toContain("sm:grid-cols-2");
    expect(src).not.toContain("space-y-4 text-sm text-text-secondary");
  });

  test("files the contact CTAs in the brand column, not under the Offices heading", () => {
    expect(src.indexOf("View current live jobs")).toBeLessThan(src.indexOf('text="Offices"'));
  });

  test("keeps a single LinkedIn social icon, not an orphaned duplicate", () => {
    expect(src.match(/aria-label="LinkedIn — Perry Barrow"/g)).toHaveLength(1);
  });
});
