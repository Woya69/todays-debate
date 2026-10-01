"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LANDING_HOOKS, type LandingHook } from "@/data/landing-hooks";

type Choice = "yes" | "no";

const SPIN_MS = 2800;
const HOLD_MS = 900;
const EXIT_MS = 720;

export function LandingSpin() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [picked, setPicked] = useState<Choice | null>(null);
  const [exiting, setExiting] = useState(false);
  const locked = useRef(false);
  const topic = LANDING_HOOKS[index % LANDING_HOOKS.length];

  useEffect(() => {
    if (picked) return;

    const cycle = () => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % LANDING_HOOKS.length);
        setVisible(true);
      }, 280);
    };

    const id = window.setInterval(cycle, SPIN_MS + HOLD_MS);
    return () => window.clearInterval(id);
  }, [picked]);

  function choose(choice: Choice, hook: LandingHook) {
    if (locked.current) return;
    locked.current = true;
    setPicked(choice);
    setExiting(true);

    const side = choice === "yes" ? "yes" : "no";
    const href = `/debate/${hook.debateId}?side=${side}`;

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

        <div className="mt-4 flex items-center gap-1.5" aria-hidden>
          {LANDING_HOOKS.map((h, i) => (
            <span
              key={h.id}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index % LANDING_HOOKS.length
                  ? "w-7 bg-pro"
                  : "w-3 bg-border"
              }`}
            />
          ))}
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
          ? "Jumping into the live room…"
          : "Tap once. Enter the live debate."}
      </p>
    </div>
  );
}
