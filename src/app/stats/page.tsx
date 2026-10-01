import type { Metadata } from "next";
import { StatsDashboard } from "@/components/stats-dashboard";

export const metadata: Metadata = {
  title: "Your Record — Today's Debate",
  description: "Accuracy, flip rate, topic leanings, and achievements.",
};

export default function StatsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-8 text-center">
        <p className="label text-accent">The Ledger</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-foreground">
          Your Record
        </h1>
        <p className="mt-2 text-muted">
          How you argue, where you lean, and what you&apos;ve earned.
        </p>
      </header>
      <StatsDashboard />
    </div>
  );
}
