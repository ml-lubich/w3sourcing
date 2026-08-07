import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
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

function Shell({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        {/* The wordmark is the way back to the public site. */}
        <Link href="/" className="group inline-flex items-center gap-3" aria-label="Back to w3sourcing.com">
          <Image
            src="/images/logo_w3_sourcing_wordmark.png"
            alt="W3 Sourcing"
            width={184}
            height={72}
            priority
            className="h-9 w-[140px] object-contain transition-transform duration-200 group-hover:scale-[1.03] dark:brightness-0 dark:invert"
          />
        </Link>
        <ThemeToggle />
      </div>

      {center ? (
        <div className="grid min-h-[70vh] place-items-center">{children}</div>
      ) : (
        <>
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-primary">Jobs admin</h1>
          {children}
        </>
      )}
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
      <Shell center>
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
