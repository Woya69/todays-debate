const ANON_KEY = "td_appear_anonymous";
const ANON_TAG_KEY = "td_anon_tag";

export function getAppearAnonymous(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ANON_KEY) === "1";
}

export function setAppearAnonymous(value: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ANON_KEY, value ? "1" : "0");
}

/** Stable short tag so "Anonymous" isn't identical for every quiet user. */
export function getAnonTag(): string {
  if (typeof window === "undefined") return "0000";
  let tag = localStorage.getItem(ANON_TAG_KEY);
  if (!tag) {
    tag =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase()
        : Math.random().toString(36).slice(2, 6).toUpperCase();
    localStorage.setItem(ANON_TAG_KEY, tag);
  }
  return tag;
}

export function anonymousLabel(tag?: string): string {
  return `Anon ${tag ?? getAnonTag()}`;
}

/**
 * Public-facing name for posts/challenges.
 * Prefer anonymous when the user opted out of showing a real name.
 */
export function resolvePublicName(input: {
  displayName?: string | null;
  email?: string | null;
  forceAnonymous?: boolean;
}): string {
  if (input.forceAnonymous ?? getAppearAnonymous()) {
    return anonymousLabel();
  }
  const named = (input.displayName || "").trim();
  if (named && named.toLowerCase() !== "anonymous") return named.slice(0, 40);
  const fromEmail = input.email?.split("@")[0]?.trim();
  if (fromEmail) return fromEmail.slice(0, 40);
  return anonymousLabel();
}
