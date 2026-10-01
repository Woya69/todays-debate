-- 1v1 challenges + crowd cheers/comments.
-- Run AFTER profiles.sql.

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  invite_code text not null unique,
  motion text not null check (char_length(motion) between 8 and 280),
  debate_slug text,
  category text not null default 'Open floor',
  status text not null default 'open' check (status in ('open', 'live', 'done')),
  round_count integer not null default 3 check (round_count between 1 and 5),
  challenger_id uuid not null references auth.users (id) on delete cascade,
  challenger_name text not null default 'Challenger',
  challenger_side text not null check (challenger_side in ('pro', 'con')),
  opponent_id uuid references auth.users (id) on delete set null,
  opponent_name text,
  opponent_side text check (opponent_side is null or opponent_side in ('pro', 'con')),
  current_round integer not null default 0,
  next_side text check (next_side is null or next_side in ('pro', 'con')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  finished_at timestamptz
);

create index if not exists challenges_status_idx
  on public.challenges (status, updated_at desc);
create index if not exists challenges_invite_idx
  on public.challenges (invite_code);

create table if not exists public.challenge_rounds (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges (id) on delete cascade,
  round_index integer not null check (round_index >= 1),
  side text not null check (side in ('pro', 'con')),
  body text not null check (char_length(body) between 3 and 280),
  author_user_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null default 'Debater',
  created_at timestamptz not null default now(),
  unique (challenge_id, round_index, side)
);

create index if not exists challenge_rounds_challenge_idx
  on public.challenge_rounds (challenge_id, round_index, created_at);

create table if not exists public.challenge_cheers (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges (id) on delete cascade,
  side text not null check (side in ('pro', 'con')),
  voter_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (challenge_id, voter_id)
);

create index if not exists challenge_cheers_challenge_idx
  on public.challenge_cheers (challenge_id, side);

create table if not exists public.challenge_comments (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges (id) on delete cascade,
  body text not null check (char_length(body) between 3 and 280),
  side text not null check (side in ('pro', 'con')),
  author_user_id uuid references auth.users (id) on delete set null,
  author_name text not null default 'Spectator',
  voter_id text,
  status text not null default 'published' check (status in ('published', 'hidden')),
  created_at timestamptz not null default now()
);

create index if not exists challenge_comments_challenge_idx
  on public.challenge_comments (challenge_id, created_at desc);

alter table public.challenges enable row level security;
alter table public.challenge_rounds enable row level security;
alter table public.challenge_cheers enable row level security;
alter table public.challenge_comments enable row level security;

drop policy if exists "read challenges" on public.challenges;
create policy "read challenges"
  on public.challenges for select using (true);

drop policy if exists "insert own challenge" on public.challenges;
create policy "insert own challenge"
  on public.challenges for insert to authenticated
  with check (challenger_id = auth.uid());

drop policy if exists "update challenges" on public.challenges;
create policy "update challenges"
  on public.challenges for update to authenticated
  using (
    challenger_id = auth.uid()
    or opponent_id = auth.uid()
    or (opponent_id is null and status = 'open')
  )
  with check (true);

drop policy if exists "read rounds" on public.challenge_rounds;
create policy "read rounds"
  on public.challenge_rounds for select using (true);

drop policy if exists "insert own round" on public.challenge_rounds;
create policy "insert own round"
  on public.challenge_rounds for insert to authenticated
  with check (author_user_id = auth.uid());

drop policy if exists "read cheers" on public.challenge_cheers;
create policy "read cheers"
  on public.challenge_cheers for select using (true);

drop policy if exists "insert cheers" on public.challenge_cheers;
create policy "insert cheers"
  on public.challenge_cheers for insert to anon, authenticated
  with check (true);

drop policy if exists "read challenge comments" on public.challenge_comments;
create policy "read challenge comments"
  on public.challenge_comments for select
  using (status = 'published' or author_user_id = auth.uid());

drop policy if exists "insert challenge comments" on public.challenge_comments;
create policy "insert challenge comments"
  on public.challenge_comments for insert to anon, authenticated
  with check (true);

create or replace function public.get_challenge_crowd(p_challenge_id uuid)
returns table (
  pro_percent integer,
  con_percent integer,
  total_cheers bigint
)
language sql
security definer
set search_path = public
as $$
  with c as (
    select * from public.challenge_cheers where challenge_id = p_challenge_id
  ),
  totals as (
    select
      count(*)::bigint as total,
      count(*) filter (where side = 'pro') as s_pro,
      count(*) filter (where side = 'con') as s_con
    from c
  )
  select
    case when total > 0 then round(100.0 * s_pro / total)::int else 50 end,
    case when total > 0 then round(100.0 * s_con / total)::int else 50 end,
    total
  from totals;
$$;

grant execute on function public.get_challenge_crowd(uuid) to anon, authenticated;
