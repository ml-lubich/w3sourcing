/**
 * One-time setup for the Supabase jobs board:
 *
 *   bun run jobs:seed
 *
 * Applies `supabase/schema.sql` (idempotent) and loads the committed Paraform
 * export into the table. Re-running is safe — rows upsert by W3 reference, so
 * roles Perry has since edited by hand keep their edits only if their reference
 * changed; a straight re-run restores the export's values for matching refs.
 *
 * Requires the Supabase env vars in `.env.local` (`vercel env pull`).
 */
import { readFileSync } from "node:fs";

import liveJobsData from "@/content/live-jobs.json";
import { toRef, type RawJob } from "@/lib/jobs";
import { isJobsDbConfigured, upsertJobs, type JobRow } from "@/lib/jobs-store";

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

if (!connectionString || !isJobsDbConfigured()) {
  console.error(
    "Missing Supabase credentials. Run `vercel env pull .env.local` first — this needs POSTGRES_URL, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

/**
 * Bun's built-in Postgres client, declared locally: `@types/bun` would put Bun's
 * globals in front of the DOM types the Next app compiles against.
 */
declare const Bun: {
  SQL: new (url: string) => { unsafe(query: string): Promise<unknown>; end(): Promise<void> };
};

const sql = new Bun.SQL(connectionString);
await sql.unsafe(readFileSync("supabase/schema.sql", "utf8"));
await sql.end();
console.log("Schema applied.");

const rows: JobRow[] = (liveJobsData as RawJob[]).map((job) => ({
  ...job,
  ref: toRef(job.link),
  hot: false,
}));

await upsertJobs(rows);
console.log(`Seeded ${rows.length} roles into Supabase.`);
