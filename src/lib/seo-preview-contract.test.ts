import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const appDir = path.join(repoRoot, "src", "app");
const publicDir = path.join(repoRoot, "public");
const scriptsDir = path.join(repoRoot, "scripts");

describe("SEO and preview rendering contract", () => {
  test("root metadata exposes crawler-friendly social previews and favicon metadata", () => {
    const layoutSrc = readFileSync(path.join(appDir, "layout.tsx"), "utf8");

    expect(layoutSrc).toContain("metadataBase: siteUrl");
    expect(layoutSrc).toContain('manifest: "/images/favicon/site.webmanifest"');
    expect(layoutSrc).toContain("shortcut:");
    expect(layoutSrc).toContain('url: "/opengraph-image"');
    expect(layoutSrc).toContain("width: 1200");
    expect(layoutSrc).toContain("height: 630");
    expect(layoutSrc).toContain("summary_large_image");
    expect(layoutSrc).toContain("max-image-preview");
    expect(layoutSrc).toContain("export const viewport");
  });

  test("Open Graph image route is a 1200 by 630 PNG preview", () => {
    const openGraphSrc = readFileSync(path.join(appDir, "opengraph-image.tsx"), "utf8");

    expect(openGraphSrc).toContain("export const size = { width: 1200, height: 630 }");
    expect(openGraphSrc).toContain('export const contentType = "image/png"');
    expect(openGraphSrc).toContain('export const runtime = "nodejs"');
    expect(openGraphSrc).toContain("loadBrandWordmarkDataUrl");
  });

  test("robots allows crawling and advertises the sitemap", () => {
    const robotsSrc = readFileSync(path.join(appDir, "robots.ts"), "utf8");

    expect(robotsSrc).toContain('userAgent: "*"');
    expect(robotsSrc).toContain('"GPTBot"');
    expect(robotsSrc).toContain('"ClaudeBot"');
    expect(robotsSrc).toContain('"PerplexityBot"');
    expect(robotsSrc).toContain('allow: "/"');
    expect(robotsSrc).toContain("/sitemap.xml");
    expect(robotsSrc).not.toContain("disallow");
  });

  test("llms.txt gives AI crawlers a concise site map", () => {
    const llmsTxt = readFileSync(path.join(publicDir, "llms.txt"), "utf8");

    expect(llmsTxt).toContain("# W3 Sourcing");
    expect(llmsTxt).toContain("https://w3sourcing.com/");
    expect(llmsTxt).toContain("https://w3sourcing.com/sitemap.xml");
    expect(llmsTxt).toContain("https://w3sourcing.com/robots.txt");
  });

  test("production smoke covers crawler and preview assets", () => {
    const smokeSrc = readFileSync(path.join(scriptsDir, "smoke-no-404.ts"), "utf8");

    expect(smokeSrc).toContain("CRITICAL_RENDERED_ROUTES");
    expect(smokeSrc).toContain('"/opengraph-image"');
    expect(smokeSrc).toContain('"/llms.txt"');
    expect(smokeSrc).toContain('"/robots.txt"');
    expect(smokeSrc).toContain('"/sitemap.xml"');
    expect(smokeSrc).toContain('"/images/favicon/site.webmanifest"');
    expect(smokeSrc).toContain('"/images/favicon/favicon.ico"');
    expect(smokeSrc).toContain('"/images/favicon/apple-touch-icon.png"');
  });
});