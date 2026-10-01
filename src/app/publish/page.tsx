import type { Metadata } from "next";
import { getScheduledDebates } from "@/lib/debate-service";
import { toDateKey } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Publish cadence",
  description:
    "How Today's Debate ships new motions — one unique debate per day, plus backfill for SEO.",
};

export default function PublishPage() {
  const pool = getScheduledDebates();
  const today = getScheduledDebates();
  const coveredDays = pool.length;
  const asOf = toDateKey();

  return (
    <div className="mx-auto max-w-2xl">
      <p className="label text-accent">Editorial ops</p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-foreground">
        Publish cadence
      </h1>
      <p className="mt-4 text-lg text-muted">
        Growth compounder: every motion is a permanent topic page. We never
        recycle thin duplicates for Google — dates redirect to slugs.
      </p>

      <hr className="rule-double my-8" />

      <dl className="grid grid-cols-2 gap-4">
        <div className="paper-card px-5 py-4">
          <dt className="label text-muted">Published motions</dt>
          <dd className="mt-1 font-display text-3xl font-semibold">{pool.length}</dd>
        </div>
        <div className="paper-card px-5 py-4">
          <dt className="label text-muted">Unique days covered</dt>
          <dd className="mt-1 font-display text-3xl font-semibold">
            {coveredDays}
          </dd>
        </div>
      </dl>

      <h2 className="mt-10 font-display text-2xl font-semibold">Rules</h2>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-muted">
        <li>Ship at least one new unique motion per calendar day when possible.</li>
        <li>AI may draft; a human skims for steelman quality before publish.</li>
        <li>Canonical URL is always <code className="text-foreground">/debate/[slug]</code>.</li>
        <li>Measure rankings on the resolution query, not the brand name.</li>
        <li>As of {asOf}, the pool has {today.length} live motions.</li>
      </ol>
    </div>
  );
}
