import { describe, expect, test } from "bun:test";
import { runBfCacheScrollNudge } from "./bf-cache-scroll-nudge";
import type { BfCacheScrollNudgeWindow } from "./bf-cache-scroll-nudge";

describe("runBfCacheScrollNudge", () => {
  test("schedules y+1 then restores scroll position", () => {
    const scrollCalls: [number, number][] = [];
    const rafQueue: FrameRequestCallback[] = [];
    let id = 0;

    const w: BfCacheScrollNudgeWindow = {
      scrollX: 5,
      scrollY: 100,
      scrollTo(x: number, y: number) {
        scrollCalls.push([x, y]);
      },
      requestAnimationFrame(cb: FrameRequestCallback) {
        rafQueue.push(cb);
        id += 1;
        return id;
      },
    };

    runBfCacheScrollNudge(w);
    expect(rafQueue.length).toBe(1);

    rafQueue[0]!(0);
    expect(scrollCalls).toEqual([[5, 101]]);
    expect(rafQueue.length).toBe(2);

    rafQueue[1]!(0);
    expect(scrollCalls).toEqual([
      [5, 101],
      [5, 100],
    ]);
  });
});
