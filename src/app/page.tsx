import type { Metadata } from "next";
import Link from "next/link";
import { getDailyDebate, debatePath } from "@/lib/debate-service";
import { formatDisplayDate, toDateKey } from "@/lib/dates";
import { StatusBar } from "@/components/status-bar";
import { ReminderForm } from "@/components/reminder-form";
import { RecentChallenges } from "@/components/recent-challenges";
import { CrowdPresence } from "@/components/crowd-presence";
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
    <div className="mx-auto w-full max-w-3xl">
      <section className="border-b border-border pb-10 pt-2">
        <p className="label text-pro">Today&apos;s Debate</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl">
          Challenge someone. Let the crowd decide.
        </h1>
        <p className="mt-4 max-w-lg text-base text-muted sm:text-lg">
          Two corners. Short rounds. Everyone else watches and cheers. Drop the
          link in a chat — that&apos;s how this spreads.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/challenge" className="btn-primary">
            Start a challenge
          </Link>
          <Link href={debatePath(debate)} className="btn-ghost">
            Today&apos;s main event
          </Link>
        </div>
      </section>

      <div className="mt-6">
        <CrowdPresence />
      </div>

      <div className="mt-4">
        <StatusBar />
      </div>

      <Link
        href={debatePath(debate)}
        className="arena-panel group mt-6 block px-5 py-6 transition hover:border-foreground sm:px-7"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="label text-pro">Main event</span>
          <span className="label text-muted">{formatDisplayDate(dateKey)}</span>
          <span className="label text-muted">No. {debate.debateNumber}</span>
        </div>
        <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
          {debate.resolution}
        </h2>
        <p className="mt-4 inline-flex items-center gap-2 font-display text-lg font-semibold text-pro">
          Pick a corner
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </p>
      </Link>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="label text-con">In progress</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
              Challenges people are watching
            </h2>
          </div>
          <Link href="/watch" className="label text-muted hover:text-foreground">
            See all →
          </Link>
        </div>
        <RecentChallenges />
      </section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/takes"
          className="arena-card block px-5 py-5 transition hover:border-foreground"
        >
          <p className="label text-pro">Rapid fire</p>
          <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
            Hot Takes
          </h3>
          <p className="mt-1 text-sm text-muted">
            Snap through a dozen spicy lines.
          </p>
        </Link>
        <Link
          href="/how-it-works"
          className="arena-card block px-5 py-5 transition hover:border-foreground"
        >
          <p className="label text-con">House rules</p>
          <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
            How it works
          </h3>
          <p className="mt-1 text-sm text-muted">
            Argue the motion. Not the person.
          </p>
        </Link>
      </div>

      <div className="mt-8">
        <ReminderForm />
      </div>
    </div>
  );
}
