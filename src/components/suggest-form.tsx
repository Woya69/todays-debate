"use client";

import { useState } from "react";
import Link from "next/link";
import { submitDebateSuggestion } from "@/lib/suggestions";

const CATEGORIES = [
  "Policy",
  "Technology",
  "Society",
  "Climate",
  "Work & Economy",
  "Science",
  "Reader",
];

export function SuggestForm() {
  const [resolution, setResolution] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [proHint, setProHint] = useState("");
  const [conHint, setConHint] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await submitDebateSuggestion({
      resolution,
      category,
      proHint,
      conHint,
    });
    setBusy(false);
    if (result.ok) {
      setDone(true);
      setResolution("");
      setProHint("");
      setConHint("");
    } else {
      setError(result.error);
    }
  }

  if (done) {
    return (
      <div className="paper-card animate-rise px-6 py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent text-2xl text-accent">
          ✓
        </div>
        <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">
          In the queue
        </h2>
        <p className="mt-2 text-sm text-muted">
          Thanks — an editor will weigh it for a future motion. You can track its
          status from your account.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 w-full border border-foreground px-6 py-3 font-display text-lg font-semibold text-foreground transition hover:bg-foreground hover:text-background"
        >
          Suggest another
        </button>
      </div>
    );
  }

  const remaining = 160 - resolution.length;

  return (
    <form onSubmit={handleSubmit} className="paper-card space-y-5 px-6 py-7">
      <label className="block">
        <span className="label text-muted">The motion</span>
        <textarea
          required
          maxLength={160}
          rows={2}
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          className="mt-1 w-full resize-none border border-border bg-transparent px-3 py-2 font-display text-xl leading-snug text-foreground outline-none focus:border-accent"
          placeholder="A claim with a real For and Against."
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
        <span className="label text-muted">Category</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`label border px-3 py-1.5 transition ${
                category === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted hover:border-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="label text-muted">The case For (optional)</span>
        <input
          maxLength={200}
          value={proHint}
          onChange={(e) => setProHint(e.target.value)}
          className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-foreground outline-none focus:border-accent"
          placeholder="Strongest argument in favour."
        />
      </label>

      <label className="block">
        <span className="label text-muted">The case Against (optional)</span>
        <input
          maxLength={200}
          value={conHint}
          onChange={(e) => setConHint(e.target.value)}
          className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-foreground outline-none focus:border-accent"
          placeholder="Strongest argument against."
        />
      </label>

      {error && (
        <p className="border border-con bg-con/10 px-3 py-2 text-sm text-con">
          {error}{" "}
          {error.toLowerCase().includes("sign in") && (
            <Link href="/account" className="underline">
              Sign in
            </Link>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={busy || resolution.trim().length < 12}
        className="w-full bg-foreground px-6 py-3 font-display text-lg font-semibold text-background transition hover:bg-accent disabled:opacity-40"
      >
        {busy ? "Submitting…" : "Submit motion"}
      </button>
    </form>
  );
}
