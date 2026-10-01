import type { Metadata } from "next";
import Link from "next/link";
import { getDailyDebate, debatePath } from "@/lib/debate-service";
import { formatDisplayDate, toDateKey } from "@/lib/dates";
import { StatusBar } from "@/components/status-bar";
import { ReminderForm } from "@/components/reminder-form";
import { RecentChallenges } from "@/components/recent-challenges";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} — challenge someone. let the crowd decide.`,
  description:
    "Challenge a friend to a structured debate. The crowd watches, cheers a corner, and decides. Daily main event always live.",
  alternates: { canonical: absoluteUrl("/") },
};

export default function HomePage() {
  const dateKey = toDateKey();
  const debate = getDailyDebate(dateKey);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-border bg-surface px-6 py-10 sm:px-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-pro/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-con/20 blur-3xl"
        />

        <p className="label text-pro">Today&apos;s Debate</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          Challenge someone.
          <br />
          <span className="bg-gradient-to-r from-pro via-foreground to-con bg-clip-text text-transparent">
            Let the crowd decide.
          </span>
        </h1>
        <p className="mt-5 max-w-lg text-base text-muted sm:text-lg">
          Short rounds. Two corners. Spectators cheer and comment. Share the
          link — growth happens when the crowd shows up.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/challenge" className="btn-primary">
            Start a challenge
          </Link>
          <Link href={debatePath(debate)} className="btn-ghost">
            Watch today&apos;s main event
          </Link>
        </div>
      </section>

      <div className="mt-6">
        <StatusBar />
      </div>

      <Link
        href={debatePath(debate)}
        className="arena-panel group mt-6 block px-6 py-7 transition hover:border-pro/50 sm:px-8"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="label rounded-full bg-pro/15 px-2.5 py-1 text-pro">
            Main Event
          </span>
          <span className="label text-muted">{formatDisplayDate(dateKey)}</span>
          <span className="label text-muted">· No. {debate.debateNumber}</span>
        </div>
        <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
          {debate.resolution}
        </h2>
        <p className="mt-4 inline-flex items-center gap-2 font-display text-lg font-bold text-pro">
          Pick a corner
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </p>
      </Link>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="label text-con">Live challenges</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-foreground">
              Watch the crowd
            </h2>
          </div>
          <Link href="/watch" className="label text-muted hover:text-foreground">
            See all →
          </Link>
        </div>
        <RecentChallenges />
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/takes"
          className="arena-card group block px-6 py-6 transition hover:border-pro/40"
        >
          <p className="label text-pro">Rapid fire</p>
          <h3 className="mt-2 font-display text-xl font-bold text-foreground">
            Hot Takes
          </h3>
          <p className="mt-1 text-sm text-muted">
            Snap-agree a dozen spicy lines. Fuel for challenges.
          </p>
        </Link>
        <Link
          href="/how-it-works"
          className="arena-card group block px-6 py-6 transition hover:border-con/40"
        >
          <p className="label text-con">The rules</p>
          <h3 className="mt-2 font-display text-xl font-bold text-foreground">
            How it works
          </h3>
          <p className="mt-1 text-sm text-muted">
            Argue the motion. Not the person. Crowd decides.
          </p>
        </Link>
      </div>

      <div className="mt-8">
        <ReminderForm />
      </div>
    </div>
  );
}
