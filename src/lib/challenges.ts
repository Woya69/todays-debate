"use client";

import type {
  Challenge,
  ChallengeComment,
  ChallengeCrowd,
  ChallengeRound,
  Corner,
} from "@/types/debate";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getVoterId } from "@/lib/voter";
import { getSeedChallenge } from "@/data/crowd";
import { resolvePublicName } from "@/lib/identity";

interface ChallengeRow {
  id: string;
  invite_code: string;
  motion: string;
  debate_slug: string | null;
  category: string;
  status: Challenge["status"];
  round_count: number;
  challenger_id: string;
  challenger_name: string;
  challenger_side: Corner;
  opponent_id: string | null;
  opponent_name: string | null;
  opponent_side: Corner | null;
  current_round: number;
  next_side: Corner | null;
  created_at: string;
  updated_at: string;
  finished_at: string | null;
}

interface RoundRow {
  id: string;
  challenge_id: string;
  round_index: number;
  side: Corner;
  body: string;
  author_name: string;
  created_at: string;
}

interface CommentRow {
  id: string;
  challenge_id: string;
  body: string;
  side: Corner;
  author_name: string;
  created_at: string;
}

const RATE_KEY = "td_challenge_rate";

function toChallenge(row: ChallengeRow): Challenge {
  return {
    id: row.id,
    inviteCode: row.invite_code,
    motion: row.motion,
    debateSlug: row.debate_slug,
    category: row.category,
    status: row.status,
    roundCount: row.round_count,
    challengerId: row.challenger_id,
    challengerName: row.challenger_name,
    challengerSide: row.challenger_side,
    opponentId: row.opponent_id,
    opponentName: row.opponent_name,
    opponentSide: row.opponent_side,
    currentRound: row.current_round,
    nextSide: row.next_side,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    finishedAt: row.finished_at,
  };
}

function toRound(row: RoundRow): ChallengeRound {
  return {
    id: row.id,
    challengeId: row.challenge_id,
    roundIndex: row.round_index,
    side: row.side,
    body: row.body,
    authorName: row.author_name,
    createdAt: row.created_at,
  };
}

function toComment(row: CommentRow): ChallengeComment {
  return {
    id: row.id,
    challengeId: row.challenge_id,
    body: row.body,
    side: row.side,
    authorName: row.author_name,
    createdAt: row.created_at,
  };
}

/** Strip control chars / obvious spam padding. */
export function sanitizeText(input: string, max: number): string {
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function looksLikeAttack(text: string): boolean {
  const lower = text.toLowerCase();
  const insults = [
    "kill yourself",
    "kys",
    "rape",
    "nigger",
    "faggot",
    "retard",
  ];
  return insults.some((w) => lower.includes(w));
}

function inviteCode(): string {
  const raw =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : `${Date.now()}${Math.random().toString(36).slice(2)}`;
  return raw.slice(0, 10);
}

function hitRateLimit(bucket: string, max: number, windowMs: number): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(RATE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
    const now = Date.now();
    const recent = (map[bucket] ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      map[bucket] = recent;
      sessionStorage.setItem(RATE_KEY, JSON.stringify(map));
      return true;
    }
    recent.push(now);
    map[bucket] = recent;
    sessionStorage.setItem(RATE_KEY, JSON.stringify(map));
    return false;
  } catch {
    return false;
  }
}

export function isSeedChallengeId(id: string): boolean {
  return id.startsWith("seed-") || Boolean(getSeedChallenge(id));
}

async function displayName(): Promise<{
  userId: string;
  name: string;
} | null> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const name = resolvePublicName({
    displayName: profile?.display_name as string | null,
    email: user.email,
  });

  return { userId: user.id, name: name || "Anon" };
}

