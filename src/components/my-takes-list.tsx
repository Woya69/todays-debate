"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCommunityTake, setTakeHidden } from "@/lib/community";

export interface MyTake {
  id: string;
  text: string;
  topic: string;
  status: string;
  agreePercent: number;
  total: number;
}

export function MyTakesList({ takes }: { takes: MyTake[] }) {
  return (
    <div className="space-y-3">
      {takes.map((take) => (
        <MyTakeCard key={take.id} take={take} />
      ))}
    </div>
  );
}

function MyTakeCard({ take }: { take: MyTake }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState(false);
  const hidden = take.status === "hidden";
  const agree = Math.round(take.agreePercent);
  const disagree = 100 - agree;

  async function toggle() {
    setBusy(true);
    await setTakeHidden(take.id, !hidden);
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (
      !window.confirm(
        "Delete this take for good? Its votes and comments go with it.",
      )
    ) {
      return;
    }
    setRemoving(true);
    const result = await deleteCommunityTake(take.id);
    if (result.ok) {
      router.refresh();
    } else {
      setRemoving(false);
      window.alert(result.error ?? "Could not delete the take.");
    }
  }

  return (
    <div className={`paper-card px-5 py-4 ${hidden ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="label text-muted">{take.topic}</span>
        <div className="flex items-center gap-3">
          {hidden && <span className="label text-con">Hidden</span>}
          <span className="label text-muted">
            {take.total} {take.total === 1 ? "vote" : "votes"}
          </span>
        </div>
      </div>
      <p className="mt-2 font-display text-lg font-semibold leading-snug text-foreground">
        {take.text}
      </p>

      {take.total === 0 ? (
        <p className="mt-3 font-mono text-xs text-muted">
          No votes yet — share it around.
        </p>
      ) : (
        <div className="mt-3">
          <div className="flex h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full"
              style={{ width: `${agree}%`, backgroundColor: "var(--pro)" }}
            />
            <div
              className="h-full"
              style={{ width: `${disagree}%`, backgroundColor: "var(--con)" }}
            />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-xs">
            <span style={{ color: "var(--pro)" }}>{agree}% agree</span>
            <span style={{ color: "var(--con)" }}>{disagree}% disagree</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
        <Link
          href={`/takes/${take.id}`}
          className="font-mono text-xs text-accent underline-offset-2 transition hover:underline"
        >
          View &amp; discuss →
        </Link>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggle}
            disabled={busy || removing}
            className="font-mono text-xs text-muted underline-offset-2 transition hover:text-foreground hover:underline disabled:opacity-40"
          >
            {busy ? "Saving…" : hidden ? "Republish" : "Hide from deck"}
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={busy || removing}
            className="font-mono text-xs text-muted underline-offset-2 transition hover:text-con hover:underline disabled:opacity-40"
          >
            {removing ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
