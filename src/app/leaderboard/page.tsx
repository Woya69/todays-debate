import type { Metadata } from "next";
import { Leaderboard } from "@/components/leaderboard";

export const metadata: Metadata = {
  title: "Standings — Today's Debate",
  description: "Who's reading the room best.",
};

export default function LeaderboardPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-8 text-center">
        <p className="label text-accent">The Table</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
          Standings
        </h1>
        <p className="mt-2 text-sm text-muted">
          Earn points from debates, predictions, and hot takes. Climb the ranks.
        </p>
      </header>
      <Leaderboard />
    </div>
  );
}
