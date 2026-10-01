import type { Metadata } from "next";
import { SponsorForm } from "@/components/sponsor-form";

export const metadata: Metadata = {
  title: "Sponsor a debate day",
  description:
    "Present a clearly labeled sponsored motion to a daily audience that actually reads both sides.",
};

export default function SponsorPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="label text-accent">Partnerships</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-foreground">
        Sponsor a day
      </h1>
      <p className="mt-4 text-lg text-muted">
        One motion. Both sides. Your brand as &ldquo;Presented by&rdquo; — never
        buried as native propaganda. Editorial independence stays ours; labeling
        stays honest.
      </p>

      <hr className="rule-double my-8" />

      <ul className="space-y-3 text-muted">
        <li>· Homepage + debate page Presenting credit</li>
        <li>· Category-aligned motion (or co-develop a brief)</li>
        <li>· Aggregate (anonymous) engagement report after the day</li>
        <li>· Optional newsletter mention to reminder subscribers</li>
      </ul>

      <div className="mt-10">
        <SponsorForm />
      </div>
    </div>
  );
}
