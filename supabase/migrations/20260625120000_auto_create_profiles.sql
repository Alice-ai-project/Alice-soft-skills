-- Auto-create a public.profiles row whenever a new user is created in auth.users.
-- Without this trigger, the profiles table stays empty for all users registered
-- through the API, causing 404 on GET /api/v1/profiles/{id}.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, created_at, updated_at)
  values (new.id, now(), now())
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
