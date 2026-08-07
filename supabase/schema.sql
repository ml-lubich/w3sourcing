-- W3 Sourcing — jobs table.
--
-- Run once against the Supabase project (SQL editor, or `bun run jobs:seed`
-- which applies nothing but expects this to exist). Columns are quoted
-- camelCase so PostgREST rows land in the app as `RawJob` with no mapping.
--
-- Every read/write goes through the service-role key on the server
-- (`src/lib/jobs-store.ts`). RLS is on with **no policies**, so the anon key
-- that ships to browsers can neither read nor write this table.

create table if not exists public.jobs (
  ref           text primary key,
  role          text not null,
  company       text,
  "roleGroup"   text,
  "roleType"    text,
  sector        text,
  locations     text,
  workplace     text,
  salary        text,
  yoe           text,
  "techStack"   text,
  visa          text,
  "postedDate"  date,
  link          text,
  website       text,
  "oneLiner"    text,
  "multiHire"   text,
  "hiringCount" text,
  hot           boolean not null default false,
  "createdAt"   timestamptz not null default now()
);

alter table public.jobs enable row level security;

create index if not exists jobs_posted_date_idx on public.jobs ("postedDate" desc nulls last);
create index if not exists jobs_hot_idx on public.jobs (hot) where hot;
