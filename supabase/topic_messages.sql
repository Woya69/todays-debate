-- Live topic chat rooms (anonymous-friendly).
-- Keyed by debate slug so Yes/No lands in a shared floor.

create table if not exists public.topic_messages (
  id uuid primary key default gen_random_uuid(),
  debate_slug text not null,
  body text not null check (char_length(body) between 1 and 280),
  side text not null check (side in ('pro', 'con')),
  role text not null default 'crowd' check (role in ('host', 'debater', 'crowd')),
  author_name text not null default 'Anon',
  voter_id text,
  author_user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists topic_messages_slug_idx
  on public.topic_messages (debate_slug, created_at desc);

alter table public.topic_messages enable row level security;

drop policy if exists "read topic messages" on public.topic_messages;
create policy "read topic messages"
  on public.topic_messages for select using (true);

drop policy if exists "insert topic messages" on public.topic_messages;
create policy "insert topic messages"
  on public.topic_messages for insert
  with check (char_length(body) between 1 and 280);

-- Realtime for instant fan-out
alter publication supabase_realtime add table public.topic_messages;
