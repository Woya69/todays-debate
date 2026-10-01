"use client";

import { useEffect, useState } from "react";
import { getProfile, getStreak, PROFILE_EVENT } from "@/lib/player";
import { getRankProgress } from "@/lib/levels";

interface Snapshot {
  points: number;
  streak: number;
  rankTitle: string;
  percent: number;
  next: string | null;
}

function read(): Snapshot {
  const profile = getProfile();
  const progress = getRankProgress(profile.points);
  return {
    points: profile.points,
    streak: getStreak(),
    rankTitle: progress.current.title,
    percent: progress.percent,
    next: progress.next?.title ?? null,
  };
}

export function StatusBar() {
  const [snap, setSnap] = useState<Snapshot | null>(null);

  useEffect(() => {
    const update = () => setSnap(read());
    update();
    window.addEventListener(PROFILE_EVENT, update);
    return () => window.removeEventListener(PROFILE_EVENT, update);
  }, []);

  if (!snap) {
    return <div className="h-[86px] paper-card animate-pulse" />;
  }

  return (
    <div className="paper-card">
      <div className="grid grid-cols-3 divide-x divide-border">
        <Stat label="Rank" value={snap.rankTitle} />
        <Stat label="Points" value={snap.points.toLocaleString()} />
        <Stat
          label="Streak"
          value={snap.streak > 0 ? `${snap.streak} day${snap.streak > 1 ? "s" : ""}` : "—"}
        />
      </div>
      {snap.next && (
        <div className="border-t border-border px-4 py-2">
          <div className="mb-1 flex justify-between">
            <span className="label text-muted">Next: {snap.next}</span>
            <span className="label text-muted">{snap.percent}%</span>
          </div>
          <div className="h-[3px] w-full bg-border">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${snap.percent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 px-2 py-3 sm:px-4">
      <p className="label truncate text-muted">{label}</p>
      <p className="mt-1 truncate font-display text-base font-semibold text-foreground sm:text-xl">
        {value}
      </p>
    </div>
  );
}
