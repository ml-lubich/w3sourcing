import type { RawJob } from "./jobs";

/**
 * Aggregations behind the admin dashboard. Pure and synchronous so the numbers
 * are testable without a database or a chart library — the charts only render
 * what these return.
 */

export type Tally = { label: string; count: number };

/** One line of axis text. Wrapped ticks collide with the next category. */
export function truncateAxisLabel(label: string, maxChars: number): string {
  const trimmed = label.trim();
  if (maxChars < 2) return "…";
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars - 1).trimEnd()}…`;
}

const RANKED_ROW_PX = 32;
const RANKED_MIN_PX = 256;

/** Chart box height. A fixed 256px box stacks nine wrapped labels on top of each other. */
export function rankedChartHeight(rows: number): number {
  if (rows <= 0) return RANKED_MIN_PX;
  return Math.max(RANKED_MIN_PX, rows * RANKED_ROW_PX);
}

type StatJob = Pick<RawJob, "roleGroup" | "sector" | "workplace" | "locations" | "postedDate"> & {
  hot?: boolean;
};

/** Counts by one single-valued field, biggest first, tail folded into "Other". */
export function tallyBy(
  jobs: StatJob[],
  field: "roleGroup" | "sector" | "workplace",
  limit = 8,
): Tally[] {
  const counts = new Map<string, number>();
  for (const job of jobs) {
    const value = job[field]?.trim();
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return foldTail([...counts].map(([label, count]) => ({ label, count })), limit);
}

/** Locations are a comma-separated list, so a role counts once per city. */
export function tallyLocations(jobs: StatJob[], limit = 8): Tally[] {
  const counts = new Map<string, number>();
  for (const job of jobs) {
    for (const city of job.locations?.split(",") ?? []) {
      const label = city.trim();
      if (!label) continue;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }
  return foldTail([...counts].map(([label, count]) => ({ label, count })), limit);
}

function foldTail(tallies: Tally[], limit: number): Tally[] {
  const sorted = tallies.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  if (sorted.length <= limit) return sorted;
  const rest = sorted.slice(limit).reduce((total, tally) => total + tally.count, 0);
  return [...sorted.slice(0, limit), { label: "Other", count: rest }];
}

export type MonthPoint = { month: string; label: string; count: number };

/**
 * Roles posted per month over the trailing window, including empty months so
 * the trend line does not silently close a gap.
 */
export function postedByMonth(jobs: StatJob[], months = 12, today = new Date()): MonthPoint[] {
  const counts = new Map<string, number>();
  for (const job of jobs) {
    const month = job.postedDate?.slice(0, 7);
    if (!month) continue;
    counts.set(month, (counts.get(month) ?? 0) + 1);
  }

  const points: MonthPoint[] = [];
  for (let back = months - 1; back >= 0; back--) {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - back, 1));
    const month = date.toISOString().slice(0, 7);
    points.push({
      month,
      label: date.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
      count: counts.get(month) ?? 0,
    });
  }
  return points;
}

export type JobSummary = {
  total: number;
  hot: number;
  addedLast30: number;
  sectors: number;
  locations: number;
};

export function summarise(jobs: StatJob[], today = new Date()): JobSummary {
  const cutoff = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const sectors = new Set<string>();
  const locations = new Set<string>();
  let hot = 0;
  let addedLast30 = 0;

  for (const job of jobs) {
    if (job.hot) hot++;
    if (job.postedDate && job.postedDate >= cutoff) addedLast30++;
    if (job.sector?.trim()) sectors.add(job.sector.trim());
    for (const city of job.locations?.split(",") ?? []) {
      if (city.trim()) locations.add(city.trim());
    }
  }

  return { total: jobs.length, hot, addedLast30, sectors: sectors.size, locations: locations.size };
}
