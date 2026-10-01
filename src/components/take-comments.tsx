"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { TakeComment } from "@/types/debate";
import {
  deleteTakeComment,
  fetchTakeComments,
  postTakeComment,
} from "@/lib/take-comments";

const MAX = 280;

export function TakeComments({ takeId }: { takeId: string }) {
  const [comments, setComments] = useState<TakeComment[] | null>(null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchTakeComments(takeId)
      .then((data) => active && setComments(data))
      .catch(() => active && setComments([]));
    return () => {
      active = false;
    };
  }, [takeId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await postTakeComment({ takeId, body });
    setBusy(false);
    if (result.ok) {
      setComments((prev) => [result.comment, ...(prev ?? [])]);
      setBody("");
    } else {
      setError(result.error);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this comment?")) return;
    const prev = comments;
    setComments((cs) => cs?.filter((c) => c.id !== id) ?? null);
    const result = await deleteTakeComment(id);
    if (!result.ok) {
      setComments(prev ?? null);
      setError(result.error ?? "Could not delete the comment.");
    }
  }

  const remaining = MAX - body.length;

  return (
    <section className="paper-card px-6 py-5">
      <div className="flex items-baseline justify-between border-b border-border pb-2">
        <h3 className="label text-foreground">Discussion</h3>
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
          placeholder="Add to the conversation…"
          className="w-full resize-none border border-border bg-transparent px-3 py-2 text-foreground outline-none focus:border-accent"
        />
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted">{remaining}</span>
          <button
            type="submit"
            disabled={busy || body.trim().length < 2}
            className="bg-foreground px-5 py-2 font-display text-base font-semibold text-background transition hover:bg-accent disabled:opacity-40"
          >
            {busy ? "Posting…" : "Comment"}
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
            No comments yet. Start the conversation.
          </p>
        )}
        {comments?.map((c) => (
          <div key={c.id} className="border-t border-border pt-3">
            <p className="text-sm leading-6 text-foreground">{c.body}</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="label text-muted">{c.authorName}</p>
              {c.mine && (
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="font-mono text-xs text-muted underline-offset-2 transition hover:text-con hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
