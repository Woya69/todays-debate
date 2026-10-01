-- Moderation + abuse controls for community takes.
-- Run AFTER community_takes.sql in the Supabase SQL editor.

-- 1) Reports -----------------------------------------------------------------
create table if not exists public.take_reports (
  id uuid primary key default gen_random_uuid(),
  take_id uuid not null references public.community_takes (id) on delete cascade,
  reporter_voter_id text not null,
  reporter_user_id uuid references auth.users (id) on delete set null,
  reason text check (reason is null or char_length(reason) <= 280),
  created_at timestamptz not null default now(),
  unique (take_id, reporter_voter_id)
);

create index if not exists take_reports_take_idx
  on public.take_reports (take_id);

alter table public.take_reports enable row level security;

-- Anyone (anon or signed in) may file a report; one per voter per take.
drop policy if exists "insert reports" on public.take_reports;
create policy "insert reports"
  on public.take_reports
  for insert
  to anon, authenticated
  with check (true);

-- No public read of reports — review them in the dashboard / via service role.

-- 2) Per-day rate limit on publishing ---------------------------------------
create or replace function public.enforce_take_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count int;
begin
  select count(*) into recent_count
  from public.community_takes
  where author_user_id = new.author_user_id
    and created_at > now() - interval '24 hours';

  if recent_count >= 10 then
    raise exception 'You can publish up to 10 takes per day. Try again later.'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists community_takes_rate_limit on public.community_takes;
create trigger community_takes_rate_limit
  before insert on public.community_takes
  for each row execute function public.enforce_take_rate_limit();
