import { describe, expect, test } from "bun:test";
import { clientPointToCardTilt } from "@/lib/use-pointer-tilt-3d";

describe("clientPointToCardTilt", () => {
  test("center yields no rotation", () => {
    const rect = { left: 0, top: 0, width: 200, height: 100 };
    const t = clientPointToCardTilt(100, 50, rect, 8);
    expect(t.rotateX).toBeCloseTo(0);
    expect(t.rotateY).toBeCloseTo(0);
  });

  test("right edge tilts positive rotateY", () => {
    const rect = { left: 0, top: 0, width: 100, height: 100 };
    const t = clientPointToCardTilt(100, 50, rect, 10);
    expect(t.rotateY).toBeCloseTo(10);
    expect(t.rotateX).toBeCloseTo(0);
  });

  test("top edge tilts positive rotateX (screen X tilt)", () => {
    const rect = { left: 0, top: 0, width: 100, height: 100 };
    const t = clientPointToCardTilt(50, 0, rect, 10);
    expect(t.rotateX).toBeCloseTo(10);
    expect(t.rotateY).toBeCloseTo(0);
  });
});
