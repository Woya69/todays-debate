import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works — Today's Debate",
  description: "Challenge someone. Trade rounds. Let the crowd decide.",
};

const steps = [
  {
    title: "Challenge someone",
    body: "Pick a motion, take a corner, send the link. They accept and take the other side.",
  },
  {
    title: "Trade short rounds",
    body: "Three rounds each. Cap at 280 characters. Argue the motion — not the person.",
  },
  {
    title: "Crowd watches",
    body: "Anyone with the link spectates, cheers a corner, and comments from that corner only.",
  },
  {
    title: "Crowd decides",
    body: "When rounds end, the cheer meter is the verdict. Share the scorecard.",
  },
  {
    title: "Daily main event",
    body: "Every day there's a public stage so the arena is never empty — pick a corner, call the crowd, keep your streak.",
  },
];

const points = [
  ["Complete today's main event", "+20"],
  ["Read the crowd correctly", "+50"],
  ["Wrong call (still counts)", "+10"],
  ["Cross the floor", "+15"],
  ["Each hot take", "+5"],
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="label text-pro">The rules</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-5xl text-foreground">
        How it works
      </h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        Structured debate theater. Not a pile-on. Not bullying. Two corners, a
        crowd, and a clear verdict.
      </p>

      <ol className="mt-10 space-y-7">
        {steps.map((item, i) => (
          <li key={item.title} className="flex gap-5">
            <span className="font-display text-3xl font-extrabold text-pro">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-display text-xl font-extrabold text-foreground">
                {item.title}
              </h2>
              <p className="mt-1 text-muted">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <hr className="rule my-8" />

      <h2 className="font-display text-2xl font-extrabold text-foreground">
        Main Event scoring
      </h2>
      <div className="arena-card mt-4">
        {points.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-border px-5 py-3 last:border-0"
          >
            <span className="text-sm text-muted">{label}</span>
            <span className="font-display text-lg font-bold text-pro">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/challenge" className="btn-primary flex-1 text-center">
          Start a challenge
        </Link>
        <Link href="/debate" className="btn-ghost flex-1 text-center">
          Today&apos;s main event
        </Link>
      </div>
    </div>
  );
}
