"use client";

import { useEffect, useState } from "react";
import { getLocalReminderEmail, subscribeReminder } from "@/lib/reminders";

export function ReminderForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedEmail, setSavedEmail] = useState<string | null>(null);

  useEffect(() => {
    setSavedEmail(getLocalReminderEmail());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await subscribeReminder(email);
    setBusy(false);
    if (result.ok) {
      setSavedEmail(email.trim().toLowerCase());
      setEmail("");
    } else {
      setError(result.error);
    }
  }

  if (savedEmail) {
    return (
      <div className="paper-card px-6 py-5">
        <p className="label text-accent">Daily reminder</p>
        <p className="mt-2 text-sm text-muted">
          You&apos;re on the list as{" "}
          <span className="font-semibold text-foreground">{savedEmail}</span>.
          We&apos;ll nudge you when each new motion goes live.
        </p>
        <button
          type="button"
          onClick={() => setSavedEmail(null)}
          className="mt-3 label text-muted underline-offset-2 transition hover:text-foreground hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="paper-card px-6 py-5">
      <p className="label text-accent">Never miss a motion</p>
      <p className="mt-2 text-sm text-muted">
        One email a day when the new debate drops. No noise, easy to leave.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 border border-border bg-transparent px-3 py-2 text-foreground outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={busy}
          className="bg-foreground px-6 py-2 font-display text-base font-semibold text-background transition hover:bg-accent disabled:opacity-40"
        >
          {busy ? "Saving…" : "Remind me"}
        </button>
      </div>
      {error && (
        <p className="mt-3 border border-con bg-con/10 px-3 py-2 text-sm text-con">
          {error}
        </p>
      )}
    </form>
  );
}
