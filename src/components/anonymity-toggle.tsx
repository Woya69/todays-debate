"use client";

import { useEffect, useState } from "react";
import {
  getAppearAnonymous,
  setAppearAnonymous,
  anonymousLabel,
  getAnonTag,
} from "@/lib/identity";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function AnonymityToggle({
  currentDisplayName,
}: {
  currentDisplayName: string | null;
}) {
  const [anon, setAnon] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(currentDisplayName ?? "");

  useEffect(() => {
    setAnon(getAppearAnonymous());
  }, []);

  async function persist(nextAnon: boolean, nextName: string) {
    setBusy(true);
    setAppearAnonymous(nextAnon);
    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const display = nextAnon
          ? anonymousLabel(getAnonTag())
          : nextName.trim().slice(0, 40) || user.email?.split("@")[0] || "Debater";
        await supabase.from("profiles").upsert({
          id: user.id,
          display_name: display,
          updated_at: new Date().toISOString(),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    } catch {
      /* local preference still saved */
    }
    setBusy(false);
  }

  return (
    <div className="space-y-4 border-t border-border pt-4">
      <div>
        <p className="label text-muted">Public identity</p>
        <p className="mt-1 text-sm text-muted">
          Hide your real name on challenges, rounds, comments, and the
          standings. You&apos;ll show as {anonymousLabel(getAnonTag())}.
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={anon}
          disabled={busy}
          onChange={(e) => {
            const next = e.target.checked;
            setAnon(next);
            void persist(next, name);
          }}
          className="mt-1 h-4 w-4 accent-[var(--pro)]"
        />
        <span className="text-sm text-foreground">
          Appear as anonymous to the public
        </span>
      </label>

      {!anon && (
        <div>
          <label className="label text-muted" htmlFor="display-name">
            Display name
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="display-name"
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              className="min-w-0 flex-1 border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-pro"
              placeholder="How you want to show up"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => void persist(false, name)}
              className="btn-primary !min-h-10 !px-4 !py-2 !text-base"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {saved && <p className="font-mono text-xs text-pro">Saved.</p>}
    </div>
  );
}
