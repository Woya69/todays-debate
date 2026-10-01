"use client";

import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="border border-foreground px-6 py-3 font-display text-lg font-semibold text-foreground transition hover:bg-foreground hover:text-background"
    >
      Sign out
    </button>
  );
}
