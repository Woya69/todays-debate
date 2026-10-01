import type { Rank, RankProgress } from "@/types/debate";

export const RANKS: Rank[] = [
  { title: "Heckler", min: 0, tier: 1 },
  { title: "Contrarian", min: 120, tier: 2 },
  { title: "Columnist", min: 320, tier: 3 },
  { title: "Pundit", min: 650, tier: 4 },
  { title: "Debater", min: 1150, tier: 5 },
  { title: "Orator", min: 2000, tier: 6 },
  { title: "Statesman", min: 3500, tier: 7 },
  { title: "Sage", min: 6000, tier: 8 },
];

export function getRankProgress(points: number): RankProgress {
  let current = RANKS[0];
  let next: Rank | null = null;

  for (let i = 0; i < RANKS.length; i++) {
    if (points >= RANKS[i].min) {
      current = RANKS[i];
      next = RANKS[i + 1] ?? null;
    }
  }

  if (!next) {
    return {
      current,
      next: null,
      pointsIntoTier: points - current.min,
      pointsForTier: 0,
      percent: 100,
    };
  }

  const span = next.min - current.min;
  const into = points - current.min;
  return {
    current,
    next,
    pointsIntoTier: into,
    pointsForTier: span,
    percent: Math.round((into / span) * 100),
  };
}

export const POINTS = {
  take: 5,
  debateComplete: 20,
  predictionCorrect: 50,
  predictionWrong: 10,
  changedMindBonus: 15,
} as const;
