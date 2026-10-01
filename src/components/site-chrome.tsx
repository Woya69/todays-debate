import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const nav = [
  { href: "/debate", label: "Today" },
  { href: "/takes", label: "Takes" },
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
    <header className="sticky top-0 z-40 border-b-[3px] border-double border-foreground bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 py-3">
          <Link href="/" className="group min-w-0 shrink">
            <span className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Today&apos;s Debate
            </span>
          </Link>
          <Link
            href="/account"
            className="label shrink-0 touch-target inline-flex items-center text-muted transition-colors hover:text-accent"
          >
            {user ? "Account" : "Sign in"}
          </Link>
        </div>
        <nav
          className="-mx-4 flex gap-1 overflow-x-auto border-t border-border px-4 pb-2 pt-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:gap-x-5 sm:gap-y-1 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label shrink-0 touch-target inline-flex items-center whitespace-nowrap px-2 text-muted transition-colors hover:text-accent sm:px-0"
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
    <footer className="mt-auto border-t border-border py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <hr className="rule-double mb-4" />
        <p className="font-display text-lg text-foreground">
          One motion. Both sides. Daily.
        </p>
        <p className="mt-1 text-sm text-muted">
          A paper for people who&apos;d rather argue well than argue loud.
        </p>
        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
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
              className="label touch-target inline-flex items-center text-muted hover:text-accent"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
