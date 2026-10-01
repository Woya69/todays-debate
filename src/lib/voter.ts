const VOTER_KEY = "td_voter_id";

/**
 * Stable per-browser identifier used to attribute anonymous votes without an account.
 * Lets us dedupe one vote per person per day while staying fully anonymous.
 */
export function getVoterId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(VOTER_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VOTER_KEY, id);
  }
  return id;
}
