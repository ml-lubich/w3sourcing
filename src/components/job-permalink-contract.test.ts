import { describe, expect, test } from "bun:test";

describe("job permalink contract", () => {
  test("the linked job card marks itself with the browser's own :target", async () => {
    const jobsCss = await Bun.file(new URL("../app/globals.css", import.meta.url)).text();
    expect(jobsCss).toContain('article[id^="job-"]:target');
    expect(jobsCss).toContain("job-target-glow");
    // The pulse settles into a static border; reduced motion keeps the border
    // and drops the animation.
    expect(jobsCss).toContain("animation: none;");
  });
});
