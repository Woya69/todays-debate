-- Daily-reminder email opt-ins.
-- Delivery requires a scheduled function (e.g. a Supabase cron / Edge Function)
-- that reads this table once a day and sends "today's motion is live".
-- This migration only captures intent.

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  email text not null check (position('@' in email) > 1),
  user_id uuid references auth.users (id) on delete set null,
  voter_id text,
  unsubscribed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (email)
);

alter table public.reminders enable row level security;

-- Anyone can opt in. Re-opting in with the same email is a no-op upsert client-side.
drop policy if exists "insert reminders" on public.reminders;
create policy "insert reminders"
  on public.reminders
  for insert
  to anon, authenticated
  with check (true);

-- Signed-in users can update (e.g. unsubscribe) rows tied to their account.
drop policy if exists "update own reminder" on public.reminders;
create policy "update own reminder"
  on public.reminders
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
