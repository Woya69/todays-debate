"use client";

import type { ChallengeCrowd, Corner } from "@/types/debate";

export function CrowdMeter({
  crowd,
  compact = false,
}: {
  crowd: ChallengeCrowd;
  compact?: boolean;
}) {
  const pro = crowd.proPercent;
  const con = crowd.conPercent;

  return (
    <div className={compact ? "space-y-2" : "arena-card space-y-3 px-5 py-4"}>
      <div className="flex items-center justify-between">
        <span className="label text-pro">FOR {pro}%</span>
        <span className="label text-muted">
          {crowd.totalCheers > 0
            ? `${crowd.totalCheers.toLocaleString()} in the crowd`
            : "Crowd warming up"}
        </span>
        <span className="label text-con">AGAINST {con}%</span>
      </div>
      <div className="crowd-meter-bar animate-meter">
        <div className="flex h-full w-full">
          <div
            className="crowd-meter-fill bg-pro"
            style={{ width: `${pro}%` }}
          />
          <div
            className="crowd-meter-fill bg-con"
            style={{ width: `${con}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function CornerCheerButtons({
  onCheer,
  disabled,
  mySide,
}: {
  onCheer: (side: Corner) => void;
  disabled?: boolean;
  mySide?: Corner | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        disabled={disabled || !!mySide}
        onClick={() => onCheer("pro")}
        className={`rounded-2xl border px-4 py-4 text-left transition ${
          mySide === "pro"
            ? "corner-pro bg-pro/10"
            : "border-border hover:border-pro"
        } disabled:opacity-50`}
      >
        <p className="label text-pro">Cheer</p>
        <p className="mt-1 font-display text-xl font-extrabold text-foreground">
          FOR
        </p>
      </button>
      <button
        type="button"
        disabled={disabled || !!mySide}
        onClick={() => onCheer("con")}
        className={`rounded-2xl border px-4 py-4 text-left transition ${
          mySide === "con"
            ? "corner-con bg-con/10"
            : "border-border hover:border-con"
        } disabled:opacity-50`}
      >
        <p className="label text-con">Cheer</p>
        <p className="mt-1 font-display text-xl font-extrabold text-foreground">
          AGAINST
        </p>
      </button>
    </div>
  );
}
