import { describe, expect, test } from "bun:test";

import { jobsDigest } from "./jobs-digest";
import type { JobRow } from "./jobs-store";

function job(overrides: Partial<JobRow> = {}): JobRow {
  return {
    ref: `W3-${Math.random().toString(36).slice(2, 8)}`,
    hot: false,
    company: "Acme",
    role: "Backend Engineer",
    roleGroup: "Engineering - AI/ML",
    roleType: "Backend Engineer",
    sector: "AI",
    locations: "Singapore",
    workplace: "Hybrid",
    salary: null,
    yoe: null,
    techStack: null,
    visa: null,
    postedDate: "2026-01-01",
    link: "",
    website: null,
    oneLiner: null,
    multiHire: "No",
    hiringCount: "1",
    ...overrides,
  };
}

describe("jobsDigest", () => {
  test("reports the totals the assistant reasons over", () => {
    const digest = jobsDigest([job(), job({ hot: true }), job({ hot: true })]);
    expect(digest).toContain("Total roles: 3");
    expect(digest).toContain("Hot roles: 2");
  });

  test("ranks facet counts highest-first and skips blanks", () => {
    const digest = jobsDigest([
      job({ sector: "AI" }),
      job({ sector: "AI" }),
      job({ sector: "AI" }),
      job({ sector: "Fintech" }),
      job({ sector: null }),
    ]);
    expect(digest).toContain("AI 3");
    expect(digest.indexOf("AI 3")).toBeLessThan(digest.indexOf("Fintech 1"));
    expect(digest).not.toContain("null");
  });

  test("lists the newest roles first and caps the sample", () => {
    const rows = Array.from({ length: 30 }, (_, i) =>
      job({ role: `Role ${i}`, postedDate: `2026-01-${String(i + 1).padStart(2, "0")}` }),
    );
    const digest = jobsDigest(rows, 5);
    expect(digest).toContain("Role 29");
    expect(digest).not.toContain("Role 0 ");
    expect(digest.indexOf("Role 29")).toBeLessThan(digest.indexOf("Role 28"));
  });

  test("marks hot roles in the sample so the model can cite them", () => {
    expect(jobsDigest([job({ role: "Hot one", hot: true })])).toContain("[HOT]");
  });

  test("stays small enough to send on every question", () => {
    const rows = Array.from({ length: 1000 }, (_, i) => job({ role: `Role ${i}` }));
    expect(jobsDigest(rows).length).toBeLessThan(12000);
  });
});
