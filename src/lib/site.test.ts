import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { getSiteUrl } from "./site";

describe("getSiteUrl", () => {
  let prevSite: string | undefined;
  let prevVercel: string | undefined;

  beforeEach(() => {
    prevSite = process.env.NEXT_PUBLIC_SITE_URL;
    prevVercel = process.env.VERCEL_URL;
  });

  afterEach(() => {
    if (prevSite === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = prevSite;
    if (prevVercel === undefined) delete process.env.VERCEL_URL;
    else process.env.VERCEL_URL = prevVercel;
  });

  test("uses NEXT_PUBLIC_SITE_URL and strips trailing slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/base/";
    delete process.env.VERCEL_URL;
    expect(getSiteUrl().href).toBe("https://example.com/base");
  });

  test("adds https when NEXT_PUBLIC_SITE_URL has no protocol", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "example.org";
    delete process.env.VERCEL_URL;
    expect(getSiteUrl().href).toBe("https://example.org/");
  });

  test("falls back to VERCEL_URL", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_URL = "my-app.vercel.app";
    expect(getSiteUrl().href).toBe("https://my-app.vercel.app/");
  });

  test("falls back to w3sourcing.com when no env is set", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;
    expect(getSiteUrl().href).toBe("https://w3sourcing.com/");
  });
});
