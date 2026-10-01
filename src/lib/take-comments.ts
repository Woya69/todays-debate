"use client";

import type { TakeComment } from "@/types/debate";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { resolvePublicName } from "@/lib/identity";

interface CommentRow {
  id: string;
  take_id: string;
  body: string;
  author_user_id: string;
  author_name: string;
  created_at: string;
}

function toComment(row: CommentRow, viewerId: string | null): TakeComment {
  return {
    id: row.id,
    takeId: row.take_id,
    body: row.body,
    authorName: row.author_name,
    mine: viewerId !== null && row.author_user_id === viewerId,
    createdAt: row.created_at,
  };
}

/** Published comments for a take, newest first. */
export async function fetchTakeComments(takeId: string): Promise<TakeComment[]> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("take_comments")
    .select("id, take_id, body, author_user_id, author_name, created_at")
    .eq("take_id", takeId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) return [];
  return (data as CommentRow[]).map((row) => toComment(row, user?.id ?? null));
}

export type PostTakeCommentResult =
  | { ok: true; comment: TakeComment }
  | { ok: false; error: string };

/** Posts a comment on a take. Requires a signed-in user. */
export async function postTakeComment(input: {
  takeId: string;
  body: string;
}): Promise<PostTakeCommentResult> {
  const body = input.body.trim();
  if (body.length < 2) return { ok: false, error: "Say a little more." };
  if (body.length > 280) {
    return { ok: false, error: "Keep it under 280 characters." };
  }

  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to join the discussion." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const authorName = resolvePublicName({
    displayName: profile?.display_name as string | null,
    email: user.email,
  });

  const { data, error } = await supabase
    .from("take_comments")
    .insert({
      take_id: input.takeId,
      body,
      author_user_id: user.id,
      author_name: authorName,
    })
    .select("id, take_id, body, author_user_id, author_name, created_at")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not post." };
  }
  return { ok: true, comment: toComment(data as CommentRow, user.id) };
}

/** Author-only: permanently delete one of your own comments. RLS enforces ownership. */
export async function deleteTakeComment(
  commentId: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("take_comments")
    .delete()
    .eq("id", commentId);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
