"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  isValidLogin,
  isValidSession,
  sessionToken,
} from "@/lib/admin-auth";
import { aiConfigured, aiText } from "@/lib/ai";
import { parseAssistantAction, type AssistantAction } from "@/lib/assistant-action";
import { jobsDigest } from "@/lib/jobs-digest";
import { jobsFromCsv } from "@/lib/jobs-csv";
import { newRef, toRef } from "@/lib/jobs";
import {
  deleteJob,
  deleteJobs,
  deleteJobsExcept,
  fetchJobs,
  updateJobs,
  upsertJobs,
  type JobRow,
} from "@/lib/jobs-store";
import { removalSummary, syncSummary } from "@/lib/jobs-sync";

/** What every form action hands back to the UI. */
export type ActionState = {
  ok?: string;
  error?: string;
  /** Hot-flag change the assistant proposed; nothing is written until confirmed. */
  action?: AssistantAction;
};

export async function isAdminSession(): Promise<boolean> {
  return isValidSession((await cookies()).get(ADMIN_COOKIE)?.value);
}

/**
 * Server actions are public endpoints — the page-level check that renders the
 * editor is not access control. Every mutation re-checks the session here.
 */
async function requireAdmin(): Promise<void> {
  if (!(await isAdminSession())) throw new Error("Not signed in.");
}

/** Publish edits to the live board without waiting for the 60s revalidate. */
function publish(): void {
  revalidatePath("/jobs");
  revalidatePath("/admin");
}

export async function login(_state: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!isValidLogin(email, password)) return { error: "That email and password combination is not right." };
  (await cookies()).set(ADMIN_COOKIE, sessionToken(email, password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return { ok: "Signed in." };
}

export async function logout(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  revalidatePath("/admin");
}

function optional(formData: FormData, field: string): string | null {
  const value = String(formData.get(field) ?? "").trim();
  return value || null;
}

export async function saveJob(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const role = String(formData.get("role") ?? "").trim();
  if (!role) return { error: "A role title is required." };

  const existingRef = String(formData.get("ref") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();
  const job: JobRow = {
    // Deriving new refs from the ATS link keeps a later CSV import of the same
    // role an update rather than a duplicate.
    ref: existingRef || (link ? toRef(link) : newRef()),
    role,
    company: String(formData.get("company") ?? "").trim(),
    roleGroup: optional(formData, "roleGroup"),
    roleType: optional(formData, "roleType"),
    sector: optional(formData, "sector"),
    locations: optional(formData, "locations"),
    workplace: optional(formData, "workplace"),
    salary: optional(formData, "salary"),
    yoe: optional(formData, "yoe"),
    techStack: optional(formData, "techStack"),
    visa: optional(formData, "visa"),
    postedDate: optional(formData, "postedDate"),
    link,
    website: optional(formData, "website"),
    oneLiner: optional(formData, "oneLiner"),
    multiHire: formData.get("multiHire") ? "Yes" : "No",
    hiringCount: optional(formData, "hiringCount"),
    hot: formData.get("hot") !== null,
  };

  await upsertJobs([job]);
  publish();
  return { ok: existingRef ? `Saved ${job.ref}.` : `Added ${job.role} (${job.ref}).` };
}

export async function removeJob(ref: string): Promise<void> {
  await requireAdmin();
  await deleteJob(ref);
  publish();
}

/**
 * Take a hand-picked selection off the board in one step, rather than one
 * confirm dialog per role.
 */
export async function removeJobs(refs: string[]): Promise<ActionState> {
  await requireAdmin();
  const removed = await deleteJobs(refs);
  publish();
  return { ok: removalSummary(removed) };
}

export async function setHot(refs: string[], hot: boolean): Promise<void> {
  await requireAdmin();
  await updateJobs(refs, { hot });
  publish();
}

export async function importCsv(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const file = formData.get("file");
  const pasted = String(formData.get("pasted") ?? "").trim();
  const text = file instanceof File && file.size > 0 ? await file.text() : pasted;
  if (!text) return { error: "Choose a CSV file or paste some rows first." };

  const { jobs, errors, ignoredColumns } = jobsFromCsv(text);
  // A file that yielded nothing is a bad upload. Bail before the replace pass so
  // it can never be read as "clear the board".
  if (jobs.length === 0) {
    return { error: errors.join(" ") || "No rows to import." };
  }

  // The checkbox flags the whole batch; a `hot` column can still flag rows on its own.
  if (formData.get("hot") !== null) for (const job of jobs) job.hot = true;

  await upsertJobs(jobs);

  /**
   * Perry's weekly rhythm: the export *is* the live board, so anything it no
   * longer lists has been filled or pulled and should come down with it.
   */
  const replace = formData.get("replace") !== null;
  const removed = replace ? await deleteJobsExcept(jobs.map((job) => job.ref)) : null;

  publish();
  return { ok: syncSummary({ imported: jobs.length, removed, ignoredColumns, errors }) };
}

const ASSISTANT_SYSTEM = `You are the W3 Sourcing desk analyst. You are given a digest of the live
job board (facet counts plus the most recent roles) and one question from a recruiter.

Write the final answer only. Never show planning, analysis steps, numbered workings, or restated
constraints — the recruiter sees exactly what you output.

Answer only from the digest — if it does not contain the answer, say so plainly rather than guessing.
Be concrete: quote numbers, name clients and role refs (W3-xxxx). Keep it under 180 words, use short
lines or bullets, no preamble, no markdown headings.

When the recruiter asks you to flag roles as hot, or to take the hot flag off roles, end your reply
with one final line, exactly:
ACTION: HOT W3-AAA111, W3-BBB222
or
ACTION: UNHOT W3-AAA111
Only refs that appear in the digest. Nothing is changed by that line — the recruiter confirms it — so
say in your prose what you are proposing and why. Leave the line out entirely for ordinary questions.`;

/** Admin-only: the digest carries client names, so this never leaves the editor. */
export async function askAssistant(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  if (!aiConfigured()) return { error: "No OPENROUTER_API_KEY set — add one to .env.local (see docs/DEPLOYMENT.md)." };

  const question = String(formData.get("question") ?? "").trim();
  if (!question) return { error: "Ask a question first." };

  try {
    const jobs = await fetchJobs();
    const { text, model } = await aiText(
      ASSISTANT_SYSTEM,
      `Live board digest:\n${jobsDigest(jobs)}\n\nQuestion: ${question}`,
    );
    const { text: answer, action } = parseAssistantAction(text);
    // A model can name a role that is not on the board; only refs that really
    // exist reach the confirm button.
    const known = new Set(jobs.map((job) => job.ref.toUpperCase()));
    const refs = action?.refs.filter((ref) => known.has(ref)) ?? [];
    return {
      ok: `${answer}\n\n— ${model}`,
      action: action && refs.length > 0 ? { hot: action.hot, refs } : undefined,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The assistant failed." };
  }
}
