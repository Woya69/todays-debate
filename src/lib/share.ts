import type { Stance, UserDebateResult, Verdict } from "@/types/debate";
import { absoluteUrl } from "@/lib/site";

function stanceWord(stance: Stance): string {
  if (stance === "pro") return "FOR";
  if (stance === "con") return "AGAINST";
  return "UNDECIDED";
}

function verdictWord(verdict: Verdict): string {
  return verdict === "pro" ? "FOR" : "AGAINST";
}

export function changedMind(result: UserDebateResult): boolean {
  return (
    result.stance !== "undecided" &&
    result.convincedBy !== "undecided" &&
    result.stance !== result.convincedBy
  );
}

/** Typographic scorecard — no emoji, reads like a clipping. */
export function buildShareText(
  result: UserDebateResult,
  resolution: string,
  debateSlug?: string,
): string {
  const lines = [
    `TODAY'S DEBATE — No. ${result.debateNumber}`,
    "————————————————",
    resolution,
    "————————————————",
    `Opened:   ${stanceWord(result.stance)}`,
    `Verdict:  ${stanceWord(result.convincedBy)}`,
  ];

  if (result.prediction) {
    const hit = result.predictionCorrect ? "read the room" : "misread the room";
    lines.push(`Called ${verdictWord(result.prediction)} — ${hit}`);
  }

  if (changedMind(result)) {
    lines.push("Crossed the floor.");
  }

  const url = debateSlug
    ? absoluteUrl(`/debate/${debateSlug}`)
    : absoluteUrl("/");
  lines.push("————————————————", url, "Challenge a friend — both sides, no pile-on.");
  return lines.join("\n");
}

/** Compact one-line scorecard for cards. */
export function buildScoreline(result: UserDebateResult): string {
  const arrow = changedMind(result) ? "→" : "·";
  return `${stanceWord(result.stance)} ${arrow} ${stanceWord(result.convincedBy)}`;
}

/** URL to the generated newspaper-style share image for a result. */
export function buildShareImageUrl(
  result: UserDebateResult,
  streak: number,
): string {
  const params = new URLSearchParams({
    n: String(result.debateNumber),
    from: result.stance,
    to: result.convincedBy,
    pts: String(result.pointsEarned),
  });
  if (streak > 0) params.set("streak", String(streak));
  return `/api/og?${params.toString()}`;
}

export function buildDebateOgUrl(slug: string): string {
  return `/api/og/debate?slug=${encodeURIComponent(slug)}`;
}

/** Prefer native share sheet; fall back to clipboard. */
export async function shareOrCopy(text: string): Promise<"shared" | "copied"> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch {
      // user cancelled or share failed — fall through
    }
  }
  await navigator.clipboard.writeText(text);
  return "copied";
}
