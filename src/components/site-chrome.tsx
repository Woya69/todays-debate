import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const nav = [
  { href: "/debate", label: "Today" },
  { href: "/challenge", label: "Challenge" },
  { href: "/watch", label: "Watch" },
  { href: "/stats", label: "Record" },
  { href: "/leaderboard", label: "Standings" },
];

export async function SiteHeader() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="group min-w-0 shrink">
          <span className="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            Today&apos;s{" "}
            <span className="bg-gradient-to-r from-pro to-con bg-clip-text text-transparent">
              Debate
            </span>
          </span>
        </Link>
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label touch-target inline-flex items-center rounded-full px-3 text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/challenge"
            className="hidden rounded-full bg-foreground px-3.5 py-2 font-display text-sm font-bold text-background transition hover:bg-pro sm:inline-flex"
          >
            Start a debate
          </Link>
          <Link
            href="/account"
            className="label shrink-0 touch-target inline-flex items-center rounded-full border border-border px-3 text-muted transition-colors hover:border-foreground hover:text-foreground"
          >
            {user ? "Account" : "Sign in"}
          </Link>
        </div>
      </div>
      <nav
        className="-mx-0 flex gap-1 overflow-x-auto border-t border-border/60 px-4 pb-2 pt-2 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
        aria-label="Mobile"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="label shrink-0 touch-target inline-flex items-center whitespace-nowrap rounded-full px-3 text-muted transition-colors hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="font-display text-2xl font-extrabold text-foreground">
          Today&apos;s Debate
        </p>
        <p className="mt-2 max-w-md text-sm text-muted">
          Challenge someone. Argue the motion — not the person. The crowd
          watches, cheers a corner, and decides.
        </p>
        <nav className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          {[
            ["/how-it-works", "How it works"],
            ["/topics", "Topics"],
            ["/archive", "Archive"],
            ["/takes", "Hot takes"],
            ["/pricing", "Plus"],
            ["/sponsor", "Sponsor"],
            ["/suggest", "Suggest"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="label touch-target inline-flex items-center text-muted hover:text-pro"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
