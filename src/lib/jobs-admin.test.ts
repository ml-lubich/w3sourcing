import { afterEach, describe, expect, test } from "bun:test";

import { isValidPassword, isValidSession, sessionToken } from "./admin-auth";
import { maskJobs, toRef, type RawJob } from "./jobs";
import { jobsFromCsv, parseCsv, toIsoDate } from "./jobs-csv";

function rawJob(overrides: Partial<RawJob> = {}): RawJob {
  return {
    company: "Acme",
    role: "Backend Engineer",
    roleGroup: null,
    roleType: null,
    sector: null,
    locations: "Singapore",
    workplace: null,
    salary: null,
    yoe: null,
    techStack: null,
    visa: "Available (Acme sponsors from day one)",
    postedDate: "2026-01-01",
    link: "https://paraform.com/company/acme/abc123456",
    website: "https://acme.com",
    oneLiner: "We do things",
    multiHire: "No",
    hiringCount: "1",
    ...overrides,
  };
}

describe("maskJobs", () => {
  test("floats hot roles above newer non-hot ones", () => {
    const masked = maskJobs([
      rawJob({ role: "Newest", postedDate: "2026-08-01" }),
      rawJob({ role: "Hot but older", postedDate: "2026-02-01", hot: true, link: "x/2" }),
    ]);
    expect(masked.map((job) => job.role)).toEqual(["Hot but older", "Newest"]);
  });

  test("keeps client identifiers out of the public shape", () => {
    const [masked] = maskJobs([rawJob()]);
    const keys = Object.keys(masked);
    expect(keys).not.toContain("company");
    expect(keys).not.toContain("website");
    expect(keys).not.toContain("link");
    expect(keys).not.toContain("oneLiner");
    // Free-text visa notes can name the client, so only the status survives.
    expect(masked.visa).toBe("Available");
  });

  test("derives the reference from the ATS link, or takes a stored one", () => {
    expect(maskJobs([rawJob()])[0].ref).toBe(toRef("https://paraform.com/company/acme/abc123456"));
    expect(maskJobs([rawJob({ ref: "W3-MANUAL" })])[0].ref).toBe("W3-MANUAL");
  });

  test("defaults hot to false rather than undefined", () => {
    expect(maskJobs([rawJob()])[0].hot).toBe(false);
  });
});

describe("parseCsv", () => {
  test("handles quoted commas, escaped quotes, and CRLF", () => {
    const rows = parseCsv('role,techStack\r\n"Engineer, Senior","Go, ""Rust"""\r\n');
    expect(rows).toEqual([
      ["role", "techStack"],
      ["Engineer, Senior", 'Go, "Rust"'],
    ]);
  });

  test("drops blank lines", () => {
    expect(parseCsv("role\nEngineer\n\n\n")).toEqual([["role"], ["Engineer"]]);
  });
});

describe("toIsoDate", () => {
  test("passes ISO through and reads day-first dates", () => {
    expect(toIsoDate("2026-06-25")).toBe("2026-06-25");
    expect(toIsoDate("25/06/2026")).toBe("2026-06-25");
    expect(toIsoDate("06/25/2026")).toBe("2026-06-25");
  });

  test("returns null for gibberish so the row can be reported", () => {
    expect(toIsoDate("next tuesday-ish")).toBeNull();
  });
});

describe("jobsFromCsv", () => {
  test("matches headers by alias and leaves every other column optional", () => {
    const result = jobsFromCsv("Job Title,Location,Comp\nStaff Engineer,London,£120k");
    expect(result.errors).toEqual([]);
    expect(result.jobs).toHaveLength(1);
    expect(result.jobs[0].role).toBe("Staff Engineer");
    expect(result.jobs[0].locations).toBe("London");
    expect(result.jobs[0].salary).toBe("£120k");
    expect(result.jobs[0].sector).toBeNull();
    expect(result.jobs[0].ref).toStartWith("W3-");
  });

  test("reads the hot flag and reports unknown columns", () => {
    const result = jobsFromCsv("role,hot,mood\nHead of AI,yes,chirpy");
    expect(result.jobs[0].hot).toBe(true);
    expect(result.ignoredColumns).toEqual(["mood"]);
  });

  test("skips rows with no role and reports the line number", () => {
    const result = jobsFromCsv("role,locations\n,Berlin\nCTO,Berlin");
    expect(result.jobs).toHaveLength(1);
    expect(result.errors[0]).toContain("Line 2");
  });

  test("rejects the row rather than guessing an unreadable date", () => {
    const result = jobsFromCsv("role,posted\nCTO,someday");
    expect(result.jobs).toHaveLength(0);
    expect(result.errors[0]).toContain("YYYY-MM-DD");
  });

  test("gives rows sharing an ATS link the same ref, so re-imports update in place", () => {
    const link = "https://paraform.com/company/acme/abc123456";
    const first = jobsFromCsv(`role,link\nBackend Engineer,${link}`);
    const second = jobsFromCsv(`role,link\nBackend Engineer (updated),${link}`);
    expect(first.jobs[0].ref).toBe(second.jobs[0].ref);
  });

  test("fails loudly when there is no role column at all", () => {
    const result = jobsFromCsv("colour,size\nred,large");
    expect(result.jobs).toHaveLength(0);
    expect(result.errors[0]).toContain("No role column");
  });
});

describe("admin session", () => {
  const original = process.env.ADMIN_PASSWORD;
  afterEach(() => {
    process.env.ADMIN_PASSWORD = original;
  });

  test("accepts a cookie minted from the current password", () => {
    process.env.ADMIN_PASSWORD = "correct horse";
    expect(isValidSession(sessionToken("correct horse"))).toBe(true);
    expect(isValidPassword("correct horse")).toBe(true);
  });

  test("rejects the wrong password and a stale cookie after a password change", () => {
    process.env.ADMIN_PASSWORD = "correct horse";
    const cookie = sessionToken("correct horse");
    expect(isValidPassword("battery staple")).toBe(false);
    process.env.ADMIN_PASSWORD = "battery staple";
    expect(isValidSession(cookie)).toBe(false);
  });

  test("locks everything out when no password is configured", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(isValidPassword("")).toBe(false);
    expect(isValidSession("anything")).toBe(false);
  });
});
