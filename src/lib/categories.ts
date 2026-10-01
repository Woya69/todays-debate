/** URL slug ↔ display category for topic hubs. */
export const CATEGORY_SLUGS: Record<string, string> = {
  "Work & Economy": "work-economy",
  Technology: "technology",
  Policy: "policy",
  Society: "society",
  Climate: "climate",
  Science: "science",
  Education: "education",
  Health: "health",
  Culture: "culture",
  Sports: "sports",
};

export function categoryToSlug(category: string): string {
  return (
    CATEGORY_SLUGS[category] ??
    category
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

export function slugToCategory(slug: string): string | null {
  const entry = Object.entries(CATEGORY_SLUGS).find(([, s]) => s === slug);
  return entry?.[0] ?? null;
}

export function allCategorySlugs(): string[] {
  return Object.values(CATEGORY_SLUGS);
}
