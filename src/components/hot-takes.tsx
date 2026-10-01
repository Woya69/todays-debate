"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { HotTake, TakeAnswer } from "@/types/debate";
import { POINTS } from "@/lib/levels";
import { getProfile, getTakeAnswer, recordTake } from "@/lib/player";
import {
  fetchHotTakeStats,
  recordTakeResponse,
  syncProfilePoints,
  type TakeStat,
} from "@/lib/stats";

interface Outcome {
  take: HotTake;
  answer: TakeAnswer;
  crowdShare: number;
  earned: number;
}

const THRESHOLD = 90;

export function HotTakes({
  takes,
  onReport,
  discussHref,
}: {
  takes: HotTake[];
  onReport?: (take: HotTake) => void;
  discussHref?: (take: HotTake) => string;
}) {
  const [index, setIndex] = useState(0);
  const [dx, setDx] = useState(0);
  const [exit, setExit] = useState<"left" | "right" | null>(null);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [points, setPoints] = useState(0);
  const [liveStats, setLiveStats] = useState<Record<string, TakeStat>>({});
  const dragging = useRef(false);
  const startX = useRef(0);

  useEffect(() => {
    fetchHotTakeStats(takes.map((t) => t.id))
      .then(setLiveStats)
      .catch(() => {});
  }, [takes]);

  // Skip takes already answered on a prior visit.
  const fresh = useMemo(
    () => takes.filter((t) => getTakeAnswer(t.id) === null),
    [takes],
  );
  const deck = fresh.length > 0 ? fresh : takes;

  const current = deck[index];
  const done = index >= deck.length;

  function commit(answer: TakeAnswer) {
    if (!current || exit) return;
    const already = getTakeAnswer(current.id) !== null;
    const earned = already ? 0 : POINTS.take;
    const profile = recordTake(current.id, answer, POINTS.take);
    void recordTakeResponse(current.id, answer);
    if (earned > 0) void syncProfilePoints(profile.points);

    const liveAgree = liveStats[current.id];
    const agree =
      liveAgree && liveAgree.total > 0
        ? liveAgree.agreePercent
        : current.agreePercent;
    const crowdShare = answer === "agree" ? agree : 100 - agree;

    setExit(answer === "agree" ? "right" : "left");
    setPoints((p) => p + earned);
    setOutcomes((o) => [...o, { take: current, answer, crowdShare, earned }]);

    window.setTimeout(() => {
      setExit(null);
      setDx(0);
      setIndex((i) => i + 1);
    }, 220);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (exit) return;
    dragging.current = true;
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    setDx(e.clientX - startX.current);
  }
  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    if (dx > THRESHOLD) commit("agree");
    else if (dx < -THRESHOLD) commit("disagree");
    else setDx(0);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (done) return;
      if (e.key === "ArrowRight") commit("agree");
      if (e.key === "ArrowLeft") commit("disagree");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, exit, done]);

  if (done) {
    return (
      <Summary outcomes={outcomes} points={points} discussHref={discussHref} />
    );
  }

  const offset = exit === "right" ? 600 : exit === "left" ? -600 : dx;
  const rotate = offset / 22;
  const next = deck[index + 1];

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-5 flex items-center justify-between">
        <span className="label text-muted">
          {index + 1} / {deck.length}
        </span>
        <span className="label text-accent">{points} pts earned</span>
      </div>

      <div className="relative h-[300px] select-none">
        {next && (
          <Card take={next} style={{ transform: "scale(0.95) translateY(10px)" }} faded />
        )}

        <Card
          take={current}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          interactive
          hint={dx}
          style={{
            transform: `translateX(${offset}px) rotate(${rotate}deg)`,
            transition: dragging.current ? "none" : "transform 0.22s ease-out",
            opacity: exit ? 0 : 1,
          }}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => commit("disagree")}
          className="border border-con px-5 py-4 font-display text-lg font-semibold text-con transition hover:bg-con hover:text-background"
        >
          Disagree
        </button>
        <button
          type="button"
          onClick={() => commit("agree")}
          className="border border-pro px-5 py-4 font-display text-lg font-semibold text-pro transition hover:bg-pro hover:text-background"
        >
          Agree
        </button>
      </div>
      <p className="mt-4 text-center font-mono text-xs text-muted">
        Swipe the card, tap a button, or use ← / → keys
      </p>
      {onReport && current && (
        <div className="mt-2 text-center">
          <ReportLink key={current.id} onReport={() => onReport(current)} />
        </div>
      )}
    </div>
  );
}

