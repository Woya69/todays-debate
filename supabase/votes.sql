-- Anonymous-by-default debate votes + the aggregate stats RPC.
-- Run AFTER profiles.sql.

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  date_key text not null,
  debate_id text not null,
  initial_stance text not null check (initial_stance in ('pro', 'con', 'undecided')),
  convinced_by text not null check (convinced_by in ('pro', 'con', 'undecided')),
  prediction text check (prediction is null or prediction in ('pro', 'con')),
  voter_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (date_key, voter_id)
);

create index if not exists votes_date_idx on public.votes (date_key, debate_id);

alter table public.votes enable row level security;

-- Anyone may cast a vote (one per voter per day, enforced by the unique index).
drop policy if exists "insert votes" on public.votes;
create policy "insert votes"
  on public.votes
  for insert
  to anon, authenticated
  with check (true);

-- Raw rows are not publicly readable; aggregates are exposed via the RPC below.

-- Aggregate stats for one day's debate. Percentages are rounded integers.
create or replace function public.get_debate_stats(p_date_key text, p_debate_id text)
returns table (
  pro_stance_percent integer,
  con_stance_percent integer,
  undecided_stance_percent integer,
  pro_convinced_percent integer,
  con_convinced_percent integer,
  total_votes bigint
)
language sql
security definer
set search_path = public
as $$
  with v as (
    select * from public.votes
    where date_key = p_date_key and debate_id = p_debate_id
  ),
  totals as (
    select
      count(*)::bigint as total,
      count(*) filter (where initial_stance = 'pro') as s_pro,
      count(*) filter (where initial_stance = 'con') as s_con,
      count(*) filter (where initial_stance = 'undecided') as s_und,
      count(*) filter (where convinced_by = 'pro') as c_pro,
      count(*) filter (where convinced_by = 'con') as c_con
    from v
  )
  select
    case when total > 0 then round(100.0 * s_pro / total)::int else 0 end,
    case when total > 0 then round(100.0 * s_con / total)::int else 0 end,
    case when total > 0 then round(100.0 * s_und / total)::int else 0 end,
    case when (c_pro + c_con) > 0 then round(100.0 * c_pro / (c_pro + c_con))::int else 0 end,
    case when (c_pro + c_con) > 0 then round(100.0 * c_con / (c_pro + c_con))::int else 0 end,
    total
  from totals;
$$;

grant execute on function public.get_debate_stats(text, text) to anon, authenticated;
