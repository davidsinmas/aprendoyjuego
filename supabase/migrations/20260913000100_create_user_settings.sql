create table public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint user_settings_must_be_an_object check (jsonb_typeof(settings) = 'object')
);

alter table public.user_settings enable row level security;

grant select, insert, update on table public.user_settings to authenticated;
revoke all on table public.user_settings from anon;

create policy "users can read own settings"
on public.user_settings
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "users can insert own settings"
on public.user_settings
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "users can update own settings"
on public.user_settings
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create function public.set_user_settings_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_user_settings_updated_at() from public, anon, authenticated;

create trigger set_user_settings_updated_at
before insert or update on public.user_settings
for each row execute function public.set_user_settings_updated_at();

alter publication supabase_realtime add table public.user_settings;
