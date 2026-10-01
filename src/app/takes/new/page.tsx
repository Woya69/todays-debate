import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { SubmitTakeForm } from "@/components/submit-take-form";

export const metadata: Metadata = {
  title: "Write a take — Today's Debate",
  description: "Publish your own hot take for the crowd to weigh in on.",
};

export default async function NewTakePage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto w-full max-w-md">
      <header className="mb-8 text-center">
        <p className="label text-accent">Rapid Fire</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
          Write a Take
        </h1>
        <p className="mt-2 text-sm text-muted">
          Drop a spicy one-liner. The crowd swipes, you watch the split.
        </p>
      </header>

      {user ? (
        <SubmitTakeForm />
      ) : (
        <div className="paper-card px-6 py-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Sign in to publish
          </h2>
          <p className="mt-2 text-sm text-muted">
            Takes are tied to your account so you can track how the crowd
            responds. Voting stays anonymous.
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
