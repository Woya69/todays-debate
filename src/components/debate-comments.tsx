"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DebateComment, Stance } from "@/types/debate";
import { fetchComments, postComment } from "@/lib/comments";

const MAX = 280;

function sideLabel(side: Stance): string {
  if (side === "pro") return "For";
  if (side === "con") return "Against";
  return "Undecided";
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
    <section className="paper-card px-6 py-5">
      <div className="flex items-baseline justify-between border-b border-border pb-2">
        <h3 className="label text-foreground">Reader rebuttals</h3>
        <span className="label text-muted">
          {comments ? comments.length : "…"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <textarea
          rows={2}
          maxLength={MAX}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="One sharp line. Make the case the article missed."
          className="w-full resize-none border border-border bg-transparent px-3 py-2 text-foreground outline-none focus:border-accent"
        />
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted">
            Posting as {sideLabel(defaultSide)} · {remaining}
          </span>
          <button
            type="submit"
            disabled={busy || body.trim().length < 3}
            className="bg-foreground px-5 py-2 font-display text-base font-semibold text-background transition hover:bg-accent disabled:opacity-40"
          >
            {busy ? "Posting…" : "Post"}
          </button>
        </div>
        {error && (
          <p className="border border-con bg-con/10 px-3 py-2 text-sm text-con">
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
            No rebuttals yet. Be the first to weigh in.
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
