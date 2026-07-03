-- Supabase schema for Marketing AI Assistant

/*
  1. tasks
  2. content_posts
  3. approval_items
  4. campaign_events
  5. leads
  6. ads_reports
*/

-- 1. tasks
create table if not exists tasks (
  id text primary key,
  title text not null,
  type text not null,
  start_date timestamp with time zone,
  deadline text not null,
  priority text not null,
  status text not null,
  file_url text,
  blocker text,
  inserted_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table tasks enable row level security;

-- 2. content_posts
create table if not exists content_posts (
  id text primary key,
  title text not null,
  channel text not null,
  type text not null,
  scheduled_at text not null,
  status text not null,
  campaign text not null,
  inserted_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table content_posts enable row level security;

-- 3. approval_items
create table if not exists approval_items (
  id text primary key,
  title text not null,
  channel text not null,
  type text not null,
  scheduled_at text not null,
  status text not null,
  campaign text not null,
  caption text not null,
  hashtags text[] not null,
  cta text,
  media_src text,
  drive_url text not null,
  ai_score integer not null,
  ai_risk_note text not null,
  priority text not null,
  warnings text[] not null,
  inserted_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table approval_items enable row level security;

-- 4. campaign_events
create table if not exists campaign_events (
  id text primary key,
  name text not null,
  goal text not null,
  progress integer not null,
  missing_checklist text[] not null,
  risk text not null,
  approval_status text not null,
  budget bigint not null,
  timeline text not null,
  inserted_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table campaign_events enable row level security;

-- 5. leads
create table if not exists leads (
  id text primary key,
  name text not null,
  phone text not null,
  email text not null,
  source text not null,
  need text not null,
  status text not null,
  follow_date text not null,
  note text not null,
  inserted_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table leads enable row level security;

-- 6. ads_reports
create table if not exists ads_reports (
  id text primary key,
  campaign_name text not null,
  platform text not null,
  budget bigint not null,
  spend bigint not null,
  leads integer not null,
  cpl bigint not null,
  ctr text not null,
  status text not null,
  report_link text not null,
  inserted_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table ads_reports enable row level security;
