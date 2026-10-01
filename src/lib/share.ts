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

/** Copy page URL (or text) to clipboard — never open the OS share sheet. */
export async function copyLink(url: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {
    // fall through
  }

  try {
    const el = document.createElement("textarea");
    el.value = url;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

/** @deprecated Prefer copyLink for share buttons. Kept for scorecard paste flows. */
export async function shareOrCopy(text: string): Promise<"shared" | "copied"> {
  const ok = await copyLink(text);
  return ok ? "copied" : "copied";
}
