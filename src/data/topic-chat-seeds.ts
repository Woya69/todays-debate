import type { Corner } from "@/types/debate";

export type ChatRole = "host" | "debater" | "crowd";

export interface TopicChatMessage {
  id: string;
  debateSlug: string;
  body: string;
  side: Corner;
  role: ChatRole;
  authorName: string;
  createdAt: string;
  /** True while waiting on network — already visible locally. */
  pending?: boolean;
  mine?: boolean;
}

/** Seed lines so a room never feels empty the second you land. */
export const TOPIC_CHAT_SEEDS: Record<string, TopicChatMessage[]> = {
  "defund-police": [
    {
      id: "seed-dp-1",
      debateSlug: "defund-police",
      body: "Opened the floor. Yes = move money off armed response. No = keep the budget.",
      side: "pro",
      role: "host",
      authorName: "Floor host",
      createdAt: new Date(Date.now() - 120_000).toISOString(),
    },
    {
      id: "seed-dp-2",
      debateSlug: "defund-police",
      body: "Response times already suck. Cutting overtime makes that worse, not better.",
      side: "con",
      role: "debater",
      authorName: "Anon RILE",
      createdAt: new Date(Date.now() - 90_000).toISOString(),
    },
    {
      id: "seed-dp-3",
      debateSlug: "defund-police",
      body: "Sending a gun to a mental health call is the expensive failure mode.",
      side: "pro",
      role: "debater",
      authorName: "Anon KOVA",
      createdAt: new Date(Date.now() - 60_000).toISOString(),
    },
    {
      id: "seed-dp-4",
      debateSlug: "defund-police",
      body: "My block got quieter after more patrols. Soft language, hard tradeoffs.",
      side: "con",
      role: "crowd",
      authorName: "Anon 4F2A",
      createdAt: new Date(Date.now() - 35_000).toISOString(),
    },
  ],
  "open-borders": [
    {
      id: "seed-ob-1",
      debateSlug: "open-borders",
      body: "Motion is open. Yes = substantially open wealthy borders. No = keep the gates.",
      side: "pro",
      role: "host",
      authorName: "Floor host",
      createdAt: new Date(Date.now() - 110_000).toISOString(),
    },
    {
      id: "seed-ob-2",
      debateSlug: "open-borders",
      body: "Labor markets aren't infinite. Housing and wages take the hit first.",
      side: "con",
      role: "debater",
      authorName: "Anon NEX",
      createdAt: new Date(Date.now() - 80_000).toISOString(),
    },
    {
      id: "seed-ob-3",
      debateSlug: "open-borders",
      body: "Talent and refugees shouldn't depend on lottery paperwork.",
      side: "pro",
      role: "debater",
      authorName: "Anon SOL",
      createdAt: new Date(Date.now() - 45_000).toISOString(),
    },
  ],
  "park-camping-ban": [
    {
      id: "seed-pc-1",
      debateSlug: "park-camping-ban",
      body: "Live floor. Ban encampments in parks — yes or no.",
      side: "pro",
      role: "host",
      authorName: "Floor host",
      createdAt: new Date(Date.now() - 100_000).toISOString(),
    },
    {
      id: "seed-pc-2",
      debateSlug: "park-camping-ban",
      body: "Kids can't use the playground. Compassion without rules isn't compassion.",
      side: "pro",
      role: "debater",
      authorName: "Anon MAYA",
      createdAt: new Date(Date.now() - 70_000).toISOString(),
    },
    {
      id: "seed-pc-3",
      debateSlug: "park-camping-ban",
      body: "Ban without housing is just displacement with better PR.",
      side: "con",
      role: "debater",
      authorName: "Anon JETT",
      createdAt: new Date(Date.now() - 40_000).toISOString(),
    },
  ],
  "tiktok-ban": [
    {
      id: "seed-tt-1",
      debateSlug: "tiktok-ban",
      body: "Should democracies ban TikTok? Floor is open.",
      side: "pro",
      role: "host",
      authorName: "Floor host",
      createdAt: new Date(Date.now() - 95_000).toISOString(),
    },
    {
      id: "seed-tt-2",
      debateSlug: "tiktok-ban",
      body: "If it's a security threat, force a sale. A ban is theater.",
      side: "con",
      role: "debater",
      authorName: "Anon CLIP",
      createdAt: new Date(Date.now() - 55_000).toISOString(),
    },
  ],
  "wealth-tax": [
    {
      id: "seed-wt-1",
      debateSlug: "wealth-tax",
      body: "Tax extreme wealth annually — yes or no. Hosting.",
      side: "pro",
      role: "host",
      authorName: "Floor host",
      createdAt: new Date(Date.now() - 85_000).toISOString(),
    },
    {
      id: "seed-wt-2",
      debateSlug: "wealth-tax",
      body: "Capital flees. Then you taxed headlines, not revenue.",
      side: "con",
      role: "debater",
      authorName: "Anon LEDG",
      createdAt: new Date(Date.now() - 50_000).toISOString(),
    },
  ],
};

export function seedsForSlug(slug: string): TopicChatMessage[] {
  return TOPIC_CHAT_SEEDS[slug] ?? [
    {
      id: `seed-${slug}-host`,
      debateSlug: slug,
      body: "Floor is open. Pick a corner and talk — no essays.",
      side: "pro",
      role: "host",
      authorName: "Floor host",
      createdAt: new Date(Date.now() - 60_000).toISOString(),
    },
  ];
}
