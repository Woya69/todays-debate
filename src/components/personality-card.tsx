"use client";

import { useEffect, useState } from "react";
import type { Personality } from "@/types/debate";
import { getProfile, PROFILE_EVENT } from "@/lib/player";
import { computePersonality } from "@/lib/personality";

export function PersonalityCard() {
  const [p, setP] = useState<Personality | null>(null);

  useEffect(() => {
    const update = () => setP(computePersonality(getProfile()));
    update();
    window.addEventListener(PROFILE_EVENT, update);
    return () => window.removeEventListener(PROFILE_EVENT, update);
  }, []);

  if (!p) return null;

  const ready = p.sampleSize >= 3;

  return (
    <div className="paper-card px-6 py-6">
      <p className="label text-muted">Your debating character</p>
      <p className="mt-2 font-display text-2xl font-semibold text-foreground">
        {p.archetype}
      </p>
      <p className="mt-1 text-sm text-muted">{p.tagline}</p>

      {ready && (
        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
          <Trait label="Decisive" value={p.decisiveness} />
          <Trait label="Flexible" value={p.flexibility} />
          <Trait label="Agreeable" value={p.agreeRate} />
        </div>
      )}
    </div>
  );
}

function Trait({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="label text-muted">{label}</span>
        <span className="font-mono text-xs text-muted">{value}%</span>
      </div>
      <div className="h-[3px] w-full bg-border">
        <div className="h-full bg-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
