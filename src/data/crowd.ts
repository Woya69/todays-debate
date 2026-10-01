/** Seeded crowd — mostly anonymous, with a few public names. */

export interface SeedPerson {
  id: string;
  name: string;
  handle: string;
  city: string;
  points: number;
  streak: number;
  leaning: "pro" | "con" | "mixed";
  bio: string;
  /** When true, public surfaces show Anon #### instead of a real name. */
  anonymous: boolean;
}

export interface SeedChallenge {
  id: string;
  inviteCode: string;
  motion: string;
  category: string;
  status: "open" | "live" | "done";
  challengerName: string;
  challengerSide: "pro" | "con";
  opponentName: string | null;
  opponentSide: "pro" | "con" | null;
  roundCount: number;
  currentRound: number;
  proCheers: number;
  conCheers: number;
  updatedMinutesAgo: number;
  rounds: Array<{
    roundIndex: number;
    side: "pro" | "con";
    authorName: string;
    body: string;
  }>;
  comments: Array<{
    side: "pro" | "con";
    authorName: string;
    body: string;
  }>;
}

/** Public label for a seed person (respects anonymity). */
export function publicSeedName(p: SeedPerson): string {
  if (!p.anonymous) return p.name;
  return `Anon ${p.handle.slice(-4).toUpperCase()}`;
}

