import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const componentsDir = import.meta.dirname;

describe("stats outcomes contract", () => {
  const src = readFileSync(path.join(componentsDir, "stats.tsx"), "utf8");

  test("keeps the requested outcome metrics visible as final values", () => {
    expect(src).toContain('const outcomeStats = [');
    expect(src).toContain('{ value: 500, suffix: "+", label: "Placements delivered"');
    expect(src).toContain('{ value: 98, suffix: "%", label: "Client retention"');
    expect(src).toContain('{ value: 45, suffix: "+", label: "Countries covered"');
    expect(src).toContain('{ value: 7, suffix: " days", label: "Avg. time to signal"');
    expect(src).toContain("{value}");
    expect(src).toContain("initial={{ opacity: 1");
    expect(src).not.toContain("useState(0)");
    expect(src).not.toContain("setCount(0)");
  });
});