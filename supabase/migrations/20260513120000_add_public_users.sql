-- Add the public users profile table required by the MVP schema.
-- Supabase Auth remains the source of identity; public.users stores app-level profile rows.

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.users (id, created_at, updated_at)
select id, created_at, updated_at
from public.profiles
on conflict (id) do nothing;

alter table public.users enable row level security;

create or replace function public.set_users_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
  before update on public.users
  for each row
  execute procedure public.set_users_updated_at();

alter table public.diagnostic_results
  drop constraint if exists diagnostic_results_user_id_fkey;

alter table public.diagnostic_results
  add constraint diagnostic_results_user_id_fkey
  foreign key (user_id) references public.users (id) on delete cascade;

alter table public.learning_roadmaps
  drop constraint if exists learning_roadmaps_user_id_fkey;

alter table public.learning_roadmaps
  add constraint learning_roadmaps_user_id_fkey
  foreign key (user_id) references public.users (id) on delete cascade;
