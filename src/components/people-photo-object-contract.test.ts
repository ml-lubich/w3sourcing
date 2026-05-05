import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const componentsDir = path.join(repoRoot, "src", "components");
const globalsSrc = readFileSync(path.join(repoRoot, "src", "app", "globals.css"), "utf8");

describe("people photo crop contract", () => {
  test("defines a shared focal point that protects heads on constrained crops", () => {
    expect(globalsSrc).toContain(".people-photo-object");
    expect(globalsSrc).toContain("object-position: center 22%");
    expect(globalsSrc).toContain("object-position: center 16%");
  });

  test("uses the shared focal point across photo-backed content modules", () => {
    for (const fileName of [
      "feature-tabs.tsx",
      "how-it-works.tsx",
      "practice-areas.tsx",
      "testimonials.tsx",
      "why-w3.tsx",
    ]) {
      const src = readFileSync(path.join(componentsDir, fileName), "utf8");
      expect(src).toContain('className="people-photo-object object-cover"');
    }
  });
});