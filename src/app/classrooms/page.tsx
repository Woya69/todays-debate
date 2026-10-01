import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Classrooms",
  description:
    "Run Today's Debate with a class or club — shared motions, anonymized room stats, printable scorecards.",
};

export default function ClassroomsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="label text-accent">For educators</p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-foreground">
        Classrooms
      </h1>
      <p className="mt-4 text-lg text-muted">
        One motion the whole room faces. Students take a side before reading,
        steelman both cases, then deliver a verdict — without a comment-section
        pile-on.
      </p>

      <hr className="rule-double my-8" />

      <h2 className="font-display text-2xl font-semibold text-foreground">
        What you get
      </h2>
      <ul className="mt-4 space-y-3 text-muted">
        <li>· Class codes so a cohort debates the same motion together</li>
        <li>· Anonymized room stats (stance vs. convinced) for debrief</li>
        <li>· Printable scorecards and facilitator notes</li>
        <li>· Archive picks aligned to civics, ethics, and science curricula</li>
      </ul>

      <div className="paper-card mt-10 px-6 py-6">
        <p className="label text-accent">Pilot seats</p>
        <p className="mt-2 text-muted">
          We&apos;re onboarding debate clubs and social-studies classrooms for a
          free pilot. Email{" "}
          <a
            className="text-accent hover:text-foreground"
            href="mailto:classrooms@todaysdebate.app?subject=Classroom%20pilot"
          >
            classrooms@todaysdebate.app
          </a>{" "}
          with your school and class size.
        </p>
        <Link
          href="/how-it-works"
          className="mt-5 inline-block border border-foreground px-5 py-3 font-display font-semibold transition hover:bg-foreground hover:text-background"
        >
          See how a session runs
        </Link>
      </div>
    </div>
  );
}
