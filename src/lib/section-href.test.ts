import { describe, expect, test } from "bun:test";
import { sectionHref } from "@/lib/section-href";

describe("sectionHref", () => {
  test("returns href unchanged when not forcing root-absolute", () => {
    expect(sectionHref("#contact", false)).toBe("#contact");
    expect(sectionHref("/privacy", true)).toBe("/privacy");
  });

  test("prefixes hash-only hrefs with / when on a non-home page", () => {
    expect(sectionHref("#contact", true)).toBe("/#contact");
  });

  test("does not double-prefix non-hash hrefs", () => {
    expect(sectionHref("/#x", true)).toBe("/#x");
  });
});
