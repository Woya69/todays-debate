import { DEBATES, LAUNCH_EPOCH, getPublishedDebates } from "@/data/debates";
import type {
  ArchiveEntry,
  DailyDebate,
  Debate,
  DebateStats,
  Stance,
} from "@/types/debate";
import {
  getDebateNumber,
  hashDateKey,
  parseDateKey,
  toDateKey,
} from "@/lib/dates";
import { categoryToSlug } from "@/lib/categories";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isDateParam(param: string): boolean {
  return DATE_RE.test(param);
}

/** Published debates in stable schedule order (array order = day index). */
export function getScheduledDebates(): Debate[] {
  return getPublishedDebates();
}

/**
 * One unique motion per calendar day from the published pool.
 * Day 1 → index 0, day 2 → index 1, … then cycles when the pool is exhausted.
 * (Canonical SEO pages remain /debate/[slug] — dates redirect there.)
 */
export function getDailyDebate(dateKey: string = toDateKey()): DailyDebate {
  const pool = getScheduledDebates();
  const debateNumber = getDebateNumber(dateKey);
  const index = (debateNumber - 1) % pool.length;
  const debate = pool[index];

  return {
    ...debate,
    dateKey,
    debateNumber,
  };
}

export function getDebateBySlug(slug: string): Debate | undefined {
  return DEBATES.find((d) => d.id === slug && d.status !== "draft");
}

/** Prefer today's featured date when this slug is today's motion. */
export function getDailyDebateForSlug(
  slug: string,
  today: string = toDateKey(),
): DailyDebate | null {
  const debate = getDebateBySlug(slug);
  if (!debate) return null;

  const todayDebate = getDailyDebate(today);
  if (todayDebate.id === slug) {
    return todayDebate;
  }

  // Use the first calendar day this slug appeared in the schedule.
  const pool = getScheduledDebates();
  const index = pool.findIndex((d) => d.id === slug);
  if (index < 0) return null;
  const firstNumber = index + 1;
  const firstDate = dateKeyForDebateNumber(firstNumber);
  return {
    ...debate,
    dateKey: firstDate,
    debateNumber: firstNumber,
  };
}

export function dateKeyForDebateNumber(debateNumber: number): string {
  const launch = parseDateKey(LAUNCH_EPOCH);
  launch.setUTCDate(launch.getUTCDate() + (debateNumber - 1));
  return toDateKey(launch);
}

/** True for any date between launch and today (inclusive). */
export function isValidDebateDate(dateKey: string): boolean {
  if (!isDateParam(dateKey)) return false;
  const date = parseDateKey(dateKey).getTime();
  if (Number.isNaN(date)) return false;
  return (
    date >= parseDateKey(LAUNCH_EPOCH).getTime() &&
    date <= parseDateKey(toDateKey()).getTime()
  );
}

/** Every featured day from today back to launch, newest first. */
export function getArchive(today: string = toDateKey()): ArchiveEntry[] {
  const entries: ArchiveEntry[] = [];
  const cursor = parseDateKey(today);
  const floor = parseDateKey(LAUNCH_EPOCH).getTime();

  while (cursor.getTime() >= floor) {
    const dateKey = toDateKey(cursor);
    const debate = getDailyDebate(dateKey);
    entries.push({
      dateKey,
      debateNumber: debate.debateNumber,
      debateId: debate.id,
      resolution: debate.resolution,
      category: debate.category,
      isToday: dateKey === today,
    });
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return entries;
}

export function getDebatesByCategory(category: string): Debate[] {
  return getScheduledDebates().filter((d) => d.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(getScheduledDebates().map((d) => d.category))].sort();
}

export function debatePath(debate: Pick<Debate, "id">): string {
  return `/debate/${debate.id}`;
}

export function categoryPath(category: string): string {
  return `/topics/${categoryToSlug(category)}`;
}

/** Mock aggregate stats until Supabase is wired up. Deterministic per date. */
export function getMockStats(dateKey: string): DebateStats {
  const hash = hashDateKey(dateKey);
  const proStance = 28 + (hash % 22);
  const conStance = 24 + ((hash >> 3) % 24);
  const undecidedStance = 100 - proStance - conStance;
  const proConvinced = 32 + ((hash >> 5) % 20);
  const conConvinced = 100 - proConvinced;

  return {
    proStancePercent: proStance,
    conStancePercent: conStance,
    undecidedStancePercent: undecidedStance,
    proConvincedPercent: proConvinced,
    conConvincedPercent: conConvinced,
    totalVotes: 1200 + (hash % 8800),
  };
}

export function stanceLabel(stance: Stance): string {
  if (stance === "pro") return "For";
  if (stance === "con") return "Against";
  return "Undecided";
}

export function communityVerdict(stats: DebateStats): "pro" | "con" {
  return stats.proConvincedPercent >= stats.conConvincedPercent ? "pro" : "con";
}

export function seoTitleFor(debate: Debate): string {
  return debate.seoTitle ?? `${debate.resolution.replace(/\.$/, "")} — for & against`;
}

export function seoDescriptionFor(debate: Debate): string {
  return (
    debate.seoDescription ??
    `Steelman both sides of: ${debate.resolution} ${debate.context ?? ""}`.slice(
      0,
      160,
    )
  );
}
