"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type {
  Badge,
  CategoryLean,
  Personality,
  PlayerProfile,
} from "@/types/debate";
import {
  getFlipRate,
  getPredictionAccuracy,
  getProfile,
  getStanceDistribution,
  getStreakInfo,
  PROFILE_EVENT,
} from "@/lib/player";
import { getRankProgress } from "@/lib/levels";
import { computePersonality } from "@/lib/personality";
import { computeBadges } from "@/lib/badges";
import { getCategoryLeanings } from "@/lib/insights";

interface Snapshot {
  profile: PlayerProfile;
  rankTitle: string;
  streak: number;
  freezeTokens: number;
  accuracy: number;
  accuracyTotal: number;
  flipPercent: number;
  stance: { pro: number; con: number; undecided: number };
  categories: CategoryLean[];
  personality: Personality;
  badges: Badge[];
}

function read(): Snapshot {
  const profile = getProfile();
  const streak = getStreakInfo();
  const acc = getPredictionAccuracy();
  return {
    profile,
    rankTitle: getRankProgress(profile.points).current.title,
    streak: streak.streak,
    freezeTokens: streak.freezeTokens,
    accuracy: acc.percent,
    accuracyTotal: acc.total,
    flipPercent: getFlipRate().percent,
    stance: getStanceDistribution(),
    categories: getCategoryLeanings(profile),
    personality: computePersonality(profile),
    badges: computeBadges(profile),
  };
}

export function StatsDashboard() {
  const [snap, setSnap] = useState<Snapshot | null>(null);

  useEffect(() => {
    const update = () => setSnap(read());
    update();
    window.addEventListener(PROFILE_EVENT, update);
    return () => window.removeEventListener(PROFILE_EVENT, update);
  }, []);

  if (!snap) return <div className="paper-card h-96 animate-pulse" />;

  const played = snap.profile.debates.length;
  const stanceTotal =
    snap.stance.pro + snap.stance.con + snap.stance.undecided || 1;

  if (played === 0) {
    return (
      <div className="paper-card px-6 py-10 text-center">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          No record yet
        </h2>
        <p className="mt-2 text-sm text-muted">
          Play your first debate and your profile starts taking shape.
        </p>
        <Link
          href="/debate"
          className="mt-6 inline-block bg-foreground px-6 py-3 font-display text-lg font-semibold text-background transition hover:bg-accent"
        >
          Read today&apos;s motion
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="paper-card grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
        <Cell label="Rank" value={snap.rankTitle} />
        <Cell label="Points" value={snap.profile.points.toLocaleString()} />
        <Cell
          label="Streak"
          value={snap.streak > 0 ? `${snap.streak}d` : "—"}
        />
        <Cell label="Freezes" value={`${snap.freezeTokens}`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Room-reading"
          value={`${snap.accuracy}%`}
          sub={`${snap.accuracyTotal} calls`}
        />
        <Metric
          label="Floor-crossing"
          value={`${snap.flipPercent}%`}
          sub="of decided debates"
        />
        <Metric label="Debates played" value={`${played}`} sub="all time" />
      </div>

      <section className="paper-card px-6 py-5">
        <p className="label text-foreground">How you open</p>
        <div className="mt-4 space-y-3">
          <Bar label="For" value={snap.stance.pro} total={stanceTotal} color="bg-pro" />
          <Bar label="Against" value={snap.stance.con} total={stanceTotal} color="bg-con" />
          <Bar
            label="Undecided"
            value={snap.stance.undecided}
            total={stanceTotal}
            color="bg-muted"
          />
        </div>
      </section>

      {snap.categories.length > 0 && (
        <section className="paper-card px-6 py-5">
          <p className="label text-foreground">Where you land, by topic</p>
          <p className="mt-1 text-xs text-muted">
            Share of decided verdicts you gave to the &ldquo;For&rdquo; side.
          </p>
          <div className="mt-4 space-y-3">
            {snap.categories.map((c) => (
              <div key={c.category}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-foreground">{c.category}</span>
                  <span className="font-mono text-xs text-muted">
                    {c.proPercent}% For · {c.played} played
                  </span>
                </div>
                <div className="flex h-2 w-full overflow-hidden bg-con/40">
                  <div
                    className="h-full bg-pro transition-all duration-700"
                    style={{ width: `${c.proPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="paper-card px-6 py-5">
        <p className="label text-muted">Your debating character</p>
        <p className="mt-2 font-display text-2xl font-semibold text-foreground">
          {snap.personality.archetype}
        </p>
        <p className="mt-1 text-sm text-muted">{snap.personality.tagline}</p>
      </section>

      <section>
        <h2 className="mb-3 font-display text-2xl font-semibold text-foreground">
          Achievements
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {snap.badges.map((b) => (
            <div
              key={b.id}
              className={`paper-card px-5 py-4 ${b.earned ? "" : "opacity-70"}`}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-semibold text-foreground">
                  {b.title}
                </p>
                <span
                  className={`label ${b.earned ? "text-accent" : "text-muted"}`}
                >
                  {b.earned ? "Earned" : `${Math.round(b.progress * 100)}%`}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{b.description}</p>
              {!b.earned && (
                <div className="mt-3 h-[3px] w-full bg-border">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${Math.round(b.progress * 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-4">
      <p className="label text-muted">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="paper-card px-5 py-4">
      <p className="label text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-accent">
        {value}
      </p>
      <p className="mt-1 font-mono text-xs text-muted">{sub}</p>
    </div>
  );
}

function Bar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = Math.round((value / total) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="font-mono text-xs text-muted">
          {value} · {pct}%
        </span>
      </div>
      <div className="h-2 w-full bg-border/60">
        <div
          className={`h-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
