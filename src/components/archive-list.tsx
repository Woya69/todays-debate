"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ArchiveEntry } from "@/types/debate";
import { getProfile, PROFILE_EVENT } from "@/lib/player";
import { fetchArchiveStats } from "@/lib/stats";
import { formatDisplayDate } from "@/lib/dates";

const PAGE = 40;

export function ArchiveList({ entries }: { entries: ArchiveEntry[] }) {
  const [played, setPlayed] = useState<Set<string>>(new Set());
  const [debaters, setDebaters] = useState<Record<string, number>>({});
  const [category, setCategory] = useState<string>("All");
  const [showUnplayedOnly, setShowUnplayedOnly] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    const update = () =>
      setPlayed(new Set(getProfile().debates.map((d) => d.dateKey)));
    update();
    window.addEventListener(PROFILE_EVENT, update);
    return () => window.removeEventListener(PROFILE_EVENT, update);
  }, []);

  useEffect(() => {
    fetchArchiveStats()
      .then(setDebaters)
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const set = new Set(entries.map((e) => e.category));
    return ["All", ...[...set].sort()];
  }, [entries]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (category !== "All" && e.category !== category) return false;
      if (showUnplayedOnly && played.has(e.dateKey)) return false;
      return true;
    });
  }, [entries, category, showUnplayedOnly, played]);

  const visible = filtered.slice(0, limit);
  const playedCount = entries.filter((e) => played.has(e.dateKey)).length;
  const totalDebaters = Object.values(debaters).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-5">
      <div className="paper-card grid grid-cols-3 divide-x divide-border">
        <div className="px-5 py-4">
          <p className="label text-muted">Motions to date</p>
          <p className="mt-1 font-display text-2xl font-semibold text-foreground">
            {entries.length}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="label text-muted">Verdicts cast</p>
          <p className="mt-1 font-display text-2xl font-semibold text-foreground">
            {totalDebaters.toLocaleString()}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="label text-muted">You&apos;ve played</p>
          <p className="mt-1 font-display text-2xl font-semibold text-accent">
            {playedCount}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCategory(c);
              setLimit(PAGE);
            }}
            className={`label border px-3 py-1.5 transition ${
              category === c
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={showUnplayedOnly}
          onChange={(e) => {
            setShowUnplayedOnly(e.target.checked);
            setLimit(PAGE);
          }}
          className="h-4 w-4 accent-[var(--accent)]"
        />
        <span className="label text-muted">Unplayed only</span>
      </label>

      <div className="paper-card overflow-hidden">
        {visible.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-muted">
            Nothing here — try a different filter.
          </p>
        )}
        {visible.map((entry) => {
          const done = played.has(entry.dateKey);
          const count = debaters[entry.dateKey] ?? 0;
          return (
            <Link
              key={entry.dateKey}
              href={`/debate/${entry.debateId}`}
              className="flex items-center gap-4 border-b border-border px-5 py-4 transition last:border-0 hover:bg-accent/5"
            >
              <span className="w-12 shrink-0 font-mono text-xs text-muted">
                No.{entry.debateNumber}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg text-foreground">
                  {entry.resolution}
                </p>
                <p className="label text-muted">
                  {entry.category}
                  {entry.isToday ? " · Today" : ` · ${formatDisplayDate(entry.dateKey)}`}
                  {count > 0 && ` · ${count.toLocaleString()} debated`}
                </p>
              </div>
              <span
                className={`label shrink-0 ${done ? "text-accent" : "text-muted"}`}
              >
                {done ? "Played" : "Open"}
              </span>
            </Link>
          );
        })}
      </div>

      {limit < filtered.length && (
        <button
          type="button"
          onClick={() => setLimit((l) => l + PAGE)}
          className="w-full border border-foreground px-6 py-3 font-display text-lg font-semibold text-foreground transition hover:bg-foreground hover:text-background"
        >
          Show more
        </button>
      )}
    </div>
  );
}
