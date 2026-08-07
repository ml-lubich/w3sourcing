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
  test("separates the groups after the brand with vertical rules on desktop only", () => {
    // Three link columns (built from one shared component) plus Offices.
    expect(src.match(/md:border-l/g)).toHaveLength(2);
    expect(src).not.toContain("\nborder-l");
  });

  test("builds every link column from one component so the headings share a baseline", () => {
    // The old layout hand-rolled each column, and a 10-link Company list next
    // to a 3-link Practices list left the rules running past empty space.
    expect(src).toContain("function FooterColumn");
    expect(src.match(/<FooterColumn/g)).toHaveLength(3);
    expect(src).not.toContain("md:grid-rows-5 md:grid-flow-col");
  });

  test("spans the twelve-column grid exactly once", () => {
    // brand 3 + three link columns at 2 + offices 3.
    expect(src).toContain("md:col-span-3");
    expect(src).toContain("md:col-span-2 md:border-l");
  });

  test("keeps the office addresses side by side until the column narrows", () => {
    expect(src).toContain("sm:grid-cols-2 md:grid-cols-1");
    expect(src).not.toContain("space-y-4 text-sm text-text-secondary");
  });

  test("opens on the contact band, above every reference column", () => {
    expect(src.indexOf("Start a conversation")).toBeLessThan(src.indexOf('text="Offices"'));
    expect(src.indexOf("View current live jobs")).toBeLessThan(src.indexOf('text="Offices"'));
  });

  test("keeps a single LinkedIn social icon, not an orphaned duplicate", () => {
    expect(src.match(/aria-label="LinkedIn — Perry Barrow"/g)).toHaveLength(1);
  });
});
