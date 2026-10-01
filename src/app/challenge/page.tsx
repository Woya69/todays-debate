import type { Metadata } from "next";
import { ChallengeCreateForm } from "@/components/challenge-create-form";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

type Props = { searchParams: Promise<{ motion?: string; slug?: string }> };

export const metadata: Metadata = {
  title: "Start a challenge",
  description:
    "Challenge someone to a structured debate. Three rounds. The crowd watches and decides.",
  alternates: { canonical: absoluteUrl("/challenge") },
};

export default async function ChallengePage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="mx-auto w-full max-w-2xl">
      <p className="label text-pro">Challenge</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        Open the floor
      </h1>
      <p className="mt-3 max-w-lg text-muted">
        Pick a motion. Take a corner. Send the link. They accept, you trade
        rounds, the crowd cheers — that&apos;s how {SITE_NAME} spreads.
      </p>
      <div className="mt-8">
        <ChallengeCreateForm
          presetMotion={params.motion}
          presetSlug={params.slug}
        />
      </div>
    </div>
  );
}
