-- Community-submitted hot takes.
-- Run this in the Supabase SQL editor (or via the CLI) once.

create table if not exists public.community_takes (
  id uuid primary key default gen_random_uuid(),
  text text not null check (char_length(text) between 8 and 140),
  topic text not null default 'Community',
  author_user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'published' check (status in ('published', 'hidden')),
  created_at timestamptz not null default now()
);

create index if not exists community_takes_created_idx
  on public.community_takes (created_at desc);

create index if not exists community_takes_author_idx
  on public.community_takes (author_user_id);

alter table public.community_takes enable row level security;

-- Everyone can read published takes; authors can always read their own.
drop policy if exists "read community takes" on public.community_takes;
create policy "read community takes"
  on public.community_takes
  for select
  using (status = 'published' or author_user_id = auth.uid());

-- Signed-in users may publish takes, but only as themselves.
drop policy if exists "insert own takes" on public.community_takes;
create policy "insert own takes"
  on public.community_takes
  for insert
  to authenticated
  with check (author_user_id = auth.uid());

-- Authors may hide/unhide their own takes.
drop policy if exists "update own takes" on public.community_takes;
create policy "update own takes"
  on public.community_takes
  for update
  to authenticated
  using (author_user_id = auth.uid())
  with check (author_user_id = auth.uid());
