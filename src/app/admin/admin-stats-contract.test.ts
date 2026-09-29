import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

describe("admin dashboard chart contract", () => {
  const src = readFileSync(path.join(import.meta.dirname, "admin-stats.tsx"), "utf8");

  test("keeps category labels on one line and sizes the chart from the row count", () => {
    expect(src).toContain("truncateAxisLabel(full, AXIS_LABEL_CHARS)");
    expect(src).toContain("rankedChartHeight(byRoleGroup.length)");
    expect(src).toContain("rankedChartHeight(bySector.length)");
    expect(src).toContain("rankedChartHeight(byLocation.length)");
    expect(src).toContain("interval={0}");
    expect(src).toContain("<title>{full}</title>");
    expect(src).not.toContain("h-64");
  });
});
