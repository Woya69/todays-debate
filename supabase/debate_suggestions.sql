-- Reader-submitted motion ideas, queued for editorial review.
-- Run AFTER profiles.sql.

create table if not exists public.debate_suggestions (
  id uuid primary key default gen_random_uuid(),
  resolution text not null check (char_length(resolution) between 12 and 160),
  category text not null default 'Reader',
  pro_hint text check (pro_hint is null or char_length(pro_hint) <= 200),
  con_hint text check (con_hint is null or char_length(con_hint) <= 200),
  author_user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists debate_suggestions_author_idx
  on public.debate_suggestions (author_user_id);

alter table public.debate_suggestions enable row level security;

-- Authors can see the status of their own submissions.
drop policy if exists "read own suggestions" on public.debate_suggestions;
create policy "read own suggestions"
  on public.debate_suggestions
  for select
  to authenticated
  using (author_user_id = auth.uid());

drop policy if exists "insert own suggestion" on public.debate_suggestions;
create policy "insert own suggestion"
  on public.debate_suggestions
  for insert
  to authenticated
  with check (author_user_id = auth.uid());

-- Daily rate limit to keep the queue sane.
create or replace function public.enforce_suggestion_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count int;
begin
  select count(*) into recent_count
  from public.debate_suggestions
  where author_user_id = new.author_user_id
    and created_at > now() - interval '24 hours';

  if recent_count >= 5 then
    raise exception 'You can suggest up to 5 motions per day.'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists debate_suggestions_limit on public.debate_suggestions;
create trigger debate_suggestions_limit
  before insert on public.debate_suggestions
  for each row execute function public.enforce_suggestion_limit();
