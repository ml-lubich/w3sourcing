"use server";

import { isJobsDbConfigured } from "@/lib/jobs-store";
import {
  countsOnIssue,
  isReferralCode,
  mintReferralCode,
  type ReferralChannel,
} from "@/lib/referrals";
import { insertReferral, jobRefExists } from "@/lib/referrals-store";
import { currentVisitorId } from "@/lib/visitor-id";

const CHANNELS = new Set<ReferralChannel>(["copy", "email", "linkedin"]);

/**
 * Mint a unique code for one live role. Public on purpose: the jobs board
 * calls it when someone copies a link or contacts Perry. It only accepts a
 * role that is already on the board, and it never returns the ATS url.
 */
export async function issueJobReferral(jobRef: string, channel: ReferralChannel): Promise<string> {
  if (!isJobsDbConfigured()) throw new Error("Referrals are not configured.");
  if (!CHANNELS.has(channel)) throw new Error("Unknown referral channel.");
  const ref = jobRef.trim();
  if (!ref.startsWith("W3-")) throw new Error("Unknown role.");
  if (!(await jobRefExists(ref))) throw new Error("Unknown role.");

  const code = mintReferralCode((length) => crypto.getRandomValues(new Uint8Array(length)));
  if (!isReferralCode(code)) throw new Error("Could not mint a referral code.");

  const visitorId = await currentVisitorId();
  const now = new Date().toISOString();
  const countsNow = countsOnIssue(channel);
  await insertReferral(
    {
      code,
      jobRef: ref,
      channel,
      createdAt: now,
      clicks: countsNow ? 1 : 0,
      lastClickedAt: countsNow ? now : null,
      lastVisitorId: countsNow ? visitorId : null,
    },
    countsNow ? visitorId : null,
  );
  return code;
}
