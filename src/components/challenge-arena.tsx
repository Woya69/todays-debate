"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type {
  Challenge,
  ChallengeComment,
  ChallengeCrowd,
  ChallengeRound,
  Corner,
} from "@/types/debate";
import {
  acceptChallenge,
  cheerCorner,
  fetchChallenge,
  fetchChallengeComments,
  fetchCrowd,
  fetchRounds,
  postChallengeComment,
  postRound,
} from "@/lib/challenges";
import { absoluteUrl } from "@/lib/site";
import { copyLink } from "@/lib/share";
import { CrowdMeter, CornerCheerButtons } from "@/components/crowd-meter";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const MAX = 280;

export function ChallengeArena({
  initialCode,
}: {
  initialCode: string;
}) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [rounds, setRounds] = useState<ChallengeRound[]>([]);
  const [crowd, setCrowd] = useState<ChallengeCrowd>({
    proPercent: 50,
    conPercent: 50,
    totalCheers: 0,
  });
  const [comments, setComments] = useState<ChallengeComment[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [cheerSide, setCheerSide] = useState<Corner | null>(null);
  const [roundBody, setRoundBody] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const c = await fetchChallenge(initialCode);
    if (!c) {
      setChallenge(null);
      setLoading(false);
      return;
    }
    setChallenge(c);
    const [r, crowdData, commentData] = await Promise.all([
      fetchRounds(c.id),
      fetchCrowd(c.id),
      fetchChallengeComments(c.id),
    ]);
    setRounds(r);
    setCrowd(crowdData);
    setComments(commentData);
    setLoading(false);
  }, [initialCode]);

  const isDemo = challenge?.id.startsWith("seed-") ?? false;

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), 8000);
    return () => window.clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    let active = true;
    async function loadUser() {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      if (active) setUserId(data.user?.id ?? null);
    }
    void loadUser();
    return () => {
      active = false;
    };
  }, []);

  async function onAccept() {
    if (!challenge) return;
    setBusy(true);
    setError(null);
    const result = await acceptChallenge(challenge.id);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setChallenge(result.challenge);
    await refresh();
  }

  async function onCheer(side: Corner) {
    if (!challenge) return;
    setBusy(true);
    setError(null);
    const result = await cheerCorner(challenge.id, side);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCheerSide(side);
    setCrowd(result.crowd);
  }

  async function onPostRound(e: React.FormEvent) {
    e.preventDefault();
    if (!challenge) return;
    setBusy(true);
    setError(null);
    const result = await postRound({ challengeId: challenge.id, body: roundBody });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setRoundBody("");
    setChallenge(result.challenge);
    setRounds((prev) => [...prev, result.round]);
    await refresh();
  }

  async function onPostComment(e: React.FormEvent) {
    e.preventDefault();
    if (!challenge || !cheerSide) {
      setError("Pick a corner before commenting.");
      return;
    }
    setBusy(true);
    setError(null);
    const result = await postChallengeComment({
      challengeId: challenge.id,
      body: commentBody,
      side: cheerSide,
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCommentBody("");
    setComments((prev) => [result.comment, ...prev]);
  }

  async function onShare() {
    if (!challenge) return;
    const url = absoluteUrl(`/challenge/${challenge.inviteCode}`);
    const ok = await copyLink(url);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  if (loading) {
    return <div className="arena-panel h-80 animate-pulse" />;
  }

  if (!challenge) {
    return (
      <div className="arena-card px-6 py-10 text-center">
        <p className="font-display text-2xl font-extrabold">Challenge not found</p>
        <Link href="/challenge" className="btn-primary mt-5 inline-flex">
          Start a new one
        </Link>
      </div>
    );
  }

  const mySide: Corner | null =
    userId && challenge.challengerId === userId
      ? challenge.challengerSide
      : userId && challenge.opponentId === userId
        ? challenge.opponentSide
        : null;

  const isMyTurn =
    challenge.status === "live" &&
    !!mySide &&
    challenge.nextSide === mySide;

  const winner =
    challenge.status === "done"
      ? crowd.proPercent === crowd.conPercent
        ? "Tie"
        : crowd.proPercent > crowd.conPercent
          ? "FOR"
          : "AGAINST"
      : null;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 animate-rise">
      <header className="arena-panel px-6 py-7 sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`label rounded-full px-2.5 py-1 ${
              challenge.status === "live"
                ? "bg-con/15 text-con"
                : challenge.status === "open"
                  ? "bg-pro/15 text-pro"
                  : "bg-border/40 text-muted"
            }`}
          >
            {challenge.status === "live"
              ? "Live"
              : challenge.status === "open"
                ? "Waiting for opponent"
                : "Crowd has spoken"}
          </span>
          <span className="label text-muted">{challenge.category}</span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          {challenge.motion}
        </h1>
        {isDemo && (
          <p className="mt-3 rounded-sm border border-border bg-background px-3 py-2 text-sm text-muted">
            Sample debate so the room never looks empty. Cheer and comment —
            start your own challenge to go live.
          </p>
        )}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-pro/40 bg-pro/5 px-4 py-3">
            <p className="label text-pro">
              {challenge.challengerSide === "pro" ? "FOR" : "AGAINST"}
            </p>
            <p className="mt-1 font-display text-lg font-bold">
              {challenge.challengerName}
            </p>
          </div>
          <div className="rounded-2xl border border-con/40 bg-con/5 px-4 py-3">
            <p className="label text-con">
              {(challenge.opponentSide ??
                (challenge.challengerSide === "pro" ? "con" : "pro")) === "pro"
                ? "FOR"
                : "AGAINST"}
            </p>
            <p className="mt-1 font-display text-lg font-bold">
              {challenge.opponentName ?? "Waiting…"}
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onShare}
            className="btn-primary relative flex-1 overflow-hidden"
            aria-live="polite"
          >
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                copied
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              }`}
            >
              Copied
            </span>
            <span
              className={`flex items-center justify-center transition-all duration-300 ${
                copied
                  ? "-translate-y-2 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              Share
            </span>
          </button>
          {challenge.status === "open" && mySide === null && (
            <button
              type="button"
              disabled={busy}
              onClick={onAccept}
              className="btn-ghost flex-1"
            >
              Accept challenge
            </button>
          )}
        </div>
      </header>

      <CrowdMeter crowd={crowd} />

      {challenge.status !== "open" && (
        <section className="arena-card space-y-4 px-5 py-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-extrabold">Rounds</h2>
            <span className="label text-muted">
              Round {Math.min(challenge.currentRound || 1, challenge.roundCount)} /{" "}
              {challenge.roundCount}
            </span>
          </div>
          {rounds.length === 0 && (
            <p className="text-sm text-muted">No rounds yet. First corner goes.</p>
          )}
          <div className="space-y-3">
            {rounds.map((r) => (
              <div
                key={r.id}
                className={`rounded-2xl border px-4 py-3 ${
                  r.side === "pro" ? "corner-pro" : "corner-con"
                }`}
              >
                <p className={`label ${r.side === "pro" ? "text-pro" : "text-con"}`}>
                  Round {r.roundIndex} · {r.side === "pro" ? "FOR" : "AGAINST"} ·{" "}
                  {r.authorName}
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">{r.body}</p>
              </div>
            ))}
          </div>

          {isMyTurn && (
            <form onSubmit={onPostRound} className="space-y-2 border-t border-border pt-4">
              <p className="label text-pro">Your turn</p>
              <textarea
                rows={3}
                maxLength={MAX}
                value={roundBody}
                onChange={(e) => setRoundBody(e.target.value)}
                placeholder="One sharp argument. Argue the motion, not the person."
                className="w-full resize-none rounded-2xl border border-border bg-background/60 px-4 py-3 outline-none focus:border-pro"
              />
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted">
                  {MAX - roundBody.length}
                </span>
                <button type="submit" disabled={busy} className="btn-primary">
                  Throw round
                </button>
              </div>
            </form>
          )}

          {challenge.status === "live" && mySide && !isMyTurn && (
            <p className="text-sm text-muted">Waiting on the other corner…</p>
          )}
        </section>
      )}

      {winner && (
        <div className="arena-panel px-6 py-8 text-center">
          <p className="label text-muted">Crowd verdict</p>
          <p className="mt-3 font-display text-5xl font-extrabold tracking-tight">
            {winner === "Tie" ? (
              "TIE"
            ) : (
              <span className={winner === "FOR" ? "text-pro" : "text-con"}>
                {winner}
              </span>
            )}
          </p>
          <p className="mt-2 text-muted">
            {crowd.proPercent}% FOR · {crowd.conPercent}% AGAINST
          </p>
          <Link
            href={`/challenge?motion=${encodeURIComponent(challenge.motion)}`}
            className="btn-primary mt-6 inline-flex"
          >
            Challenge someone on this
          </Link>
        </div>
      )}

      <section className="arena-card space-y-4 px-5 py-5">
        <h2 className="font-display text-xl font-extrabold">Crowd</h2>
        <p className="text-sm text-muted">
          Pick a corner to cheer. Comments require a corner — no anonymous pile-ons.
        </p>
        <CornerCheerButtons
          onCheer={onCheer}
          disabled={busy}
          mySide={cheerSide}
        />

        <form onSubmit={onPostComment} className="space-y-2 border-t border-border pt-4">
          <textarea
            rows={2}
            maxLength={MAX}
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder={
              cheerSide
                ? "One line from your corner."
                : "Cheer a corner first, then comment."
            }
            className="w-full resize-none rounded-2xl border border-border bg-background/60 px-4 py-3 outline-none focus:border-pro"
            disabled={!cheerSide}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={busy || !cheerSide || commentBody.trim().length < 3}
              className="btn-primary"
            >
              Post
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {comments.length === 0 && (
            <p className="text-sm text-muted">No crowd lines yet.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="border-t border-border pt-3">
              <p className="text-sm leading-6 text-foreground">{c.body}</p>
              <p className="mt-1 label text-muted">
                {c.authorName} · {c.side === "pro" ? "FOR" : "AGAINST"}
              </p>
            </div>
          ))}
        </div>
      </section>

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
    </div>
  );
}
