/** Gut-punch hooks for the landing spin. Display text stays short; slug hits a real debate. */
export interface LandingHook {
  id: string;
  /** Short line that hits in under a second. */
  hook: string;
  debateId: string;
}

export const LANDING_HOOKS: LandingHook[] = [
  {
    id: "defund",
    hook: "Defund the police.",
    debateId: "defund-police",
  },
  {
    id: "borders",
    hook: "Open the borders.",
    debateId: "open-borders",
  },
  {
    id: "prisons",
    hook: "Abolish prisons.",
    debateId: "prison-abolition",
  },
  {
    id: "homeless",
    hook: "Ban homeless camps in parks.",
    debateId: "park-camping-ban",
  },
  {
    id: "hate",
    hook: "Criminalize hate speech.",
    debateId: "hate-speech-ban",
  },
  {
    id: "draft",
    hook: "Reinstate the military draft.",
    debateId: "military-draft",
  },
  {
    id: "dying",
    hook: "Legalize medical aid in dying.",
    debateId: "medical-aid-dying",
  },
  {
    id: "english",
    hook: "English only. Official.",
    debateId: "english-official",
  },
  {
    id: "gas",
    hook: "Ban new gas cars by 2035.",
    debateId: "ban-gas-cars",
  },
  {
    id: "wealth",
    hook: "Tax billionaires into the ground.",
    debateId: "wealth-tax",
  },
  {
    id: "surveillance",
    hook: "AI cameras on every street.",
    debateId: "surveillance-cameras",
  },
  {
    id: "tiktok",
    hook: "Ban TikTok.",
    debateId: "tiktok-ban",
  },
];