export async function createChallenge(input: {
  motion: string;
  side: Corner;
  debateSlug?: string | null;
  category?: string;
  roundCount?: number;
}): Promise<{ ok: true; challenge: Challenge } | { ok: false; error: string }> {
  const motion = sanitizeText(input.motion, 280);
  if (motion.length < 8) return { ok: false, error: "Motion needs a bit more." };
  if (looksLikeAttack(motion)) {
    return { ok: false, error: "Argue the motion — keep it civil." };
  }
  if (hitRateLimit("create", 5, 60_000)) {
    return { ok: false, error: "Slow down — too many challenges in a minute." };
  }

  const who = await displayName();
  if (!who) return { ok: false, error: "Sign in to start a challenge." };

  const category = sanitizeText(input.category ?? "Open floor", 40) || "Open floor";
  const roundCount = Math.min(5, Math.max(1, input.roundCount ?? 3));

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("challenges")
    .insert({
      invite_code: inviteCode(),
      motion,
      debate_slug: input.debateSlug ?? null,
      category,
      round_count: roundCount,
      challenger_id: who.userId,
      challenger_name: who.name,
      challenger_side: input.side,
      next_side: input.side,
      status: "open",
    })
    .select("*")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message?.includes("relation")
        ? "Challenges aren’t live on this database yet. Run supabase/challenges.sql."
        : error?.message || "Couldn’t create challenge.",
    };
  }
  return { ok: true, challenge: toChallenge(data as ChallengeRow) };
}

export async function fetchChallenge(idOrCode: string): Promise<Challenge | null> {
  const seed = getSeedChallenge(idOrCode);
  if (seed) return seed.challenge;

  try {
    const supabase = getSupabaseBrowserClient();
    const byId = await supabase
      .from("challenges")
      .select("*")
      .eq("id", idOrCode)
      .maybeSingle();
    if (byId.data) return toChallenge(byId.data as ChallengeRow);

    const byCode = await supabase
      .from("challenges")
      .select("*")
      .eq("invite_code", idOrCode)
      .maybeSingle();
    if (byCode.data) return toChallenge(byCode.data as ChallengeRow);
  } catch {
    /* fall through */
  }
  return null;
}

export async function listRecentChallenges(limit = 8): Promise<Challenge[]> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .in("status", ["open", "live", "done"])
      .order("updated_at", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return (data as ChallengeRow[]).map(toChallenge);
  } catch {
    return [];
  }
}

export async function acceptChallenge(
  challengeId: string,
): Promise<{ ok: true; challenge: Challenge } | { ok: false; error: string }> {
  if (isSeedChallengeId(challengeId)) {
    return {
      ok: false,
      error: "This is a demo challenge — start a new one to debate for real.",
    };
  }

  const who = await displayName();
  if (!who) return { ok: false, error: "Sign in to accept this challenge." };
  if (hitRateLimit("accept", 10, 60_000)) {
    return { ok: false, error: "Slow down." };
  }

  const existing = await fetchChallenge(challengeId);
  if (!existing) return { ok: false, error: "Challenge not found." };
  if (existing.status !== "open") {
    return { ok: false, error: "This challenge already started." };
  }
  if (existing.challengerId === who.userId) {
    return { ok: false, error: "You can’t accept your own challenge." };
  }

  const opponentSide: Corner = existing.challengerSide === "pro" ? "con" : "pro";
  const supabase = getSupabaseBrowserClient();

  // Prefer secure RPC when available; fall back to constrained update.
  const rpc = await supabase.rpc("accept_challenge", {
    p_challenge_id: existing.id,
    p_opponent_name: who.name,
  });

  if (!rpc.error && rpc.data) {
    const row = Array.isArray(rpc.data) ? rpc.data[0] : rpc.data;
    if (row) return { ok: true, challenge: toChallenge(row as ChallengeRow) };
  }

  const { data, error } = await supabase
    .from("challenges")
    .update({
      opponent_id: who.userId,
      opponent_name: who.name,
      opponent_side: opponentSide,
      status: "live",
      current_round: 1,
      next_side: existing.challengerSide,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id)
    .eq("status", "open")
    .is("opponent_id", null)
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message || "Couldn’t accept challenge." };
  }
  return { ok: true, challenge: toChallenge(data as ChallengeRow) };
}

