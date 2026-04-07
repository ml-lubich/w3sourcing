import { describe, expect, test } from "bun:test";
import {
  isFooterScrollRevealVisible,
  isFooterSplitWordsGateOpen,
} from "@/lib/footer-scroll-reveal-gate";

describe("footer-scroll-reveal-gate", () => {
  test("reveal stays false until client ready unless reduced motion", () => {
    expect(
      isFooterScrollRevealVisible({
        clientMotionReady: false,
        inView: true,
        prefersReducedMotion: false,
      }),
    ).toBe(false);
  });

  test("reveal follows in view only after client ready", () => {
    expect(
      isFooterScrollRevealVisible({
        clientMotionReady: true,
        inView: false,
        prefersReducedMotion: false,
      }),
    ).toBe(false);

    expect(
      isFooterScrollRevealVisible({
        clientMotionReady: true,
        inView: true,
        prefersReducedMotion: false,
      }),
    ).toBe(true);
  });

  test("reduced motion shows without waiting for in-view or client gate", () => {
    expect(
      isFooterScrollRevealVisible({
        clientMotionReady: false,
        inView: false,
        prefersReducedMotion: true,
      }),
    ).toBe(true);
  });

  test("split-word gate is never open before client ready", () => {
    expect(
      isFooterSplitWordsGateOpen({
        clientMotionReady: false,
        inView: true,
      }),
    ).toBe(false);
    expect(
      isFooterSplitWordsGateOpen({
        clientMotionReady: true,
        inView: true,
      }),
    ).toBe(true);
  });
});
