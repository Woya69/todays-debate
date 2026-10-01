"use client";

import type { HotTake } from "@/types/debate";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getVoterId } from "@/lib/voter";
import { fetchHotTakeStats, type TakeStat } from "@/lib/stats";

export interface CommunityTake extends HotTake {
  createdAt: string;
}

export interface MyTake extends CommunityTake {
  agreePercent: number;
  total: number;
  status: string;
}

interface TakeRow {
  id: string;
  text: string;
  topic: string;
  status: string;
  created_at: string;
}

export type SubmitResult =
  | { ok: true; take: CommunityTake }
  | { ok: false; error: string };

/** Publishes a take authored by the signed-in user. Requires an active session. */
export async function submitCommunityTake(input: {
  text: string;
  topic: string;
}): Promise<SubmitResult> {
  const text = input.text.trim();
  const topic = input.topic.trim() || "Community";

  if (text.length < 8) {
    return { ok: false, error: "Give it at least 8 characters." };
  }
  if (text.length > 140) {
    return { ok: false, error: "Keep it under 140 characters." };
  }

  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You need to be signed in to publish a take." };
  }

  const { data, error } = await supabase
    .from("community_takes")
    .insert({ text, topic, author_user_id: user.id })
    .select("id, text, topic, status, created_at")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not save your take." };
  }

  const row = data as TakeRow;
  return {
    ok: true,
    take: {
      id: row.id,
      text: row.text,
      topic: row.topic,
      agreePercent: 50,
      createdAt: row.created_at,
    },
  };
}

/** Recently published community takes, newest first, for the community swipe deck. */
export async function fetchCommunityDeck(limit = 30): Promise<CommunityTake[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("community_takes")
    .select("id, text, topic, status, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  const rows = data as TakeRow[];
  // Seed each card with its live crowd agree-rate so results feel real.
  const stats = await fetchHotTakeStats(rows.map((r) => r.id)).catch(
    () => ({}) as Record<string, TakeStat>,
  );

  return rows.map((row) => {
    const stat = stats[row.id];
    return {
      id: row.id,
      text: row.text,
      topic: row.topic,
      agreePercent: stat && stat.total > 0 ? stat.agreePercent : 50,
      createdAt: row.created_at,
    };
  });
}

/** The signed-in user's own takes, each joined with its live crowd stats. */
export async function fetchMyTakes(): Promise<MyTake[]> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("community_takes")
    .select("id, text, topic, status, created_at")
    .eq("author_user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const rows = data as TakeRow[];
  const stats = await fetchHotTakeStats(rows.map((r) => r.id));

  return rows.map((row) => {
    const stat = stats[row.id];
    return {
      id: row.id,
      text: row.text,
      topic: row.topic,
      status: row.status,
      createdAt: row.created_at,
      agreePercent: stat?.agreePercent ?? 0,
      total: stat?.total ?? 0,
    };
  });
}

/** Flags a take for review. One report per browser per take; safe to call again (ignored). */
export async function reportTake(
  takeId: string,
  reason?: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("take_reports").upsert(
    {
      take_id: takeId,
      reporter_voter_id: getVoterId(),
      reporter_user_id: user?.id ?? null,
      reason: reason?.trim() || null,
    },
    { onConflict: "take_id,reporter_voter_id", ignoreDuplicates: true },
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Author-only: hide or republish one of your own takes. */
export async function setTakeHidden(
  takeId: string,
  hidden: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("community_takes")
    .update({ status: hidden ? "hidden" : "published" })
    .eq("id", takeId);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Author-only: permanently delete one of your own takes. RLS enforces ownership. */
export async function deleteCommunityTake(
  takeId: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("community_takes")
    .delete()
    .eq("id", takeId);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
