import type { Metadata } from "next";
import Link from "next/link";
import { getDailyDebate, debatePath } from "@/lib/debate-service";
import { formatDisplayDate, toDateKey } from "@/lib/dates";
import { StatusBar } from "@/components/status-bar";
import { PersonalityCard } from "@/components/personality-card";
import { ReminderForm } from "@/components/reminder-form";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} — one motion, both sides, daily`,
  description:
    "Take a side on today's motion, read the strongest case for and against, predict the room, then cast your verdict.",
  alternates: { canonical: absoluteUrl("/") },
};

export default function HomePage() {
  const dateKey = toDateKey();
  const debate = getDailyDebate(dateKey);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <section className="text-center">
        <div className="flex items-center justify-center gap-3 label text-muted">
          <span>{formatDisplayDate(dateKey)}</span>
          <span className="text-accent">·</span>
          <span>No. {debate.debateNumber}</span>
        </div>
        <hr className="rule-double mx-auto mt-3 max-w-xs" />
      </section>

      <StatusBar />

      <Link
        href={debatePath(debate)}
        className="paper-card group block px-7 py-8 transition hover:border-foreground"
      >
        <p className="label text-accent">The Motion of the Day</p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.15] text-foreground sm:text-4xl">
          {debate.resolution}
        </h1>
        <p className="mt-4 inline-flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          Take your side
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </p>
      </Link>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/takes"
          className="paper-card group block px-6 py-6 transition hover:border-foreground"
        >
          <p className="label text-accent">Rapid Fire</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
            Hot Takes
          </h2>
          <p className="mt-1 text-sm text-muted">
            Swipe a dozen spicy statements. Five points each.
          </p>
        </Link>
        <Link
          href="/topics"
          className="paper-card group block px-6 py-6 transition hover:border-foreground"
        >
          <p className="label text-accent">The Index</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
            Topics
          </h2>
          <p className="mt-1 text-sm text-muted">
            Browse every motion by subject — built for search.
          </p>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/stats"
          className="paper-card group block px-6 py-6 transition hover:border-foreground"
        >
          <p className="label text-accent">The Ledger</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
            Your Record
          </h2>
          <p className="mt-1 text-sm text-muted">
            Accuracy, leanings, and the badges you&apos;ve earned.
          </p>
        </Link>
        <Link
          href="/archive"
          className="paper-card group block px-6 py-6 transition hover:border-foreground"
        >
          <p className="label text-accent">The Back Issues</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
            Archive
          </h2>
          <p className="mt-1 text-sm text-muted">
            Replay any motion you missed. Catch up your record.
          </p>
        </Link>
      </div>

      <PersonalityCard />

      <ReminderForm />
    </div>
  );
}