export const SEED_PEOPLE: SeedPerson[] = [
  {
    id: "p01",
    name: "Maya Ortiz",
    handle: "maya_o",
    city: "Austin",
    points: 840,
    streak: 6,
    leaning: "mixed",
    bio: "Policy nerd. Changes her mind on purpose.",
    anonymous: false,
  },
  {
    id: "p02",
    name: "Jordan Blake",
    handle: "jblake",
    city: "Chicago",
    points: 1210,
    streak: 11,
    leaning: "pro",
    bio: "Debated in college, still can't shut up.",
    anonymous: false,
  },
  {
    id: "p03",
    name: "Priya Nair",
    handle: "priya.n",
    city: "Seattle",
    points: 690,
    streak: 3,
    leaning: "con",
    bio: "Asks the annoying follow-up question.",
    anonymous: true,
  },
  {
    id: "p04",
    name: "Chris Delgado",
    handle: "cdelgado",
    city: "Miami",
    points: 455,
    streak: 2,
    leaning: "mixed",
    bio: "Here for the crowd takes, staying for the drama.",
    anonymous: true,
  },
  {
    id: "p05",
    name: "Aisha Rahman",
    handle: "aisha.r",
    city: "Toronto",
    points: 980,
    streak: 8,
    leaning: "pro",
    bio: "Writes short. Hits hard.",
    anonymous: false,
  },
  {
    id: "p06",
    name: "Noah Keller",
    handle: "nkeller",
    city: "Denver",
    points: 320,
    streak: 1,
    leaning: "con",
    bio: "Skeptic by default. Softie in private.",
    anonymous: true,
  },
  {
    id: "p07",
    name: "Sofia Mendes",
    handle: "sofiam",
    city: "Lisbon",
    points: 760,
    streak: 4,
    leaning: "mixed",
    bio: "Night owl. Best rounds after midnight.",
    anonymous: true,
  },
  {
    id: "p08",
    name: "Marcus Webb",
    handle: "mwebb",
    city: "Atlanta",
    points: 1125,
    streak: 9,
    leaning: "pro",
    bio: "Coach energy. Makes you define your terms.",
    anonymous: false,
  },
  {
    id: "p09",
    name: "Elena Cho",
    handle: "elenacho",
    city: "LA",
    points: 540,
    streak: 2,
    leaning: "con",
    bio: "Screenshots the good ones for group chat.",
    anonymous: true,
  },
  {
    id: "p10",
    name: "Tyler Brooks",
    handle: "tbrooks",
    city: "Philly",
    points: 410,
    streak: 5,
    leaning: "mixed",
    bio: "Lost three in a row. Still coming back.",
    anonymous: true,
  },
  {
    id: "p11",
    name: "Nadia Hassan",
    handle: "nadiah",
    city: "London",
    points: 890,
    streak: 7,
    leaning: "pro",
    bio: "Quiet until round three.",
    anonymous: true,
  },
  {
    id: "p12",
    name: "Owen Price",
    handle: "oprice",
    city: "Portland",
    points: 275,
    streak: 1,
    leaning: "con",
    bio: "New here. Already addicted to the meter.",
    anonymous: true,
  },
  {
    id: "p13",
    name: "Camila Rojas",
    handle: "camilar",
    city: "CDMX",
    points: 1030,
    streak: 10,
    leaning: "mixed",
    bio: "Bilingual arguments hit different.",
    anonymous: false,
  },
  {
    id: "p14",
    name: "Derek Singh",
    handle: "dsingh",
    city: "Vancouver",
    points: 615,
    streak: 3,
    leaning: "pro",
    bio: "Data first, vibes second — usually.",
    anonymous: true,
  },
  {
    id: "p15",
    name: "Hannah Cole",
    handle: "hcole",
    city: "Boston",
    points: 720,
    streak: 4,
    leaning: "con",
    bio: "Law school dropout energy, in a good way.",
    anonymous: true,
  },
  {
    id: "p16",
    name: "Luis Farah",
    handle: "lfarah",
    city: "Brooklyn",
    points: 950,
    streak: 6,
    leaning: "mixed",
    bio: "Challenges coworkers on lunch breaks.",
    anonymous: false,
  },
  {
    id: "p17",
    name: "Greta Holm",
    handle: "gholm",
    city: "Stockholm",
    points: 380,
    streak: 2,
    leaning: "pro",
    bio: "Polite. Ruthless.",
    anonymous: true,
  },
  {
    id: "p18",
    name: "Jamal Rivers",
    handle: "jrivers",
    city: "Houston",
    points: 805,
    streak: 5,
    leaning: "con",
    bio: "Calls out weak analogies immediately.",
    anonymous: true,
  },
  {
    id: "p19",
    name: "Ivy Chen",
    handle: "ivychen",
    city: "Singapore",
    points: 560,
    streak: 3,
    leaning: "mixed",
    bio: "Timezone makes her the morning crowd.",
    anonymous: true,
  },
  {
    id: "p20",
    name: "Benito Alvarez",
    handle: "balvarez",
    city: "Phoenix",
    points: 290,
    streak: 1,
    leaning: "pro",
    bio: "Started for fun. Now has a streak anxiety.",
    anonymous: true,
  },
  {
    id: "p21",
    name: "Ruth Okonkwo",
    handle: "ruth.o",
    city: "Lagos",
    points: 1180,
    streak: 12,
    leaning: "con",
    bio: "Longest streak on the board this month.",
    anonymous: false,
  },
  {
    id: "p22",
    name: "Sam Quinn",
    handle: "samq",
    city: "Dublin",
    points: 470,
    streak: 2,
    leaning: "mixed",
    bio: "Half the comments are punchlines.",
    anonymous: true,
  },
  {
    id: "p23",
    name: "Leila Moreau",
    handle: "lmoreau",
    city: "Montreal",
    points: 665,
    streak: 4,
    leaning: "pro",
    bio: "Brings receipts. Leaves quietly.",
    anonymous: true,
  },
];

const N = Object.fromEntries(
  SEED_PEOPLE.map((p) => [p.id, publicSeedName(p)]),
) as Record<string, string>;

