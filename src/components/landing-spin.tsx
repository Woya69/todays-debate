"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LANDING_HOOKS, type LandingHook } from "@/data/landing-hooks";

type Choice = "yes" | "no";

const SPIN_MS = 3200;
const EXIT_MS = 720;

export function LandingSpin() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Choice | null>(null);
  const [exiting, setExiting] = useState(false);
  const [tick, setTick] = useState(0);
  const locked = useRef(false);
  const pauseUntil = useRef(0);

  const topic = LANDING_HOOKS[index];

  useEffect(() => {
    if (picked) return;

    const id = window.setInterval(() => {
      if (Date.now() < pauseUntil.current) return;
      setIndex((i) => (i + 1) % LANDING_HOOKS.length);
      setTick((t) => t + 1);
    }, SPIN_MS);

    return () => window.clearInterval(id);
  }, [picked]);

  function jumpTo(i: number) {
    if (picked || locked.current || i === index) return;
    pauseUntil.current = Date.now() + SPIN_MS;
    setIndex(i);
    setTick((t) => t + 1);
  }

  function choose(choice: Choice, hook: LandingHook) {
    if (locked.current) return;
    locked.current = true;
    setPicked(choice);
    setExiting(true);

    const side = choice === "yes" ? "yes" : "no";
    const href = `/challenge?motion=${encodeURIComponent(hook.hook)}&slug=${encodeURIComponent(hook.debateId)}&side=${side}`;

    window.setTimeout(() => {
      router.push(href);
    }, EXIT_MS);
  }

  return (
    <div
      className={`landing-spin relative flex min-h-[calc(100dvh-7.5rem)] flex-col items-center justify-center px-1 py-8 text-center sm:min-h-[calc(100dvh-6rem)] ${
        exiting ? "landing-spin--exit" : ""
      } ${picked === "yes" ? "landing-spin--yes" : ""} ${
        picked === "no" ? "landing-spin--no" : ""
      }`}
    >
      <p className="label landing-spin__pulse text-muted">Yes or no. No essay.</p>

      <div className="mt-8 flex w-full max-w-3xl flex-col items-center">
        <p
          key={`${topic.id}-${tick}`}
          className="landing-topic font-display text-[clamp(2.1rem,8vw,4.75rem)] font-semibold leading-[1.05] tracking-tight text-foreground"
        >
          {topic.hook}
        </p>

        <div
          className="mt-5 flex items-center justify-center gap-1"
          role="tablist"
          aria-label="Topics by popularity"
        >
          {LANDING_HOOKS.map((h, i) => {
            const active = i === index;
            return (
              <button
                key={h.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Topic ${i + 1}: ${h.hook}`}
                disabled={!!picked}
                onClick={() => jumpTo(i)}
                className="group inline-flex h-11 min-w-11 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-pro/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    active
                      ? "w-8 bg-pro"
                      : "w-3 bg-border group-hover:bg-muted"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-12 grid w-full max-w-md grid-cols-2 gap-3 sm:mt-14 sm:gap-4">
        <button
          type="button"
          disabled={!!picked}
          onClick={() => choose("yes", topic)}
          className="landing-choice landing-choice--yes touch-target"
        >
          YES
        </button>
        <button
          type="button"
          disabled={!!picked}
          onClick={() => choose("no", topic)}
          className="landing-choice landing-choice--no touch-target"
        >
          NO
        </button>
      </div>

      <p className="mt-8 max-w-xs text-sm text-muted">
        {picked
          ? "Opening a live challenge on this…"
          : "Hottest first. Tap a dot to jump. Yes/No starts a fight."}
      </p>
    </div>
  );
}
