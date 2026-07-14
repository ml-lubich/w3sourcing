import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const componentsDir = import.meta.dirname;

describe("trusted-by visual contract", () => {
  const src = readFileSync(path.join(componentsDir, "trusted-by.tsx"), "utf8");

  function extractCompanyField(arrayName: string, fieldName: "name" | "domain"): string[] {
    const match = src.match(new RegExp(`const ${arrayName}: readonly CompanyEntry\\[] = \\[([\\s\\S]*?)\\];`));
    expect(match?.[1]).toBeDefined();

    const arrayBody = match?.[1] ?? "";
    return [...arrayBody.matchAll(new RegExp(`${fieldName}: "([^"]+)"`, "g"))].map(
      (fieldMatch) => fieldMatch[1],
    );
  }

  test("keeps company icon tiles borderless", () => {
    expect(src).toContain("function CompanyIcon");
    expect(src).not.toContain("border-gray-border/70");
    expect(src).not.toContain("dark:border-white/10");
    expect(src).not.toContain("shadow-[0_8px_20px_rgb(15_23_42_/_0.07)]");
    expect(src).not.toContain("bg-white/78");
    expect(src).not.toContain("dark:bg-white/[0.06]");
  });

  test("keeps all four marquee rows on disjoint company lists", () => {
    const arrays = [
      "topRowCompanies",
      "bottomRowCompanies",
      "thirdRowCompanies",
      "fourthRowCompanies",
    ];
    const allNames = arrays.flatMap((a) => extractCompanyField(a, "name"));
    const allDomains = arrays.flatMap((a) => extractCompanyField(a, "domain"));

    for (const a of arrays) {
      expect(extractCompanyField(a, "name").length).toBeGreaterThan(0);
    }
    // No company or domain repeats across the four rows.
    expect(new Set(allNames).size).toBe(allNames.length);
    expect(new Set(allDomains).size).toBe(allDomains.length);
  });

  test("renders four rows, all scrolling right-to-left", () => {
    expect(src).toContain("function MarqueeTrack");
    // Four rows wired through the marqueeRows config.
    const rowKeys = [...src.matchAll(/copyKey: "trusted-row-\d"/g)];
    expect(rowKeys.length).toBe(4);
    // Every row scrolls the same direction (right-to-left = reverse={false});
    // no row opts into the reversed animation direction.
    expect(src).toContain("reverse={false}");
    expect(src).not.toMatch(/<MarqueeTrack[\s\S]*?\breverse\b(?!=\{false\})/);
  });
});