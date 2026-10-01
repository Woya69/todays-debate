import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works — Today's Debate",
  description: "The rules of the house, in under a minute.",
};

const steps = [
  {
    title: "Take a side",
    body: "Every day, one motion. Call it For, Against, or Undecided before you read a word.",
  },
  {
    title: "Read both cases",
    body: "The strongest argument for and against — tight, sourced in spirit, no filler.",
  },
  {
    title: "Call the room",
    body: "Predict which way the crowd will rule. Get it right for a points bonus.",
  },
  {
    title: "Deliver your verdict",
    body: "Which side actually convinced you? Cross the floor if they earned it.",
  },
  {
    title: "File your scorecard",
    body: "A clean typographic result to share — no spoilers, no shouting.",
  },
];

const points = [
  ["Complete a debate", "+20"],
  ["Read the room correctly", "+50"],
  ["Wrong call (still counts)", "+10"],
  ["Cross the floor", "+15"],
  ["Each hot take", "+5"],
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="label text-accent">The House Rules</p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-foreground">
        How it works
      </h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        One motion a day. Everyone debates the same one. No threads, no pile-ons —
        a scorecard, not a shouting match.
      </p>

      <hr className="rule-double my-8" />

      <ol className="space-y-7">
        {steps.map((item, i) => (
          <li key={item.title} className="flex gap-5">
            <span className="font-display text-3xl font-semibold text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                {item.title}
              </h2>
              <p className="mt-1 text-muted">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <hr className="rule my-8" />

      <h2 className="font-display text-2xl font-semibold text-foreground">
        Scoring
      </h2>
      <div className="paper-card mt-4">
        {points.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-border px-5 py-3 last:border-0"
          >
            <span className="text-foreground">{label}</span>
            <span className="font-mono text-accent">{value}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold text-foreground">
        Keeping your streak
      </h2>
      <p className="mt-3 text-muted">
        Miss a day and a <strong className="text-foreground">freeze token</strong>{" "}
        bridges the gap automatically — your run survives one slip. You earn a
        token every few debates, up to three in reserve. Out of tokens? The{" "}
        <Link href="/archive" className="text-accent underline-offset-2 hover:underline">
          archive
        </Link>{" "}
        lets you replay any motion you missed.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold text-foreground">
        On the presses
      </h2>
      <ul className="mt-3 space-y-2 text-muted">
        <li>
          <Link href="/archive" className="text-accent underline-offset-2 hover:underline">
            The archive
          </Link>{" "}
          — every past motion, replayable
        </li>
        <li>
          <Link href="/stats" className="text-accent underline-offset-2 hover:underline">
            Your record
          </Link>{" "}
          — accuracy, leanings, and achievements
        </li>
        <li>
          <Link href="/suggest" className="text-accent underline-offset-2 hover:underline">
            Suggest a motion
          </Link>{" "}
          — the best reader pitches run
        </li>
        <li>Reader rebuttals on every verdict</li>
      </ul>

      <Link
        href="/debate"
        className="mt-10 inline-flex bg-foreground px-6 py-3 font-display text-lg font-semibold text-background transition hover:bg-accent"
      >
        Read today&apos;s motion
      </Link>
    </div>
  );
}
