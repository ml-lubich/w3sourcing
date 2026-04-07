import path from "node:path";
import { describe, expect, test } from "bun:test";
import { pageDirToUrlPath } from "@/lib/page-dir-to-url-path";

describe("pageDirToUrlPath", () => {
  const app = path.join("project", "src", "app");

  test("maps app root page directory to /", () => {
    expect(pageDirToUrlPath(app, app)).toBe("/");
  });

  test("maps static segments to URL paths", () => {
    expect(pageDirToUrlPath(app, path.join(app, "privacy"))).toBe("/privacy");
  });

  test("strips route group folders from the public path", () => {
    expect(pageDirToUrlPath(app, path.join(app, "(site)", "terms"))).toBe(
      "/terms",
    );
  });

  test("maps a page directory that is only route groups to /", () => {
    expect(pageDirToUrlPath(app, path.join(app, "(marketing)"))).toBe("/");
  });

  test("returns null for private path segments", () => {
    expect(pageDirToUrlPath(app, path.join(app, "_draft", "x"))).toBeNull();
  });

  test("returns null for dynamic route directories", () => {
    expect(pageDirToUrlPath(app, path.join(app, "blog", "[slug]"))).toBeNull();
  });

  test("encodes segment characters that require encoding in URLs", () => {
    const weird = "a b";
    expect(pageDirToUrlPath(app, path.join(app, weird))).toBe(
      `/${encodeURIComponent(weird)}`,
    );
  });
});
