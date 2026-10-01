import type {
  PlayerProfile,
  StreakInfo,
  TakeAnswer,
  UserDebateResult,
} from "@/types/debate";
import { toDateKey } from "@/lib/dates";

const STORAGE_KEY = "td_profile_v1";

const EMPTY: PlayerProfile = {
  points: 0,
  debates: [],
  takes: {},
  lastActive: "",
  freezeTokens: 0,
  frozenDates: [],
};

export function getProfile(): PlayerProfile {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<PlayerProfile>;
    return {
      points: parsed.points ?? 0,
      debates: parsed.debates ?? [],
      takes: parsed.takes ?? {},
      lastActive: parsed.lastActive ?? "",
      freezeTokens: parsed.freezeTokens ?? 0,
      frozenDates: parsed.frozenDates ?? [],
    };
  } catch {
    return { ...EMPTY };
  }
}

export const PROFILE_EVENT = "td:profile-changed";

function save(profile: PlayerProfile): PlayerProfile {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event(PROFILE_EVENT));
  }
  return profile;
}

export function getDebateResult(dateKey: string): UserDebateResult | null {
  return getProfile().debates.find((d) => d.dateKey === dateKey) ?? null;
}

export const MAX_FREEZE_TOKENS = 3;
const FREEZE_EVERY = 5;

export function recordDebate(result: UserDebateResult): PlayerProfile {
  const profile = getProfile();
  const isNew = !profile.debates.some((d) => d.dateKey === result.dateKey);
  const debates = profile.debates.filter((d) => d.dateKey !== result.dateKey);
  debates.push(result);

  // Earn a streak-freeze token every few completed debates, capped.
  let freezeTokens = profile.freezeTokens;
  if (isNew && debates.length % FREEZE_EVERY === 0) {
    freezeTokens = Math.min(MAX_FREEZE_TOKENS, freezeTokens + 1);
  }

  return save({
    ...profile,
    debates,
    freezeTokens,
    points: profile.points + result.pointsEarned,
    lastActive: toDateKey(),
  });
}

export function getTakeAnswer(id: string): TakeAnswer | null {
  return getProfile().takes[id] ?? null;
}

export function recordTake(
  id: string,
  answer: TakeAnswer,
  points: number,
): PlayerProfile {
  const profile = getProfile();
  if (profile.takes[id]) return profile;
  return save({
    ...profile,
    takes: { ...profile.takes, [id]: answer },
    points: profile.points + points,
    lastActive: toDateKey(),
  });
}

export function getStreak(today: string = toDateKey()): number {
  return getStreakInfo(today).streak;
}

/**
 * Streak length, with freeze tokens silently bridging single missed days.
 * Scans backwards from today; a gap consumes one available token instead of
 * ending the run, mirroring the classic "streak freeze" mechanic.
 */
export function getStreakInfo(today: string = toDateKey()): StreakInfo {
  const profile = getProfile();
  const done = new Set(profile.debates.map((d) => d.dateKey));
  if (done.size === 0) {
    return { streak: 0, freezeTokens: profile.freezeTokens, protected: false };
  }

  const cursor = new Date(`${today}T12:00:00.000Z`);
  if (!done.has(today)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  let streak = 0;
  let tokens = profile.freezeTokens;
  let usedFreeze = false;

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (done.has(key)) {
      streak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
      continue;
    }
    // Missed day: spend a token to bridge it, but only if a played day precedes it.
    if (tokens > 0 && streak > 0) {
      const prev = new Date(cursor);
      prev.setUTCDate(prev.getUTCDate() - 1);
      if (done.has(prev.toISOString().slice(0, 10))) {
        tokens -= 1;
        usedFreeze = true;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
        continue;
      }
    }
    break;
  }

  return { streak, freezeTokens: tokens, protected: usedFreeze };
}

export function getPredictionAccuracy(): {
  correct: number;
  total: number;
  percent: number;
} {
  const predicted = getProfile().debates.filter(
    (d) => d.predictionCorrect !== null,
  );
  const correct = predicted.filter((d) => d.predictionCorrect).length;
  const total = predicted.length;
  return {
    correct,
    total,
    percent: total > 0 ? Math.round((correct / total) * 100) : 0,
  };
}

/** How often the reader crossed the floor among debates where they took a side. */
export function getFlipRate(): { flips: number; decided: number; percent: number } {
  const decidedDebates = getProfile().debates.filter(
    (d) => d.stance !== "undecided" && d.convincedBy !== "undecided",
  );
  const flips = decidedDebates.filter((d) => d.stance !== d.convincedBy).length;
  const decided = decidedDebates.length;
  return {
    flips,
    decided,
    percent: decided > 0 ? Math.round((flips / decided) * 100) : 0,
  };
}

/** Opening-stance distribution across all played debates. */
export function getStanceDistribution(): {
  pro: number;
  con: number;
  undecided: number;
} {
  const debates = getProfile().debates;
  return {
    pro: debates.filter((d) => d.stance === "pro").length,
    con: debates.filter((d) => d.stance === "con").length,
    undecided: debates.filter((d) => d.stance === "undecided").length,
  };
}
