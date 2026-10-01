-- Real community participation per motion, for the Archive page.
-- Run AFTER votes.sql.

-- Returns one row per day that has received votes, with the number of
-- people who debated that motion. Days with no votes are simply absent.
create or replace function public.get_archive_stats()
returns table (
  date_key text,
  debaters bigint
)
language sql
security definer
set search_path = public
as $$
  select date_key, count(*)::bigint as debaters
  from public.votes
  group by date_key;
$$;

grant execute on function public.get_archive_stats() to anon, authenticated;
