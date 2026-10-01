import type { Stance, UserDebateResult, Verdict } from "@/types/debate";
import { absoluteUrl } from "@/lib/site";

function stanceWord(stance: Stance): string {
  if (stance === "pro") return "FOR";
  if (stance === "con") return "AGAINST";
  return "WATCH";
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

/** Shareable scorecard for social / clipboard. */
export function buildShareText(
  result: UserDebateResult,
  resolution: string,
  debateSlug?: string,
): string {
  const lines = [
    `TODAY'S DEBATE — Main Event No. ${result.debateNumber}`,
    "——————————————",
    resolution,
    "——————————————",
    `Opened:   ${stanceWord(result.stance)}`,
    `Verdict:  ${stanceWord(result.convincedBy)}`,
  ];

  if (result.prediction) {
    const hit = result.predictionCorrect ? "read the crowd" : "misread the crowd";
    lines.push(`Called ${verdictWord(result.prediction)} — ${hit}`);
  }

  if (changedMind(result)) {
    lines.push("Crossed the floor.");
  }

  const url = debateSlug
    ? absoluteUrl(`/debate/${debateSlug}`)
    : absoluteUrl("/");
  lines.push(
    "——————————————",
    url,
    "Challenge someone. Let the crowd decide.",
  );
  return lines.join("\n");
}

export function buildScoreline(result: UserDebateResult): string {
  const arrow = changedMind(result) ? "→" : "·";
  return `${stanceWord(result.stance)} ${arrow} ${stanceWord(result.convincedBy)}`;
}

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

export function buildChallengeShareText(input: {
  motion: string;
  inviteCode: string;
  status: "open" | "live" | "done";
  proPercent?: number;
  conPercent?: number;
}): string {
  const url = absoluteUrl(`/challenge/${input.inviteCode}`);
  if (input.status === "open") {
    return `I challenged you on Today's Debate:\n${input.motion}\n\nAccept here: ${url}`;
  }
  if (input.status === "done" && input.proPercent != null && input.conPercent != null) {
    const winner =
      input.proPercent === input.conPercent
        ? "TIE"
        : input.proPercent > input.conPercent
          ? "FOR"
          : "AGAINST";
    return `Crowd ruled ${winner} (${input.proPercent}%–${input.conPercent}%)\n${input.motion}\n\n${url}`;
  }
  return `Watch this debate — crowd is live:\n${input.motion}\n\n${url}`;
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
