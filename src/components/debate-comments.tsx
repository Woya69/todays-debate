"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DebateComment, Stance } from "@/types/debate";
import { fetchComments, postComment } from "@/lib/comments";

const MAX = 280;

function sideLabel(side: Stance): string {
  if (side === "pro") return "FOR";
  if (side === "con") return "AGAINST";
  return "WATCH";
}

export function DebateComments({
  debateId,
  defaultSide,
}: {
  debateId: string;
  defaultSide: Stance;
}) {
  const [comments, setComments] = useState<DebateComment[] | null>(null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchComments(debateId)
      .then((data) => active && setComments(data))
      .catch(() => active && setComments([]));
    return () => {
      active = false;
    };
  }, [debateId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await postComment({ debateId, body, side: defaultSide });
    setBusy(false);
    if (result.ok) {
      setComments((prev) => [result.comment, ...(prev ?? [])]);
      setBody("");
    } else {
      setError(result.error);
    }
  }

  const remaining = MAX - body.length;

  return (
    <section className="arena-card px-5 py-5 sm:px-6">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-xl font-extrabold text-foreground">
          Crowd
        </h3>
        <span className="label text-muted">
          {comments ? comments.length : "…"}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        One sharp line from your corner. Argue the motion — not the person.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <textarea
          rows={2}
          maxLength={MAX}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Make the case the stage missed."
          className="w-full resize-none rounded-2xl border border-border bg-background/60 px-3 py-2 text-foreground outline-none focus:border-pro"
        />
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted">
            Posting as {sideLabel(defaultSide)} · {remaining}
          </span>
          <button
            type="submit"
            disabled={busy || body.trim().length < 3}
            className="btn-primary !min-h-10 !px-5 !py-2 !text-base"
          >
            {busy ? "Posting…" : "Post"}
          </button>
        </div>
        {error && (
          <p className="rounded-xl border border-con/40 bg-con/10 px-3 py-2 text-sm text-con">
            {error}{" "}
            {error.toLowerCase().includes("sign in") && (
              <Link href="/account" className="underline">
                Sign in
              </Link>
            )}
          </p>
        )}
      </form>

      <div className="mt-5 space-y-3">
        {comments && comments.length === 0 && (
          <p className="text-sm text-muted">
            No crowd lines yet. Be first.
          </p>
        )}
        {comments?.map((c) => (
          <div key={c.id} className="border-t border-border pt-3">
            <p className="text-sm leading-6 text-foreground">{c.body}</p>
            <p className="mt-1 label text-muted">
              {c.authorName} · {sideLabel(c.side)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
