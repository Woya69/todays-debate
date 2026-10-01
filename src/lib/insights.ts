import type { CategoryLean, PlayerProfile } from "@/types/debate";
import { getDailyDebate } from "@/lib/debate-service";

/**
 * Reconstructs the category for each played debate (debates are deterministic
 * per date) and reports how the reader leaned within each category.
 */
export function getCategoryLeanings(profile: PlayerProfile): CategoryLean[] {
  const buckets = new Map<string, { played: number; pro: number; decided: number }>();

  for (const result of profile.debates) {
    const { category } = getDailyDebate(result.dateKey);
    const bucket = buckets.get(category) ?? { played: 0, pro: 0, decided: 0 };
    bucket.played += 1;
    if (result.convincedBy !== "undecided") {
      bucket.decided += 1;
      if (result.convincedBy === "pro") bucket.pro += 1;
    }
    buckets.set(category, bucket);
  }

  return [...buckets.entries()]
    .map(([category, b]) => ({
      category,
      played: b.played,
      proPercent: b.decided > 0 ? Math.round((b.pro / b.decided) * 100) : 50,
    }))
    .sort((a, b) => b.played - a.played);
}
