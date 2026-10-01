"use client";

import type { DebateStats, Stance, TakeAnswer, Verdict } from "@/types/debate";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getVoterId } from "@/lib/voter";

export interface TakeStat {
  agreePercent: number;
  total: number;
}

/** Live crowd stats for a debate from the aggregate RPC. Returns null when unavailable. */
export async function fetchDebateStats(
  dateKey: string,
  debateId: string,
): Promise<DebateStats | null> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .rpc("get_debate_stats", { p_date_key: dateKey, p_debate_id: debateId })
    .single();

  if (error || !data) return null;

  const row = data as {
    pro_stance_percent: number;
    con_stance_percent: number;
    undecided_stance_percent: number;
    pro_convinced_percent: number;
    con_convinced_percent: number;
    total_votes: number;
  };

  return {
    proStancePercent: row.pro_stance_percent,
    conStancePercent: row.con_stance_percent,
    undecidedStancePercent: row.undecided_stance_percent,
    proConvincedPercent: row.pro_convinced_percent,
    conConvincedPercent: row.con_convinced_percent,
    totalVotes: Number(row.total_votes),
  };
}

/** Real debater counts per motion, keyed by date_key. Empty when unavailable. */
export async function fetchArchiveStats(): Promise<Record<string, number>> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("get_archive_stats");

  const out: Record<string, number> = {};
  if (error || !data) return out;

  for (const row of data as Array<{ date_key: string; debaters: number }>) {
    out[row.date_key] = Number(row.debaters);
  }
  return out;
}

/** Records an anonymous-by-default vote. Attaches the user id only if signed in. */
export async function castDebateVote(params: {
  dateKey: string;
  debateId: string;
  initialStance: Stance;
  convincedBy: Stance;
  prediction: Verdict | null;
}): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("votes").upsert(
    {
      date_key: params.dateKey,
      debate_id: params.debateId,
      initial_stance: params.initialStance,
      convinced_by: params.convincedBy,
      prediction: params.prediction,
      voter_id: getVoterId(),
      user_id: user?.id ?? null,
    },
    { onConflict: "date_key,voter_id", ignoreDuplicates: true },
  );
}

/** Live agree-rates for a set of hot takes, keyed by take id. */
export async function fetchHotTakeStats(
  takeIds: string[],
): Promise<Record<string, TakeStat>> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("get_hot_take_stats", {
    p_take_ids: takeIds,
  });

  const out: Record<string, TakeStat> = {};
  if (error || !data) return out;

  for (const row of data as Array<{
    take_id: string;
    agree_percent: number;
    total: number;
  }>) {
    out[row.take_id] = {
      agreePercent: row.agree_percent,
      total: Number(row.total),
    };
  }
  return out;
}

/** Records an anonymous-by-default hot-take response. */
export async function recordTakeResponse(
  takeId: string,
  answer: TakeAnswer,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("take_responses").upsert(
    {
      take_id: takeId,
      answer,
      voter_id: getVoterId(),
      user_id: user?.id ?? null,
    },
    { onConflict: "take_id,voter_id", ignoreDuplicates: true },
  );
}

/** Mirrors the local point total to the signed-in user's profile (no-op when anonymous). */
export async function syncProfilePoints(points: number): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({ points, updated_at: new Date().toISOString() })
    .eq("id", user.id);
}
