import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { SuggestForm } from "@/components/suggest-form";

export const metadata: Metadata = {
  title: "Suggest a motion — Today's Debate",
  description: "Pitch a debate for a future day.",
};

export default async function SuggestPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto w-full max-w-md">
      <header className="mb-8 text-center">
        <p className="label text-accent">The Editorial Desk</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
          Suggest a Motion
        </h1>
        <p className="mt-2 text-sm text-muted">
          The best reader motions become a debate of the day.
        </p>
      </header>

      {user ? (
        <SuggestForm />
      ) : (
        <div className="paper-card px-6 py-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Sign in to suggest
          </h2>
          <p className="mt-2 text-sm text-muted">
            Submissions are tied to your account so we can credit you if it runs.
          </p>
          <Link
            href="/account"
            className="mt-6 inline-block w-full bg-foreground px-6 py-3 font-display text-lg font-semibold text-background transition hover:bg-accent"
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}
