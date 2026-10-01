"use client";

import { useState } from "react";
import Link from "next/link";
import { submitCommunityTake } from "@/lib/community";

const TOPICS = [
  "Society",
  "Economy",
  "Technology",
  "Climate",
  "Democracy",
  "Education",
  "Media",
  "Work",
  "Culture",
];

const MAX = 140;

export function SubmitTakeForm() {
  const [text, setText] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await submitCommunityTake({ text, topic });
    setBusy(false);
    if (result.ok) {
      setPublished(true);
      setText("");
    } else {
      setError(result.error);
    }
  }

  if (published) {
    return (
      <div className="paper-card animate-rise px-6 py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent text-2xl text-accent">
          ✓
        </div>
        <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">
          Your take is live
        </h2>
        <p className="mt-2 text-sm text-muted">
          It&apos;s now in the community deck for others to weigh in on. Watch
          the agree/disagree split roll in on your account.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/account"
            className="flex-1 bg-foreground px-6 py-3 text-center font-display text-lg font-semibold text-background transition hover:bg-accent"
          >
            See my takes
          </Link>
          <button
            type="button"
            onClick={() => setPublished(false)}
            className="flex-1 border border-foreground px-6 py-3 font-display text-lg font-semibold text-foreground transition hover:bg-foreground hover:text-background"
          >
            Write another
          </button>
        </div>
      </div>
    );
  }

  const remaining = MAX - text.length;

  return (
    <form onSubmit={handleSubmit} className="paper-card space-y-5 px-6 py-7">
      <label className="block">
        <span className="label text-muted">Your take</span>
        <textarea
          required
          maxLength={MAX}
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-1 w-full resize-none border border-border bg-transparent px-3 py-2 font-display text-xl leading-snug text-foreground outline-none focus:border-accent"
          placeholder="Say something people will actually argue about."
        />
        <span
          className={`mt-1 block text-right font-mono text-xs ${
            remaining < 0 ? "text-con" : "text-muted"
          }`}
        >
          {remaining}
        </span>
      </label>

      <div>
        <span className="label text-muted">Topic</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              className={`label border px-3 py-1.5 transition ${
                topic === t
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted hover:border-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="border border-con bg-con/10 px-3 py-2 text-sm text-con">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy || text.trim().length < 8}
        className="w-full bg-foreground px-6 py-3 font-display text-lg font-semibold text-background transition hover:bg-accent disabled:opacity-40"
      >
        {busy ? "Publishing…" : "Publish take"}
      </button>

      <p className="font-mono text-xs text-muted">
        Keep it to one clear claim. Published takes are public and tied to your
        account.
      </p>
    </form>
  );
}
