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

export function DebateFlow({
  debate,
  hideTitle = false,
  initialStance,
}: {
  debate: DailyDebate;
  hideTitle?: boolean;
  initialStance?: Stance;
}) {
  const [step, setStep] = useState<DebateStep>(
    initialStance ? "read" : "stance",
  );
  const [stance, setStance] = useState<Stance | null>(initialStance ?? null);
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
    } else if (initialStance) {
      setStance(initialStance);
      setStep("read");
    }
    setStreak(getStreak());
  }, [debate.dateKey, debate.id, initialStance]);

  async function castVote(convincedBy: Stance) {
    if (!stance) return;

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
    await shareOrCopy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const challengeHref = `/challenge?motion=${encodeURIComponent(debate.resolution)}&slug=${encodeURIComponent(debate.id)}`;

  return (
    <div className="mx-auto w-full max-w-3xl">
      {!hideTitle && (
        <header className="mb-6 text-center">
          <p className="label text-pro">Main Event · No. {debate.debateNumber}</p>
          <h1 className="mx-auto mt-3 max-w-2xl font-display text-[1.65rem] font-extrabold leading-[1.1] text-foreground sm:text-[2.6rem]">
            {debate.resolution}
          </h1>
          <p className="mt-3 label text-muted">{debate.category}</p>
        </header>
      )}

      <div className="mb-6 flex items-center justify-center gap-1.5 sm:mb-8 sm:gap-2">
        {steps.map((s, i) => (
          <span
            key={s}
            className={`h-1.5 w-8 rounded-full sm:w-10 ${
              i <= stepIndex ? "bg-pro" : "bg-border"
            }`}
          />
        ))}
      </div>

      {step === "stance" && (
        <section className="animate-rise space-y-6">
          <Heading
            title="Pick a corner"
            sub="Gut call before the clash. You can flip later if the other side earns it."
          />
          <StancePicker
            selected={stance}
            onSelect={(s) => {
              setStance(s);
              setStep("read");
            }}
          />
          <Link href={challengeHref} className="btn-ghost mx-auto flex max-w-md">
            Or challenge a friend on this motion
          </Link>
        </section>
      )}

      {step === "read" && stance && (
        <section className="animate-rise space-y-5">
          {debate.context && (
            <div className="arena-card border-l-4 border-l-pro px-5 py-4">
              <p className="label text-pro">The brief</p>
              <p className="mt-2 text-sm leading-6 text-muted">{debate.context}</p>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <SideCard side="pro" title={debate.pro.title} argument={debate.pro.argument} />
            <SideCard side="con" title={debate.con.title} argument={debate.con.argument} />
          </div>

          <DebateComments debateId={debate.id} defaultSide={stance} />

          <label className="arena-card flex cursor-pointer items-start gap-3 px-5 py-4">
            <input
              type="checkbox"
              checked={hasRead}
              onChange={(e) => setHasRead(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--pro)]"
            />
            <span className="text-sm leading-6 text-muted">
              I&apos;ve weighed both corners and I&apos;m ready to call the crowd.
            </span>
          </label>
          <button
            type="button"
            disabled={!hasRead}
            onClick={() => setStep("predict")}
            className="btn-primary w-full"
          >
            Continue
          </button>
        </section>
      )}

      {step === "predict" && (
        <section className="animate-rise space-y-6">
          <Heading
            title="Call the crowd"
            sub="Which corner wins the room? Nail it for bonus points."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <PredictButton
              side="pro"
              label="Crowd rules FOR"
              active={prediction === "pro"}
              onClick={() => setPrediction("pro")}
            />
            <PredictButton
              side="con"
              label="Crowd rules AGAINST"
              active={prediction === "con"}
              onClick={() => setPrediction("con")}
            />
          </div>
          <p className="text-center font-mono text-xs text-muted">
            Correct call +{POINTS.predictionCorrect} · taking part +
            {POINTS.predictionWrong}
          </p>
          <button
            type="button"
            disabled={!prediction}
            onClick={() => setStep("vote")}
            className="btn-primary w-full"
          >
            Lock it in
          </button>
        </section>
      )}

      {step === "vote" && (
        <section className="animate-rise space-y-6">
          <Heading
            title="Your verdict"
            sub="Forget where you started — which corner actually made the better case?"
          />
          <StancePicker selected={null} onSelect={castVote} />
        </section>
      )}

      {step === "share" && result && (
        <section className="animate-rise space-y-5">
          <div className="arena-panel px-6 py-8 text-center">
            <p className="label text-muted">Verdict locked</p>
            <p className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {buildScoreline(result)}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
              {changedMind(result) ? "You crossed the floor" : "You held your corner"}
            </p>

            <div className="mt-6 flex items-center justify-center gap-8">
              <div>
                <p className="font-display text-3xl font-extrabold text-pro">
                  +{result.pointsEarned}
                </p>
                <p className="label text-muted">points</p>
              </div>
              {streak > 0 && (
                <div>
                  <p className="font-display text-3xl font-extrabold text-foreground">
                    {streak}
                  </p>
                  <p className="label text-muted">day streak</p>
                </div>
              )}
            </div>

            {result.predictionCorrect !== null && (
              <p className="mt-5 border-t border-border pt-4 text-sm text-muted">
                You called the crowd{" "}
                <strong className="text-foreground">
                  {result.prediction === "pro" ? "FOR" : "AGAINST"}
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
            <div className="arena-card px-6 py-5">
              <p className="label text-muted">Your debating character</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-foreground">
                {personality.archetype}
              </p>
              <p className="mt-1 text-sm text-muted">{personality.tagline}</p>
            </div>
          )}

          <div className="arena-card overflow-hidden">
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
              className="block border-t border-border px-5 py-3 text-center label text-pro transition hover:bg-pro/5"
            >
              Open share image →
            </a>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={copyShare} className="btn-primary flex-1">
              {copied ? "Ready to paste" : "Share scorecard"}
            </button>
            <Link href={challengeHref} className="btn-ghost flex-1">
              Challenge a friend
            </Link>
          </div>

          <DebateComments
            debateId={debate.id}
            defaultSide={result.convincedBy}
          />

          <p className="text-center font-mono text-xs text-muted">
            New main event every day. Challenges run whenever you drop a link.
          </p>
        </section>
      )}
    </div>
  );
}

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="text-center">
      <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted">{sub}</p>
    </div>
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
        ? "corner-pro bg-pro/10"
        : "border-border hover:border-pro"
      : active
        ? "corner-con bg-con/10"
        : "border-border hover:border-con";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-14 rounded-2xl border px-4 py-5 text-left font-display text-lg font-extrabold text-foreground transition sm:px-5 sm:py-6 sm:text-xl ${tone}`}
    >
      {label}
    </button>
  );
}
