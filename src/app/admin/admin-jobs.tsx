"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import { ChartPie, Check, Flame, Link2, List, MousePointerClick, Pencil, Plus, Search, Sparkles, Trash2, Upload } from "lucide-react";

import { issueJobReferral } from "@/app/jobs/referral-actions";
import { RoleIcon } from "@/components/role-icon";
import { jobPermalink } from "@/lib/jobs";
import { referralPath } from "@/lib/referrals";
import { CSV_TEMPLATE_COLUMNS } from "@/lib/jobs-csv";
import type { StoredReferral } from "@/lib/referrals-store";
import type { JobRow } from "@/lib/jobs-store";

import {
  askAssistant,
  importCsv,
  logout,
  removeJob,
  removeJobs,
  saveJob,
  setHot,
  type ActionState,
} from "./actions";
import { AdminReferrals } from "./admin-referrals";
import { AdminStats } from "./admin-stats";
import { AssistantMessage } from "./assistant-message";

const INPUT =
  "w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm text-primary outline-none focus:border-accent dark:border-white/15 dark:bg-white/5";
const BUTTON =
  "inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-60";
/** Colourless base: a caller that needs its own text colour composes onto this, */
const GHOST_BASE =
  "inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold transition-colors dark:border-white/15";
/** …rather than fighting a baked-in `text-*` that may win on stylesheet order. */
const GHOST_TEXT = "text-text-secondary hover:text-accent";
const GHOST_BUTTON = `${GHOST_BASE} ${GHOST_TEXT}`;

/** Rows render a page at a time; the rest arrive as the editor scrolls. */
const PAGE_SIZE = 40;

const TEMPLATE_CSV = `${CSV_TEMPLATE_COLUMNS.join(",")}\nSenior Backend Engineer,Acme,Engineering - AI/ML,Backend Engineer,AI,Singapore,Hybrid,S$150K - S$200K,5 - 10 years,"Go, Postgres",Available,2026-08-06,,https://acme.com,,No,1,yes\n`;

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
      <div className="relative flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-primary">{job ? `Edit ${job.ref}` : "Add a role"}</h2>
        <button type="button" onClick={onDone} className={GHOST_BUTTON}>
          Cancel
        </button>
      </div>

      <p className="relative mt-1 text-xs text-text-secondary">
        Only the role title is required. Company, website, and the ATS link stay internal — the
        public board never shows them.
      </p>

      <div className="relative mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="relative mt-5 flex flex-wrap items-center gap-6">
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <input type="checkbox" name="hot" defaultChecked={job?.hot} className="size-4 accent-orange-500" />
          <Flame className="size-4 text-orange-500" aria-hidden /> New hot job
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" name="multiHire" defaultChecked={job?.multiHire === "Yes"} className="size-4" />
          Hiring more than one
        </label>
      </div>

      {state.error ? (
        <p className="relative mt-4 text-sm text-red-600 dark:text-red-400">{state.error}</p>
      ) : null}

      <button type="submit" disabled={pending} className={`relative mt-5 ${BUTTON}`}>
        {pending ? "Saving…" : job ? "Save changes" : "Publish role"}
      </button>
    </form>
  );
}

