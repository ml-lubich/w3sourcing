import type { Metadata } from "next";

import { isAdminConfigured } from "@/lib/admin-auth";
import { fetchJobs, isJobsDbConfigured } from "@/lib/jobs-store";

import { isAdminSession } from "./actions";
import { AdminJobs } from "./admin-jobs";
import { AdminLogin } from "./admin-login";

export const metadata: Metadata = {
  title: "Jobs admin",
  robots: { index: false, follow: false },
};

/** Always live: this is the editor's view of the board, never a cached page. */
export const dynamic = "force-dynamic";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">W3 Sourcing</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary">Jobs admin</h1>
      {children}
    </main>
  );
}

export default async function AdminPage() {
  if (!isAdminConfigured() || !isJobsDbConfigured()) {
    return (
      <Shell>
        <div className="glass-panel mt-8 rounded-2xl p-6 text-sm text-text-secondary">
          <p className="font-semibold text-primary">Not configured yet.</p>
          <p className="mt-2">
            This environment is missing{" "}
            {[
              !isAdminConfigured() && "ADMIN_EMAIL / ADMIN_PASSWORD",
              !isJobsDbConfigured() && "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY",
            ]
              .filter(Boolean)
              .join(" and ")}
            . See <code>docs/DEPLOYMENT.md</code> — the live board keeps serving the committed
            Paraform export until Supabase is wired up.
          </p>
        </div>
      </Shell>
    );
  }

  if (!(await isAdminSession())) {
    return (
      <Shell>
        <AdminLogin />
      </Shell>
    );
  }

  return (
    <Shell>
      <AdminJobs jobs={await fetchJobs()} />
    </Shell>
  );
}
