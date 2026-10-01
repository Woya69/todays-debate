"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = getSupabaseBrowserClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) setError(error.message);
      else setSentTo(email);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else router.refresh();
    }
    setBusy(false);
  }

  async function handleGoogle() {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  }

  if (sentTo) {
    return (
      <div className="paper-card animate-rise px-6 py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent text-2xl text-accent">
          ✉
        </div>
        <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">
          Check your email
        </h2>
        <p className="mt-2 text-sm text-muted">
          We sent a confirmation link to
        </p>
        <p className="mt-1 font-display text-lg font-semibold text-foreground">
          {sentTo}
        </p>
        <p className="mt-4 text-sm text-muted">
          Click the link in that email to confirm your account, then come back
          and sign in. It can take a minute to arrive — check spam too.
        </p>
        <button
          type="button"
          onClick={() => {
            setSentTo(null);
            setMode("signin");
            setPassword("");
          }}
          className="mt-6 w-full border border-foreground px-6 py-3 font-display text-lg font-semibold text-foreground transition hover:bg-foreground hover:text-background"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="paper-card px-6 py-7">
      <div className="mb-5 flex gap-2">
        <Tab active={mode === "signin"} onClick={() => setMode("signin")}>
          Sign in
        </Tab>
        <Tab active={mode === "signup"} onClick={() => setMode("signup")}>
          Create account
        </Tab>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <span className="label text-muted">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 min-h-12 w-full border border-border bg-transparent px-3 py-3 text-base text-foreground outline-none focus:border-accent"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="label text-muted">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 min-h-12 w-full border border-border bg-transparent px-3 py-3 text-base text-foreground outline-none focus:border-accent"
            placeholder="At least 6 characters"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="min-h-12 w-full bg-foreground px-6 py-3 font-display text-lg font-semibold text-background transition hover:bg-accent disabled:opacity-40"
        >
          {busy
            ? "Working…"
            : mode === "signup"
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <hr className="flex-1 border-border" />
        <span className="label text-muted">or</span>
        <hr className="flex-1 border-border" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="w-full min-h-12 border border-foreground px-6 py-3 font-display text-lg font-semibold text-foreground transition hover:bg-foreground hover:text-background"
      >
        Continue with Google
      </button>

      {error && (
        <p className="mt-4 border border-con bg-con/10 px-3 py-2 text-sm text-con">
          {error}
        </p>
      )}

      <p className="mt-4 font-mono text-xs text-muted">
        Voting stays anonymous — an account just saves your points, streak, and
        spot on the standings across devices.
      </p>
    </div>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-12 flex-1 items-center justify-center border px-4 py-2 font-display text-base font-semibold transition ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted hover:border-foreground"
      }`}
    >
      {children}
    </button>
  );
}