function CsvImport({ onDone }: { onDone: () => void }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(importCsv, {});

  return (
    <form action={formAction} className="glass-panel mt-6 rounded-2xl p-6">
      <div className="relative flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-primary">Import a CSV</h2>
        <button type="button" onClick={onDone} className={GHOST_BUTTON}>
          Close
        </button>
      </div>
      <p className="relative mt-1 text-xs text-text-secondary">
        Column names are matched loosely (<code>job title</code>, <code>location</code>,{" "}
        <code>comp</code>… all work) and anything unrecognised is ignored. Rows carrying the same
        ATS link as an existing role update it instead of duplicating it. Add a <code>hot</code>{" "}
        column with <code>yes</code> to flag hot roles. Dates read day-first (05/08/2026 is 5 August).
      </p>

      <input type="file" name="file" accept=".csv,text/csv" className={`relative mt-4 ${INPUT}`} />
      <textarea
        name="pasted"
        rows={4}
        placeholder="…or paste CSV rows here (with a header row)"
        className={`relative mt-3 ${INPUT}`}
      />

      {/* The weekly rhythm: the export is the board, so what it drops comes down. */}
      <label className="relative mt-4 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
        <input type="checkbox" name="replace" className="mt-0.5 size-4 accent-amber-500" />
        <span className="text-sm">
          <span className="font-semibold text-primary">Replace the board</span>
          <span className="block text-xs text-text-secondary">
            Remove every role that is not in this file. Use this for the weekly Paraform batch —
            roles that have been filled or pulled come down in the same step. Leave it off to add to
            the board without touching what is already there.
          </span>
        </span>
      </label>

      <label className="relative mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <input type="checkbox" name="hot" className="size-4 accent-orange-500" />
        <Flame className="size-4 text-orange-500" aria-hidden /> Mark every imported role as hot
      </label>

      {state.error ? (
        <p className="relative mt-4 text-sm text-red-600 dark:text-red-400">{state.error}</p>
      ) : null}
      {state.ok ? (
        <p className="relative mt-4 text-sm text-emerald-700 dark:text-emerald-400">{state.ok}</p>
      ) : null}

      <div className="relative mt-5 flex flex-wrap items-center gap-3">
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

function CopyLinkButton({ job }: { job: JobRow }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback(async () => {
    let url = `${window.location.origin}${jobPermalink(job.ref)}`;
    try {
      const code = await issueJobReferral(job.ref, "copy");
      url = `${window.location.origin}${referralPath(code)}`;
    } catch {
      // The plain anchor still works when the referral ledger is offline.
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this link", url);
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }, [job.ref]);

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`${GHOST_BASE} ${
        copied
          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : GHOST_TEXT
      }`}
    >
      {copied ? (
        <>
          <Check className="size-3.5" aria-hidden /> Link copied
        </>
      ) : (
        <>
          <Link2 className="size-3.5" aria-hidden /> Copy link
        </>
      )}
    </button>
  );
}

/** Starters so the desk never faces an empty box. */
const ASSISTANT_PROMPTS = [
  "What stands out about the board right now?",
  "Which roles look like they deserve the hot flag?",
  "Where are we most concentrated — clients, sectors, locations?",
  "Which roles have gone stale and need a refresh?",
];

function AdminAssistant() {
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      role: "user" | "assistant";
      text: string;
      model?: string;
      action?: NonNullable<ActionState["action"]>;
    }>
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(promptText?: string) {
    const textToSend = promptText ?? input;
    if (!textToSend.trim() || loading) return;

    setError(null);
    setInput("");
    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `ai-${Date.now()}`;

    setMessages((prev) => [...prev, { id: userMsgId, role: "user", text: textToSend }]);
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("question", textToSend);
      const res = await askAssistant({}, fd);

      if (res.error) {
        setError(res.error);
      } else if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: "assistant",
            text: res.ok,
            action: res.action,
          },
        ]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to query assistant");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-panel mt-6 flex flex-col rounded-3xl border border-gray-border/50 bg-gradient-to-b from-surface to-surface/80 p-6 shadow-2xl backdrop-blur-xl dark:border-white/[0.08]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-border/40 pb-5 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_40%,transparent)]">
            <Sparkles className="size-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span>W3 Intelligence Assistant</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500 border border-emerald-500/20">
                Live Digest
              </span>
            </h2>
            <p className="text-xs text-text-secondary">
              Real-time job board digest with interactive batch operations (Hot, Unflag, Delete).
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setMessages([])}
            className="rounded-xl border border-gray-border/60 bg-surface/50 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-primary transition-colors"
          >
            Clear conversation
          </button>
        )}
      </div>

      {/* Suggested Starter Chips */}
      {messages.length === 0 && (
        <div className="my-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
            Suggested Queries
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ASSISTANT_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="group flex items-center justify-between rounded-2xl border border-gray-border/60 bg-surface/60 p-3.5 text-left text-xs font-medium text-text-secondary hover:border-accent/40 hover:bg-surface hover:text-primary transition-all duration-200 shadow-sm"
              >
                <span>{prompt}</span>
                <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message History & Animated Stream */}
      <div className="flex-1 space-y-4 overflow-y-auto py-4 min-h-[160px] max-h-[500px] pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-accent text-white font-medium rounded-tr-xs"
                  : "glass-chip text-primary border border-gray-border/40 dark:border-white/[0.06] rounded-tl-xs"
              }`}
            >
              {m.role === "assistant" ? (
                <AssistantMessage text={m.text} />
              ) : (
                <p>{m.text}</p>
              )}
            </div>

            {/* Interactive Tool Actions */}
            {m.action && (
              <div className="mt-2 w-full max-w-[90%]">
                <AssistantProposal action={m.action} />
              </div>
            )}
          </div>
        ))}
        {loading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
          <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
            <span className="size-2 rounded-full bg-accent animate-ping" />
            <span>Analyzing board digest…</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {error && (
        <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Modern Gemini-style Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative mt-2 flex items-center rounded-2xl border border-gray-border/80 bg-surface/90 p-1.5 shadow-inner focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 dark:border-white/[0.1] transition-all"
      >
        <input
          type="text"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or request role changes (e.g. mark AI roles hot, delete stale jobs)…"
          className="flex-1 bg-transparent px-4 py-2.5 text-sm text-primary placeholder:text-text-secondary/70 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex size-9 items-center justify-center rounded-xl bg-accent text-white shadow-md hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
        </button>
      </form>
    </div>
  );
}

/** Rich interactive action proposal with selectable/deselectable roles and confirmation */
function AssistantProposal({ action }: { action: NonNullable<ActionState["action"]> }) {
  const [selectedRefs, setSelectedRefs] = useState<Set<string>>(() => new Set(action.refs));
  const [done, setDone] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const actionType = action.type ?? (action.hot ? "hot" : "unhot");
  const isDelete = actionType === "delete";
  const isHot = actionType === "hot";

  function toggleRef(ref: string) {
    setSelectedRefs((prev) => {
      const next = new Set(prev);
      if (next.has(ref)) {
        next.delete(ref);
      } else {
        next.add(ref);
      }
      return next;
    });
  }

  function selectAll() {
    setSelectedRefs(new Set(action.refs));
  }

  function deselectAll() {
    setSelectedRefs(new Set());
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
        <Check className="size-4" /> {done}
      </div>
    );
  }

  const borderTone = isDelete
    ? "border-red-500/40 bg-red-500/5 dark:bg-red-500/10"
    : isHot
    ? "border-orange-500/40 bg-orange-500/5 dark:bg-orange-500/10"
    : "border-sky-500/40 bg-sky-500/5 dark:bg-sky-500/10";

  const titleText = isDelete
    ? `Delete ${selectedRefs.size} of ${action.refs.length} selected role(s)?`
    : isHot
    ? `Mark ${selectedRefs.size} of ${action.refs.length} role(s) hot?`
    : `Remove hot flag from ${selectedRefs.size} of ${action.refs.length} role(s)?`;

  return (
    <div className={`rounded-2xl border p-4 shadow-sm backdrop-blur-md ${borderTone}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isDelete ? (
            <Trash2 className="size-4 text-red-500" />
          ) : isHot ? (
            <Flame className="size-4 text-orange-500" />
          ) : (
            <Sparkles className="size-4 text-sky-500" />
          )}
          <span className="text-xs font-bold text-primary">{titleText}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <button
            type="button"
            onClick={selectAll}
            className="text-accent hover:underline font-medium"
          >
            Select all
          </button>
          <span className="text-text-secondary">·</span>
          <button
            type="button"
            onClick={deselectAll}
            className="text-text-secondary hover:underline"
          >
            Deselect all
          </button>
        </div>
      </div>

      {/* Selectable / Deselectable Role Pills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {action.refs.map((ref) => {
          const active = selectedRefs.has(ref);
          return (
            <button
              key={ref}
              type="button"
              onClick={() => toggleRef(ref)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                active
                  ? isDelete
                    ? "bg-red-500 text-white shadow-xs"
                    : isHot
                    ? "bg-orange-500 text-white shadow-xs"
                    : "bg-sky-500 text-white shadow-xs"
                  : "glass-chip text-text-secondary line-through opacity-60 hover:opacity-100"
              }`}
            >
              <span>{active ? "✓" : "✗"}</span>
              <span>{ref}</span>
            </button>
          );
        })}
      </div>

      {/* Action Execution Button */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          disabled={pending || selectedRefs.size === 0}
          onClick={() =>
            startTransition(async () => {
              const refsToApply = Array.from(selectedRefs);
              if (isDelete) {
                await removeJobs(refsToApply);
                setDone(`Deleted ${refsToApply.length} role${refsToApply.length === 1 ? "" : "s"} from the board.`);
              } else {
                await setHot(refsToApply, isHot);
                setDone(
                  `${isHot ? "Marked" : "Unflagged"} ${refsToApply.length} role${
                    refsToApply.length === 1 ? "" : "s"
                  }.`,
                );
              }
            })
          }
          className={`rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md transition-all cursor-pointer ${
            isDelete
              ? "bg-red-600 hover:bg-red-500 disabled:opacity-40"
              : isHot
              ? "bg-orange-600 hover:bg-orange-500 disabled:opacity-40"
              : "bg-sky-600 hover:bg-sky-500 disabled:opacity-40"
          }`}
        >
          {pending
            ? "Applying changes…"
            : `Confirm ${isDelete ? "Deletion" : isHot ? "Mark Hot" : "Unflag"} (${selectedRefs.size})`}
        </button>
      </div>
    </div>
  );
}