export async function fetchRounds(challengeId: string): Promise<ChallengeRound[]> {
  const seed = getSeedChallenge(challengeId);
  if (seed) return seed.rounds;

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("challenge_rounds")
      .select("*")
      .eq("challenge_id", challengeId)
      .order("round_index", { ascending: true })
      .order("created_at", { ascending: true });
    if (error || !data) return [];
    return (data as RoundRow[]).map(toRound);
  } catch {
    return [];
  }
}

export async function postRound(input: {
  challengeId: string;
  body: string;
}): Promise<{ ok: true; round: ChallengeRound; challenge: Challenge } | { ok: false; error: string }> {
  if (isSeedChallengeId(input.challengeId)) {
    return { ok: false, error: "Demo challenges are read-only. Start your own." };
  }

  const body = sanitizeText(input.body, 280);
  if (body.length < 3) return { ok: false, error: "Say a little more." };
  if (looksLikeAttack(body)) {
    return { ok: false, error: "Argue the motion — not the person." };
  }
  if (hitRateLimit("round", 20, 60_000)) {
    return { ok: false, error: "Slow down." };
  }

  const who = await displayName();
  if (!who) return { ok: false, error: "Sign in to throw a round." };

  const challenge = await fetchChallenge(input.challengeId);
  if (!challenge) return { ok: false, error: "Challenge not found." };
  if (challenge.status !== "live") return { ok: false, error: "This debate isn’t live." };
  if (!challenge.nextSide) return { ok: false, error: "Waiting on the other corner." };

  const mySide =
    challenge.challengerId === who.userId
      ? challenge.challengerSide
      : challenge.opponentId === who.userId
        ? challenge.opponentSide
        : null;

  if (!mySide) return { ok: false, error: "Only the two debaters can throw rounds." };
  if (mySide !== challenge.nextSide) return { ok: false, error: "Not your turn." };

  const roundIndex = challenge.currentRound;
  const supabase = getSupabaseBrowserClient();
  const { data: round, error } = await supabase
    .from("challenge_rounds")
    .insert({
      challenge_id: challenge.id,
      round_index: roundIndex,
      side: mySide,
      body,
      author_user_id: who.userId,
      author_name: who.name,
    })
    .select("*")
    .single();

  if (error || !round) {
    return { ok: false, error: error?.message || "Couldn’t post round." };
  }

  const rounds = await fetchRounds(challenge.id);
  const bothPosted = rounds.filter((r) => r.roundIndex === roundIndex).length >= 2;
  const isLastRound = roundIndex >= challenge.roundCount;

  let nextStatus: Challenge["status"] = challenge.status;
  let nextRound = challenge.currentRound;
  let nextSide: Corner | null = mySide === "pro" ? "con" : "pro";
  let finishedAt: string | null = null;

  if (bothPosted) {
    if (isLastRound) {
      nextStatus = "done";
      nextSide = null;
      finishedAt = new Date().toISOString();
    } else {
      nextRound = roundIndex + 1;
      nextSide = challenge.challengerSide;
    }
  }

  const { data: updated, error: updateError } = await supabase
    .from("challenges")
    .update({
      status: nextStatus,
      current_round: nextRound,
      next_side: nextSide,
      finished_at: finishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", challenge.id)
    .eq("status", "live")
    .select("*")
    .single();

  if (updateError || !updated) {
    return { ok: false, error: updateError?.message || "Round posted but state stalled." };
  }

  return {
    ok: true,
    round: toRound(round as RoundRow),
    challenge: toChallenge(updated as ChallengeRow),
  };
}

export async function fetchCrowd(challengeId: string): Promise<ChallengeCrowd> {
  const seed = getSeedChallenge(challengeId);
  if (seed) return seed.crowd;

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_challenge_crowd", {
      p_challenge_id: challengeId,
    });
    if (error || !data || !Array.isArray(data) || data.length === 0) {
      return { proPercent: 50, conPercent: 50, totalCheers: 0 };
    }
    const row = data[0] as {
      pro_percent: number;
      con_percent: number;
      total_cheers: number;
    };
    return {
      proPercent: row.pro_percent,
      conPercent: row.con_percent,
      totalCheers: Number(row.total_cheers) || 0,
    };
  } catch {
    return { proPercent: 50, conPercent: 50, totalCheers: 0 };
  }
}

