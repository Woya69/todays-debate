export type Stance = "pro" | "con" | "undecided";

export type DebateStep = "stance" | "read" | "predict" | "vote" | "share";

export interface Source {
  label: string;
  url?: string;
}

export type DebateStatus = "published" | "draft";

export interface Debate {
  id: string;
  resolution: string;
  category: string;
  /** One-paragraph neutral framing shown before the two cases. */
  context?: string;
  pro: {
    title: string;
    argument: string;
  };
  con: {
    title: string;
    argument: string;
  };
  /** Optional further-reading prompts surfaced under the arguments. */
  furtherReading?: Source[];
  /** ISO date when this motion entered the published pool. */
  publishedAt?: string;
  /** Override for <title>; defaults to resolution-based SEO title. */
  seoTitle?: string;
  /** Override for meta description. */
  seoDescription?: string;
  status?: DebateStatus;
}

export interface DailyDebate extends Debate {
  dateKey: string;
  debateNumber: number;
}

export type Verdict = "pro" | "con";

export interface UserDebateResult {
  dateKey: string;
  debateNumber: number;
  stance: Stance;
  convincedBy: Stance;
  prediction: Verdict | null;
  predictionCorrect: boolean | null;
  pointsEarned: number;
  completedAt: string;
}

export interface DebateStats {
  proStancePercent: number;
  conStancePercent: number;
  undecidedStancePercent: number;
  proConvincedPercent: number;
  conConvincedPercent: number;
  totalVotes: number;
}

export type TakeAnswer = "agree" | "disagree";

export interface HotTake {
  id: string;
  text: string;
  topic: string;
  /** Share of the crowd that agrees (mock until Supabase). 0-100. */
  agreePercent: number;
}

export interface PlayerProfile {
  points: number;
  debates: UserDebateResult[];
  takes: Record<string, TakeAnswer>;
  lastActive: string;
  /** Tokens that bridge a single missed day in the streak. */
  freezeTokens: number;
  /** Dates already paid for with a freeze token, so we don't double-charge. */
  frozenDates: string[];
}

export interface Rank {
  title: string;
  min: number;
  tier: number;
}

export interface RankProgress {
  current: Rank;
  next: Rank | null;
  pointsIntoTier: number;
  pointsForTier: number;
  percent: number;
}

export interface Personality {
  archetype: string;
  tagline: string;
  decisiveness: number;
  flexibility: number;
  agreeRate: number;
  sampleSize: number;
}

export interface StreakInfo {
  streak: number;
  freezeTokens: number;
  /** True when a freeze token is currently bridging yesterday's gap. */
  protected: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  /** 0-1 progress toward earning, when measurable. */
  progress: number;
}

export interface CategoryLean {
  category: string;
  played: number;
  /** Share of decided debates where the reader sided For. 0-100. */
  proPercent: number;
}

export interface ArchiveEntry {
  dateKey: string;
  debateNumber: number;
  debateId: string;
  resolution: string;
  category: string;
  isToday: boolean;
}

export interface DebateComment {
  id: string;
  debateId: string;
  body: string;
  authorName: string;
  side: Stance;
  createdAt: string;
}

export interface TakeComment {
  id: string;
  takeId: string;
  body: string;
  authorName: string;
  /** True when the signed-in viewer authored this comment. */
  mine: boolean;
  createdAt: string;
}

export interface DebateSuggestion {
  resolution: string;
  category: string;
  proHint: string;
  conHint: string;
}

export type ChallengeStatus = "open" | "live" | "done";
export type Corner = "pro" | "con";

export interface Challenge {
  id: string;
  inviteCode: string;
  motion: string;
  debateSlug: string | null;
  category: string;
  status: ChallengeStatus;
  roundCount: number;
  challengerId: string;
  challengerName: string;
  challengerSide: Corner;
  opponentId: string | null;
  opponentName: string | null;
  opponentSide: Corner | null;
  currentRound: number;
  nextSide: Corner | null;
  createdAt: string;
  updatedAt: string;
  finishedAt: string | null;
}

export interface ChallengeRound {
  id: string;
  challengeId: string;
  roundIndex: number;
  side: Corner;
  body: string;
  authorName: string;
  createdAt: string;
}

export interface ChallengeCrowd {
  proPercent: number;
  conPercent: number;
  totalCheers: number;
}

export interface ChallengeComment {
  id: string;
  challengeId: string;
  body: string;
  side: Corner;
  authorName: string;
  createdAt: string;
}