export const SEED_CHALLENGES: SeedChallenge[] = [
  {
    id: "seed-c1",
    inviteCode: "mx9k2p",
    motion: "Remote work should be the default for knowledge jobs",
    category: "Work",
    status: "live",
    challengerName: N.p01,
    challengerSide: "pro",
    opponentName: N.p02,
    opponentSide: "con",
    roundCount: 3,
    currentRound: 2,
    proCheers: 41,
    conCheers: 36,
    updatedMinutesAgo: 4,
    rounds: [
      {
        roundIndex: 1,
        side: "pro",
        authorName: N.p01,
        body: "Offices optimize for presence, not output. Async writing already beats most meetings.",
      },
      {
        roundIndex: 1,
        side: "con",
        authorName: N.p02,
        body: "Juniors don't learn from Slack. Mentorship dies when nobody shares a hallway.",
      },
      {
        roundIndex: 2,
        side: "pro",
        authorName: N.p01,
        body: "Then redesign mentorship on purpose. Don't chain adults to desks for accidental osmosis.",
      },
    ],
    comments: [
      {
        side: "pro",
        authorName: N.p09,
        body: "The hallway argument always assumes good managers. Bold.",
      },
      {
        side: "con",
        authorName: N.p06,
        body: "I've never met a fully remote team that onboards well in under 6 months.",
      },
    ],
  },
  {
    id: "seed-c2",
    inviteCode: "q7n4vd",
    motion: "Universities should abolish legacy admissions",
    category: "Education",
    status: "done",
    challengerName: N.p03,
    challengerSide: "pro",
    opponentName: N.p08,
    opponentSide: "con",
    roundCount: 3,
    currentRound: 3,
    proCheers: 58,
    conCheers: 29,
    updatedMinutesAgo: 38,
    rounds: [
      {
        roundIndex: 1,
        side: "pro",
        authorName: N.p03,
        body: "Legacy is a VIP line dressed up as tradition. Merit already has enough noise.",
      },
      {
        roundIndex: 1,
        side: "con",
        authorName: N.p08,
        body: "Alumni giving funds seats. Cut legacy cold and you cut scholarships with it.",
      },
      {
        roundIndex: 2,
        side: "pro",
        authorName: N.p03,
        body: "Then fundraise on outcomes, not bloodlines. Donors don't need their kids as collateral.",
      },
      {
        roundIndex: 2,
        side: "con",
        authorName: N.p08,
        body: "Pretty theory. In practice, the first budget cut is always financial aid.",
      },
      {
        roundIndex: 3,
        side: "pro",
        authorName: N.p03,
        body: "If a school only survives by selling access, that's the scandal — not the fix.",
      },
      {
        roundIndex: 3,
        side: "con",
        authorName: N.p08,
        body: "Idealism is free. Operating a university with labs and dorms isn't.",
      },
    ],
    comments: [
      {
        side: "pro",
        authorName: N.p21,
        body: "Crowd got this one right. Legacy is just soft nepotism.",
      },
      {
        side: "con",
        authorName: N.p14,
        body: "People keep ignoring the endowment math. Painful but real.",
      },
    ],
  },
  {
    id: "seed-c3",
    inviteCode: "ht2w8c",
    motion: "Social media age gates should start at 16, not 13",
    category: "Tech",
    status: "live",
    challengerName: N.p05,
    challengerSide: "pro",
    opponentName: N.p22,
    opponentSide: "con",
    roundCount: 3,
    currentRound: 1,
    proCheers: 22,
    conCheers: 27,
    updatedMinutesAgo: 11,
    rounds: [
      {
        roundIndex: 1,
        side: "pro",
        authorName: N.p05,
        body: "Thirteen-year-olds don't have impulse control for infinite feeds. We already know this.",
      },
      {
        roundIndex: 1,
        side: "con",
        authorName: N.p22,
        body: "Ban them and they lie harder. Better teach literacy than play whack-a-mole with birthdays.",
      },
    ],
    comments: [
      {
        side: "con",
        authorName: N.p10,
        body: "My cousin was '17' on every app at 12. Age gates are theater.",
      },
      {
        side: "pro",
        authorName: N.p17,
        body: "Theater that raises the floor still matters. Seatbelts aren't perfect either.",
      },
    ],
  },
  {
    id: "seed-c4",
    inviteCode: "br5m1a",
    motion: "Cities should ban cars from downtown cores on weekdays",
    category: "Cities",
    status: "open",
    challengerName: N.p16,
    challengerSide: "pro",
    opponentName: null,
    opponentSide: null,
    roundCount: 3,
    currentRound: 0,
    proCheers: 9,
    conCheers: 4,
    updatedMinutesAgo: 19,
    rounds: [],
    comments: [
      {
        side: "pro",
        authorName: N.p07,
        body: "Someone take the against corner. I want blood on this one.",
      },
    ],
  },
  {
    id: "seed-c5",
    inviteCode: "zk8p3e",
    motion: "AI-written essays should be allowed if students disclose them",
    category: "Education",
    status: "done",
    challengerName: N.p15,
    challengerSide: "con",
    opponentName: N.p19,
    opponentSide: "pro",
    roundCount: 3,
    currentRound: 3,
    proCheers: 33,
    conCheers: 47,
    updatedMinutesAgo: 95,
    rounds: [
      {
        roundIndex: 1,
        side: "con",
        authorName: N.p15,
        body: "Disclosure doesn't teach thinking. It teaches outsourcing with paperwork.",
      },
      {
        roundIndex: 1,
        side: "pro",
        authorName: N.p19,
        body: "We already allow spellcheck and search. Pretending the line is sacred is nostalgia.",
      },
      {
        roundIndex: 2,
        side: "con",
        authorName: N.p15,
        body: "Spellcheck fixes letters. Models replace the argument. Different category.",
      },
      {
        roundIndex: 2,
        side: "pro",
        authorName: N.p19,
        body: "Then grade the oral defense. Ban the tool and you just punish honest kids.",
      },
      {
        roundIndex: 3,
        side: "con",
        authorName: N.p15,
        body: "Oral defenses for 200 students? Cute. Schools need a real standard, not theater.",
      },
      {
        roundIndex: 3,
        side: "pro",
        authorName: N.p19,
        body: "So invent one. Freezing 2015 rules because grading is hard isn't a principle.",
      },
    ],
    comments: [
      {
        side: "con",
        authorName: N.p18,
        body: "If you can't explain it without the model, you didn't learn it.",
      },
      {
        side: "pro",
        authorName: N.p13,
        body: "Same energy as banning calculators in 1989. Adapt the assessment.",
      },
    ],
  },
  {
    id: "seed-c6",
    inviteCode: "nw4j7s",
    motion: "Tip culture in the US should be replaced by higher menu prices",
    category: "Culture",
    status: "live",
    challengerName: N.p04,
    challengerSide: "pro",
    opponentName: N.p23,
    opponentSide: "con",
    roundCount: 3,
    currentRound: 3,
    proCheers: 39,
    conCheers: 40,
    updatedMinutesAgo: 2,
    rounds: [
      {
        roundIndex: 1,
        side: "pro",
        authorName: N.p04,
        body: "Wages shouldn't depend on my mood after dessert. Put labor in the price.",
      },
      {
        roundIndex: 1,
        side: "con",
        authorName: N.p23,
        body: "In practice, 'no tip' cities just cut take-home for servers while owners smile.",
      },
      {
        roundIndex: 2,
        side: "pro",
        authorName: N.p04,
        body: "Then regulate the wage floor. Guest guilt isn't a payroll system.",
      },
      {
        roundIndex: 2,
        side: "con",
        authorName: N.p23,
        body: "Great. Pass that law first. Until then, tipping is how rent gets paid tonight.",
      },
      {
        roundIndex: 3,
        side: "pro",
        authorName: N.p04,
        body: "So we never change anything because transition is messy? That's how bad systems forever.",
      },
      {
        roundIndex: 3,
        side: "con",
        authorName: N.p23,
        body: "Change the law, not the customer's conscience. Order matters.",
      },
    ],
    comments: [
      {
        side: "pro",
        authorName: N.p12,
        body: "The tip screen at a counter for a bottled water broke me.",
      },
      {
        side: "con",
        authorName: N.p20,
        body: "My sister servers. She'll take the tip world over corporate 'service included.'",
      },
    ],
  },
  {
    id: "seed-c7",
    inviteCode: "x9m1kq",
    motion: "Cities should significantly reduce police budgets and reinvest in social services",
    category: "Politics",
    status: "live",
    challengerName: N.p11,
    challengerSide: "pro",
    opponentName: N.p08,
    opponentSide: "con",
    roundCount: 3,
    currentRound: 2,
    proCheers: 41,
    conCheers: 58,
    updatedMinutesAgo: 6,
    rounds: [
      {
        roundIndex: 1,
        side: "pro",
        authorName: N.p11,
        body: "Armed response to poverty and mental crisis is expensive failure. Move dollars to housing and crisis teams that actually close loops.",
      },
      {
        roundIndex: 1,
        side: "con",
        authorName: N.p08,
        body: "Cut the budget and response times explode. Victims don't get a theory seminar — they get a delayed radio call.",
      },
      {
        roundIndex: 2,
        side: "pro",
        authorName: N.p11,
        body: "We're not erasing cops. We're stopping the habit of sending a gun to every 911 that needs a social worker.",
      },
    ],
    comments: [
      {
        side: "con",
        authorName: N.p21,
        body: "My block got quieter after overtime funding. Soft language, hard tradeoffs.",
      },
      {
        side: "pro",
        authorName: N.p06,
        body: "Overtime is not a strategy. It's a bill we keep paying because reform scares people.",
      },
    ],
  },
  {
    id: "seed-c8",
    inviteCode: "p4v8nz",
    motion: "Western colonialism was, on balance, good for the colonized",
    category: "History",
    status: "live",
    challengerName: N.p14,
    challengerSide: "pro",
    opponentName: N.p13,
    opponentSide: "con",
    roundCount: 3,
    currentRound: 1,
    proCheers: 31,
    conCheers: 64,
    updatedMinutesAgo: 14,
    rounds: [
      {
        roundIndex: 1,
        side: "pro",
        authorName: N.p14,
        body: "Rail, courts, literacy, medicine — messy and extractive, but the counterfactual wasn't utopia. It was rival empires and stagnation.",
      },
      {
        roundIndex: 1,
        side: "con",
        authorName: N.p13,
        body: "You credit the thief for installing lights in the house he looted. Development under the gun isn't a gift.",
      },
    ],
    comments: [
      {
        side: "con",
        authorName: N.p18,
        body: "Every 'balance sheet' colonial take erases famines that were policy, not weather.",
      },
      {
        side: "pro",
        authorName: N.p17,
        body: "If the metric is life expectancy and literacy, the chart is inconvenient for the pure-villain story.",
      },
    ],
  },
  {
    id: "seed-c9",
    inviteCode: "r2k7wb",
    motion: "Nuclear-armed states should disarm unilaterally on a fixed schedule",
    category: "Geopolitics",
    status: "done",
    challengerName: N.p03,
    challengerSide: "pro",
    opponentName: N.p05,
    opponentSide: "con",
    roundCount: 3,
    currentRound: 3,
    proCheers: 52,
    conCheers: 51,
    updatedMinutesAgo: 55,
    rounds: [
      {
        roundIndex: 1,
        side: "pro",
        authorName: N.p03,
        body: "One accidental launch ends cities. Deterrence theory is a coin flip with civilian bodies on the line.",
      },
      {
        roundIndex: 1,
        side: "con",
        authorName: N.p05,
        body: "Unilateral disarmament invites coercion. Rivals keep their arsenals; you trade leverage for applause.",
      },
      {
        roundIndex: 2,
        side: "pro",
        authorName: N.p03,
        body: "Schedules create verification windows. Waiting for perfect reciprocity is how arsenals grow forever.",
      },
      {
        roundIndex: 2,
        side: "con",
        authorName: N.p05,
        body: "Verification without teeth is theater. Treaties only hold when both sides fear cheating equally.",
      },
      {
        roundIndex: 3,
        side: "pro",
        authorName: N.p03,
        body: "Moral leadership still moves allies. Somebody has to go first or the status quo wins by inertia.",
      },
      {
        roundIndex: 3,
        side: "con",
        authorName: N.p05,
        body: "Moral leadership without deterrence is a speech. Keep parity; cut stockpiles together or not at all.",
      },
    ],
    comments: [
      {
        side: "pro",
        authorName: N.p09,
        body: "We've normalized city-killing machines as 'stability.' That's the real extremism.",
      },
      {
        side: "con",
        authorName: N.p02,
        body: "History's lesson isn't 'disarm first.' It's don't trust a rival holding a bigger stick.",
      },
    ],
  },
  {
    id: "seed-c10",
    inviteCode: "m6t3jd",
    motion: "All immigration from Muslim-majority countries to the West should be paused for a decade",
    category: "Politics",
    status: "live",
    challengerName: N.p10,
    challengerSide: "pro",
    opponentName: N.p16,
    opponentSide: "con",
    roundCount: 3,
    currentRound: 2,
    proCheers: 44,
    conCheers: 49,
    updatedMinutesAgo: 9,
    rounds: [
      {
        roundIndex: 1,
        side: "pro",
        authorName: N.p10,
        body: "Integration failure is measurable: parallel legal norms, terror plots, polling on apostasy and gay rights. Pause is triage.",
      },
      {
        roundIndex: 1,
        side: "con",
        authorName: N.p16,
        body: "Collective punishment by passport religion is just bigotry with a spreadsheet. Vet individuals. Don't ban civilizations.",
      },
      {
        roundIndex: 2,
        side: "pro",
        authorName: N.p10,
        body: "Individual vetting already failed at scale. Countries get immigration policy; 'bigotry' isn't an argument against selection.",
      },
    ],
    comments: [
      {
        side: "con",
        authorName: N.p01,
        body: "My orthodontist is Syrian. Your pause treats him like a sleeper cell. Policy needs sharper knives.",
      },
      {
        side: "pro",
        authorName: N.p20,
        body: "Nobody pauses Italian immigration after the mafia. Curious what makes this cohort special in your model.",
      },
      {
        side: "pro",
        authorName: N.p12,
        body: "Because survey data on sharia, blasphemy, and cousin marriage isn't the same as 'Italians like pasta.'",
      },
    ],
  },
  {
    id: "seed-c11",
    inviteCode: "w8c2hf",
    motion: "Democracy is a failed experiment — competent authoritarianism is preferable",
    category: "Politics",
    status: "open",
    challengerName: N.p07,
    challengerSide: "pro",
    opponentName: null,
    opponentSide: null,
    roundCount: 3,
    currentRound: 0,
    proCheers: 17,
    conCheers: 12,
    updatedMinutesAgo: 27,
    rounds: [],
    comments: [
      {
        side: "pro",
        authorName: N.p19,
        body: "Voters pick vibes. Singapore builds metros. I'm not romantic about ballots anymore.",
      },
      {
        side: "con",
        authorName: N.p21,
        body: "Every 'competent strongman' pitch ends with a succession crisis and a purge. Take the against corner.",
      },
    ],
  },
];

