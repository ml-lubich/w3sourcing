import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const adminDir = import.meta.dirname;
const libDir = path.join(adminDir, "..", "..", "lib");

const actions = readFileSync(path.join(adminDir, "actions.ts"), "utf8");
const adminJobs = readFileSync(path.join(adminDir, "admin-jobs.tsx"), "utf8");
const store = readFileSync(path.join(libDir, "jobs-store.ts"), "utf8");

/**
 * Perry uploads the full batch of live Paraform roles every week (70–100 in,
 * roughly as many dropping out). Retiring the old ones one row at a time is the
 * bottleneck these contracts exist to keep closed.
 */
describe("bulk removal contract", () => {
  test("the store deletes a batch of refs in one round trip per page", () => {
    expect(store).toContain("export async function deleteJobs");
    expect(store).toContain('.in("ref"');
    // Chunked, because PostgREST filters travel in the query string.
    expect(store).toContain("chunk(");
  });

  test("the store can retire everything the batch did not mention", () => {
    expect(store).toContain("export async function deleteJobsExcept");
    expect(store).toContain("staleRefs");
    expect(store).toContain("export async function fetchJobRefs");
  });

  test("a bulk removal action exists and re-checks the session like every other mutation", () => {
    expect(actions).toContain("export async function removeJobs");
    const body = actions.slice(actions.indexOf("export async function removeJobs"));
    expect(body.slice(0, 400)).toContain("await requireAdmin()");
  });

  test("the import action accepts a replace flag and reports what it retired", () => {
    expect(actions).toContain('formData.get("replace")');
    expect(actions).toContain("deleteJobsExcept");
    expect(actions).toContain("syncSummary");
  });

  test("replacing the board never runs off a CSV that parsed to nothing", () => {
    // Scoped to the action body — `deleteJobsExcept` also appears in the imports.
    const body = actions.slice(actions.indexOf("export async function importCsv"));
    // The zero-row early return has to sit above the replace pass.
    expect(body.indexOf("jobs.length === 0")).toBeLessThan(body.indexOf("deleteJobsExcept"));
    expect(body).toContain("return { error:");
  });
});

describe("admin bulk UI contract", () => {
  test("rows carry selection checkboxes with accessible labels", () => {
    expect(adminJobs).toContain("selected");
    expect(adminJobs).toContain("toggleRow");
    expect(adminJobs).toContain('type="checkbox"');
    expect(adminJobs).toContain("aria-label");
  });

  test("one control selects every role the current search matches", () => {
    expect(adminJobs).toContain("Select all");
    // Selection spans the whole filtered set, not just the rows scrolled into view.
    expect(adminJobs).toContain("matches.map");
  });

  test("removing a selection is confirmed with its count before it fires", () => {
    expect(adminJobs).toContain("removeJobs");
    expect(adminJobs).toContain("Remove selected");
    expect(adminJobs).toContain("confirm(");
  });

  test("does not print a how-to under the selection bar", () => {
    expect(adminJobs).not.toContain("Tip: tick rows");
    expect(adminJobs).not.toContain("hit the flame");
  });

  test("the same selection drives a tri-state hot control", () => {
    // Mixed selections read as "partly hot" and go all-hot on the first press,
    // the way a bold button behaves over mixed text.
    expect(adminJobs).toContain("Partly hot");
    expect(adminJobs).toContain('aria-pressed={hotState === "off" ? false : hotState === "on" ? true : "mixed"}');
    expect(adminJobs).toContain("toggleHot(selectedRefs, !allSelectedHot)");
  });

  test("the import panel offers an optional mark-everything-hot checkbox", () => {
    expect(adminJobs).toContain("Mark every imported role as hot");
  });

  test("the import panel offers the weekly replace-the-board option", () => {
    expect(adminJobs).toContain('name="replace"');
    expect(adminJobs).toContain("Replace the board");
  });
});
