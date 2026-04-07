import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const srcDir = path.join(import.meta.dirname, "..");

/**
 * Guards against regressions: ThemeProvider once shipped a `useEffect` path without
 * importing it (runtime ReferenceError). Raw `<script>` in layout.tsx triggered React 19
 * “script tag while rendering” warnings.
 */
describe("root theme + layout contract", () => {
  test("ThemeProvider avoids useEffect entirely (useLayoutEffect + bfcache handler)", () => {
    const file = path.join(srcDir, "components", "theme-provider.tsx");
    const text = readFileSync(file, "utf8");
    expect(text).toContain("useLayoutEffect");
    expect(text).not.toContain("useEffect");
  });

  test("Root layout loads theme boot via next/script beforeInteractive, not inline <script src>", () => {
    const file = path.join(srcDir, "app", "layout.tsx");
    const text = readFileSync(file, "utf8");
    expect(text).toContain('from "next/script"');
    expect(text).toContain('strategy="beforeInteractive"');
    expect(text).toContain("/w3-theme-boot.js");
    expect(text).not.toMatch(/<script\s[^>]*src=["']\/w3-theme-boot\.js/);
  });
});
