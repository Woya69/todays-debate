import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories, categoryPath, getDebatesByCategory } from "@/lib/debate-service";

export const metadata: Metadata = {
  title: "Topics — Today's Debate",
  description:
    "Browse every motion by category: technology, policy, climate, education, and more.",
};

export default function TopicsIndexPage() {
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-2xl">
      <p className="label text-accent">The Index</p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-foreground">
        Topics
      </h1>
      <p className="mt-3 text-lg text-muted">
        Every motion, filed by subject — built for search and for readers who follow a beat.
      </p>
      <hr className="rule-double my-8" />
      <ul className="space-y-3">
        {categories.map((category) => {
          const count = getDebatesByCategory(category).length;
          return (
            <li key={category}>
              <Link
                href={categoryPath(category)}
                className="paper-card flex items-center justify-between px-5 py-4 transition hover:border-foreground"
              >
                <span className="font-display text-xl font-semibold text-foreground">
                  {category}
                </span>
                <span className="label text-muted">{count} motions</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
