"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type {
  DailyDebate,
  DebateStats,
  DebateStep,
  Personality,
  Stance,
  UserDebateResult,
  Verdict,
} from "@/types/debate";
import { communityVerdict, getMockStats } from "@/lib/debate-service";
import {
  castDebateVote,
  fetchDebateStats,
  syncProfilePoints,
} from "@/lib/stats";
import { POINTS } from "@/lib/levels";
import {
  buildScoreline,
  buildShareImageUrl,
  buildShareText,
  changedMind,
  shareOrCopy,
} from "@/lib/share";
import {
  getDebateResult,
  getProfile,
  getStreak,
  recordDebate,
} from "@/lib/player";
import { computePersonality } from "@/lib/personality";
import { StancePicker } from "@/components/stance-picker";
import { SideCard } from "@/components/side-card";
import { CommunityStats } from "@/components/community-stats";
import { DebateComments } from "@/components/debate-comments";

const steps: DebateStep[] = ["stance", "read", "predict", "vote", "share"];

export function DebateFlow({ debate }: { debate: DailyDebate }) {
  const [step, setStep] = useState<DebateStep>("stance");
  const [stance, setStance] = useState<Stance | null>(null);
  const [prediction, setPrediction] = useState<Verdict | null>(null);
  const [hasRead, setHasRead] = useState(false);
  const [result, setResult] = useState<UserDebateResult | null>(null);
  const [personality, setPersonality] = useState<Personality | null>(null);
  const [streak, setStreak] = useState(0);
  const [copied, setCopied] = useState(false);

  const [stats, setStats] = useState<DebateStats | null>(null);
  const stepIndex = steps.indexOf(step);

  useEffect(() => {
    const saved = getDebateResult(debate.dateKey);
    if (saved) {
      setResult(saved);
      setStance(saved.stance);
      setPrediction(saved.prediction);
      setHasRead(true);
      setStep("share");
      setPersonality(computePersonality(getProfile()));
      fetchDebateStats(debate.dateKey, debate.id)
        .then((live) => setStats(live ?? getMockStats(debate.dateKey)))
        .catch(() => setStats(getMockStats(debate.dateKey)));
    }
    setStreak(getStreak());
  }, [debate.dateKey, debate.id]);

  async function castVote(convincedBy: Stance) {
    if (!stance) return;

    // Record the anonymous vote first, then read back live crowd stats
    // (which now include this vote) to grade the room-reading prediction.
    await castDebateVote({
      dateKey: debate.dateKey,
      debateId: debate.id,
      initialStance: stance,
      convincedBy,
      prediction,
    });

    const live =
      (await fetchDebateStats(debate.dateKey, debate.id).catch(() => null)) ??
      getMockStats(debate.dateKey);
    setStats(live);

    const roomVerdict = communityVerdict(live);
    const predictionCorrect = prediction ? prediction === roomVerdict : null;
    const flipped =
      stance !== "undecided" &&
      convincedBy !== "undecided" &&
      stance !== convincedBy;

    let points = POINTS.debateComplete;
    if (predictionCorrect === true) points += POINTS.predictionCorrect;
    else if (predictionCorrect === false) points += POINTS.predictionWrong;
    if (flipped) points += POINTS.changedMindBonus;

    const payload: UserDebateResult = {
      dateKey: debate.dateKey,
      debateNumber: debate.debateNumber,
      stance,
      convincedBy,
      prediction,
      predictionCorrect,
      pointsEarned: points,
      completedAt: new Date().toISOString(),
    };

    const profile = recordDebate(payload);
    setResult(payload);
    setPersonality(computePersonality(profile));
    setStreak(getStreak());
    void syncProfilePoints(profile.points);
    setStep("share");
  }

  async function copyShare() {
    if (!result) return;
    const text = buildShareText(result, debate.resolution, debate.id);
    const mode = await shareOrCopy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    return mode;
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6 text-center">
        <p className="label text-accent">Motion No. {debate.debateNumber}</p>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold leading-[1.15] text-foreground sm:text-[2.6rem]">
          {debate.resolution}
        </h1>
        <p className="mt-3 label text-muted">{debate.category}</p>
      </header>

      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <span
            key={s}
            className={`h-[3px] w-10 ${i <= stepIndex ? "bg-accent" : "bg-border"}`}
          />
        ))}
      </div>

      {step === "stance" && (
        <section className="animate-rise space-y-6">
          <Heading
            title="Where do you stand?"
            sub="A gut call before the arguments. You can change your mind later."
          />
          <StancePicker
            selected={stance}
            onSelect={(s) => {
              setStance(s);
              setStep("read");
            }}
          />
        </section>
      )}

      {step === "read" && stance && (
        <section className="animate-rise space-y-5">
          {debate.context && (
            <div className="paper-card border-l-4 border-l-accent px-5 py-4">
              <p className="label text-accent">The brief</p>
              <p className="mt-2 text-sm leading-6 text-muted">{debate.context}</p>
            </div>
          )}
          <SideCard side="pro" title={debate.pro.title} argument={debate.pro.argument} />
          <SideCard side="con" title={debate.con.title} argument={debate.con.argument} />
          <label className="paper-card flex cursor-pointer items-start gap-3 px-5 py-4">
            <input
              type="checkbox"
              checked={hasRead}
              onChange={(e) => setHasRead(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--accent)]"
            />
            <span className="text-sm leading-6 text-muted">
              I&apos;ve weighed both cases and I&apos;m ready to call the room.
            </span>
          </label>
          <PrimaryButton disabled={!hasRead} onClick={() => setStep("predict")}>
            Continue
          </PrimaryButton>
        </section>
      )}

      {step === "predict" && (
        <section className="animate-rise space-y-6">
          <Heading
            title="Call the room"
            sub="Which way will the crowd rule today? Nail it for bonus points."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <PredictButton
              side="pro"
              label="The room rules For"
              active={prediction === "pro"}
              onClick={() => setPrediction("pro")}
            />
            <PredictButton
              side="con"
              label="The room rules Against"
              active={prediction === "con"}
              onClick={() => setPrediction("con")}
            />
          </div>
          <p className="text-center font-mono text-xs text-muted">
            Correct call +{POINTS.predictionCorrect} · taking part +
            {POINTS.predictionWrong}
          </p>
          <PrimaryButton disabled={!prediction} onClick={() => setStep("vote")}>
            Lock it in
          </PrimaryButton>
        </section>
      )}

      {step === "vote" && (
        <section className="animate-rise space-y-6">
          <Heading
            title="Your verdict"
            sub="Forget where you started — which side actually made the better case?"
          />
          <StancePicker selected={null} onSelect={castVote} />
        </section>
      )}

      {step === "share" && result && (
        <section className="animate-rise space-y-5">
          <div className="paper-card px-6 py-7 text-center">
            <p className="label text-muted">The verdict is in</p>
            <p className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground">
              {buildScoreline(result)}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
              {changedMind(result) ? "You crossed the floor" : "You held your ground"}
            </p>

            <hr className="rule my-5" />

            <div className="flex items-center justify-center gap-6">
              <div>
                <p className="font-display text-2xl font-semibold text-accent">
                  +{result.pointsEarned}
                </p>
                <p className="label text-muted">points</p>
              </div>
              {streak > 0 && (
                <div>
                  <p className="font-display text-2xl font-semibold text-foreground">
                    {streak}
                  </p>
                  <p className="label text-muted">day streak</p>
                </div>
              )}
            </div>

            {result.predictionCorrect !== null && (
              <p className="mt-5 border-t border-border pt-4 text-sm text-muted">
                You called the room{" "}
                <strong className="text-foreground">
                  {result.prediction === "pro" ? "For" : "Against"}
                </strong>{" "}
                — {result.predictionCorrect ? "spot on." : "not this time."}
              </p>
            )}
          </div>

          {stats && (
            <CommunityStats
              stats={stats}
              mode="convinced"
              highlight={prediction}
            />
          )}

          {personality && personality.sampleSize >= 3 && (
            <div className="paper-card px-6 py-5">
              <p className="label text-muted">Your debating character</p>
              <p className="mt-2 font-display text-2xl font-semibold text-foreground">
                {personality.archetype}
              </p>
              <p className="mt-1 text-sm text-muted">{personality.tagline}</p>
            </div>
          )}

          <div className="paper-card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={buildShareImageUrl(result, streak)}
              alt="Your shareable scorecard"
              className="block w-full"
              width={1200}
              height={630}
            />
            <a
              href={buildShareImageUrl(result, streak)}
              target="_blank"
              rel="noopener noreferrer"
              className="block border-t border-border px-5 py-3 text-center label text-accent transition hover:bg-accent/5"
            >
              Open share image →
            </a>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryButton onClick={copyShare}>
              {copied ? "Ready to paste" : "Share / copy scorecard"}
            </PrimaryButton>
            <Link
              href="/takes"
              className="flex-1 border border-foreground px-6 py-4 text-center font-display text-lg font-semibold text-foreground transition hover:bg-foreground hover:text-background"
            >
              Run the Hot Takes
            </Link>
          </div>

          <DebateComments
            debateId={debate.id}
            defaultSide={result.convincedBy}
          />

          <p className="text-center font-mono text-xs text-muted">
            New motion every day. Come back tomorrow to keep the streak.
          </p>
        </section>
      )}
    </div>
  );
}

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="text-center">
      <h2 className="font-display text-2xl font-semibold text-foreground">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted">{sub}</p>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 bg-foreground px-6 py-4 font-display text-lg font-semibold text-background transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function PredictButton({
  side,
  label,
  active,
  onClick,
}: {
  side: "pro" | "con";
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const tone =
    side === "pro"
      ? active
        ? "border-pro bg-pro/10"
        : "border-border hover:border-pro"
      : active
        ? "border-con bg-con/10"
        : "border-border hover:border-con";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-5 py-6 text-left font-display text-xl font-semibold text-foreground transition ${tone}`}
    >
      {label}
    </button>
  );
}
