import { PERRY_EMAIL } from "@/content/contact-links";
import liveJobsData from "@/content/live-jobs.json";

/** One Paraform role from the recruiter export (public-safe fields only — no fees, no candidate data). */
export type LiveJob = {
  company: string;
  role: string;
  roleGroup: string | null;
  roleType: string | null;
  sector: string | null;
  locations: string | null;
  workplace: string | null;
  salary: string | null;
  yoe: string | null;
  techStack: string | null;
  visa: string | null;
  postedDate: string | null;
  link: string;
  website: string | null;
  oneLiner: string | null;
  multiHire: string | null;
  hiringCount: string | null;
};

/** The export mixes label variants for the same workplace mode. */
const WORKPLACE_LABELS: Record<string, string> = {
  ONSITE: "On-site",
};

/** Some export rows carry bare hosts (`deepgrove.ai`) that browsers would resolve relative to /jobs. */
function toAbsoluteUrl(website: string | null): string | null {
  if (!website) return null;
  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

export function loadLiveJobs(): LiveJob[] {
  const jobs = (liveJobsData as LiveJob[]).map((job) => ({
    ...job,
    workplace: job.workplace ? (WORKPLACE_LABELS[job.workplace] ?? job.workplace) : null,
    website: toAbsoluteUrl(job.website),
  }));
  return jobs.sort((a, b) => {
    if (!a.postedDate) return b.postedDate ? 1 : 0;
    if (!b.postedDate) return -1;
    return b.postedDate.localeCompare(a.postedDate);
  });
}

export type JobFilters = {
  query?: string;
  roleGroup?: string;
  workplace?: string;
};

export function filterJobs(jobs: LiveJob[], filters: JobFilters): LiveJob[] {
  const query = filters.query?.trim().toLowerCase();
  return jobs.filter((job) => {
    if (filters.roleGroup && job.roleGroup !== filters.roleGroup) return false;
    if (filters.workplace && job.workplace !== filters.workplace) return false;
    if (!query) return true;
    const haystack = [
      job.role,
      job.company,
      job.techStack,
      job.locations,
      job.sector,
      job.roleType,
      job.roleGroup,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

/** Prefilled auto-message to Perry about one specific role. */
export function buildJobMailtoHref(job: LiveJob): string {
  const subject = `Interested in ${job.role} at ${job.company} (via w3sourcing.com)`;
  const body = [
    "Hi Perry,",
    "",
    `I found the ${job.role} role at ${job.company} on the W3 Sourcing live jobs page and would like to hear more.`,
    "",
    "My LinkedIn profile: ",
    "A little about me: ",
    "",
    "Thanks,",
    "",
  ].join("\n");
  return `mailto:${PERRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
