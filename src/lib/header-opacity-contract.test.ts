import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const globalsSrc = readFileSync(path.join(repoRoot, "src", "app", "globals.css"), "utf8");

describe("header opacity contract", () => {
  test("keeps the fixed header frosted at the top of the page", () => {
    expect(globalsSrc).toContain("--header-glass: 1");
    expect(globalsSrc).not.toContain("--header-glass: 0");
    expect(globalsSrc).not.toContain("box-shadow: none;");
  });
});