import { describe, expect, test } from "bun:test";

import { PERRY_EMAIL } from "@/content/contact-links";
import { buildJobMailtoHref, type LiveJob } from "./jobs";
import {
  clickCountsAsReferral,
  countsOnIssue,
  isReferralCode,
  mintReferralCode,
  referralPath,
  REFERRAL_CODE_LENGTH,
} from "./referrals";

const job: LiveJob = {
  ref: "W3-AAAAAA",
  hot: false,
  role: "Product Engineer (Senior/Staff)",
  roleGroup: "Engineering - AI/ML",
  roleType: "Product Engineer",
  sector: "AI",
  locations: "San Francisco",
  workplace: "Hybrid",
  salary: "$200K - $300K",
  yoe: "5 - 8 years",
  techStack: "TypeScript, React",
  visa: null,
  postedDate: "2026-07-01",
  multiHire: "No",
  hiringCount: "1",
};

describe("referral codes", () => {
  test("mints an 8-character code Perry can read aloud", () => {
    const code = mintReferralCode(() => new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]));
    expect(code).toHaveLength(REFERRAL_CODE_LENGTH);
    expect(isReferralCode(code)).toBe(true);
    expect(code).not.toMatch(/[01OI]/);
  });

  test("the same bytes always mint the same code", () => {
    const bytes = () => new Uint8Array([10, 11, 12, 13, 14, 15, 16, 17]);
    expect(mintReferralCode(bytes)).toBe(mintReferralCode(bytes));
  });

  test("rejects codes that are short, lower-case, or ambiguous", () => {
    expect(isReferralCode("ABCD2345")).toBe(true);
    expect(isReferralCode("abcd2345")).toBe(false);
    expect(isReferralCode("ABCD234")).toBe(false);
    expect(isReferralCode("ABCD234O")).toBe(false);
    expect(isReferralCode("ABCD2341")).toBe(false);
  });

  test("a shared link is the short referral path, not the bare job anchor", () => {
    expect(referralPath("ABCD2345")).toBe("/r/ABCD2345");
  });
});

describe("referral click counting", () => {
  test("the first person to open a link counts; a repeat from the same person does not", () => {
    expect(clickCountsAsReferral(false)).toBe(true);
    expect(clickCountsAsReferral(true)).toBe(false);
  });

  test("email and LinkedIn count at the click; a copied link counts when someone opens it", () => {
    expect(countsOnIssue("email")).toBe(true);
    expect(countsOnIssue("linkedin")).toBe(true);
    expect(countsOnIssue("copy")).toBe(false);
  });
});

describe("referral mailto", () => {
  test("puts the unique code in the subject and body so Perry can match the sender", () => {
    const href = buildJobMailtoHref(job, {
      code: "ABCD2345",
      origin: "https://w3sourcing.com",
    });
    expect(href).toStartWith(`mailto:${PERRY_EMAIL}?`);
    const subject = decodeURIComponent(href.match(/subject=([^&]*)/)?.[1] ?? "");
    const body = decodeURIComponent(href.match(/body=([^&]*)/)?.[1] ?? "");
    expect(subject).toContain("ABCD2345");
    expect(subject).toContain("W3-AAAAAA");
    expect(body).toContain("ABCD2345");
    expect(body).toContain("https://w3sourcing.com/r/ABCD2345");
    expect(href).not.toMatch(/paraform/i);
  });
});
