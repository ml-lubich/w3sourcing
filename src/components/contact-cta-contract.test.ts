import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const componentsDir = import.meta.dirname;
const appDir = path.join(componentsDir, "..", "app");
const contentDir = path.join(componentsDir, "..", "content");

const PERRY_LINKEDIN_URL = "https://www.linkedin.com/in/perrybarrow/";

/**
 * Perry's request (2026-07-11): every "contact us" CTA points to his LinkedIn
 * profile instead of an email address. Legal pages (privacy/terms) keep their
 * legal-contact email references — those are not CTAs.
 */
describe("contact CTA → LinkedIn contract", () => {
  test("shared contact-links constants exist", () => {
    const src = readFileSync(path.join(contentDir, "contact-links.ts"), "utf8");
    expect(src).toContain(`export const PERRY_LINKEDIN_URL = "${PERRY_LINKEDIN_URL}"`);
    expect(src).toContain('export const PERRY_EMAIL = "perry@w3sourcing.com"');
  });

  const ctaComponents = [
    "header.tsx",
    "hero.tsx",
    "cta-banner.tsx",
    "comparison.tsx",
    "contact.tsx",
    "footer.tsx",
  ];

  for (const file of ctaComponents) {
    test(`${file} has no email CTA and links to Perry's LinkedIn`, () => {
      const src = readFileSync(path.join(componentsDir, file), "utf8");
      expect(src).not.toContain("mailto:info@w3sourcing.com");
      expect(src).toContain("PERRY_LINKEDIN_URL");
      expect(src).toContain('target="_blank"');
      expect(src).toContain('rel="noopener noreferrer"');
    });
  }

  test("not-found page CTA links to Perry's LinkedIn instead of email", () => {
    const src = readFileSync(path.join(appDir, "not-found.tsx"), "utf8");
    expect(src).not.toContain("mailto:info@w3sourcing.com");
    expect(src).toContain("PERRY_LINKEDIN_URL");
  });

  test("legal pages keep their legal-contact email references", () => {
    const terms = readFileSync(path.join(appDir, "terms", "page.tsx"), "utf8");
    const privacy = readFileSync(path.join(appDir, "privacy", "page.tsx"), "utf8");
    expect(terms).toContain("mailto:");
    expect(privacy).toContain("mailto:");
  });
});
