import type { Metadata } from "next";

import { JobsExplorer } from "@/components/jobs-explorer";
import { LegalPageShell } from "@/components/legal-page-shell";
import { PERRY_LINKEDIN_URL } from "@/content/contact-links";
import { loadLiveJobs } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Live jobs",
  description:
    "Browse the current live roles W3 Sourcing is recruiting for — search by title, company, or tech stack, then message Perry Barrow directly about any role.",
};

export default function JobsPage() {
  const jobs = loadLiveJobs();

  return (
    <LegalPageShell>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <span className="glass-chip mb-5 inline-block rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Current live jobs
          </span>
          <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-primary sm:text-4xl lg:text-5xl">
            Roles we are actively recruiting for
          </h1>
          <p className="mt-5 text-base leading-relaxed text-text-secondary sm:text-lg">
            {jobs.length.toLocaleString("en-GB")} open mandates, refreshed from our live pipeline.
            Search for a job title or browse everything — then{" "}
            <a
              href={PERRY_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
            >
              DM Perry on LinkedIn
            </a>{" "}
            or send a prefilled email about any role that fits.
          </p>
        </div>
        <JobsExplorer jobs={jobs} />
      </div>
    </LegalPageShell>
  );
}
