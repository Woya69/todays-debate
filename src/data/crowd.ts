/** Seeded crowd — realistic names & activity so the room never feels empty. */

export interface SeedPerson {
  id: string;
  name: string;
  handle: string;
  city: string;
  points: number;
  streak: number;
  leaning: "pro" | "con" | "mixed";
  bio: string;
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
  },
];

export const SEED_CHALLENGES: SeedChallenge[] = [
  {
    id: "seed-c1",
    inviteCode: "mx9k2p",
    motion: "Remote work should be the default for knowledge jobs",
    category: "Work",
    status: "live",
    challengerName: "Maya Ortiz",
    challengerSide: "pro",
    opponentName: "Jordan Blake",
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
        authorName: "Maya Ortiz",
        body: "Offices optimize for presence, not output. Async writing already beats most meetings.",
      },
      {
        roundIndex: 1,
        side: "con",
        authorName: "Jordan Blake",
        body: "Juniors don't learn from Slack. Mentorship dies when nobody shares a hallway.",
      },
      {
        roundIndex: 2,
        side: "pro",
        authorName: "Maya Ortiz",
        body: "Then redesign mentorship on purpose. Don't chain adults to desks for accidental osmosis.",
      },
    ],
    comments: [
      {
        side: "pro",
        authorName: "Elena Cho",
        body: "The hallway argument always assumes good managers. Bold.",
      },
      {
        side: "con",
        authorName: "Noah Keller",
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
    challengerName: "Priya Nair",
    challengerSide: "pro",
    opponentName: "Marcus Webb",
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
        authorName: "Priya Nair",
        body: "Legacy is a VIP line dressed up as tradition. Merit already has enough noise.",
      },
      {
        roundIndex: 1,
        side: "con",
        authorName: "Marcus Webb",
        body: "Alumni giving funds seats. Cut legacy cold and you cut scholarships with it.",
      },
      {
        roundIndex: 2,
        side: "pro",
        authorName: "Priya Nair",
        body: "Then fundraise on outcomes, not bloodlines. Donors don't need their kids as collateral.",
      },
      {
        roundIndex: 2,
        side: "con",
        authorName: "Marcus Webb",
        body: "Pretty theory. In practice, the first budget cut is always financial aid.",
      },
      {
        roundIndex: 3,
        side: "pro",
        authorName: "Priya Nair",
        body: "If a school only survives by selling access, that's the scandal — not the fix.",
      },
      {
        roundIndex: 3,
        side: "con",
        authorName: "Marcus Webb",
        body: "Idealism is free. Operating a university with labs and dorms isn't.",
      },
    ],
    comments: [
      {
        side: "pro",
        authorName: "Ruth Okonkwo",
        body: "Crowd got this one right. Legacy is just soft nepotism.",
      },
      {
        side: "con",
        authorName: "Derek Singh",
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
    challengerName: "Aisha Rahman",
    challengerSide: "pro",
    opponentName: "Sam Quinn",
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
        authorName: "Aisha Rahman",
        body: "Thirteen-year-olds don't have impulse control for infinite feeds. We already know this.",
      },
      {
        roundIndex: 1,
        side: "con",
        authorName: "Sam Quinn",
        body: "Ban them and they lie harder. Better teach literacy than play whack-a-mole with birthdays.",
      },
    ],
    comments: [
      {
        side: "con",
        authorName: "Tyler Brooks",
        body: "My cousin was '17' on every app at 12. Age gates are theater.",
      },
      {
        side: "pro",
        authorName: "Greta Holm",
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
    challengerName: "Luis Farah",
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
        authorName: "Sofia Mendes",
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
    challengerName: "Hannah Cole",
    challengerSide: "con",
    opponentName: "Ivy Chen",
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
        authorName: "Hannah Cole",
        body: "Disclosure doesn't teach thinking. It teaches outsourcing with paperwork.",
      },
      {
        roundIndex: 1,
        side: "pro",
        authorName: "Ivy Chen",
        body: "We already allow spellcheck and search. Pretending the line is sacred is nostalgia.",
      },
      {
        roundIndex: 2,
        side: "con",
        authorName: "Hannah Cole",
        body: "Spellcheck fixes letters. Models replace the argument. Different category.",
      },
      {
        roundIndex: 2,
        side: "pro",
        authorName: "Ivy Chen",
        body: "Then grade the oral defense. Ban the tool and you just punish honest kids.",
      },
      {
        roundIndex: 3,
        side: "con",
        authorName: "Hannah Cole",
        body: "Oral defenses for 200 students? Cute. Schools need a real standard, not theater.",
      },
      {
        roundIndex: 3,
        side: "pro",
        authorName: "Ivy Chen",
        body: "So invent one. Freezing 2015 rules because grading is hard isn't a principle.",
      },
    ],
    comments: [
      {
        side: "con",
        authorName: "Jamal Rivers",
        body: "If you can't explain it without the model, you didn't learn it.",
      },
      {
        side: "pro",
        authorName: "Camila Rojas",
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
    challengerName: "Chris Delgado",
    challengerSide: "pro",
    opponentName: "Leila Moreau",
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
        authorName: "Chris Delgado",
        body: "Wages shouldn't depend on my mood after dessert. Put labor in the price.",
      },
      {
        roundIndex: 1,
        side: "con",
        authorName: "Leila Moreau",
        body: "In practice, 'no tip' cities just cut take-home for servers while owners smile.",
      },
      {
        roundIndex: 2,
        side: "pro",
        authorName: "Chris Delgado",
        body: "Then regulate the wage floor. Guest guilt isn't a payroll system.",
      },
      {
        roundIndex: 2,
        side: "con",
        authorName: "Leila Moreau",
        body: "Great. Pass that law first. Until then, tipping is how rent gets paid tonight.",
      },
      {
        roundIndex: 3,
        side: "pro",
        authorName: "Chris Delgado",
        body: "So we never change anything because transition is messy? That's how bad systems forever.",
      },
      {
        roundIndex: 3,
        side: "con",
        authorName: "Leila Moreau",
        body: "Change the law, not the customer's conscience. Order matters.",
      },
    ],
    comments: [
      {
        side: "pro",
        authorName: "Owen Price",
        body: "The tip screen at a counter for a bottled water broke me.",
      },
      {
        side: "con",
        authorName: "Benito Alvarez",
        body: "My sister servers. She'll take the tip world over corporate 'service included.'",
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

/** Deterministic “online now” count that drifts by hour so it feels alive. */
export function crowdOnlineCount(now = new Date()): number {
  const hour = now.getUTCHours();
  const base = 18 + ((hour * 3) % 9);
  return base;
}
