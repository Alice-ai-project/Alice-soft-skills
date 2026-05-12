-- MVP schema: profiles (auth.users), courses, questionnaires, questions,
-- diagnostic_results, learning_roadmaps
-- Backend uses service role; RLS enabled for defense in depth on Data API exposure.

create extension if not exists "pgcrypto";

-- Profile row per auth user (single source of identity: auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.questionnaires (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  questionnaire_id uuid not null references public.questionnaires (id) on delete cascade,
  prompt text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.diagnostic_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  questionnaire_id uuid not null references public.questionnaires (id) on delete restrict,
  scores jsonb not null default '[]'::jsonb,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists diagnostic_results_user_id_created_at_idx
  on public.diagnostic_results (user_id, created_at desc);

create table if not exists public.learning_roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  diagnostic_result_id uuid references public.diagnostic_results (id) on delete set null,
  title text not null,
  roadmap_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.questionnaires enable row level security;
alter table public.questions enable row level security;
alter table public.diagnostic_results enable row level security;
alter table public.learning_roadmaps enable row level security;

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute procedure public.set_profiles_updated_at();
