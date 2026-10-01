import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const nav = [
  { href: "/debate", label: "Today" },
  { href: "/takes", label: "Hot Takes" },
  { href: "/archive", label: "Archive" },
  { href: "/topics", label: "Topics" },
  { href: "/stats", label: "Record" },
  { href: "/leaderboard", label: "Standings" },
  { href: "/how-it-works", label: "Rules" },
  { href: "/pricing", label: "Plus" },
];

export async function SiteHeader() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b-[3px] border-double border-foreground bg-background/90 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="group">
            <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Today&apos;s Debate
            </span>
          </Link>
          <Link
            href="/account"
            className="label text-muted transition-colors hover:text-accent"
          >
            {user ? "Account" : "Sign in"}
          </Link>
        </div>
        <nav className="-mt-1 flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-2 pb-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label text-muted transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <hr className="rule-double mb-4" />
        <p className="font-display text-lg text-foreground">
          One motion. Both sides. Daily.
        </p>
        <p className="mt-1 text-sm text-muted">
          A paper for people who&apos;d rather argue well than argue loud.
        </p>
        <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {[
            ["/topics", "Topics"],
            ["/pricing", "Pricing"],
            ["/sponsor", "Sponsor"],
            ["/classrooms", "Classrooms"],
            ["/publish", "Publish"],
            ["/how-it-works", "Rules"],
            ["/suggest", "Suggest"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="label text-muted hover:text-accent"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
