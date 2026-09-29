import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const src = readFileSync(path.join(import.meta.dirname, "admin-referrals.tsx"), "utf8");

describe("admin referrals ledger", () => {
  test("shows the ledger without an on-screen how-to", () => {
    expect(src).not.toContain("commission");
    expect(src).not.toContain("Match the code");
    expect(src).not.toContain("gets its own code");
    expect(src).not.toContain("They appear when");
  });
});
