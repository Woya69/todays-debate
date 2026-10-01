import type { PlayerProfile, Personality } from "@/types/debate";

const ARCHETYPES = {
  hardliner: {
    archetype: "The Hardliner",
    tagline: "Picks a side fast and rarely budges.",
  },
  seeker: {
    archetype: "The Truth-Seeker",
    tagline: "Commits early, but follows the better argument.",
  },
  skeptic: {
    archetype: "The Skeptic",
    tagline: "Slow to commit, hard to move.",
  },
  radical: {
    archetype: "The Free Radical",
    tagline: "Holds loosely, swings freely.",
  },
  unwritten: {
    archetype: "Unwritten",
    tagline: "Play a few rounds and your profile takes shape.",
  },
} as const;

export function computePersonality(profile: PlayerProfile): Personality {
  const debates = profile.debates;
  const sample = debates.length;

  if (sample < 3) {
    return {
      ...ARCHETYPES.unwritten,
      decisiveness: 0,
      flexibility: 0,
      agreeRate: 0,
      sampleSize: sample,
    };
  }

  const decided = debates.filter((d) => d.stance !== "undecided").length;
  const decisiveness = Math.round((decided / sample) * 100);

  const flipped = debates.filter(
    (d) =>
      d.stance !== "undecided" &&
      d.convincedBy !== "undecided" &&
      d.stance !== d.convincedBy,
  ).length;
  const flexibility = decided > 0 ? Math.round((flipped / decided) * 100) : 0;

  const takeValues = Object.values(profile.takes);
  const agreeRate =
    takeValues.length > 0
      ? Math.round(
          (takeValues.filter((t) => t === "agree").length / takeValues.length) *
            100,
        )
      : 0;

  const decisive = decisiveness >= 55;
  const flexible = flexibility >= 30;

  let key: keyof typeof ARCHETYPES;
  if (decisive && !flexible) key = "hardliner";
  else if (decisive && flexible) key = "seeker";
  else if (!decisive && !flexible) key = "skeptic";
  else key = "radical";

  return {
    ...ARCHETYPES[key],
    decisiveness,
    flexibility,
    agreeRate,
    sampleSize: sample,
  };
}
