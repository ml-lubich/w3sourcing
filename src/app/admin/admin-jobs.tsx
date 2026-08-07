"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import { Flame, Pencil, Plus, Search, Trash2, Upload } from "lucide-react";

import { CSV_TEMPLATE_COLUMNS } from "@/lib/jobs-csv";
import type { JobRow } from "@/lib/jobs-store";

import { importCsv, logout, removeJob, saveJob, setHot, type ActionState } from "./actions";

const INPUT =
  "w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm text-primary outline-none focus:border-accent dark:border-white/15 dark:bg-white/5";
const BUTTON =
  "inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-60";
const GHOST_BUTTON =
  "inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold text-text-secondary transition-colors hover:text-accent dark:border-white/15";

/** How many rows to render at once — the board runs to hundreds of roles. */
const LIST_LIMIT = 60;

const TEMPLATE_CSV = `${CSV_TEMPLATE_COLUMNS.join(",")}\nSenior Backend Engineer,Acme,Engineering - AI/ML,Backend Engineer,AI,Singapore,Hybrid,$150K - $200K,5 - 10 years,"Go, Postgres",Available,2026-08-06,,https://acme.com,,No,1,yes\n`;

function Field({
  name,
  label,
  defaultValue,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className={`mt-1 ${INPUT}`}
      />
    </label>
  );
}

