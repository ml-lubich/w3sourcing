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
      expect(job.company).toBeTruthy();
      expect(job.role).toBeTruthy();
      expect(job.link).toStartWith("https://paraform.com/");
    }
  });

  test("company websites are absolute URLs (bare hosts in the export are normalized)", () => {
    for (const job of jobs) {
      if (job.website) {
        expect(job.website).toMatch(/^https?:\/\//);
      }
    }
  });

  test("is sorted newest-first by posted date", () => {
    const dated = jobs.filter((j) => j.postedDate);
    for (let i = 1; i < dated.length; i++) {
      expect(dated[i - 1].postedDate! >= dated[i].postedDate!).toBe(true);
    }
  });

  test("contains no candidate PII and no recruiter fee/reward data (public site)", () => {
    const allowedKeys = new Set([
      "company",
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
      "link",
      "website",
      "oneLiner",
      "multiHire",
      "hiringCount",
    ]);
    for (const job of jobs) {
      for (const key of Object.keys(job)) {
        expect(allowedKeys.has(key)).toBe(true);
      }
    }
    const raw = JSON.stringify(jobs);
    expect(raw).not.toMatch(/total fee/i);
    expect(raw).not.toMatch(/% first year/i);
    expect(raw).not.toMatch(/talent density/i);
    expect(raw).not.toMatch(/response likelihood/i);
  });
});

describe("filterJobs", () => {
  const sample: LiveJob[] = [
    {
      company: "Traba",
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
      link: "https://paraform.com/company/traba",
      website: "http://www.traba.work",
      oneLiner: "Industrial labor marketplace",
      multiHire: "Yes",
      hiringCount: "1 - 2",
    },
    {
      company: "Nuance Labs",
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
      link: "https://paraform.com/company/nuance-labs",
      website: "https://nuancelabs.ai/",
      oneLiner: "Face-to-face AI interaction",
      multiHire: "No",
      hiringCount: "1",
    },
  ];

  test("matches job titles case-insensitively", () => {
    expect(filterJobs(sample, { query: "research engineer" })).toHaveLength(1);
    expect(filterJobs(sample, { query: "research engineer" })[0].company).toBe("Nuance Labs");
  });

  test("matches company, tech stack, and location", () => {
    expect(filterJobs(sample, { query: "traba" })).toHaveLength(1);
    expect(filterJobs(sample, { query: "pytorch" })[0].company).toBe("Nuance Labs");
    expect(filterJobs(sample, { query: "seattle" })).toHaveLength(1);
  });

  test("applies role-group and workplace filters, empty query browses all", () => {
    expect(filterJobs(sample, {})).toHaveLength(2);
    expect(filterJobs(sample, { roleGroup: "Engineering - AI/ML" })).toHaveLength(2);
    expect(filterJobs(sample, { workplace: "Remote" })).toHaveLength(0);
  });
});

describe("buildJobMailtoHref", () => {
  const job = {
    company: "Traba",
    role: "Product Engineer (Senior/Staff)",
  } as LiveJob;

  test("targets Perry with a prefilled auto-message naming role and company", () => {
    const href = buildJobMailtoHref(job);
    expect(href).toStartWith(`mailto:${PERRY_EMAIL}?`);
    const url = new URL(href);
    const params = new URLSearchParams(url.search.slice(1) || href.split("?")[1]);
    const subject = decodeURIComponent(href.match(/subject=([^&]*)/)?.[1] ?? "");
    const body = decodeURIComponent(href.match(/body=([^&]*)/)?.[1] ?? "");
    expect(subject).toContain("Product Engineer (Senior/Staff)");
    expect(subject).toContain("Traba");
    expect(body).toContain("Traba");
    expect(params.toString().length).toBeGreaterThan(0);
  });
});
