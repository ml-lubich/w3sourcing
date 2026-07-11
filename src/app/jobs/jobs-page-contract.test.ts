import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const jobsDir = import.meta.dirname;
const appDir = path.join(jobsDir, "..");
const componentsDir = path.join(appDir, "..", "components");

describe("live jobs page contract", () => {
  test("/jobs page exists with metadata and renders the explorer", () => {
    const src = readFileSync(path.join(jobsDir, "page.tsx"), "utf8");
    expect(src).toContain("export const metadata");
    expect(src.toLowerCase()).toContain("live jobs");
    expect(src).toContain("JobsExplorer");
    expect(src).toContain("loadLiveJobs");
  });

  test("explorer is interactive: search, filters, incremental loading", () => {
    const src = readFileSync(path.join(componentsDir, "jobs-explorer.tsx"), "utf8");
    expect(src).toContain('"use client"');
    expect(src).toContain("filterJobs");
    expect(src).toContain('type="search"');
    expect(src).toContain("Load more");
  });

  test("every job card offers LinkedIn DM, prefilled email, and job description actions", () => {
    const src = readFileSync(path.join(componentsDir, "jobs-explorer.tsx"), "utf8");
    expect(src).toContain("PERRY_LINKEDIN_URL");
    expect(src).toContain("DM Perry on LinkedIn");
    expect(src).toContain("buildJobMailtoHref");
    expect(src).toContain("Email about this role");
    expect(src).toContain("View job description");
  });

  test("/jobs is in the sitemap", () => {
    const src = readFileSync(path.join(appDir, "sitemap.ts"), "utf8");
    expect(src).toContain("/jobs");
  });

  test("homepage hero, header, and footer link to the live jobs page", () => {
    for (const file of ["hero.tsx", "header.tsx", "footer.tsx"]) {
      const src = readFileSync(path.join(componentsDir, file), "utf8");
      expect(src).toContain('"/jobs"');
    }
    const hero = readFileSync(path.join(componentsDir, "hero.tsx"), "utf8");
    expect(hero).toContain("View current live jobs");
  });
});
