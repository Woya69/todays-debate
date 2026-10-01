-- One-line reader rebuttals attached to a debate.
-- Run AFTER profiles.sql.

create table if not exists public.debate_comments (
  id uuid primary key default gen_random_uuid(),
  debate_id text not null,
  body text not null check (char_length(body) between 3 and 280),
  side text not null check (side in ('pro', 'con', 'undecided')),
  author_user_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null default 'Anonymous',
  status text not null default 'published' check (status in ('published', 'hidden')),
  created_at timestamptz not null default now()
);

create index if not exists debate_comments_debate_idx
  on public.debate_comments (debate_id, created_at desc);

alter table public.debate_comments enable row level security;

drop policy if exists "read comments" on public.debate_comments;
create policy "read comments"
  on public.debate_comments
  for select
  using (status = 'published' or author_user_id = auth.uid());

drop policy if exists "insert own comment" on public.debate_comments;
create policy "insert own comment"
  on public.debate_comments
  for insert
  to authenticated
  with check (author_user_id = auth.uid());

drop policy if exists "update own comment" on public.debate_comments;
create policy "update own comment"
  on public.debate_comments
  for update
  to authenticated
  using (author_user_id = auth.uid())
  with check (author_user_id = auth.uid());

-- Cap rebuttals to a few per debate per author to discourage spam.
create or replace function public.enforce_comment_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count int;
begin
  select count(*) into recent_count
  from public.debate_comments
  where author_user_id = new.author_user_id
    and debate_id = new.debate_id;

  if recent_count >= 3 then
    raise exception 'You can post up to 3 rebuttals per debate.'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists debate_comments_limit on public.debate_comments;
create trigger debate_comments_limit
  before insert on public.debate_comments
  for each row execute function public.enforce_comment_limit();