function JobForm({ job, onDone }: { job: JobRow | null; onDone: () => void }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(async (prev, data) => {
    const result = await saveJob(prev, data);
    if (result.ok) onDone();
    return result;
  }, {});

  return (
    <form action={formAction} className="glass-panel mt-6 rounded-2xl p-6">
      <input type="hidden" name="ref" defaultValue={job?.ref ?? ""} />
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-primary">
          {job ? `Edit ${job.ref}` : "Add a role"}
        </h2>
        <button type="button" onClick={onDone} className={GHOST_BUTTON}>
          Cancel
        </button>
      </div>

      <p className="mt-1 text-xs text-text-secondary">
        Only the role title is required. Company, website, and the ATS link stay internal — the
        public board never shows them.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field name="role" label="Role title" defaultValue={job?.role} required />
        <Field name="company" label="Company (internal)" defaultValue={job?.company} />
        <Field name="locations" label="Locations" defaultValue={job?.locations} placeholder="Singapore, London" />
        <Field name="workplace" label="Workplace" defaultValue={job?.workplace} placeholder="On-site / Hybrid / Remote" />
        <Field name="salary" label="Salary" defaultValue={job?.salary} placeholder="$150K - $200K" />
        <Field name="yoe" label="Experience" defaultValue={job?.yoe} placeholder="5 - 10 years" />
        <Field name="roleGroup" label="Role group" defaultValue={job?.roleGroup} placeholder="Engineering - AI/ML" />
        <Field name="roleType" label="Role type" defaultValue={job?.roleType} placeholder="Backend Engineer" />
        <Field name="sector" label="Sector" defaultValue={job?.sector} placeholder="AI" />
        <Field name="techStack" label="Tech stack" defaultValue={job?.techStack} placeholder="Go, Postgres" />
        <Field name="visa" label="Visa" defaultValue={job?.visa} placeholder="Available" />
        <Field name="postedDate" label="Posted date" type="date" defaultValue={job?.postedDate} />
        <Field name="hiringCount" label="Openings" defaultValue={job?.hiringCount} placeholder="1 - 2" />
        <Field name="link" label="ATS link (internal)" defaultValue={job?.link} />
        <Field name="website" label="Company website (internal)" defaultValue={job?.website} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-6">
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <input type="checkbox" name="hot" defaultChecked={job?.hot} className="size-4 accent-orange-500" />
          <Flame className="size-4 text-orange-500" aria-hidden /> New hot job
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" name="multiHire" defaultChecked={job?.multiHire === "Yes"} className="size-4" />
          Hiring more than one
        </label>
      </div>

      {state.error ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">{state.error}</p> : null}

      <button type="submit" disabled={pending} className={`mt-5 ${BUTTON}`}>
        {pending ? "Saving…" : job ? "Save changes" : "Publish role"}
      </button>
    </form>
  );
}

function CsvImport({ onDone }: { onDone: () => void }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(importCsv, {});

  return (
    <form action={formAction} className="glass-panel mt-6 rounded-2xl p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-primary">Import a CSV</h2>
        <button type="button" onClick={onDone} className={GHOST_BUTTON}>
          Close
        </button>
      </div>
      <p className="mt-1 text-xs text-text-secondary">
        Column names are matched loosely (<code>job title</code>, <code>location</code>,{" "}
        <code>comp</code>… all work) and anything unrecognised is ignored. Rows carrying the same
        ATS link as an existing role update it instead of duplicating it. Add a <code>hot</code>{" "}
        column with <code>yes</code> to flag hot roles.
      </p>

      <input type="file" name="file" accept=".csv,text/csv" className={`mt-4 ${INPUT}`} />
      <textarea
        name="pasted"
        rows={4}
        placeholder="…or paste CSV rows here (with a header row)"
        className={`mt-3 ${INPUT}`}
      />

      {state.error ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">{state.error}</p> : null}
      {state.ok ? <p className="mt-4 text-sm text-emerald-700 dark:text-emerald-400">{state.ok}</p> : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={BUTTON}>
          {pending ? "Importing…" : "Import roles"}
        </button>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(TEMPLATE_CSV)}`}
          download="w3-jobs-template.csv"
          className={GHOST_BUTTON}
        >
          Download template
        </a>
      </div>
    </form>
  );
}

export function AdminJobs({ jobs }: { jobs: JobRow[] }) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<JobRow | null>(null);
  const [panel, setPanel] = useState<"none" | "add" | "import">("none");
  const [pending, startTransition] = useTransition();

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return jobs;
    return jobs.filter((job) =>
      [job.ref, job.role, job.company, job.locations, job.sector, job.roleGroup]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [jobs, query]);

  const hotCount = jobs.filter((job) => job.hot).length;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-secondary">
          <strong className="text-primary">{jobs.length}</strong> live roles
          {hotCount > 0 ? ` · ${hotCount} hot` : ""}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setPanel(panel === "add" ? "none" : "add");
            }}
            className={BUTTON}
          >
            <Plus className="size-4" aria-hidden /> Add a role
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setPanel(panel === "import" ? "none" : "import");
            }}
            className={GHOST_BUTTON}
          >
            <Upload className="size-4" aria-hidden /> Import CSV
          </button>
          <a href="/jobs" className={GHOST_BUTTON}>
            View live board
          </a>
          <form action={logout}>
            <button type="submit" className={GHOST_BUTTON}>
              Sign out
            </button>
          </form>
        </div>
      </div>

      {panel === "import" ? <CsvImport onDone={() => setPanel("none")} /> : null}
      {panel === "add" && !editing ? <JobForm job={null} onDone={() => setPanel("none")} /> : null}
      {editing ? <JobForm key={editing.ref} job={editing} onDone={() => setEditing(null)} /> : null}

      <label className="relative mt-8 block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" aria-hidden />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search roles, companies, references…"
          className={`${INPUT} pl-9`}
        />
      </label>

      <ul className="mt-4 divide-y divide-black/5 dark:divide-white/10">
        {matches.slice(0, LIST_LIMIT).map((job) => (
          <li key={job.ref} className="flex flex-wrap items-center gap-3 py-3">
            <button
              type="button"
              title={job.hot ? "Remove hot flag" : "Mark as a new hot job"}
              aria-pressed={job.hot}
              disabled={pending}
              onClick={() => startTransition(() => void setHot(job.ref, !job.hot))}
              className={`rounded-lg p-2 transition-colors ${
                job.hot ? "text-orange-500" : "text-text-secondary hover:text-orange-500"
              }`}
            >
              <Flame className="size-4" fill={job.hot ? "currentColor" : "none"} aria-hidden />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-primary">{job.role}</p>
              <p className="truncate text-xs text-text-secondary">
                {[job.company, job.locations, job.postedDate].filter(Boolean).join(" · ")}
              </p>
            </div>

            <span className="glass-chip rounded-md px-2 py-0.5 text-[11px] font-semibold text-text-secondary">
              {job.ref}
            </span>

            <button
              type="button"
              onClick={() => {
                setPanel("none");
                setEditing(job);
              }}
              className={GHOST_BUTTON}
            >
              <Pencil className="size-3.5" aria-hidden /> Edit
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (confirm(`Remove "${job.role}" (${job.ref}) from the site?`)) {
                  startTransition(() => void removeJob(job.ref));
                }
              }}
              className={`${GHOST_BUTTON} hover:text-red-600`}
            >
              <Trash2 className="size-3.5" aria-hidden /> Remove
            </button>
          </li>
        ))}
      </ul>

      {matches.length === 0 ? (
        <p className="py-8 text-sm text-text-secondary">No roles match “{query}”.</p>
      ) : null}
      {matches.length > LIST_LIMIT ? (
        <p className="py-4 text-xs text-text-secondary">
          Showing the first {LIST_LIMIT} of {matches.length} matches — narrow the search to find a
          specific role.
        </p>
      ) : null}
    </div>
  );
}
