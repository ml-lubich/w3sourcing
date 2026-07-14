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
