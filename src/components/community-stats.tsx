import type { DebateStats } from "@/types/debate";

interface CommunityStatsProps {
  stats: DebateStats;
  mode: "stance" | "convinced";
  highlight?: "pro" | "con" | null;
}

export function CommunityStats({ stats, mode, highlight }: CommunityStatsProps) {
  const bars =
    mode === "stance"
      ? [
          { key: "pro", label: "FOR", value: stats.proStancePercent, color: "bg-pro" },
          { key: "con", label: "AGAINST", value: stats.conStancePercent, color: "bg-con" },
          { key: "und", label: "WATCH", value: stats.undecidedStancePercent, color: "bg-muted" },
        ]
      : [
          { key: "pro", label: "FOR", value: stats.proConvincedPercent, color: "bg-pro" },
          { key: "con", label: "AGAINST", value: stats.conConvincedPercent, color: "bg-con" },
        ];

  const pro = mode === "convinced" ? stats.proConvincedPercent : stats.proStancePercent;
  const con = mode === "convinced" ? stats.conConvincedPercent : stats.conStancePercent;

  return (
    <div className="arena-card px-5 py-5 sm:px-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-display text-xl font-extrabold text-foreground">
          {mode === "stance" ? "How corners opened" : "Crowd meter"}
        </h3>
        <span className="label text-muted">
          {stats.totalVotes.toLocaleString()} in
        </span>
      </div>

      {mode === "convinced" && (
        <div className="mb-4">
          <div className="mb-2 flex justify-between">
            <span className="label text-pro">{pro}%</span>
            <span className="label text-con">{con}%</span>
          </div>
          <div className="crowd-meter-bar animate-meter">
            <div className="flex h-full w-full">
              <div className="crowd-meter-fill bg-pro" style={{ width: `${pro}%` }} />
              <div className="crowd-meter-fill bg-con" style={{ width: `${con}%` }} />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {bars.map((bar) => (
          <div key={bar.key}>
            <div className="mb-1 flex justify-between text-sm">
              <span
                className={
                  highlight === bar.key ? "font-semibold text-foreground" : "text-muted"
                }
              >
                {bar.label}
                {highlight === bar.key ? " — your call" : ""}
              </span>
              <span className="font-mono text-muted">{bar.value}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border/60">
              <div
                className={`h-full rounded-full ${bar.color} transition-all duration-700`}
                style={{ width: `${bar.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
