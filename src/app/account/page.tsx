import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AuthForm } from "@/components/auth-form";
import { SignOutButton } from "@/components/sign-out-button";
import { MyTakesList, type MyTake } from "@/components/my-takes-list";
import { ReminderForm } from "@/components/reminder-form";

export const metadata: Metadata = {
  title: "Account — Today's Debate",
  description: "Sign in to save your points and streak.",
};

export default async function AccountPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { display_name: string | null; points: number } | null = null;
  let myTakes: MyTake[] = [];
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, points")
      .eq("id", user.id)
      .single();
    profile = data;

    const { data: takeRows } = await supabase
      .from("community_takes")
      .select("id, text, topic, status, created_at")
      .eq("author_user_id", user.id)
      .order("created_at", { ascending: false });

    const rows = (takeRows ?? []) as Array<{
      id: string;
      text: string;
      topic: string;
      status: string;
    }>;

    const statsById: Record<string, { agree_percent: number; total: number }> =
      {};
    if (rows.length > 0) {
      const { data: statRows } = await supabase.rpc("get_hot_take_stats", {
        p_take_ids: rows.map((r) => r.id),
      });
      for (const s of (statRows ?? []) as Array<{
        take_id: string;
        agree_percent: number;
        total: number;
      }>) {
        statsById[s.take_id] = { agree_percent: s.agree_percent, total: s.total };
      }
    }

    myTakes = rows.map((r) => ({
      id: r.id,
      text: r.text,
      topic: r.topic,
      status: r.status,
      agreePercent: statsById[r.id]?.agree_percent ?? 0,
      total: Number(statsById[r.id]?.total ?? 0),
    }));
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <header className="mb-8 text-center">
        <p className="label text-accent">Your Desk</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
          {user ? "Account" : "Sign in"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {user
            ? "Your progress is saved to this account."
            : "Optional — vote anonymously anytime, or sign in to keep your record."}
        </p>
      </header>

      {user ? (
        <div className="paper-card space-y-5 px-6 py-7">
          <div>
            <p className="label text-muted">Signed in as</p>
            <p className="mt-1 font-display text-xl font-semibold text-foreground">
              {profile?.display_name || user.email}
            </p>
            <p className="mt-1 text-sm text-muted">{user.email}</p>
          </div>
          <div className="border-t border-border pt-4">
            <p className="label text-muted">Saved points</p>
            <p className="mt-1 font-display text-3xl font-semibold text-accent">
              {(profile?.points ?? 0).toLocaleString()}
            </p>
          </div>
          <SignOutButton />
        </div>
      ) : (
        <AuthForm />
      )}

      {user && (
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">
              My takes
            </h2>
            <Link
              href="/takes/new"
              className="label text-accent transition-colors hover:text-foreground"
            >
              + New take
            </Link>
          </div>

          {myTakes.length === 0 ? (
            <div className="paper-card px-6 py-7 text-center">
              <p className="text-sm text-muted">
                You haven&apos;t published a take yet.
              </p>
              <Link
                href="/takes/new"
                className="mt-4 inline-block border border-foreground px-5 py-2 font-display text-base font-semibold text-foreground transition hover:bg-foreground hover:text-background"
              >
                Write your first take
              </Link>
            </div>
          ) : (
            <MyTakesList takes={myTakes} />
          )}
        </section>
      )}

      <section className="mt-8 space-y-4">
        <ReminderForm />
        <Link
          href="/suggest"
          className="paper-card block px-6 py-5 transition hover:border-foreground"
        >
          <p className="label text-accent">The Editorial Desk</p>
          <p className="mt-1 font-display text-lg font-semibold text-foreground">
            Suggest a motion →
          </p>
          <p className="mt-1 text-sm text-muted">
            Pitch a debate. The best reader motions run as a debate of the day.
          </p>
        </Link>
      </section>
    </div>
  );
}
