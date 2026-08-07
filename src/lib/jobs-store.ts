import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { RawJob } from "./jobs";

/**
 * Server-only Supabase access for the jobs table. Never import this from a
 * client component: it holds the service-role key, and every row it returns
 * still carries client identifiers (company, website, Paraform link).
 *
 * The table has RLS on with no policies, so the anon key in the browser cannot
 * touch it — the service role is the only way in, and it lives here.
 */

/** A row as stored: `RawJob` with the two server-managed fields guaranteed. */
export type JobRow = RawJob & { ref: string; hot: boolean };

const TABLE = "jobs";
/** PostgREST caps a response at 1000 rows; page until a short page comes back. */
const PAGE_SIZE = 1000;

function url(): string | undefined {
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function isJobsDbConfigured(): boolean {
  return Boolean(url() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let client: SupabaseClient | null = null;

function db(): SupabaseClient {
  if (!isJobsDbConfigured()) {
    throw new Error(
      "Supabase is not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see docs/DEPLOYMENT.md).",
    );
  }
  client ??= createClient(url()!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export async function fetchJobs(): Promise<JobRow[]> {
  const rows: JobRow[] = [];
  for (let page = 0; ; page++) {
    const { data, error } = await db()
      .from(TABLE)
      .select("*")
      .order("hot", { ascending: false })
      .order("postedDate", { ascending: false, nullsFirst: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
    if (error) throw new Error(`Failed to load jobs: ${error.message}`);
    rows.push(...((data ?? []) as JobRow[]));
    if (!data || data.length < PAGE_SIZE) return rows;
  }
}

/** Insert or update by `ref` — re-importing the same export updates in place. */
export async function upsertJobs(jobs: JobRow[]): Promise<number> {
  if (jobs.length === 0) return 0;
  for (let i = 0; i < jobs.length; i += PAGE_SIZE) {
    const { error } = await db()
      .from(TABLE)
      .upsert(jobs.slice(i, i + PAGE_SIZE), { onConflict: "ref" });
    if (error) throw new Error(`Failed to save jobs: ${error.message}`);
  }
  return jobs.length;
}

export async function updateJob(ref: string, patch: Partial<JobRow>): Promise<void> {
  const { error } = await db().from(TABLE).update(patch).eq("ref", ref);
  if (error) throw new Error(`Failed to update ${ref}: ${error.message}`);
}

export async function deleteJob(ref: string): Promise<void> {
  const { error } = await db().from(TABLE).delete().eq("ref", ref);
  if (error) throw new Error(`Failed to delete ${ref}: ${error.message}`);
}
