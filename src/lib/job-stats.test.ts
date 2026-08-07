import { describe, expect, test } from "bun:test";

import { postedByMonth, summarise, tallyBy, tallyLocations } from "./job-stats";
import { roleIconKey } from "./role-icon";

const jobs = [
  { roleGroup: "Engineering", sector: "AI", workplace: "Remote", locations: "London, Berlin", postedDate: "2026-08-01", hot: true },
  { roleGroup: "Engineering", sector: "AI", workplace: "Hybrid", locations: "London", postedDate: "2026-08-02" },
  { roleGroup: "Legal", sector: "Law", workplace: "Hybrid", locations: "Singapore", postedDate: "2026-01-05" },
  { roleGroup: null, sector: null, workplace: null, locations: null, postedDate: null },
];

describe("tallyBy", () => {
  test("counts a field biggest-first and ignores blanks", () => {
    expect(tallyBy(jobs, "roleGroup")).toEqual([
      { label: "Engineering", count: 2 },
      { label: "Legal", count: 1 },
    ]);
  });

  test("folds everything past the limit into Other", () => {
    const many = ["a", "b", "c", "d"].map((sector) => ({ ...jobs[0], sector }));
    const tallies = tallyBy([...many, ...many.slice(0, 1)], "sector", 2);
    expect(tallies).toHaveLength(3);
    expect(tallies[2]).toEqual({ label: "Other", count: 2 });
  });
});

describe("tallyLocations", () => {
  test("counts a role once per city it lists", () => {
    expect(tallyLocations(jobs)).toEqual([
      { label: "London", count: 2 },
      { label: "Berlin", count: 1 },
      { label: "Singapore", count: 1 },
    ]);
  });
});

describe("postedByMonth", () => {
  const points = postedByMonth(jobs, 3, new Date("2026-08-15T00:00:00Z"));

  test("returns the trailing window in order, newest last", () => {
    expect(points.map((point) => point.month)).toEqual(["2026-06", "2026-07", "2026-08"]);
  });

  test("keeps empty months so the trend does not close a gap", () => {
    expect(points.map((point) => point.count)).toEqual([0, 0, 2]);
  });
});

describe("summarise", () => {
  const summary = summarise(jobs, new Date("2026-08-15T00:00:00Z"));

  test("counts roles, hot flags, and recent posts", () => {
    expect(summary.total).toBe(4);
    expect(summary.hot).toBe(1);
    expect(summary.addedLast30).toBe(2);
  });

  test("counts distinct sectors and cities", () => {
    expect(summary.sectors).toBe(2);
    expect(summary.locations).toBe(3);
  });
});

describe("roleIconKey", () => {
  test("reads the discipline from the role title", () => {
    expect(roleIconKey({ role: "Senior Frontend Engineer" })).toBe("engineering");
    expect(roleIconKey({ role: "Enterprise Account Executive" })).toBe("sales");
    expect(roleIconKey({ role: "Real Estate Litigation Partner" })).toBe("legal");
    expect(roleIconKey({ role: "Chief of Staff" })).toBe("executive");
    expect(roleIconKey({ role: "Data Scientist" })).toBe("data");
    expect(roleIconKey({ role: "Product Manager, Platform" })).toBe("product");
  });

  test("prefers the specific rule over the broad one", () => {
    // Both match "engineer"; the more precise discipline has to win.
    expect(roleIconKey({ role: "Senior Technical Support Engineer" })).toBe("support");
    expect(roleIconKey({ role: "Solutions Engineer" })).toBe("support");
    expect(roleIconKey({ role: "RL Research Engineer" })).toBe("research");
    expect(roleIconKey({ role: "Security Engineer" })).toBe("security");
  });

  test("falls back to role type, group, and sector when the title is bare", () => {
    expect(roleIconKey({ role: "Member of Technical Staff", sector: "Law" })).toBe("legal");
    expect(roleIconKey({ role: "Associate", roleGroup: "Finance" })).toBe("finance");
  });

  test("uses the generic briefcase when nothing matches", () => {
    expect(roleIconKey({ role: "Zookeeper" })).toBe("role");
  });
});
