"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Mail, MapPin, Search } from "lucide-react";

import { PERRY_LINKEDIN_URL } from "@/content/contact-links";
import { buildJobMailtoHref, filterJobs, type LiveJob } from "@/lib/jobs";

const PAGE_SIZE = 24;

function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function formatPostedDate(iso: string | null): string | null {
  if (!iso) return null;
  const parsed = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function techStackChips(techStack: string | null): string[] {
  if (!techStack) return [];
  return techStack
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export function JobsExplorer({ jobs }: { jobs: LiveJob[] }) {
  const [query, setQuery] = useState("");
  const [roleGroup, setRoleGroup] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const roleGroups = useMemo(
    () =>
      [...new Set(jobs.map((j) => j.roleGroup).filter((v): v is string => Boolean(v)))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [jobs],
  );
  const workplaces = useMemo(
    () =>
      [...new Set(jobs.map((j) => j.workplace).filter((v): v is string => Boolean(v)))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [jobs],
  );

  const filtered = useMemo(
    () =>
      filterJobs(jobs, {
        query,
        roleGroup: roleGroup || undefined,
        workplace: workplace || undefined,
      }),
    [jobs, query, roleGroup, workplace],
  );
  const visible = filtered.slice(0, visibleCount);

  const resetPaging = () => setVisibleCount(PAGE_SIZE);

  return (
    <div>
      <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-8">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
              strokeWidth={2}
              aria-hidden
            />
            <span className="sr-only">Search live jobs</span>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetPaging();
              }}
              placeholder="Search by job title, company, tech stack, or location…"
              className="glass-control w-full rounded-xl py-3 pl-10 pr-4 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/25 transition-all"
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter by role group</span>
            <select
              value={roleGroup}
              onChange={(e) => {
                setRoleGroup(e.target.value);
                resetPaging();
              }}
              className="glass-control w-full rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/25 transition-all md:w-56"
            >
              <option value="">All role groups</option>
              {roleGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Filter by workplace</span>
            <select
              value={workplace}
              onChange={(e) => {
                setWorkplace(e.target.value);
                resetPaging();
              }}
              className="glass-control w-full rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/25 transition-all md:w-44"
            >
              <option value="">Any workplace</option>
              {workplaces.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs font-medium text-muted" aria-live="polite">
          Showing {visible.length.toLocaleString("en-GB")} of {filtered.length.toLocaleString("en-GB")} live roles
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center">
          <p className="text-primary font-semibold">No roles match that search.</p>
          <p className="mt-2 text-sm text-text-secondary">
            Try a broader keyword, or message Perry directly — new mandates open every week.
          </p>
          <a
            href={PERRY_LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            <LinkedInGlyph className="size-4" />
            DM Perry on LinkedIn
          </a>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((job) => {
            const posted = formatPostedDate(job.postedDate);
            const chips = techStackChips(job.techStack);
            return (
              <article
                key={job.link}
                className="glass-panel flex flex-col rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_16px_44px_rgb(15_23_42_/_0.1)] dark:hover:shadow-[0_16px_44px_rgb(0_0_0_/_0.4)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold leading-snug text-primary">{job.role}</h3>
                    <p className="mt-1 text-sm font-semibold text-accent">
                      {job.website ? (
                        <a
                          href={job.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {job.company}
                        </a>
                      ) : (
                        job.company
                      )}
                      {job.sector ? (
                        <span className="font-medium text-muted"> · {job.sector}</span>
                      ) : null}
                    </p>
                  </div>
                  {posted ? (
                    <span className="glass-chip shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-text-secondary whitespace-nowrap">
                      {posted}
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-text-secondary">
                  {job.locations ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5 text-muted" strokeWidth={2} aria-hidden />
                      {job.locations}
                    </span>
                  ) : null}
                  {job.workplace ? <span>{job.workplace}</span> : null}
                  {job.salary ? <span className="text-primary">{job.salary}</span> : null}
                  {job.yoe ? <span>{job.yoe} exp.</span> : null}
                  {job.multiHire === "Yes" && job.hiringCount ? (
                    <span className="text-accent">{job.hiringCount} openings</span>
                  ) : null}
                </div>

                {job.oneLiner ? (
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">{job.oneLiner}</p>
                ) : null}

                {chips.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {chips.map((chip) => (
                      <span
                        key={chip}
                        className="glass-chip rounded-md px-2 py-0.5 text-[11px] font-medium text-text-secondary"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : null}

                {job.visa ? (
                  <p className="mt-3 text-xs text-muted">Visa: {job.visa}</p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2 pt-1">
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-hover"
                  >
                    View job description
                    <ArrowUpRight className="size-3.5" strokeWidth={2} aria-hidden />
                  </a>
                  <a
                    href={PERRY_LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-panel glass-panel--chrome inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-primary transition-colors hover:text-accent"
                  >
                    <LinkedInGlyph className="size-3.5" />
                    DM Perry on LinkedIn
                  </a>
                  <a
                    href={buildJobMailtoHref(job)}
                    className="glass-panel glass-panel--chrome inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-primary transition-colors hover:text-accent"
                  >
                    <Mail className="size-3.5" strokeWidth={2} aria-hidden />
                    Email about this role
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {filtered.length > visible.length ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="glass-panel glass-panel--chrome inline-flex items-center justify-center rounded-xl px-8 py-3 text-sm font-semibold text-primary transition-all hover:text-accent"
          >
            Load more roles ({(filtered.length - visible.length).toLocaleString("en-GB")} remaining)
          </button>
        </div>
      ) : null}
    </div>
  );
}
