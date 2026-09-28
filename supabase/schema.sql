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

-- One row per shared link or contact click. `clicks` is distinct people, not
-- page refreshes. The visitor id is an opaque first-party cookie — no email,
-- no IP, no client name. RLS on, no policies: service role only.
create table if not exists public.job_referrals (
  code            text primary key,
  "jobRef"        text not null,
  channel         text not null,
  "createdAt"     timestamptz not null default now(),
  clicks          integer not null default 0,
  "lastClickedAt" timestamptz,
  "lastVisitorId" text
);

alter table public.job_referrals enable row level security;

create index if not exists job_referrals_created_idx on public.job_referrals ("createdAt" desc);

create table if not exists public.job_referral_clicks (
  code         text not null,
  "visitorId"  text not null,
  "clickedAt"  timestamptz not null default now(),
  "userAgent"  text,
  primary key (code, "visitorId")
);

alter table public.job_referral_clicks enable row level security;
