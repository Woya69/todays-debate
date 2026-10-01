import type { Metadata } from "next";
import Link from "next/link";
import { RecentChallenges } from "@/components/recent-challenges";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Watch",
  description: "Live and recent challenges. Pick a corner. Join the crowd.",
  alternates: { canonical: absoluteUrl("/watch") },
};

export default function WatchPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-con">Watch</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-foreground">
            The crowd is gathering
          </h1>
          <p className="mt-3 max-w-md text-muted">
            Spectate live debates. Cheer a corner. Drop one sharp line.
          </p>
        </div>
        <Link href="/challenge" className="btn-primary">
          Start one
        </Link>
      </div>
      <div className="mt-8">
        <RecentChallenges limit={20} />
      </div>
    </div>
  );
}
