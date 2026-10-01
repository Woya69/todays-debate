"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Corner } from "@/types/debate";
import type { TopicChatMessage } from "@/data/topic-chat-seeds";
import {
  loadTopicChat,
  sendTopicChat,
  subscribeTopicChat,
} from "@/lib/topic-chat";
import { absoluteUrl } from "@/lib/site";
import { copyLink } from "@/lib/share";
import { CrowdMeter } from "@/components/crowd-meter";

function roleBadge(role: TopicChatMessage["role"]) {
  if (role === "host")
    return { label: "Host", className: "bg-foreground text-background" };
  if (role === "debater")
    return { label: "Debater", className: "bg-pro/15 text-pro" };
  return null;
}

export function LiveTopicRoom({
  slug,
  motion,
  initialSide,
}: {
  slug: string;
  motion: string;
  initialSide: Corner;
}) {
  const [side, setSide] = useState<Corner>(initialSide);
  const [messages, setMessages] = useState<TopicChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [online, setOnline] = useState(12);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const onRemoteRef = useRef<(msg: TopicChatMessage) => void>(() => {});

  onRemoteRef.current = (msg: TopicChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      if (msg.mine) return prev;
      const twin = prev.find(
        (m) =>
          m.mine &&
          m.body === msg.body &&
          Math.abs(
            new Date(m.createdAt).getTime() - new Date(msg.createdAt).getTime(),
          ) < 4000,
      );
      if (twin) {
        return prev.map((m) =>
          m.id === twin.id ? { ...msg, mine: true } : m,
        );
      }
      return [...prev, msg];
    });
  };

  useEffect(() => {
    let active = true;
    void loadTopicChat(slug).then((msgs) => {
      if (active) setMessages(msgs);
    });
    const unsub = subscribeTopicChat(slug, (msg) => onRemoteRef.current(msg));
    setOnline(8 + Math.floor(Math.random() * 24));
    return () => {
      active = false;
      unsub();
    };
  }, [slug]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const proCount = messages.filter((m) => m.side === "pro").length;
  const conCount = messages.filter((m) => m.side === "con").length;
  const total = Math.max(1, proCount + conCount);
  const crowd = {
    proPercent: Math.round((100 * proCount) / total),
    conPercent: Math.round((100 * conCount) / total),
    totalCheers: total,
  };

  function onSend(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (body.length < 1) return;
    setDraft("");

    const result = sendTopicChat({
      debateSlug: slug,
      body,
      side,
      role: "crowd",
    });
    if (!result.ok) return;

    // Same-second paint — no waiting on network.
    setMessages((prev) =>
      prev.some((m) => m.id === result.message.id)
        ? prev
        : [...prev, result.message],
    );
    inputRef.current?.focus();
  }

  async function onShare() {
    const url = absoluteUrl(`/live/${slug}`);
    const ok = await copyLink(url);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 animate-rise">
      <header className="arena-panel px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label rounded-full bg-con/15 px-2.5 py-1 text-con">
            Live chat
          </span>
          <span className="label text-muted">{online} in the room</span>
          <span
            className={`label rounded-full px-2.5 py-1 ${
              side === "pro" ? "bg-pro/15 text-pro" : "bg-con/15 text-con"
            }`}
          >
            You: {side === "pro" ? "YES" : "NO"}
          </span>
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
          {motion}
        </h1>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onShare}
            className="btn-primary relative flex-1 overflow-hidden"
          >
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                copied ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              Copied
            </span>
            <span
              className={`flex items-center justify-center transition-all duration-300 ${
                copied ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              Share
            </span>
          </button>
          <Link
            href={`/challenge?motion=${encodeURIComponent(motion)}&slug=${encodeURIComponent(slug)}&side=${side === "pro" ? "yes" : "no"}`}
            className="btn-ghost flex-1 text-center"
          >
            Challenge someone
          </Link>
        </div>
      </header>

      <CrowdMeter crowd={crowd} />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSide("pro")}
          className={`flex-1 rounded-md border px-3 py-2 font-display text-lg font-semibold transition ${
            side === "pro"
              ? "border-pro bg-pro text-background"
              : "border-border bg-surface text-muted"
          }`}
        >
          YES
        </button>
        <button
          type="button"
          onClick={() => setSide("con")}
          className={`flex-1 rounded-md border px-3 py-2 font-display text-lg font-semibold transition ${
            side === "con"
              ? "border-con bg-con text-background"
              : "border-border bg-surface text-muted"
          }`}
        >
          NO
        </button>
      </div>

      <section className="arena-panel flex min-h-[28rem] flex-col overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <p className="label text-pro">Room chat</p>
          <p className="mt-1 text-sm text-muted">
            Host + debater lines stay highlighted. Send is instant.
          </p>
        </div>

        <div
          ref={listRef}
          className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
        >
          {messages.map((m) => {
            const badge = roleBadge(m.role);
            const highlighted = m.role === "host" || m.role === "debater";
            return (
              <div
                key={m.id}
                className={`rounded-md px-3 py-2.5 ${
                  highlighted
                    ? m.role === "host"
                      ? "border border-foreground/20 bg-foreground/[0.04]"
                      : m.side === "pro"
                        ? "border border-pro/35 bg-pro/8"
                        : "border border-con/35 bg-con/8"
                    : "bg-transparent"
                } ${m.mine ? "ring-1 ring-foreground/10" : ""}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`label ${
                      m.side === "pro" ? "text-pro" : "text-con"
                    }`}
                  >
                    {m.side === "pro" ? "YES" : "NO"}
                  </span>
                  {badge && (
                    <span
                      className={`label rounded-sm px-1.5 py-0.5 ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  )}
                  <span className="label text-muted">{m.authorName}</span>
                </div>
                <p className="mt-1.5 text-[0.98rem] leading-snug text-foreground">
                  {m.body}
                </p>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={onSend}
          className="flex gap-2 border-t border-border bg-surface-raised px-3 py-3"
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={280}
            placeholder={`Argue for ${side === "pro" ? "YES" : "NO"}…`}
            className="min-h-11 flex-1 rounded-md border border-border bg-background px-3 text-foreground outline-none focus:border-foreground"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={draft.trim().length < 1}
            className="btn-primary shrink-0 px-4"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
