"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type SuggestResult = { ok: true } | { ok: false; error: string };

/** Submits a reader motion idea for editorial review. Requires sign-in. */
export async function submitDebateSuggestion(input: {
  resolution: string;
  category: string;
  proHint: string;
  conHint: string;
}): Promise<SuggestResult> {
  const resolution = input.resolution.trim();
  if (resolution.length < 12) {
    return { ok: false, error: "Give the motion at least 12 characters." };
  }
  if (resolution.length > 160) {
    return { ok: false, error: "Keep the motion under 160 characters." };
  }

  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to suggest a motion." };

  const { error } = await supabase.from("debate_suggestions").insert({
    resolution,
    category: input.category.trim() || "Reader",
    pro_hint: input.proHint.trim() || null,
    con_hint: input.conHint.trim() || null,
    author_user_id: user.id,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
