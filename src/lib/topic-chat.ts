"use client";

import type { Corner } from "@/types/debate";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getVoterId } from "@/lib/voter";
import { anonymousLabel, getAnonTag, resolvePublicName } from "@/lib/identity";
import {
  seedsForSlug,
  type ChatRole,
  type TopicChatMessage,
} from "@/data/topic-chat-seeds";
import { sanitizeText } from "@/lib/challenges";

const LOCAL_KEY = (slug: string) => `td_topic_chat_${slug}`;
const CHANNEL = (slug: string) => `td-topic-${slug}`;

interface Row {
  id: string;
  debate_slug: string;
  body: string;
  side: Corner;
  role: ChatRole;
  author_name: string;
  created_at: string;
}

function toMsg(row: Row): TopicChatMessage {
  return {
    id: row.id,
    debateSlug: row.debate_slug,
    body: row.body,
    side: row.side,
    role: row.role,
    authorName: row.author_name,
    createdAt: row.created_at,
  };
}

function readLocal(slug: string): TopicChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY(slug));
    if (!raw) return [];
    return JSON.parse(raw) as TopicChatMessage[];
  } catch {
    return [];
  }
}

function writeLocal(slug: string, messages: TopicChatMessage[]) {
  if (typeof window === "undefined") return;
  const trimmed = messages
    .filter((m) => !String(m.id).startsWith("seed-"))
    .slice(-120);
  localStorage.setItem(LOCAL_KEY(slug), JSON.stringify(trimmed));
}

function mergeMessages(
  slug: string,
  remote: TopicChatMessage[],
): TopicChatMessage[] {
  const local = readLocal(slug);
  const seeds = seedsForSlug(slug);
  const map = new Map<string, TopicChatMessage>();
  for (const m of [...seeds, ...remote, ...local]) {
    map.set(m.id, m);
  }
  return [...map.values()].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

function broadcast(slug: string, message: TopicChatMessage) {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
  const ch = new BroadcastChannel(CHANNEL(slug));
  ch.postMessage({ type: "msg", message });
  ch.close();
}

function syncAuthorLabel(): string {
  return anonymousLabel(getAnonTag());
}

/** Initial feed: seeds + local + remote if available. */
export async function loadTopicChat(
  slug: string,
): Promise<TopicChatMessage[]> {
  let remote: TopicChatMessage[] = [];
  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase
      .from("topic_messages")
      .select("id, debate_slug, body, side, role, author_name, created_at")
      .eq("debate_slug", slug)
      .order("created_at", { ascending: true })
      .limit(100);
    if (data) remote = (data as Row[]).map(toMsg);
  } catch {
    remote = [];
  }
  return mergeMessages(slug, remote);
}

/**
 * Optimistic send: message returned in the same tick (after sync sanitize).
 * Network persist is fire-and-forget.
 */
export function sendTopicChat(input: {
  debateSlug: string;
  body: string;
  side: Corner;
  role?: ChatRole;
}): { ok: true; message: TopicChatMessage } | { ok: false; error: string } {
  const body = sanitizeText(input.body, 280);
  if (body.length < 1) return { ok: false, error: "Type something." };

  const message: TopicChatMessage = {
    id: `local-${crypto.randomUUID()}`,
    debateSlug: input.debateSlug,
    body,
    side: input.side,
    role: input.role ?? "crowd",
    authorName: syncAuthorLabel(),
    createdAt: new Date().toISOString(),
    mine: true,
  };

  const existing = readLocal(input.debateSlug);
  writeLocal(input.debateSlug, [...existing, message]);
  broadcast(input.debateSlug, message);

  void persistRemote(message);

  return { ok: true, message };
}

async function persistRemote(message: TopicChatMessage) {
  try {
    const supabase = getSupabaseBrowserClient();
    const voterId = getVoterId();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let authorName = message.authorName;
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();
      authorName = resolvePublicName({
        displayName: profile?.display_name as string | null,
        email: user.email,
      });
    }

    await supabase.from("topic_messages").insert({
      debate_slug: message.debateSlug,
      body: message.body,
      side: message.side,
      role: message.role,
      author_name: authorName,
      voter_id: voterId,
      author_user_id: user?.id ?? null,
    });
  } catch {
    // local + broadcast still work
  }
}

/** Subscribe to instant fan-out (BroadcastChannel + Supabase realtime). */
export function subscribeTopicChat(
  slug: string,
  onMessage: (message: TopicChatMessage) => void,
): () => void {
  let bc: BroadcastChannel | null = null;
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    bc = new BroadcastChannel(CHANNEL(slug));
    bc.onmessage = (ev) => {
      const data = ev.data as { type?: string; message?: TopicChatMessage };
      if (data?.type === "msg" && data.message) onMessage(data.message);
    };
  }

  let channel: { unsubscribe: () => void } | null = null;
  try {
    const supabase = getSupabaseBrowserClient();
    const ch = supabase
      .channel(`topic-chat-${slug}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "topic_messages",
          filter: `debate_slug=eq.${slug}`,
        },
        (payload: { new: Row }) => {
          const row = payload.new;
          if (row?.id) onMessage(toMsg(row));
        },
      )
      .subscribe();
    channel = { unsubscribe: () => void supabase.removeChannel(ch) };
  } catch {
    channel = null;
  }

  return () => {
    bc?.close();
    channel?.unsubscribe();
  };
}
