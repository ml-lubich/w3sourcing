import { describe, expect, test } from "bun:test";
import { sectionIdFromNavHref } from "@/lib/section-nav";

describe("sectionIdFromNavHref", () => {
  test("parses hash id from root-absolute section links", () => {
    expect(sectionIdFromNavHref("/#contact")).toBe("contact");
  });

  test("parses hash id from same-page hash links", () => {
    expect(sectionIdFromNavHref("#features")).toBe("features");
  });

  test("returns null when there is no section id", () => {
    expect(sectionIdFromNavHref("/")).toBeNull();
    expect(sectionIdFromNavHref("#")).toBeNull();
    expect(sectionIdFromNavHref("/#")).toBeNull();
    expect(sectionIdFromNavHref("/other")).toBeNull();
  });
});
