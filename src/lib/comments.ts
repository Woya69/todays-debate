"use client";

import type { DebateComment, Stance } from "@/types/debate";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface CommentRow {
  id: string;
  debate_id: string;
  body: string;
  side: Stance;
  author_name: string;
  created_at: string;
}

function toComment(row: CommentRow): DebateComment {
  return {
    id: row.id,
    debateId: row.debate_id,
    body: row.body,
    side: row.side,
    authorName: row.author_name,
    createdAt: row.created_at,
  };
}

/** Published rebuttals for a debate, newest first. */
export async function fetchComments(debateId: string): Promise<DebateComment[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("debate_comments")
    .select("id, debate_id, body, side, author_name, created_at")
    .eq("debate_id", debateId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return (data as CommentRow[]).map(toComment);
}

export type PostCommentResult =
  | { ok: true; comment: DebateComment }
  | { ok: false; error: string };

/** Posts a one-line rebuttal. Requires a signed-in user. */
export async function postComment(input: {
  debateId: string;
  body: string;
  side: Stance;
}): Promise<PostCommentResult> {
  const body = input.body.trim();
  if (body.length < 3) return { ok: false, error: "Say a little more." };
  if (body.length > 280) return { ok: false, error: "Keep it under 280 characters." };

  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to post a rebuttal." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const authorName =
    (profile?.display_name as string | null) ||
    user.email?.split("@")[0] ||
    "Anonymous";

  const { data, error } = await supabase
    .from("debate_comments")
    .insert({
      debate_id: input.debateId,
      body,
      side: input.side,
      author_user_id: user.id,
      author_name: authorName,
    })
    .select("id, debate_id, body, side, author_name, created_at")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not post." };
  }
  return { ok: true, comment: toComment(data as CommentRow) };
}
