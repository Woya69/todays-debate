import type { Badge, PlayerProfile } from "@/types/debate";
import { getFlipRate, getPredictionAccuracy, getStreakInfo } from "@/lib/player";
import { getRankProgress } from "@/lib/levels";

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/** Derives the full achievement set from a profile, with progress for locked ones. */
export function computeBadges(profile: PlayerProfile): Badge[] {
  const debatesPlayed = profile.debates.length;
  const takesPlayed = Object.keys(profile.takes).length;
  const streak = getStreakInfo().streak;
  const accuracy = getPredictionAccuracy();
  const flip = getFlipRate();
  const rank = getRankProgress(profile.points).current;

  const predictionStreak = longestPredictionStreak(profile);

  const defs: Array<Omit<Badge, "earned"> & { earned: boolean }> = [
    {
      id: "first-verdict",
      title: "First Verdict",
      description: "Complete your first debate.",
      progress: clamp01(debatesPlayed / 1),
      earned: debatesPlayed >= 1,
    },
    {
      id: "regular",
      title: "Regular Reader",
      description: "Complete 10 debates.",
      progress: clamp01(debatesPlayed / 10),
      earned: debatesPlayed >= 10,
    },
    {
      id: "week-streak",
      title: "Seven Days Running",
      description: "Hold a 7-day streak.",
      progress: clamp01(streak / 7),
      earned: streak >= 7,
    },
    {
      id: "floor-crosser",
      title: "Floor Crosser",
      description: "Cross the floor 10 times.",
      progress: clamp01(flip.flips / 10),
      earned: flip.flips >= 10,
    },
    {
      id: "room-reader",
      title: "Reads the Room",
      description: "Call the room right 5 times in a row.",
      progress: clamp01(predictionStreak / 5),
      earned: predictionStreak >= 5,
    },
    {
      id: "sharp",
      title: "Sharp Eye",
      description: "Reach 70% room-reading accuracy (min 10 calls).",
      progress:
        accuracy.total >= 10 ? clamp01(accuracy.percent / 70) : clamp01(accuracy.total / 10),
      earned: accuracy.total >= 10 && accuracy.percent >= 70,
    },
    {
      id: "rapid-fire",
      title: "Rapid Fire",
      description: "Answer 50 hot takes.",
      progress: clamp01(takesPlayed / 50),
      earned: takesPlayed >= 50,
    },
    {
      id: "orator",
      title: "Orator",
      description: "Reach the Orator rank.",
      progress: clamp01(profile.points / 2000),
      earned: rank.tier >= 6,
    },
  ];

  return defs;
}

/** Longest run of consecutive correct room calls, ordered by completion time. */
function longestPredictionStreak(profile: PlayerProfile): number {
  const ordered = [...profile.debates]
    .filter((d) => d.predictionCorrect !== null)
    .sort((a, b) => a.completedAt.localeCompare(b.completedAt));

  let best = 0;
  let run = 0;
  for (const d of ordered) {
    if (d.predictionCorrect) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
  }
  return best;
}
