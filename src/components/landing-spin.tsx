"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LANDING_HOOKS, type LandingHook } from "@/data/landing-hooks";

type Choice = "yes" | "no";

const SPIN_MS = 2800;
const HOLD_MS = 900;
const EXIT_MS = 720;
const FADE_MS = 280;

export function LandingSpin() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [picked, setPicked] = useState<Choice | null>(null);
  const [exiting, setExiting] = useState(false);
  const locked = useRef(false);
  const indexRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const fadeRef = useRef<number | null>(null);

  const topic = LANDING_HOOKS[index];

  const clearTimers = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (fadeRef.current != null) {
      window.clearTimeout(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  const goTo = useCallback(
    (next: number, animate: boolean) => {
      const bounded =
        ((next % LANDING_HOOKS.length) + LANDING_HOOKS.length) %
        LANDING_HOOKS.length;
      if (bounded === indexRef.current && animate) return;

      if (!animate) {
        indexRef.current = bounded;
        setIndex(bounded);
        setVisible(true);
        return;
      }

      setVisible(false);
      fadeRef.current = window.setTimeout(() => {
        indexRef.current = bounded;
        setIndex(bounded);
        setVisible(true);
      }, FADE_MS);
    },
    [],
  );

  const scheduleNext = useCallback(() => {
    clearTimers();
    timerRef.current = window.setTimeout(() => {
      goTo(indexRef.current + 1, true);
      scheduleNext();
    }, SPIN_MS + HOLD_MS);
  }, [clearTimers, goTo]);

  useEffect(() => {
    if (picked) {
      clearTimers();
      return;
    }
    scheduleNext();
    return clearTimers;
  }, [picked, scheduleNext, clearTimers]);

  function jumpTo(i: number) {
    if (picked || locked.current) return;
    goTo(i, true);
    scheduleNext();
  }

  function choose(choice: Choice, hook: LandingHook) {
    if (locked.current) return;
    locked.current = true;
    clearTimers();
    setPicked(choice);
    setExiting(true);

    const side = choice === "yes" ? "yes" : "no";
    // Live room for THIS motion — challenge create with stance, not a random tip fight.
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
          key={topic.id}
          className={`font-display text-[clamp(2.1rem,8vw,4.75rem)] font-semibold leading-[1.05] tracking-tight text-foreground transition-all duration-300 ${
            visible && !exiting
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
        >
          {topic.hook}
        </p>

        <div
          className="mt-5 flex items-center justify-center gap-1.5"
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
                className={`touch-target inline-flex items-center justify-center rounded-full p-2 transition ${
                  picked ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }`}
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    active ? "w-8 bg-pro" : "w-3 bg-border hover:bg-muted"
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
