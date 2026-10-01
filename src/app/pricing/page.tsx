import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free daily debates for everyone. Plus unlocks the full archive extras, ad-free reading, and deeper stats.",
};

const PLUS_FEATURES = [
  "Ad-free reading across debates and archive",
  "Deep personality + streak compare with friends",
  "Early access to expert briefs on flagship motions",
  "Priority suggest queue for community motions",
];

export default function PricingPage() {
  const checkout =
    process.env.NEXT_PUBLIC_POLAR_CHECKOUT_URL ??
    process.env.NEXT_PUBLIC_PLUS_CHECKOUT_URL;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="label text-accent">Membership</p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-foreground">
        Pricing
      </h1>
      <p className="mt-4 text-lg text-muted">
        The daily motion stays free forever. Plus is for people who want the full
        paper without ads — and the ledger unlocked.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="paper-card px-6 py-6">
          <p className="label text-muted">Daily</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Free</h2>
          <p className="mt-2 text-sm text-muted">
            Today&apos;s motion, both sides, Hot Takes, and your personal record.
          </p>
          <Link
            href="/debate"
            className="mt-6 inline-block border border-foreground px-5 py-3 font-display font-semibold transition hover:bg-foreground hover:text-background"
          >
            Start today
          </Link>
        </div>

        <div className="paper-card border-foreground px-6 py-6">
          <p className="label text-accent">Plus</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">
            $9<span className="text-lg text-muted">/mo</span>
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {PLUS_FEATURES.map((f) => (
              <li key={f}>· {f}</li>
            ))}
          </ul>
          {checkout ? (
            <a
              href={checkout}
              className="mt-6 inline-block bg-foreground px-5 py-3 font-display font-semibold text-background transition hover:opacity-90"
            >
              Upgrade with Polar
            </a>
          ) : (
            <p className="mt-6 text-sm text-muted">
              Checkout link coming soon — set{" "}
              <code className="text-foreground">NEXT_PUBLIC_POLAR_CHECKOUT_URL</code>.
            </p>
          )}
        </div>
      </div>

      <p className="mt-8 text-sm text-muted">
        Schools and clubs: see{" "}
        <Link href="/classrooms" className="text-accent hover:text-foreground">
          Classrooms
        </Link>
        . Brands:{" "}
        <Link href="/sponsor" className="text-accent hover:text-foreground">
          Sponsor a day
        </Link>
        .
      </p>
    </div>
  );
}
