"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { HotTake } from "@/types/debate";
import { fetchCommunityDeck, reportTake } from "@/lib/community";
import { HotTakes } from "@/components/hot-takes";

export function CommunityDeck() {
  const [takes, setTakes] = useState<HotTake[] | null>(null);

  useEffect(() => {
    let active = true;
    fetchCommunityDeck()
      .then((data) => {
        if (active) setTakes(data);
      })
      .catch(() => {
        if (active) setTakes([]);
      });
    return () => {
      active = false;
    };
  }, []);

  if (takes === null) {
    return (
      <p className="text-center font-mono text-sm text-muted">
        Loading the community deck…
      </p>
    );
  }

  if (takes.length === 0) {
    return (
      <div className="paper-card px-6 py-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          No community takes yet
        </h2>
        <p className="mt-2 text-sm text-muted">
          Be the first to put one out there.
        </p>
        <Link
          href="/takes/new"
          className="mt-6 inline-block w-full bg-foreground px-6 py-3 font-display text-lg font-semibold text-background transition hover:bg-accent"
        >
          Write a take
        </Link>
      </div>
    );
  }

  return (
    <HotTakes
      takes={takes}
      onReport={(take) => void reportTake(take.id)}
      discussHref={(take) => `/takes/${take.id}`}
    />
  );
}
