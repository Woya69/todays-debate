"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getVoterId } from "@/lib/voter";

const LOCAL_KEY = "td_reminder_email";

export type ReminderResult = { ok: true } | { ok: false; error: string };

/** Returns the email this browser previously opted in with, if any. */
export function getLocalReminderEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LOCAL_KEY);
}

/** Opts an email into the daily reminder. Works signed in or anonymous. */
export async function subscribeReminder(email: string): Promise<ReminderResult> {
  const clean = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
    return { ok: false, error: "That doesn't look like an email." };
  }

  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("reminders").upsert(
    {
      email: clean,
      user_id: user?.id ?? null,
      voter_id: getVoterId(),
      unsubscribed: false,
    },
    { onConflict: "email" },
  );

  if (error) return { ok: false, error: error.message };

  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_KEY, clean);
  }
  return { ok: true };
}
