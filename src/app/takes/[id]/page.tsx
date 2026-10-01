import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { TakeComments } from "@/components/take-comments";

export const metadata: Metadata = {
  title: "Take — Today's Debate",
  description: "A community hot take, open for discussion.",
};

interface TakeRow {
  id: string;
  text: string;
  topic: string;
  status: string;
  author_user_id: string;
}

export default async function TakeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();

  const { data } = await supabase
    .from("community_takes")
    .select("id, text, topic, status, author_user_id")
    .eq("id", id)
    .maybeSingle();

  const take = data as TakeRow | null;
  if (!take) notFound();

  let agree = 50;
  let total = 0;
  const { data: statRows } = await supabase.rpc("get_hot_take_stats", {
    p_take_ids: [take.id],
  });
  const stat = ((statRows ?? []) as Array<{
    take_id: string;
    agree_percent: number;
    total: number;
  }>)[0];
  if (stat && Number(stat.total) > 0) {
    agree = stat.agree_percent;
    total = Number(stat.total);
  }
  const disagree = 100 - agree;

  return (
    <div className="mx-auto w-full max-w-md space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/takes" className="label text-accent hover:text-foreground">
          ← Hot Takes
        </Link>
      </div>

      <div className="paper-card px-6 py-6">
        <span className="label text-muted">{take.topic}</span>
        <p className="mt-2 font-display text-2xl font-semibold leading-snug text-foreground">
          {take.text}
        </p>

        {total === 0 ? (
          <p className="mt-4 font-mono text-xs text-muted">
            No votes yet — be the first to weigh in below.
          </p>
        ) : (
          <div className="mt-4">
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
              <span style={{ color: "var(--con)" }}>
                {total} {total === 1 ? "vote" : "votes"}
              </span>
            </div>
          </div>
        )}
      </div>

      <TakeComments takeId={take.id} />
    </div>
  );
}
