import type { MetadataRoute } from "next";
import { allCategorySlugs } from "@/lib/categories";
import { getScheduledDebates } from "@/lib/debate-service";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/debate",
    "/challenge",
    "/watch",
    "/archive",
    "/how-it-works",
    "/takes",
    "/leaderboard",
    "/stats",
    "/suggest",
    "/topics",
    "/pricing",
    "/sponsor",
    "/classrooms",
    "/publish",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency:
      path === "" || path === "/debate" || path === "/watch" || path === "/challenge"
        ? "daily"
        : "weekly",
    priority: path === "" ? 1 : path === "/challenge" || path === "/debate" ? 0.9 : 0.7,
  }));

  const debates = getScheduledDebates().map((d) => ({
    url: `${SITE_URL}/debate/${d.id}`,
    lastModified: d.publishedAt ? new Date(d.publishedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const topics = allCategorySlugs().map((slug) => ({
    url: `${SITE_URL}/topics/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...debates, ...topics];
}
