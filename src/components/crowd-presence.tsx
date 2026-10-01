"use client";

import { SEED_PEOPLE, crowdOnlineCount, publicSeedName } from "@/data/crowd";

export function CrowdPresence() {
  const online = crowdOnlineCount();
  const faces = SEED_PEOPLE.slice(0, 8);
  const named = SEED_PEOPLE.filter((p) => !p.anonymous).slice(0, 3);

  return (
    <div className="arena-card px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="label text-pro">In the room</p>
          <p className="mt-1 font-display text-xl font-semibold text-foreground">
            {online} people debating right now
          </p>
        </div>
        <div className="flex -space-x-2">
          {faces.map((p) => {
            const label = publicSeedName(p);
            return (
              <span
                key={p.id}
                title={label}
                className="inline-flex h-8 w-8 items-center justify-center border border-border text-xs font-semibold text-foreground"
                style={{
                  backgroundColor:
                    p.leaning === "pro"
                      ? "color-mix(in srgb, var(--pro) 12%, white)"
                      : p.leaning === "con"
                        ? "color-mix(in srgb, var(--con) 12%, white)"
                        : "var(--surface-raised)",
                }}
              >
                {p.anonymous
                  ? "?"
                  : p.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
              </span>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-sm text-muted">
        {named.map((p) => p.name).join(", ")}
        {named.length ? " and " : ""}
        mostly anonymous corners — you can hide your name too.
      </p>
    </div>
  );
}
