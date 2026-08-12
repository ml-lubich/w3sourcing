/**
 * The weekly board sync.
 *
 * Perry re-uploads the full batch of live Paraform roles each week: 70–100 come
 * in and roughly as many drop out. Retiring the departed ones row by row was the
 * bottleneck, so an import can now *replace* the board — upsert everything in
 * the file, then take down whatever the file did not mention.
 *
 * The decisions live here as plain functions so the destructive half is covered
 * by tests that never touch Supabase.
 */

/**
 * Refs on the board that this batch no longer carries.
 *
 * An empty batch returns nothing on purpose. Callers only get here after a CSV
 * parsed to zero usable rows, which is a bad upload — not an instruction to wipe
 * every client's roles off the site.
 */
export function staleRefs(existing: readonly string[], keep: readonly string[]): string[] {
  if (keep.length === 0) return [];
  const kept = new Set(keep);
  const stale = new Set(existing.filter((ref) => !kept.has(ref)));
  return [...stale];
}

/** Split a batch into pages. A nonsense page size stays one page rather than looping. */
export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (items.length === 0) return [];
  if (size < 1) return [[...items]];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
}

function roles(count: number): string {
  return `${count} role${count === 1 ? "" : "s"}`;
}

export type SyncOutcome = {
  imported: number;
  /** How many were retired, or `null` when this import did not replace the board. */
  removed: number | null;
  ignoredColumns: string[];
  errors: string[];
};

/** The one-line receipt the admin sees after an import. */
export function syncSummary({ imported, removed, ignoredColumns, errors }: SyncOutcome): string {
  const notes = [`Imported ${roles(imported)}.`];

  if (removed !== null) {
    notes.push(
      removed === 0
        ? "Nothing else was on the board to remove."
        : `Removed ${roles(removed)} that were not in the file.`,
    );
  }
  if (ignoredColumns.length > 0) notes.push(`Ignored unknown columns: ${ignoredColumns.join(", ")}.`);
  if (errors.length > 0) notes.push(`${errors.length} row(s) skipped — ${errors.slice(0, 5).join(" ")}`);

  return notes.join(" ");
}

/** The receipt for a hand-picked selection removed from the roles list. */
export function removalSummary(removed: number): string {
  return removed === 0 ? "Nothing to remove." : `Removed ${roles(removed)}.`;
}