export async function cheerCorner(
  challengeId: string,
  side: Corner,
): Promise<{ ok: true; crowd: ChallengeCrowd } | { ok: false; error: string }> {
  if (isSeedChallengeId(challengeId)) {
    const seed = getSeedChallenge(challengeId);
    if (!seed) return { ok: false, error: "Challenge not found." };
    // Local-only cheer bump for demo feel
    const next = {
      ...seed.crowd,
      totalCheers: seed.crowd.totalCheers + 1,
      proPercent:
        side === "pro"
          ? Math.min(99, seed.crowd.proPercent + 1)
          : Math.max(1, seed.crowd.proPercent - 1),
      conPercent:
        side === "con"
          ? Math.min(99, seed.crowd.conPercent + 1)
          : Math.max(1, seed.crowd.conPercent - 1),
    };
    return { ok: true, crowd: next };
  }

  if (hitRateLimit("cheer", 8, 60_000)) {
    return { ok: false, error: "Slow down." };
  }

  const supabase = getSupabaseBrowserClient();
  const voterId = getVoterId();
  if (!voterId || voterId === "server" || voterId.length < 8) {
    return { ok: false, error: "Couldn’t verify this browser." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("challenge_cheers").insert({
    challenge_id: challengeId,
    side,
    voter_id: sanitizeText(voterId, 64),
    user_id: user?.id ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "You already picked a corner." };
    }
    return { ok: false, error: error.message || "Couldn’t cheer." };
  }

  const crowd = await fetchCrowd(challengeId);
  return { ok: true, crowd };
}

export async function fetchChallengeComments(
  challengeId: string,
): Promise<ChallengeComment[]> {
  const seed = getSeedChallenge(challengeId);
  if (seed) return seed.comments;

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("challenge_comments")
      .select("id, challenge_id, body, side, author_name, created_at")
      .eq("challenge_id", challengeId)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(60);
    if (error || !data) return [];
    return (data as CommentRow[]).map(toComment);
  } catch {
    return [];
  }
}

export async function postChallengeComment(input: {
  challengeId: string;
  body: string;
  side: Corner;
}): Promise<
  { ok: true; comment: ChallengeComment } | { ok: false; error: string }
> {
  const body = sanitizeText(input.body, 280);
  if (body.length < 3) return { ok: false, error: "Say a little more." };
  if (looksLikeAttack(body)) {
    return { ok: false, error: "Argue the motion — not the person." };
  }
  if (hitRateLimit("comment", 12, 60_000)) {
    return { ok: false, error: "Slow down on comments." };
  }

  if (isSeedChallengeId(input.challengeId)) {
    const who = await displayName();
    const voterId = getVoterId();
    return {
      ok: true,
      comment: {
        id: `local-${Date.now()}`,
        challengeId: input.challengeId,
        body,
        side: input.side,
        authorName: who?.name ?? `Spectator ${voterId.slice(0, 4)}`,
        createdAt: new Date().toISOString(),
      },
    };
  }

  const supabase = getSupabaseBrowserClient();
  const who = await displayName();
  const voterId = getVoterId();
  const authorName = sanitizeText(
    who?.name ?? `Spectator ${voterId.slice(0, 4)}`,
    40,
  );

  const { data, error } = await supabase
    .from("challenge_comments")
    .insert({
      challenge_id: input.challengeId,
      body,
      side: input.side,
      author_user_id: who?.userId ?? null,
      author_name: authorName,
      voter_id: sanitizeText(voterId, 64),
    })
    .select("id, challenge_id, body, side, author_name, created_at")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message || "Couldn’t post." };
  }
  return { ok: true, comment: toComment(data as CommentRow) };
}
