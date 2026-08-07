"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  isValidPassword,
  isValidSession,
  sessionToken,
} from "@/lib/admin-auth";
import { jobsFromCsv } from "@/lib/jobs-csv";
import { newRef, toRef } from "@/lib/jobs";
import { deleteJob, updateJob, upsertJobs, type JobRow } from "@/lib/jobs-store";

/** What every form action hands back to the UI. */
export type ActionState = { ok?: string; error?: string };

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
  const password = String(formData.get("password") ?? "");
  if (!isValidPassword(password)) return { error: "That password is not right." };
  (await cookies()).set(ADMIN_COOKIE, sessionToken(password), {
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

export async function setHot(ref: string, hot: boolean): Promise<void> {
  await requireAdmin();
  await updateJob(ref, { hot });
  publish();
}

export async function importCsv(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const file = formData.get("file");
  const pasted = String(formData.get("pasted") ?? "").trim();
  const text = file instanceof File && file.size > 0 ? await file.text() : pasted;
  if (!text) return { error: "Choose a CSV file or paste some rows first." };

  const { jobs, errors, ignoredColumns } = jobsFromCsv(text);
  if (jobs.length === 0) {
    return { error: errors.join(" ") || "No rows to import." };
  }

  await upsertJobs(jobs);
  publish();

  const notes = [`Imported ${jobs.length} role${jobs.length === 1 ? "" : "s"}.`];
  if (ignoredColumns.length > 0) notes.push(`Ignored unknown columns: ${ignoredColumns.join(", ")}.`);
  if (errors.length > 0) notes.push(`${errors.length} row(s) skipped — ${errors.slice(0, 5).join(" ")}`);
  return { ok: notes.join(" ") };
}
