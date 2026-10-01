-- Comments on community hot takes, so readers can engage and discuss.
-- Run AFTER community_takes.sql and profiles.sql.

create table if not exists public.take_comments (
  id uuid primary key default gen_random_uuid(),
  take_id uuid not null references public.community_takes (id) on delete cascade,
  body text not null check (char_length(body) between 2 and 280),
  author_user_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null default 'Anonymous',
  status text not null default 'published' check (status in ('published', 'hidden')),
  created_at timestamptz not null default now()
);

create index if not exists take_comments_take_idx
  on public.take_comments (take_id, created_at desc);

alter table public.take_comments enable row level security;

-- Anyone can read published comments; authors can always read their own.
drop policy if exists "read take comments" on public.take_comments;
create policy "read take comments"
  on public.take_comments
  for select
  using (status = 'published' or author_user_id = auth.uid());

-- Signed-in users may comment, but only as themselves.
drop policy if exists "insert own take comment" on public.take_comments;
create policy "insert own take comment"
  on public.take_comments
  for insert
  to authenticated
  with check (author_user_id = auth.uid());

-- Authors may edit/hide their own comments.
drop policy if exists "update own take comment" on public.take_comments;
create policy "update own take comment"
  on public.take_comments
  for update
  to authenticated
  using (author_user_id = auth.uid())
  with check (author_user_id = auth.uid());

-- Authors may delete their own comments.
drop policy if exists "delete own take comment" on public.take_comments;
create policy "delete own take comment"
  on public.take_comments
  for delete
  to authenticated
  using (author_user_id = auth.uid());

-- Cap comments per take per author to discourage spam.
create or replace function public.enforce_take_comment_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count int;
begin
  select count(*) into recent_count
  from public.take_comments
  where author_user_id = new.author_user_id
    and take_id = new.take_id;

  if recent_count >= 10 then
    raise exception 'You can post up to 10 comments per take.'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists take_comments_limit on public.take_comments;
create trigger take_comments_limit
  before insert on public.take_comments
  for each row execute function public.enforce_take_comment_limit();

-- Let authors hard-delete their own takes (cascades to comments, reports).
drop policy if exists "delete own takes" on public.community_takes;
create policy "delete own takes"
  on public.community_takes
  for delete
  to authenticated
  using (author_user_id = auth.uid());
