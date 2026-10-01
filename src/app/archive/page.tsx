import type { Metadata } from "next";
import { ArchiveList } from "@/components/archive-list";
import { getArchive } from "@/lib/debate-service";

export const metadata: Metadata = {
  title: "The Archive — Today's Debate",
  description: "Every past motion, replayable. Catch up on the ones you missed.",
};

export default function ArchivePage() {
  const entries = getArchive();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-8 text-center">
        <p className="label text-accent">The Back Issues</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-foreground">
          The Archive
        </h1>
        <p className="mt-2 text-muted">
          Every motion we&apos;ve run. Replay any you missed — your record fills in.
        </p>
      </header>
      <ArchiveList entries={entries} />
    </div>
  );
}
