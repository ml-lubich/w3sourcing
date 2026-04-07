import { describe, expect, test } from "bun:test";
import { computeSnappyScrollDurationMs } from "./scroll-to-section";

describe("computeSnappyScrollDurationMs", () => {
  test("clamps to min for tiny distances", () => {
    expect(computeSnappyScrollDurationMs(10)).toBe(200);
    expect(computeSnappyScrollDurationMs(-10)).toBe(200);
  });

  test("scales with distance between min and max", () => {
    expect(computeSnappyScrollDurationMs(800)).toBe(272);
    expect(computeSnappyScrollDurationMs(-800)).toBe(272);
  });

  test("clamps to max for very long jumps", () => {
    expect(computeSnappyScrollDurationMs(99999)).toBe(420);
  });
});
