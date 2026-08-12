import { describe, expect, test } from "bun:test";

import { chunk, removalSummary, staleRefs, syncSummary } from "./jobs-sync";

describe("staleRefs", () => {
  test("returns the roles that dropped out of this week's batch", () => {
    expect(staleRefs(["W3-1", "W3-2", "W3-3"], ["W3-2", "W3-3"])).toEqual(["W3-1"]);
  });

  test("keeps everything when the batch repeats the whole board", () => {
    expect(staleRefs(["W3-1", "W3-2"], ["W3-1", "W3-2"])).toEqual([]);
  });

  test("ignores refs in the batch that were never on the board", () => {
    expect(staleRefs(["W3-1"], ["W3-1", "W3-NEW"])).toEqual([]);
  });

  /**
   * The guard that matters: an empty batch must not be read as "delete the
   * board". Callers reach this only after the CSV parsed to zero rows, which
   * is a bad upload, not an instruction to wipe every client's roles.
   */
  test("refuses to treat an empty batch as a wipe", () => {
    expect(staleRefs(["W3-1", "W3-2"], [])).toEqual([]);
  });

  test("survives duplicate refs on either side", () => {
    expect(staleRefs(["W3-1", "W3-1", "W3-2"], ["W3-2", "W3-2"])).toEqual(["W3-1"]);
  });
});

describe("chunk", () => {
  test("splits a batch into full pages plus a remainder", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  test("keeps a short batch as a single page", () => {
    expect(chunk(["a"], 200)).toEqual([["a"]]);
  });

  test("has nothing to do with an empty batch", () => {
    expect(chunk([], 10)).toEqual([]);
  });

  test("never loops forever on a nonsense page size", () => {
    expect(chunk([1, 2], 0)).toEqual([[1, 2]]);
  });
});

describe("syncSummary", () => {
  test("reports what came in and what was retired", () => {
    expect(syncSummary({ imported: 82, removed: 74, ignoredColumns: [], errors: [] })).toBe(
      "Imported 82 roles. Removed 74 roles that were not in the file.",
    );
  });

  test("says so plainly when the replace pass retired nothing", () => {
    expect(syncSummary({ imported: 3, removed: 0, ignoredColumns: [], errors: [] })).toBe(
      "Imported 3 roles. Nothing else was on the board to remove.",
    );
  });

  test("omits the removal sentence entirely when not replacing", () => {
    expect(syncSummary({ imported: 1, removed: null, ignoredColumns: [], errors: [] })).toBe(
      "Imported 1 role.",
    );
  });

  test("surfaces ignored columns and skipped rows after the counts", () => {
    const summary = syncSummary({
      imported: 2,
      removed: null,
      ignoredColumns: ["mood", "vibe"],
      errors: ["Line 4: skipped, no role title."],
    });
    expect(summary).toContain("Imported 2 roles.");
    expect(summary).toContain("Ignored unknown columns: mood, vibe.");
    expect(summary).toContain("1 row(s) skipped");
    expect(summary).toContain("Line 4");
  });

  test("does not spill more than five skipped rows into one message", () => {
    const errors = Array.from({ length: 9 }, (_, i) => `Line ${i + 2}: skipped, no role title.`);
    const summary = syncSummary({ imported: 1, removed: null, ignoredColumns: [], errors });
    expect(summary).toContain("9 row(s) skipped");
    expect(summary).not.toContain("Line 10");
  });
});

describe("removalSummary", () => {
  test("counts the roles taken off the board", () => {
    expect(removalSummary(12)).toBe("Removed 12 roles.");
  });

  test("stays grammatical for a single role", () => {
    expect(removalSummary(1)).toBe("Removed 1 role.");
  });

  test("has something to say when the selection was already gone", () => {
    expect(removalSummary(0)).toBe("Nothing to remove.");
  });
});
