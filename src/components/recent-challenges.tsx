"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Challenge } from "@/types/debate";
import { listRecentChallenges } from "@/lib/challenges";

function statusLabel(status: Challenge["status"]): string {
  if (status === "open") return "Open";
  if (status === "live") return "Live";
  return "Done";
}

function statusTone(status: Challenge["status"]): string {
  if (status === "open") return "text-pro bg-pro/15";
  if (status === "live") return "text-con bg-con/15";
  return "text-muted bg-border/40";
}

export function RecentChallenges({ limit = 6 }: { limit?: number }) {
  const [items, setItems] = useState<Challenge[] | null>(null);

  useEffect(() => {
    let active = true;
    listRecentChallenges(limit)
      .then((data) => active && setItems(data))
      .catch(() => active && setItems([]));
    return () => {
      active = false;
    };
  }, [limit]);

  if (!items) {
    return <div className="arena-card h-40 animate-pulse" />;
  }

  if (items.length === 0) {
    return (
      <div className="arena-card px-6 py-8 text-center">
        <p className="font-display text-xl font-bold text-foreground">
          No challenges yet
        </p>
        <p className="mt-2 text-sm text-muted">
          Be first. Start a debate and drop the link in a group chat.
        </p>
        <Link href="/challenge" className="btn-primary mt-5 inline-flex">
          Start a challenge
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((c) => (
        <Link
          key={c.id}
          href={`/challenge/${c.inviteCode}`}
          className="arena-card block px-5 py-4 transition hover:border-pro/40"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className={`label rounded-full px-2.5 py-1 ${statusTone(c.status)}`}>
              {statusLabel(c.status)}
            </span>
            <span className="label text-muted">{c.category}</span>
          </div>
          <p className="mt-2 font-display text-lg font-bold leading-snug text-foreground">
            {c.motion}
          </p>
          <p className="mt-2 text-sm text-muted">
            {c.challengerName}
            {c.opponentName ? ` vs ${c.opponentName}` : " waiting for opponent"}
          </p>
        </Link>
      ))}
    </div>
  );
}
