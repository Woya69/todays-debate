import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allCategorySlugs,
  categoryToSlug,
  slugToCategory,
} from "@/lib/categories";
import { getDebatesByCategory } from "@/lib/debate-service";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return allCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return { title: "Not found" };
  const title = `${category} debates — Today's Debate`;
  const description = `Pros and cons on ${category.toLowerCase()} motions. Steelman both sides, then cast your verdict.`;
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/topics/${slug}`) },
    openGraph: { title, description },
  };
}

export default async function TopicCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = slugToCategory(slug);
  if (!category) notFound();

  const debates = getDebatesByCategory(category);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="label text-muted">
        <Link href="/topics" className="hover:text-accent">
          Topics
        </Link>
        <span className="mx-2">/</span>
        <span className="text-accent">{category}</span>
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-foreground">
        {category}
      </h1>
      <p className="mt-3 text-muted">
        {debates.length} motions. Each page steelmans both sides.
      </p>
      <hr className="rule my-8" />
      <ul className="divide-y divide-border border border-border">
        {debates.map((debate) => (
          <li key={debate.id}>
            <Link
              href={`/debate/${debate.id}`}
              className="block px-5 py-4 transition hover:bg-accent/5"
            >
              <p className="font-display text-lg font-semibold text-foreground">
                {debate.resolution}
              </p>
              <p className="mt-1 label text-muted">
                {categoryToSlug(category)} · Read both sides
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
