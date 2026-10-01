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
        <div className="min-w-0 px-2 py-3 sm:px-5 sm:py-4">
          <p className="label text-muted">Motions</p>
          <p className="mt-1 font-display text-xl font-semibold text-foreground sm:text-2xl">
            {entries.length}
          </p>
        </div>
        <div className="min-w-0 px-2 py-3 sm:px-5 sm:py-4">
          <p className="label text-muted">Verdicts</p>
          <p className="mt-1 font-display text-xl font-semibold text-foreground sm:text-2xl">
            {totalDebaters.toLocaleString()}
          </p>
        </div>
        <div className="min-w-0 px-2 py-3 sm:px-5 sm:py-4">
          <p className="label text-muted">Played</p>
          <p className="mt-1 font-display text-xl font-semibold text-accent sm:text-2xl">
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
            className={`label touch-target inline-flex items-center border px-3 py-2 transition ${
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
              className="flex items-start gap-3 border-b border-border px-4 py-4 transition last:border-0 hover:bg-accent/5 sm:items-center sm:gap-4 sm:px-5"
            >
              <span className="w-10 shrink-0 pt-1 font-mono text-xs text-muted sm:w-12 sm:pt-0">
                No.{entry.debateNumber}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base leading-snug text-foreground sm:truncate sm:text-lg">
                  {entry.resolution}
                </p>
                <p className="label mt-1 text-muted">
                  {entry.category}
                  {entry.isToday ? " · Today" : ` · ${formatDisplayDate(entry.dateKey)}`}
                  {count > 0 && ` · ${count.toLocaleString()} debated`}
                </p>
              </div>
              <span
                className={`label shrink-0 pt-1 sm:pt-0 ${done ? "text-accent" : "text-muted"}`}
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
