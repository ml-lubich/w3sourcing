import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const appDir = path.join(repoRoot, "src", "app");
const publicImagesDir = path.join(repoRoot, "public", "images");
const faviconDir = path.join(publicImagesDir, "favicon");
const faviconUrlPrefix = "/images/favicon/";

const expectedFaviconFiles = [
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "apple-touch-icon.png",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "favicon.ico",
  "logo.png",
  "site.webmanifest",
] as const;

function collectFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
  });
}

describe("favicon asset contract", () => {
  test("serves favicon metadata only from public/images/favicon", () => {
    const layoutSrc = readFileSync(path.join(appDir, "layout.tsx"), "utf8");

    expect(layoutSrc).toContain(`manifest: "${faviconUrlPrefix}site.webmanifest"`);
    expect(layoutSrc).toContain(`${faviconUrlPrefix}favicon.ico`);
    expect(layoutSrc).toContain(`${faviconUrlPrefix}favicon-32x32.png`);
    expect(layoutSrc).toContain(`${faviconUrlPrefix}favicon-16x16.png`);
    expect(layoutSrc).toContain(`${faviconUrlPrefix}apple-touch-icon.png`);
    expect(layoutSrc).not.toContain("/icon?");
    expect(layoutSrc).not.toContain("/apple-icon");
  });

  test("keeps favicon files and source logo in the favicon folder", () => {
    const actualFiles = readdirSync(faviconDir).sort();

    expect(actualFiles).toEqual([...expectedFaviconFiles].sort());
    expect(existsSync(path.join(publicImagesDir, "logo_favicon.png"))).toBe(false);
    expect(existsSync(path.join(appDir, "icon.tsx"))).toBe(false);
    expect(existsSync(path.join(appDir, "apple-icon.tsx"))).toBe(false);
    expect(existsSync(path.join(appDir, "manifest.ts"))).toBe(false);
  });

  test("web manifest icon entries resolve to the favicon folder", () => {
    const manifestPath = path.join(faviconDir, "site.webmanifest");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      icons: Array<{ src: string; sizes: string; type: string }>;
    };

    expect(manifest.icons.length).toBeGreaterThan(0);
    for (const icon of manifest.icons) {
      expect(icon.src.startsWith(faviconUrlPrefix)).toBe(true);
      expect(existsSync(path.join(repoRoot, "public", icon.src))).toBe(true);
    }
  });

  test("does not leave favicon-named assets outside public/images/favicon", () => {
    const strayFiles = collectFiles(publicImagesDir).filter((filePath) => {
      const relativePath = path.relative(publicImagesDir, filePath);
      const isInsideFaviconDir = relativePath.startsWith(`favicon${path.sep}`);
      return !isInsideFaviconDir && /favicon/i.test(path.basename(filePath));
    });

    expect(strayFiles).toEqual([]);
  });
});