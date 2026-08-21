import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * `useInView` / `whileInView` margins must be pixels. Some engines reject a
 * percentage `rootMargin` outright, and when the observer is never created the
 * gate stays false forever — the section keeps its `initial` opacity of 0 and
 * renders as a blank band. That is what happened to the feature blocks on
 * mobile: ~3,300px of empty screen between the coverage and outcomes sections.
 */
const roots = ["src/components", "src/lib", "src/app"];

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

describe("in-view margin contract", () => {
  test("no percentage rootMargin anywhere", () => {
    const offenders: string[] = [];
    for (const root of roots) {
      for (const file of walk(root)) {
        if (file.endsWith("inview-margin-contract.test.ts")) continue;
        const src = readFileSync(file, "utf8");
        for (const match of src.matchAll(/margin:\s*"([^"]*)"/g)) {
          if (match[1].includes("%")) offenders.push(`${file}: ${match[1]}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