export function seedChallengeToPublic(c: SeedChallenge) {
  const total = c.proCheers + c.conCheers;
  return {
    challenge: {
      id: c.id,
      inviteCode: c.inviteCode,
      motion: c.motion,
      debateSlug: null as string | null,
      category: c.category,
      status: c.status,
      roundCount: c.roundCount,
      challengerId: `seed:${c.challengerName}`,
      challengerName: c.challengerName,
      challengerSide: c.challengerSide,
      opponentId: c.opponentName ? `seed:${c.opponentName}` : null,
      opponentName: c.opponentName,
      opponentSide: c.opponentSide,
      currentRound: c.currentRound,
      nextSide: c.status === "live" ? c.challengerSide : null,
      createdAt: new Date(Date.now() - c.updatedMinutesAgo * 60_000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - c.updatedMinutesAgo * 60_000).toISOString(),
      finishedAt:
        c.status === "done"
          ? new Date(Date.now() - c.updatedMinutesAgo * 60_000).toISOString()
          : null,
    },
    crowd: {
      proPercent: total > 0 ? Math.round((100 * c.proCheers) / total) : 50,
      conPercent: total > 0 ? Math.round((100 * c.conCheers) / total) : 50,
      totalCheers: total,
    },
    rounds: c.rounds.map((r, i) => ({
      id: `${c.id}-r${i}`,
      challengeId: c.id,
      roundIndex: r.roundIndex,
      side: r.side,
      body: r.body,
      authorName: r.authorName,
      createdAt: new Date(Date.now() - (c.updatedMinutesAgo + i) * 60_000).toISOString(),
    })),
    comments: c.comments.map((cm, i) => ({
      id: `${c.id}-cm${i}`,
      challengeId: c.id,
      body: cm.body,
      side: cm.side,
      authorName: cm.authorName,
      createdAt: new Date(Date.now() - (c.updatedMinutesAgo + i * 2) * 60_000).toISOString(),
    })),
  };
}

export function getSeedChallenge(idOrCode: string) {
  const found = SEED_CHALLENGES.find(
    (c) => c.id === idOrCode || c.inviteCode === idOrCode,
  );
  return found ? seedChallengeToPublic(found) : null;
}

export function listSeedChallenges() {
  return SEED_CHALLENGES.map(seedChallengeToPublic)
    .map((x) => x.challenge)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}

export function crowdOnlineCount(now = new Date()): number {
  const hour = now.getUTCHours();
  const base = 18 + ((hour * 3) % 9);
  return base;
}
