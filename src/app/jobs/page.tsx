import type { Metadata } from "next";

import { JobsExplorer } from "@/components/jobs-explorer";
import { LegalPageShell } from "@/components/legal-page-shell";
import { loadLiveJobs } from "@/lib/jobs-server";
import { isReferralCode } from "@/lib/referrals";
import { findReferral } from "@/lib/referrals-store";

export const metadata: Metadata = {
  title: "Jobs",
  description:
    "Browse the current live roles W3 Sourcing is recruiting for — search by title, reference, or tech stack, then message Perry Barrow directly about any role.",
};

/**
 * Rebuilt at most once a minute; admin edits call `revalidatePath("/jobs")`, so
 * Perry's changes are live immediately rather than on the next window.
 */
export const revalidate = 60;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const jobs = await loadLiveJobs();
  const params = await searchParams;
  const code = typeof params.r === "string" ? params.r.toUpperCase() : "";
  const referral = isReferralCode(code) ? await findReferral(code).catch(() => null) : null;

  return (
    <LegalPageShell>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <span className="glass-chip mb-5 inline-block rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Jobs
          </span>
          <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Roles we are actively recruiting for
          </h1>
        </div>
        <JobsExplorer
          jobs={jobs}
          activeReferral={referral ? { code: referral.code, jobRef: referral.jobRef } : null}
        />
      </div>
    </LegalPageShell>
  );
}
