import { PERRY_EMAIL } from "@/content/contact-links";
import liveJobsData from "@/content/live-jobs.json";

/**
 * Raw Paraform export row. This shape is server-only — it carries client-
 * identifying fields (company, website, Paraform link, taglines) that must
 * never reach the browser. `loadLiveJobs` masks it down to {@link LiveJob}
 * before anything is handed to a client component.
 */
type RawJob = {
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

/**
 * Public, candidate-facing role. Per Perry's request (2026-07-13) every client
 * identifier is stripped server-side: no company name, no company website, no
 * Paraform link, no marketing tagline, no free-text visa notes (which can name
 * the client). Candidates get enough substance to self-select, and a W3
 * reference number to quote when contacting Perry.
 */
export type LiveJob = {
  ref: string;
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
  multiHire: string | null;
  hiringCount: string | null;
};

/** The export mixes label variants for the same workplace mode. */
const WORKPLACE_LABELS: Record<string, string> = {
  ONSITE: "On-site",
};

/**
 * Stable, human-quotable reference from the Paraform role id (unique per role,
 * so refs never collide and don't shift when the pipeline refreshes).
 */
function toRef(link: string): string {
  const id = link.split("/").filter(Boolean).pop() ?? link;
  return `W3-${id.slice(-6).toUpperCase()}`;
}

/**
 * Reduce visa to availability only. The export's parenthetical detail often
 * names the client ("Ender is not sponsoring…"), so drop everything after the
 * first "(".
 */
function toVisaStatus(visa: string | null): string | null {
  if (!visa) return null;
  const status = visa.split("(")[0].trim();
  return status || null;
}

export function loadLiveJobs(): LiveJob[] {
  const jobs: LiveJob[] = (liveJobsData as RawJob[]).map((job) => ({
    ref: toRef(job.link),
    role: job.role,
    roleGroup: job.roleGroup,
    roleType: job.roleType,
    sector: job.sector,
    locations: job.locations,
    workplace: job.workplace ? (WORKPLACE_LABELS[job.workplace] ?? job.workplace) : null,
    salary: job.salary,
    yoe: job.yoe,
    techStack: job.techStack,
    visa: toVisaStatus(job.visa),
    postedDate: job.postedDate,
    multiHire: job.multiHire,
    hiringCount: job.hiringCount,
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
      job.ref,
      job.role,
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

/** Prefilled auto-message to Perry about one specific role (by W3 reference). */
export function buildJobMailtoHref(job: LiveJob): string {
  const subject = `Interested in ${job.role} — ${job.ref} (via w3sourcing.com)`;
  const body = [
    "Hi Perry,",
    "",
    `I saw the ${job.role} role (ref ${job.ref}) on the W3 Sourcing live jobs page and would like further details.`,
    "",
    "My LinkedIn profile: ",
    "A little about me: ",
    "",
    "Thanks,",
    "",
  ].join("\n");
  return `mailto:${PERRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