function ReportLink({ onReport }: { onReport: () => void }) {
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <span className="font-mono text-xs text-muted">
        Thanks — flagged for review.
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        onReport();
        setDone(true);
      }}
      className="font-mono text-xs text-muted underline-offset-2 transition hover:text-con hover:underline"
    >
      Report this take
    </button>
  );
}

function Card({
  take,
  style,
  faded,
  interactive,
  hint = 0,
  ...handlers
}: {
  take: HotTake;
  style?: React.CSSProperties;
  faded?: boolean;
  interactive?: boolean;
  hint?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...handlers}
      style={style}
      className={`paper-card absolute inset-0 flex flex-col justify-between px-7 py-7 ${
        interactive ? "cursor-grab active:cursor-grabbing touch-none" : ""
      } ${faded ? "opacity-50" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span className="label text-muted">{take.topic}</span>
        <div className="flex gap-3">
          <span
            className="label transition-opacity"
            style={{ opacity: hint < -30 ? 1 : 0.2, color: "var(--con)" }}
          >
            Disagree
          </span>
          <span
            className="label transition-opacity"
            style={{ opacity: hint > 30 ? 1 : 0.2, color: "var(--pro)" }}
          >
            Agree
          </span>
        </div>
      </div>
      <p className="font-display text-2xl font-semibold leading-snug text-foreground">
        {take.text}
      </p>
      <span className="label text-muted">Today&apos;s Takes</span>
    </div>
  );
}

function Summary({
  outcomes,
  points,
  discussHref,
}: {
  outcomes: Outcome[];
  points: number;
  discussHref?: (take: HotTake) => string;
}) {
  const agreed = outcomes.filter((o) => o.answer === "agree").length;
  const withCrowd = outcomes.filter((o) => o.crowdShare >= 50).length;
  const contrarian = outcomes.length - withCrowd;
  const total = getProfile().points;

  return (
    <div className="mx-auto w-full max-w-md animate-rise">
      <div className="paper-card px-6 py-7 text-center">
        <p className="label text-muted">Takes filed</p>
        <p className="mt-3 font-display text-4xl font-semibold text-accent">
          +{points}
        </p>
        <p className="mt-1 text-sm text-muted">points this round · {total.toLocaleString()} total</p>

        <hr className="rule my-5" />

        <div className="grid grid-cols-3 divide-x divide-border">
          <Mini label="Agreed" value={`${agreed}/${outcomes.length}`} />
          <Mini label="With crowd" value={`${withCrowd}`} />
          <Mini label="Against" value={`${contrarian}`} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {outcomes.map((o, i) => (
          <div
            key={`${o.take.id}-${i}`}
            className="paper-card px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <span className="pr-3 text-sm text-foreground">{o.take.text}</span>
              <span
                className="label shrink-0"
                style={{
                  color: o.answer === "agree" ? "var(--pro)" : "var(--con)",
                }}
              >
                {o.answer === "agree" ? "Agree" : "Disagree"}
              </span>
            </div>
            {discussHref && (
              <Link
                href={discussHref(o.take)}
                className="mt-2 inline-block font-mono text-xs text-accent underline-offset-2 transition hover:underline"
              >
                Join the discussion →
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/debate"
          className="flex-1 bg-foreground px-6 py-4 text-center font-display text-lg font-semibold text-background transition hover:bg-accent"
        >
          Today&apos;s Debate
        </Link>
        <Link
          href="/leaderboard"
          className="flex-1 border border-foreground px-6 py-4 text-center font-display text-lg font-semibold text-foreground transition hover:bg-foreground hover:text-background"
        >
          Standings
        </Link>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1">
      <p className="font-display text-xl font-semibold text-foreground">{value}</p>
      <p className="label text-muted">{label}</p>
    </div>
  );
}
