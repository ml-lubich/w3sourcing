import type { JobRow } from "./jobs-store";

/**
 * A compact, token-cheap picture of the board for the admin assistant: the
 * whole table would be tens of thousands of tokens, so facets carry the shape
 * and a recent sample carries the detail.
 */

function counts(jobs: JobRow[], pick: (job: JobRow) => string | null | undefined, top = 8): string {
  const tally = new Map<string, number>();
  for (const job of jobs) {
    const value = pick(job)?.trim();
    if (value) tally.set(value, (tally.get(value) ?? 0) + 1);
  }
  return [...tally]
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([value, count]) => `${value} ${count}`)
    .join(", ");
}

export function jobsDigest(jobs: JobRow[], sample = 40): string {
  const newest = [...jobs].sort((a, b) => (b.postedDate ?? "").localeCompare(a.postedDate ?? ""));
  return [
    `Total roles: ${jobs.length}`,
    `Hot roles: ${jobs.filter((job) => job.hot).length}`,
    `Role groups: ${counts(jobs, (job) => job.roleGroup)}`,
    `Sectors: ${counts(jobs, (job) => job.sector)}`,
    `Locations: ${counts(jobs, (job) => job.locations)}`,
    `Workplace: ${counts(jobs, (job) => job.workplace)}`,
    `Clients: ${counts(jobs, (job) => job.company, 12)}`,
    `Posted months: ${counts(jobs, (job) => job.postedDate?.slice(0, 7), 6)}`,
    "",
    `${Math.min(sample, newest.length)} most recent roles (ref · role · client · location · posted):`,
    ...newest
      .slice(0, sample)
      .map(
        (job) =>
          `${job.ref} · ${job.role} · ${job.company || "—"} · ${job.locations || "—"} · ${
            job.postedDate ?? "undated"
          }${job.hot ? " [HOT]" : ""}`,
      ),
  ].join("\n");
}
