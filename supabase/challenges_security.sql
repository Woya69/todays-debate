-- Harden challenge RLS + accept RPC + spam caps.
-- Run AFTER challenges.sql

-- Replace loose update policy: only parties may update, and open challenges
-- can only be claimed (opponent fields), not rewritten arbitrarily by strangers.
drop policy if exists "update challenges" on public.challenges;

drop policy if exists "challenger update own" on public.challenges;
create policy "challenger update own"
  on public.challenges for update to authenticated
  using (challenger_id = auth.uid())
  with check (challenger_id = auth.uid());

drop policy if exists "opponent update own" on public.challenges;
create policy "opponent update own"
  on public.challenges for update to authenticated
  using (opponent_id = auth.uid())
  with check (opponent_id = auth.uid());

-- Secure accept: only fills opponent when still open.
create or replace function public.accept_challenge(
  p_challenge_id uuid,
  p_opponent_name text
)
returns public.challenges
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.challenges;
  clean_name text := left(trim(both from coalesce(p_opponent_name, 'Opponent')), 40);
begin
  if auth.uid() is null then
    raise exception 'Sign in required' using errcode = '42501';
  end if;

  update public.challenges c
  set
    opponent_id = auth.uid(),
    opponent_name = clean_name,
    opponent_side = case when c.challenger_side = 'pro' then 'con' else 'pro' end,
    status = 'live',
    current_round = 1,
    next_side = c.challenger_side,
    updated_at = now()
  where c.id = p_challenge_id
    and c.status = 'open'
    and c.opponent_id is null
    and c.challenger_id <> auth.uid()
  returning * into result;

  if result.id is null then
    raise exception 'Challenge unavailable' using errcode = 'P0001';
  end if;

  return result;
end;
$$;

grant execute on function public.accept_challenge(uuid, text) to authenticated;

-- Cap comments per voter per challenge.
create or replace function public.enforce_challenge_comment_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count int;
begin
  if new.voter_id is not null then
    select count(*) into recent_count
    from public.challenge_comments
    where challenge_id = new.challenge_id
      and voter_id = new.voter_id;
    if recent_count >= 5 then
      raise exception 'Comment limit reached for this debate.'
        using errcode = 'check_violation';
    end if;
  elsif new.author_user_id is not null then
    select count(*) into recent_count
    from public.challenge_comments
    where challenge_id = new.challenge_id
      and author_user_id = new.author_user_id;
    if recent_count >= 5 then
      raise exception 'Comment limit reached for this debate.'
        using errcode = 'check_violation';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists challenge_comments_limit on public.challenge_comments;
create trigger challenge_comments_limit
  before insert on public.challenge_comments
  for each row execute function public.enforce_challenge_comment_limit();

-- Round authors must be a participant on that side.
create or replace function public.enforce_challenge_round_author()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.challenges;
begin
  select * into c from public.challenges where id = new.challenge_id;
  if c.id is null or c.status <> 'live' then
    raise exception 'Debate is not live.' using errcode = 'check_violation';
  end if;
  if new.author_user_id = c.challenger_id and new.side = c.challenger_side then
    return new;
  end if;
  if c.opponent_id is not null
     and new.author_user_id = c.opponent_id
     and new.side = c.opponent_side then
    return new;
  end if;
  raise exception 'Only corner participants can post rounds.'
    using errcode = '42501';
end;
$$;

drop trigger if exists challenge_rounds_author on public.challenge_rounds;
create trigger challenge_rounds_author
  before insert on public.challenge_rounds
  for each row execute function public.enforce_challenge_round_author();

-- Tighten comment insert: require voter_id length.
alter table public.challenge_comments
  drop constraint if exists challenge_comments_voter_len;
alter table public.challenge_comments
  add constraint challenge_comments_voter_len
  check (voter_id is null or char_length(voter_id) between 8 and 64);

alter table public.challenge_cheers
  drop constraint if exists challenge_cheers_voter_len;
alter table public.challenge_cheers
  add constraint challenge_cheers_voter_len
  check (char_length(voter_id) between 8 and 64);
