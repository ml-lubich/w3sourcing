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
    expect(src).toContain('title: "Jobs"');
    expect(src).toMatch(/>\s*Jobs\s*</);
    expect(src).toContain("JobsExplorer");
    expect(src).toContain("loadLiveJobs");
    expect(src).not.toContain("open mandates, refreshed from our live pipeline");
  });

  test("explorer uses branded custom listbox filters instead of native selects", () => {
    const src = readFileSync(path.join(componentsDir, "jobs-explorer.tsx"), "utf8");
    expect(src).toContain('"use client"');
    expect(src).toContain("filterJobs");
    expect(src).toContain('type="search"');
    expect(src).not.toContain("<select");
    expect(src).toContain('aria-haspopup="listbox"');
    expect(src).toContain('role="listbox"');
    expect(src).toContain('role="option"');
  });

  test("explorer offers sector and visa filters in addition to role group and workplace", () => {
    const src = readFileSync(path.join(componentsDir, "jobs-explorer.tsx"), "utf8");
    expect(src).toContain("setRoleGroup");
    expect(src).toContain("setWorkplace");
    expect(src).toContain("setSector");
    expect(src).toContain("setVisa");
    expect(src).toContain("sector: sector || undefined");
    expect(src).toContain("visa: visa || undefined");
  });

  test("more jobs load from an intersection sentinel without pagination controls", () => {
    const src = readFileSync(path.join(componentsDir, "jobs-explorer.tsx"), "utf8");
    expect(src).toContain("IntersectionObserver");
    expect(src).toContain("loadMoreRef");
    expect(src).not.toContain("Load more");
  });

  test("incremental loading renders accessible shimmer card placeholders", () => {
    const src = readFileSync(path.join(componentsDir, "jobs-explorer.tsx"), "utf8");
    expect(src).toContain("isLoadingMore");
    expect(src).toContain("animate-pulse");
    expect(src).toContain('aria-hidden="true"');
  });

  test("job cards copy their permalink straight to the clipboard, with no share sheet", () => {
    const src = readFileSync(path.join(componentsDir, "jobs-explorer.tsx"), "utf8");
    expect(src).toContain("navigator.clipboard.writeText");
    expect(src).toContain("jobPermalink");
    expect(src).toContain("Copy link");
    expect(src).toContain("Link copied");
    expect(src).toContain("job.ref");
    // The OS share sheet put a dialog between the reader and the link they wanted.
    expect(src).not.toContain("navigator.share");
  });

  test("job cards carry a per-discipline icon and a pointer-driven 3D tilt", () => {
    const src = readFileSync(path.join(componentsDir, "jobs-explorer.tsx"), "utf8");
    expect(src).toContain("RoleIcon");
    expect(src).toContain("data-tilt-card");
    expect(src).toContain("jobs-card-3d");
    // One delegated handler on the grid, not a spring per card.
    expect(src).toContain("tiltCardUnderPointer");
    expect(src).not.toContain("usePointerTilt3d");
  });

  test("every job card offers LinkedIn DM and prefilled email as the contact actions", () => {
    const src = readFileSync(path.join(componentsDir, "jobs-explorer.tsx"), "utf8");
    expect(src).toContain("PERRY_LINKEDIN_URL");
    expect(src).toContain("DM Perry on LinkedIn");
    expect(src).toContain("buildJobMailtoHref");
    expect(src).toContain("Email about this role");
    expect(src).toContain("For further details, contact Perry");
  });

  test("job cards expose no client identifiers (company, website, or Paraform link)", () => {
    const src = readFileSync(path.join(componentsDir, "jobs-explorer.tsx"), "utf8");
    expect(src).not.toContain("job.company");
    expect(src).not.toContain("job.website");
    expect(src).not.toContain("job.link");
    expect(src).not.toContain("job.oneLiner");
  });

  test("job cards do not render posted-date pills", () => {
    const src = readFileSync(path.join(componentsDir, "jobs-explorer.tsx"), "utf8");
    expect(src).not.toContain("formatPostedDate");
    expect(src).not.toContain("job.postedDate");
  });

  // `.glass-panel > *` in globals.css sets position:relative and z-index:1 on every direct
  // child, and outranks Tailwind utilities in the cascade. Both guards below broke the page.
  test("the card glow decoration is nested, not a direct child of the glass panel", () => {
    const src = readFileSync(path.join(componentsDir, "jobs-explorer.tsx"), "utf8");
    expect(src.indexOf("blur-3xl")).toBeGreaterThan(
      src.indexOf("relative flex h-full flex-col"),
    );
  });

  test("the filter grid carries an inline z-index so open popovers stay on top", () => {
    const src = readFileSync(path.join(componentsDir, "jobs-explorer.tsx"), "utf8");
    expect(src).toContain("style={{ zIndex: 30 }}");
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

    const header = readFileSync(path.join(componentsDir, "header.tsx"), "utf8");
    expect(header).not.toContain("Live Jobs");
    expect(header.match(/>\s*Jobs\s*</g)).toHaveLength(2);
  });
});
