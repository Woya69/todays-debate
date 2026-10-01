-- Hot-take responses (both curated and community takes) + agree-rate RPC.
-- Run AFTER profiles.sql. take_id is text so curated ids ("t1") and
-- community uuids share one table.

create table if not exists public.take_responses (
  id uuid primary key default gen_random_uuid(),
  take_id text not null,
  answer text not null check (answer in ('agree', 'disagree')),
  voter_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (take_id, voter_id)
);

create index if not exists take_responses_take_idx on public.take_responses (take_id);

alter table public.take_responses enable row level security;

drop policy if exists "insert take responses" on public.take_responses;
create policy "insert take responses"
  on public.take_responses
  for insert
  to anon, authenticated
  with check (true);

-- Agree-rate + total for a set of takes, keyed by id.
create or replace function public.get_hot_take_stats(p_take_ids text[])
returns table (
  take_id text,
  agree_percent integer,
  total bigint
)
language sql
security definer
set search_path = public
as $$
  select
    take_id,
    case when count(*) > 0
      then round(100.0 * count(*) filter (where answer = 'agree') / count(*))::int
      else 0 end as agree_percent,
    count(*)::bigint as total
  from public.take_responses
  where take_id = any(p_take_ids)
  group by take_id;
$$;

grant execute on function public.get_hot_take_stats(text[]) to anon, authenticated;
