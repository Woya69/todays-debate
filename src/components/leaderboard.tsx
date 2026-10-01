"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPredictionAccuracy, getProfile, PROFILE_EVENT } from "@/lib/player";
import { getRankProgress } from "@/lib/levels";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { syncProfilePoints } from "@/lib/stats";

interface Row {
  id: string;
  name: string;
  points: number;
  you?: boolean;
}

const TOP_LIMIT = 100;

export function Leaderboard() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [accuracy, setAccuracy] = useState(0);
  const [youRank, setYouRank] = useState(0);
  const [total, setTotal] = useState(0);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = getSupabaseBrowserClient();
      const localPoints = getProfile().points;

      let userId: string | null = null;
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        userId = user?.id ?? null;
      } catch {
        userId = null;
      }

      // Keep the signed-in player's standing current with their local total
      // before we read the field back.
      if (userId) {
        try {
          await syncProfilePoints(localPoints);
        } catch {
          /* offline — fall back to whatever is stored */
        }
      }

      let accounts: Row[] = [];
      let community = 0;
      try {
        const { data, count } = await supabase
          .from("profiles")
          .select("id, display_name, points", { count: "exact" })
          .gt("points", 0)
          .order("points", { ascending: false })
          .limit(TOP_LIMIT);

        const profiles = (data ?? []) as Array<{
          id: string;
          display_name: string | null;
          points: number | null;
        }>;
        accounts = profiles.map((a) => ({
          id: a.id,
          name: a.display_name || "Anonymous",
          points: a.points ?? 0,
          you: userId ? a.id === userId : false,
        }));
        community = count ?? accounts.length;
      } catch {
        accounts = [];
      }

      let merged: Row[];
      let rank: number;

      if (userId) {
        // Ensure "you" is visible even if outside the top window.
        if (!accounts.some((r) => r.you)) {
          accounts = [
            ...accounts,
            { id: userId, name: "You", points: localPoints, you: true },
          ];
        }
        merged = [...accounts].sort((a, b) => b.points - a.points);
        try {
          const { count } = await supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .gt("points", localPoints);
          rank = (count ?? 0) + 1;
        } catch {
          rank = merged.findIndex((r) => r.you) + 1;
        }
      } else {
        merged = [
          ...accounts,
          { id: "you-local", name: "You", points: localPoints, you: true },
        ].sort((a, b) => b.points - a.points);
        rank = merged.findIndex((r) => r.you) + 1;
        community += 1;
      }

      if (cancelled) return;
      setRows(merged);
      setYouRank(rank);
      setTotal(Math.max(community, rank, merged.length));
      setAccuracy(getPredictionAccuracy().percent);
      setSignedIn(!!userId);
    }

    void load();
    const onChange = () => void load();
    window.addEventListener(PROFILE_EVENT, onChange);
    return () => {
      cancelled = true;
      window.removeEventListener(PROFILE_EVENT, onChange);
    };
  }, []);

  if (!rows) return <div className="paper-card h-96 animate-pulse" />;

  const fieldEmpty = rows.filter((r) => !r.you).length === 0;

  return (
    <div className="space-y-5">
      <div className="paper-card grid grid-cols-2 divide-x divide-border">
        <div className="px-5 py-4">
          <p className="label text-muted">Your position</p>
          <p className="mt-1 font-display text-2xl font-semibold text-foreground">
            {youRank}
            <span className="text-muted"> / {total}</span>
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="label text-muted">Room-reading accuracy</p>
          <p className="mt-1 font-display text-2xl font-semibold text-foreground">
            {accuracy}%
          </p>
        </div>
      </div>

      <div className="paper-card overflow-hidden">
        {rows.map((row, i) => {
          const rank = getRankProgress(row.points).current.title;
          return (
            <div
              key={row.id}
              className={`flex items-center gap-4 border-b border-border px-5 py-3 last:border-0 ${
                row.you ? "bg-accent/10" : ""
              }`}
            >
              <span className="w-6 font-mono text-sm text-muted">{i + 1}</span>
              <div className="flex-1">
                <p
                  className={`font-display text-lg ${
                    row.you ? "font-semibold text-accent" : "text-foreground"
                  }`}
                >
                  {row.name}
                </p>
                <p className="label text-muted">{rank}</p>
              </div>
              <span className="font-mono text-sm text-foreground">
                {row.points.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>

      {fieldEmpty && (
        <p className="text-center text-sm text-muted">
          The table&apos;s still filling up — play a debate and you could be the
          first name on the board.
        </p>
      )}

      {signedIn ? (
        <p className="text-center font-mono text-xs text-muted">
          Real players only · your points sync as you debate
        </p>
      ) : (
        <p className="text-center font-mono text-xs text-muted">
          Real players only ·{" "}
          <Link href="/account" className="text-accent hover:underline">
            sign in
          </Link>{" "}
          to claim your spot on the table
        </p>
      )}
    </div>
  );
}
