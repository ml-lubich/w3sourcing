import { describe, expect, test } from "bun:test";

import { PERRY_EMAIL } from "@/content/contact-links";
import {
  buildJobMailtoHref,
  filterJobs,
  loadLiveJobs,
  type LiveJob,
} from "./jobs";

describe("live jobs dataset", () => {
  const jobs = loadLiveJobs();

  test("serves the full Paraform roles export", () => {
    expect(jobs.length).toBeGreaterThan(900);
  });

  test("every job has the fields the cards depend on", () => {
    for (const job of jobs) {
      expect(job.ref).toStartWith("W3-");
      expect(job.role).toBeTruthy();
    }
  });

  test("W3 reference numbers are unique", () => {
    const refs = jobs.map((j) => j.ref);
    expect(new Set(refs).size).toBe(refs.length);
  });

  test("is sorted newest-first by posted date", () => {
    const dated = jobs.filter((j) => j.postedDate);
    for (let i = 1; i < dated.length; i++) {
      expect(dated[i - 1].postedDate! >= dated[i].postedDate!).toBe(true);
    }
  });

  test("only masked, public-safe fields are exposed (no client identifiers)", () => {
    const allowedKeys = new Set([
      "ref",
      "role",
      "roleGroup",
      "roleType",
      "sector",
      "locations",
      "workplace",
      "salary",
      "yoe",
      "techStack",
      "visa",
      "postedDate",
      "multiHire",
      "hiringCount",
    ]);
    for (const job of jobs) {
      for (const key of Object.keys(job)) {
        expect(allowedKeys.has(key)).toBe(true);
      }
    }
  });

  test("payload leaks no client identifiers, Paraform refs, or fee data", () => {
    const raw = JSON.stringify(jobs);
    // Client name / website / Paraform source are stripped server-side.
    expect(raw).not.toMatch(/paraform/i);
    expect(raw).not.toMatch(/https?:\/\//i);
    // Free-text visa notes (which can name the client) are reduced to status only.
    expect(raw).not.toMatch(/sponsor/i);
    // Recruiter economics never belong on the public site.
    expect(raw).not.toMatch(/total fee/i);
    expect(raw).not.toMatch(/% first year/i);
    expect(raw).not.toMatch(/talent density/i);
    expect(raw).not.toMatch(/response likelihood/i);
  });

  test("visa is reduced to availability status only", () => {
    for (const job of jobs) {
      if (job.visa) {
        expect(job.visa).not.toContain("(");
      }
    }
  });
});

const sample: LiveJob[] = [
  {
    ref: "W3-AAAAAA",
    role: "Product Engineer (Senior/Staff)",
    roleGroup: "Engineering - AI/ML",
    roleType: "Product Engineer",
    sector: "AI",
    locations: "San Francisco, New York",
    workplace: "On-site",
    salary: "$200K - $300K",
    yoe: "5 - 10 years",
    techStack: "TypeScript, React, Python",
    visa: null,
    postedDate: "2026-06-23",
    multiHire: "Yes",
    hiringCount: "1 - 2",
  },
  {
    ref: "W3-BBBBBB",
    role: "RL Research Engineer",
    roleGroup: "Engineering - AI/ML",
    roleType: "Research Engineer",
    sector: "Software Development",
    locations: "Seattle",
    workplace: "On-site",
    salary: "$250K - $350K",
    yoe: "0 - 2 years",
    techStack: "Python, PyTorch",
    visa: "Available",
    postedDate: "2026-06-25",
    multiHire: "No",
    hiringCount: "1",
  },
];

describe("filterJobs", () => {
  test("matches job titles case-insensitively", () => {
    expect(filterJobs(sample, { query: "research engineer" })).toHaveLength(1);
    expect(filterJobs(sample, { query: "research engineer" })[0].ref).toBe("W3-BBBBBB");
  });

  test("matches ref, tech stack, and location", () => {
    expect(filterJobs(sample, { query: "w3-bbbbbb" })).toHaveLength(1);
    expect(filterJobs(sample, { query: "pytorch" })[0].ref).toBe("W3-BBBBBB");
    expect(filterJobs(sample, { query: "seattle" })).toHaveLength(1);
  });

  test("applies role-group and workplace filters, empty query browses all", () => {
    expect(filterJobs(sample, {})).toHaveLength(2);
    expect(filterJobs(sample, { roleGroup: "Engineering - AI/ML" })).toHaveLength(2);
    expect(filterJobs(sample, { workplace: "Remote" })).toHaveLength(0);
  });
});

describe("buildJobMailtoHref", () => {
  test("targets Perry with a prefilled auto-message naming role and W3 ref", () => {
    const href = buildJobMailtoHref(sample[0]);
    expect(href).toStartWith(`mailto:${PERRY_EMAIL}?`);
    const subject = decodeURIComponent(href.match(/subject=([^&]*)/)?.[1] ?? "");
    const body = decodeURIComponent(href.match(/body=([^&]*)/)?.[1] ?? "");
    expect(subject).toContain("Product Engineer (Senior/Staff)");
    expect(subject).toContain("W3-AAAAAA");
    expect(body).toContain("W3-AAAAAA");
  });
});
