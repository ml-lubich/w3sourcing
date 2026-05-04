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

  test("keeps marquee rows on disjoint company lists", () => {
    const topNames = extractCompanyField("topRowCompanies", "name");
    const bottomNames = extractCompanyField("bottomRowCompanies", "name");
    const topDomains = extractCompanyField("topRowCompanies", "domain");
    const bottomDomains = extractCompanyField("bottomRowCompanies", "domain");

    expect(topNames.length).toBeGreaterThan(0);
    expect(bottomNames.length).toBeGreaterThan(0);
    expect(new Set([...topNames, ...bottomNames]).size).toBe(topNames.length + bottomNames.length);
    expect(new Set([...topDomains, ...bottomDomains]).size).toBe(
      topDomains.length + bottomDomains.length,
    );
  });

  test("keeps the second marquee row moving in the opposite direction", () => {
    expect(src).toContain("function MarqueeTrack");
    expect(src).toContain('reverse ? "[animation-direction:reverse]" : ""');
    expect(src).toContain("companies={topRowCompanies}");
    expect(src).toContain("companies={bottomRowCompanies}");
    expect(src).toContain("reverse={false}");
    expect(src).toContain("reverse\n");
    expect(src).toContain('className="-translate-x-12"');
  });
});