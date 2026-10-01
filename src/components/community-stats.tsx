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
          { key: "pro", label: "For", value: stats.proStancePercent, color: "bg-pro" },
          { key: "con", label: "Against", value: stats.conStancePercent, color: "bg-con" },
          { key: "und", label: "Undecided", value: stats.undecidedStancePercent, color: "bg-muted" },
        ]
      : [
          { key: "pro", label: "For", value: stats.proConvincedPercent, color: "bg-pro" },
          { key: "con", label: "Against", value: stats.conConvincedPercent, color: "bg-con" },
        ];

  return (
    <div className="paper-card px-6 py-5">
      <div className="mb-4 flex items-baseline justify-between border-b border-border pb-2">
        <h3 className="label text-foreground">
          {mode === "stance" ? "How the room opened" : "How the room ruled"}
        </h3>
        <span className="label text-muted">
          {stats.totalVotes.toLocaleString()} readers
        </span>
      </div>
      <div className="space-y-3">
        {bars.map((bar) => (
          <div key={bar.key}>
            <div className="mb-1 flex justify-between text-sm">
              <span
                className={
                  highlight === bar.key ? "font-semibold text-foreground" : ""
                }
              >
                {bar.label}
                {highlight === bar.key ? " — your call" : ""}
              </span>
              <span className="font-mono text-muted">{bar.value}%</span>
            </div>
            <div className="h-2 w-full bg-border/60">
              <div
                className={`h-full ${bar.color} transition-all duration-700`}
                style={{ width: `${bar.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-border pt-3 font-mono text-xs text-muted">
        {stats.totalVotes > 0
          ? "Live community totals"
          : "Be the first to weigh in"}
      </p>
    </div>
  );
}
