/** Gut-punch hooks for the landing spin. Ordered by heat (most → least). */
export interface LandingHook {
  id: string;
  /** Short line that hits in under a second. */
  hook: string;
  debateId: string;
  /** Relative popularity / share velocity. Higher spins first. */
  heat: number;
}

const HOOKS: LandingHook[] = [
  {
    id: "defund",
    hook: "Defund the police.",
    debateId: "defund-police",
    heat: 98,
  },
  {
    id: "borders",
    hook: "Open the borders.",
    debateId: "open-borders",
    heat: 95,
  },
  {
    id: "homeless",
    hook: "Ban homeless camps in parks.",
    debateId: "park-camping-ban",
    heat: 91,
  },
  {
    id: "tiktok",
    hook: "Ban TikTok.",
    debateId: "tiktok-ban",
    heat: 88,
  },
  {
    id: "wealth",
    hook: "Tax billionaires into the ground.",
    debateId: "wealth-tax",
    heat: 84,
  },
  {
    id: "prisons",
    hook: "Abolish prisons.",
    debateId: "prison-abolition",
    heat: 79,
  },
  {
    id: "hate",
    hook: "Criminalize hate speech.",
    debateId: "hate-speech-ban",
    heat: 76,
  },
  {
    id: "surveillance",
    hook: "AI cameras on every street.",
    debateId: "surveillance-cameras",
    heat: 72,
  },
  {
    id: "draft",
    hook: "Reinstate the military draft.",
    debateId: "military-draft",
    heat: 68,
  },
  {
    id: "dying",
    hook: "Legalize medical aid in dying.",
    debateId: "medical-aid-dying",
    heat: 64,
  },
  {
    id: "english",
    hook: "English only. Official.",
    debateId: "english-official",
    heat: 59,
  },
  {
    id: "gas",
    hook: "Ban new gas cars by 2035.",
    debateId: "ban-gas-cars",
    heat: 52,
  },
];

/** Always most popular → least. */
export const LANDING_HOOKS: LandingHook[] = [...HOOKS].sort(
  (a, b) => b.heat - a.heat,
);
