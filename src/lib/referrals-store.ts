import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { clickCountsAsReferral, countsOnIssue, type ReferralChannel } from "./referrals";
import { isJobsDbConfigured } from "./jobs-store";

/**
 * Server-only ledger for job referral codes. Same access model as the jobs
 * table: service role only, RLS on with no policies, never imported from a
 * client component. Rows carry a job reference and an opaque visitor id — no
 * company name, no ATS link, no email address.
 */

const REFERRALS = "job_referrals";
const CLICKS = "job_referral_clicks";

export type StoredReferral = {
  code: string;
  jobRef: string;
  channel: ReferralChannel;
  createdAt: string;
  clicks: number;
  lastClickedAt: string | null;
  lastVisitorId: string | null;
};

type ReferralInsert = {
  code: string;
  jobRef: string;
  channel: ReferralChannel;
  createdAt: string;
  clicks: number;
  lastClickedAt: string | null;
  lastVisitorId: string | null;
};

function url(): string | undefined {
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
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

function rowToReferral(row: {
  code: string;
  jobRef: string;
  channel: string;
  createdAt: string;
  clicks: number;
  lastClickedAt: string | null;
  lastVisitorId: string | null;
}): StoredReferral {
  return {
    code: row.code,
    jobRef: row.jobRef,
    channel: row.channel as ReferralChannel,
    createdAt: row.createdAt,
    clicks: row.clicks,
    lastClickedAt: row.lastClickedAt,
    lastVisitorId: row.lastVisitorId,
  };
}

export async function jobRefExists(jobRef: string): Promise<boolean> {
  if (!isJobsDbConfigured()) return false;
  const { data, error } = await db().from("jobs").select("ref").eq("ref", jobRef).maybeSingle();
  if (error) throw new Error(`Failed to look up ${jobRef}: ${error.message}`);
  return Boolean(data);
}

export async function insertReferral(referral: ReferralInsert, visitorId: string | null): Promise<void> {
  const { error } = await db().from(REFERRALS).insert(referral);
  if (error) throw new Error(`Failed to save referral ${referral.code}: ${error.message}`);
  if (visitorId && countsOnIssue(referral.channel)) {
    await writeClick(referral.code, visitorId, null);
  }
}

export async function findReferral(code: string): Promise<StoredReferral | null> {
  if (!isJobsDbConfigured()) return null;
  const { data, error } = await db().from(REFERRALS).select("*").eq("code", code).maybeSingle();
  if (error) throw new Error(`Failed to load referral ${code}: ${error.message}`);
  return data ? rowToReferral(data as StoredReferral) : null;
}

async function writeClick(code: string, visitorId: string, userAgent: string | null): Promise<void> {
  const { error } = await db().from(CLICKS).insert({
    code,
    visitorId,
    clickedAt: new Date().toISOString(),
    userAgent: userAgent?.replace(/\s+/g, " ").slice(0, 160) ?? null,
  });
  if (error && error.code !== "23505") {
    throw new Error(`Failed to record click on ${code}: ${error.message}`);
  }
}

/**
 * Count this visitor against the code once. Repeats update the timestamp only.
 * Returns whether this call was a new referral.
 */
export async function recordReferralClick(input: {
  code: string;
  visitorId: string;
  userAgent: string | null;
}): Promise<boolean> {
  const { data: prior, error: readError } = await db()
    .from(CLICKS)
    .select("visitorId")
    .eq("code", input.code)
    .eq("visitorId", input.visitorId)
    .maybeSingle();
  if (readError) throw new Error(`Failed to read clicks for ${input.code}: ${readError.message}`);

  const counted = clickCountsAsReferral(Boolean(prior));
  if (counted) {
    await writeClick(input.code, input.visitorId, input.userAgent);
    const { data: referral, error: loadError } = await db()
      .from(REFERRALS)
      .select("clicks")
      .eq("code", input.code)
      .maybeSingle();
    if (loadError || !referral) {
      throw new Error(`Failed to load referral ${input.code}: ${loadError?.message ?? "missing"}`);
    }
    const { error: updateError } = await db()
      .from(REFERRALS)
      .update({
        clicks: (referral.clicks as number) + 1,
        lastClickedAt: new Date().toISOString(),
        lastVisitorId: input.visitorId,
      })
      .eq("code", input.code);
    if (updateError) throw new Error(`Failed to count referral ${input.code}: ${updateError.message}`);
  } else {
    const { error } = await db()
      .from(CLICKS)
      .update({ clickedAt: new Date().toISOString() })
      .eq("code", input.code)
      .eq("visitorId", input.visitorId);
    if (error) throw new Error(`Failed to refresh click on ${input.code}: ${error.message}`);
    await db()
      .from(REFERRALS)
      .update({ lastClickedAt: new Date().toISOString(), lastVisitorId: input.visitorId })
      .eq("code", input.code);
  }
  return counted;
}

/** Newest first. A missing table (schema not applied yet) yields an empty ledger, not a dead admin. */
export async function fetchReferrals(): Promise<StoredReferral[]> {
  if (!isJobsDbConfigured()) return [];
  const { data, error } = await db()
    .from(REFERRALS)
    .select("*")
    .order("createdAt", { ascending: false })
    .limit(500);
  if (error) {
    if (/job_referrals|schema cache|does not exist/i.test(error.message)) return [];
    throw new Error(`Failed to load referrals: ${error.message}`);
  }
  return ((data ?? []) as StoredReferral[]).map(rowToReferral);
}
