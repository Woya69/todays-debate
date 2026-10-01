/** Canonical public origin. Override with NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://todaysdebate.app";

export const SITE_NAME = "Today's Debate";

export const SITE_TAGLINE = "One motion. Both sides. Daily.";

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
