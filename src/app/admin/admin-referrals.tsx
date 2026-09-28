import type { StoredReferral } from "@/lib/referrals-store";
import type { JobRow } from "@/lib/jobs-store";
import { SITE_REFERRAL_RATE } from "@/lib/referrals";

function when(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * The ledger Perry uses to pay the site referral. One row per link. "People"
 * is distinct visitors, so a refresh is not a second commission.
 */
export function AdminReferrals({
  referrals,
  jobs,
}: {
  referrals: StoredReferral[];
  jobs: JobRow[];
}) {
  const roles = new Map(jobs.map((job) => [job.ref, job.role]));
  const people = referrals.reduce((sum, row) => sum + row.clicks, 0);
  const percent = Math.round(SITE_REFERRAL_RATE * 100);

  return (
    <div className="mt-6">
      <p className="text-sm text-text-secondary">
        <strong className="text-primary">{referrals.length}</strong> referral links ·{" "}
        <strong className="text-primary">{people}</strong> people
      </p>
      <p className="mt-2 max-w-3xl text-sm text-text-secondary">
        Each shared link and each email or LinkedIn click gets its own code. A person counts once
        per link. Match the code in the email subject to the sender — that is the record for the{" "}
        {percent}% commission when someone comes through the site.
      </p>

      {referrals.length === 0 ? (
        <p className="glass-panel mt-6 rounded-2xl p-6 text-sm text-text-secondary">
          No referral links yet. They appear when someone copies a role link, emails Perry about a
          role, or messages him on LinkedIn from the live board.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                <th className="py-2 pr-4">Code</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">How</th>
                <th className="py-2 pr-4">Issued</th>
                <th className="py-2 pr-4">People</th>
                <th className="py-2 pr-4">Last open</th>
                <th className="py-2">Visitor</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((row) => (
                <tr key={row.code} className="border-t border-black/5 dark:border-white/10">
                  <td className="py-2 pr-4 font-mono text-xs font-semibold text-primary">{row.code}</td>
                  <td className="py-2 pr-4 text-primary">
                    <span className="font-mono text-xs text-text-secondary">{row.jobRef}</span>
                    <span className="mt-0.5 block">{roles.get(row.jobRef) ?? "Role removed"}</span>
                  </td>
                  <td className="py-2 pr-4 capitalize text-text-secondary">{row.channel}</td>
                  <td className="py-2 pr-4 text-text-secondary">{when(row.createdAt)}</td>
                  <td className="py-2 pr-4 font-semibold text-primary">{row.clicks}</td>
                  <td className="py-2 pr-4 text-text-secondary">{when(row.lastClickedAt)}</td>
                  <td className="py-2 font-mono text-[11px] text-text-secondary">
                    {row.lastVisitorId ? row.lastVisitorId.slice(0, 8) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
