"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Corner } from "@/types/debate";
import { createChallenge } from "@/lib/challenges";
import { getPublishedDebates } from "@/data/debates";

export function ChallengeCreateForm({
  presetMotion,
  presetSlug,
  presetCategory,
}: {
  presetMotion?: string;
  presetSlug?: string;
  presetCategory?: string;
}) {
  const router = useRouter();
  const corpus = useMemo(() => getPublishedDebates().slice(0, 40), []);
  const [motion, setMotion] = useState(presetMotion ?? "");
  const [side, setSide] = useState<Corner>("pro");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickedSlug, setPickedSlug] = useState<string | null>(presetSlug ?? null);
  const [category, setCategory] = useState(presetCategory ?? "Open floor");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await createChallenge({
      motion,
      side,
      debateSlug: pickedSlug,
      category,
      roundCount: 3,
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/challenge/${result.challenge.inviteCode}`);
  }

  return (
    <form onSubmit={onSubmit} className="arena-panel space-y-5 px-6 py-7 sm:px-8">
      <div>
        <p className="label text-pro">The motion</p>
        <textarea
          rows={3}
          maxLength={280}
          value={motion}
          onChange={(e) => {
            setMotion(e.target.value);
            setPickedSlug(null);
            setCategory("Open floor");
          }}
          placeholder="What should you two debate?"
          className="mt-2 w-full resize-none rounded-2xl border border-border bg-background/60 px-4 py-3 text-foreground outline-none focus:border-pro"
        />
        <p className="mt-1 font-mono text-xs text-muted">{280 - motion.length} left</p>
      </div>

      {!presetMotion && (
        <div>
          <p className="label text-muted">Or grab a motion from the corpus</p>
          <div className="mt-2 max-h-40 space-y-2 overflow-y-auto pr-1">
            {corpus.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setMotion(d.resolution);
                  setPickedSlug(d.id);
                  setCategory(d.category);
                }}
                className="block w-full rounded-xl border border-border px-3 py-2 text-left text-sm text-muted transition hover:border-pro hover:text-foreground"
              >
                {d.resolution}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="label text-muted">Your corner</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSide("pro")}
            className={`rounded-2xl border px-4 py-4 text-left ${
              side === "pro" ? "corner-pro animate-corner-pro bg-pro/10" : "border-border"
            }`}
          >
            <p className="label text-pro">Corner</p>
            <p className="mt-1 font-display text-2xl font-extrabold">FOR</p>
          </button>
          <button
            type="button"
            onClick={() => setSide("con")}
            className={`rounded-2xl border px-4 py-4 text-left ${
              side === "con" ? "corner-con animate-corner-con bg-con/10" : "border-border"
            }`}
          >
            <p className="label text-con">Corner</p>
            <p className="mt-1 font-display text-2xl font-extrabold">AGAINST</p>
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-con/40 bg-con/10 px-4 py-3 text-sm text-con">
          {error}{" "}
          {error.toLowerCase().includes("sign in") && (
            <Link href="/account" className="underline">
              Sign in
            </Link>
          )}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-primary w-full">
        {busy ? "Opening the floor…" : "Create challenge link"}
      </button>
      <p className="text-center text-sm text-muted">
        Three rounds each. Argue the motion — not the person. Crowd cheers a corner.
      </p>
    </form>
  );
}