export function AdminJobs({
  jobs,
  referrals,
}: {
  jobs: JobRow[];
  referrals: StoredReferral[];
}) {
  // Hot toggles paint instantly and settle when the server action revalidates.
  const [list, applyHot] = useOptimistic(jobs, (current: JobRow[], patch: { refs: string[]; hot: boolean }) => {
    const refs = new Set(patch.refs);
    return current.map((job) => (refs.has(job.ref) ? { ...job, hot: patch.hot } : job));
  });
  const lastClicked = useRef<number | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"roles" | "dashboard" | "assistant" | "referrals">("roles");
  const [editing, setEditing] = useState<JobRow | null>(null);
  const [panel, setPanel] = useState<"none" | "add" | "import">("none");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set());
  const [pending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((job) =>
      [job.ref, job.role, job.company, job.locations, job.sector, job.roleGroup]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [list, query]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || visibleCount >= matches.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisibleCount((count) => Math.min(count + PAGE_SIZE, matches.length));
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [matches.length, visibleCount]);

  const hotCount = list.filter((job) => job.hot).length;
  const visible = matches.slice(0, visibleCount);

  const toggleHot = useCallback(
    (refs: string[], hot: boolean) =>
      startTransition(async () => {
        applyHot({ refs, hot });
        await setHot(refs, hot);
      }),
    [applyHot],
  );

  /** Shift-click extends from the last clicked row, the way file lists do. */
  const toggleRow = useCallback(
    (index: number, shiftKey: boolean) => {
      setSelected((prev) => {
        const next = new Set(prev);
        const turningOn = !next.has(visible[index].ref);
        const from = shiftKey && lastClicked.current !== null ? lastClicked.current : index;
        for (let i = Math.min(from, index); i <= Math.max(from, index); i++) {
          if (turningOn) next.add(visible[i].ref);
          else next.delete(visible[i].ref);
        }
        return next;
      });
      lastClicked.current = index;
    },
    [visible],
  );

  const selectedJobs = list.filter((job) => selected.has(job.ref));
  const selectedRefs = selectedJobs.map((job) => job.ref);
  const allSelectedHot = selectedJobs.length > 0 && selectedJobs.every((job) => job.hot);
  const someSelectedHot = selectedJobs.some((job) => job.hot);
  // Mixed selections behave like a bold button: the first press makes them all hot.
  const hotState = allSelectedHot ? "on" : someSelectedHot ? "mixed" : "off";
  const allMatchesSelected = matches.length > 0 && matches.every((job) => selected.has(job.ref));

  const removeSelected = () => {
    const refs = [...selected];
    if (refs.length === 0) return;
    const noun = refs.length === 1 ? "role" : "roles";
    if (!confirm(`Remove ${refs.length} ${noun} from the site? This cannot be undone.`)) return;
    startTransition(async () => {
      await removeJobs(refs);
      setSelected(new Set());
    });
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="glass-chip inline-flex rounded-xl p-1">
          {(
            [
              ["roles", "Roles", List],
              ["dashboard", "Dashboard", ChartPie],
              ["referrals", "Referrals", MousePointerClick],
              ["assistant", "Assistant", Sparkles],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              aria-pressed={view === id}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                view === id ? "bg-accent text-white" : "text-text-secondary hover:text-accent"
              }`}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setView("roles");
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
              setView("roles");
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

      {view === "assistant" ? (
        <AdminAssistant />
      ) : view === "referrals" ? (
        <AdminReferrals referrals={referrals} jobs={list} />
      ) : view === "dashboard" ? (
        <AdminStats jobs={list} />
      ) : (
        <>
          {panel === "import" ? <CsvImport onDone={() => setPanel("none")} /> : null}
          {panel === "add" && !editing ? <JobForm job={null} onDone={() => setPanel("none")} /> : null}
          {editing ? <JobForm key={editing.ref} job={editing} onDone={() => setEditing(null)} /> : null}

          <p className="mt-6 text-sm text-text-secondary">
            <strong className="text-primary">{list.length}</strong> live roles
            {hotCount > 0 ? ` · ${hotCount} hot` : ""}
          </p>

          <label className="relative mt-3 block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" aria-hidden />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                // A new search starts at the first page rather than deep in the old one.
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Search roles, companies, references…"
              className={`${INPUT} pl-9`}
            />
          </label>

          <div className="glass-chip sticky top-2 z-10 mt-4 flex flex-wrap items-center gap-3 rounded-xl px-3 py-2">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <input
                type="checkbox"
                checked={allMatchesSelected}
                disabled={matches.length === 0}
                ref={(node) => {
                  if (node) node.indeterminate = !allMatchesSelected && selected.size > 0;
                }}
                onChange={(event) =>
                  setSelected(event.target.checked ? new Set(matches.map((job) => job.ref)) : new Set())
                }
                // Selecting covers everything the search matches, not just the rows
                // scrolled into view — otherwise this would mean "the first 40".
                aria-label={
                  query.trim()
                    ? `Select all ${matches.length} roles matching this search`
                    : `Select all ${matches.length} roles`
                }
                className="size-4 accent-accent"
              />
              {selected.size > 0 ? `${selected.size} selected` : `Select all ${matches.length}`}
            </label>

            <button
              type="button"
              disabled={selected.size === 0}
              aria-pressed={hotState === "off" ? false : hotState === "on" ? true : "mixed"}
              title={
                hotState === "on" ? "Remove the hot flag from the selection" : "Mark the selection as hot"
              }
              onClick={() => toggleHot(selectedRefs, !allSelectedHot)}
              className={`${GHOST_BASE} disabled:opacity-40 ${
                hotState === "off" ? GHOST_TEXT : "border-orange-500/50 bg-orange-500/10 text-orange-500"
              }`}
            >
              <Flame
                className="size-4"
                fill={hotState === "off" ? "none" : "currentColor"}
                fillOpacity={hotState === "mixed" ? 0.4 : 1}
                aria-hidden
              />
              {hotState === "on" ? "Hot" : hotState === "mixed" ? "Partly hot" : "Mark hot"}
            </button>

            {selected.size > 0 ? (
              <>
                <button
                  type="button"
                  disabled={pending}
                  onClick={removeSelected}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                >
                  <Trash2 className="size-4" aria-hidden />
                  {pending ? "Removing…" : `Remove selected (${selected.size})`}
                </button>
                <button type="button" onClick={() => setSelected(new Set())} className={`${GHOST_BASE} ${GHOST_TEXT}`}>
                  Clear
                </button>
              </>
            ) : (
              <span className="text-xs text-text-secondary">
                Tip: tick rows (shift-click for a range), then hit the flame.
              </span>
            )}
          </div>

          <ul className="mt-2 divide-y divide-black/5 dark:divide-white/10">
            {visible.map((job, index) => (
              <li
                key={job.ref}
                className={`flex flex-wrap items-center gap-3 py-3 ${
                  selected.has(job.ref) ? "bg-accent/5" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(job.ref)}
                  onChange={() => undefined}
                  onClick={(event) => toggleRow(index, event.shiftKey)}
                  aria-label={`Select ${job.role} (${job.ref})`}
                  className="size-4 shrink-0 accent-accent"
                />
                <button
                  type="button"
                  title={job.hot ? "Remove hot flag" : "Mark as a new hot job"}
                  aria-pressed={job.hot}
                  onClick={() => toggleHot([job.ref], !job.hot)}
                  className={`rounded-lg p-2 transition-colors ${
                    job.hot ? "text-orange-500" : "text-text-secondary hover:text-orange-500"
                  }`}
                >
                  <Flame className="size-4" fill={job.hot ? "currentColor" : "none"} aria-hidden />
                </button>

                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent/18 to-cyan-400/10 text-accent">
                  <RoleIcon job={job} className="size-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-primary">{job.role}</p>
                  <p className="truncate text-xs text-text-secondary">
                    {[job.company, job.locations, job.postedDate].filter(Boolean).join(" · ")}
                  </p>
                </div>

                <span className="glass-chip rounded-md px-2 py-0.5 text-[11px] font-semibold text-text-secondary">
                  {job.ref}
                </span>

                <CopyLinkButton job={job} />
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

          <div ref={sentinelRef} aria-hidden className="h-px" />

          {matches.length === 0 ? (
            <p className="py-8 text-sm text-text-secondary">No roles match “{query}”.</p>
          ) : null}
          {visibleCount < matches.length ? (
            <p className="py-4 text-xs text-text-secondary">
              Showing {visibleCount} of {matches.length} — keep scrolling to load more.
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
