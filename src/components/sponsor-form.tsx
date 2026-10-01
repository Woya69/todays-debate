"use client";

import { useState } from "react";

export function SponsorForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = [
      `Brand: ${data.get("brand")}`,
      `Email: ${data.get("email")}`,
      `Budget: ${data.get("budget")}`,
      `Notes: ${data.get("notes")}`,
    ].join("\n");
    const mailto = `mailto:sponsors@todaysdebate.app?subject=${encodeURIComponent(
      "Sponsored debate day inquiry",
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
  }

  if (sent) {
    return (
      <p className="paper-card px-5 py-6 text-muted">
        Opening your mail client — if nothing appears, email{" "}
        <span className="text-foreground">sponsors@todaysdebate.app</span>.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="paper-card space-y-4 px-5 py-6">
      <label className="block">
        <span className="label text-muted">Brand</span>
        <input
          name="brand"
          required
          className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-foreground"
        />
      </label>
      <label className="block">
        <span className="label text-muted">Work email</span>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-foreground"
        />
      </label>
      <label className="block">
        <span className="label text-muted">Approx. budget</span>
        <select
          name="budget"
          className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-foreground"
          defaultValue="explore"
        >
          <option value="explore">Still exploring</option>
          <option value="2-5k">$2–5k / day</option>
          <option value="5-15k">$5–15k / day</option>
          <option value="15k+">$15k+ / day</option>
        </select>
      </label>
      <label className="block">
        <span className="label text-muted">What should the day be about?</span>
        <textarea
          name="notes"
          rows={4}
          className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-foreground"
        />
      </label>
      <button
        type="submit"
        className="w-full bg-foreground px-5 py-3 font-display text-lg font-semibold text-background"
      >
        Send inquiry
      </button>
    </form>
  );
}
