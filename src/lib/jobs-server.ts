import liveJobsData from "@/content/live-jobs.json";

import { maskJobs, type LiveJob, type RawJob } from "./jobs";
import { fetchJobs, isJobsDbConfigured } from "./jobs-store";

/**
 * Public jobs board data, masked for the browser.
 *
 * Supabase is the source of truth in every environment where it is configured
 * (that is what Perry edits at `/admin`). The committed Paraform export is the
 * fallback so local dev, `bun run test`, and the route smoke still render a
 * full board without database credentials.
 */
export async function loadLiveJobs(): Promise<LiveJob[]> {
  if (!isJobsDbConfigured()) return maskJobs(liveJobsData as RawJob[]);
  return maskJobs(await fetchJobs());
}
