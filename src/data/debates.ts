import type { Debate } from "@/types/debate";
import raw from "./debates.json";

export const DEBATES = raw as Debate[];

/** Calendar day the product started featuring motions. */
export const LAUNCH_EPOCH = "2025-01-01";

export function getPublishedDebates(): Debate[] {
  return DEBATES.filter((d) => d.status !== "draft");
}
