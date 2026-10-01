import type { Metadata } from "next";
import Link from "next/link";
import { CommunityDeck } from "@/components/community-deck";

export const metadata: Metadata = {
  title: "Hot Takes — Today's Debate",
  description: "Swipe on takes written by the community.",
};

export default function TakesPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <header className="mb-8 text-center">
        <p className="label text-accent">Rapid Fire</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
          Hot Takes
        </h1>
        <p className="mt-2 text-sm text-muted">
          Written by readers, judged by you. Gut reaction only — no fence-sitting.
        </p>
        <div className="mt-4 flex justify-center">
          <Link
            href="/takes/new"
            className="label border border-foreground px-4 py-1.5 text-foreground transition hover:bg-foreground hover:text-background"
          >
            + Write a take
          </Link>
        </div>
      </header>
      <CommunityDeck />
    </div>
  );
}
