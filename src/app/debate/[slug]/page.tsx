import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { DebateFlow } from "@/components/debate-flow";
import { JsonLd } from "@/components/json-ld";
import { AdSlot } from "@/components/ad-slot";
import {
  categoryPath,
  getDailyDebate,
  getDailyDebateForSlug,
  getDebateBySlug,
  getScheduledDebates,
  isDateParam,
  isValidDebateDate,
  seoDescriptionFor,
  seoTitleFor,
} from "@/lib/debate-service";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { formatDisplayDate } from "@/lib/dates";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getScheduledDebates().map((d) => ({ slug: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (isDateParam(slug)) {
    if (!isValidDebateDate(slug)) return { title: "Not found" };
    const debate = getDailyDebate(slug);
    return {
      title: seoTitleFor(debate),
      description: seoDescriptionFor(debate),
      alternates: { canonical: absoluteUrl(`/debate/${debate.id}`) },
    };
  }

  const debate = getDebateBySlug(slug);
  if (!debate) return { title: "Not found" };

  const title = seoTitleFor(debate);
  const description = seoDescriptionFor(debate);
  const url = absoluteUrl(`/debate/${debate.id}`);
  const ogImage = absoluteUrl(`/api/og/debate?slug=${debate.id}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function DebateSlugPage({ params }: Props) {
  const { slug } = await params;

  if (isDateParam(slug)) {
    if (!isValidDebateDate(slug)) notFound();
    const debate = getDailyDebate(slug);
    permanentRedirect(`/debate/${debate.id}`);
  }

  const daily = getDailyDebateForSlug(slug);
  if (!daily) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: daily.resolution,
    description: seoDescriptionFor(daily),
    datePublished: daily.publishedAt ?? "2025-01-01",
    author: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: absoluteUrl(`/debate/${daily.id}`),
    about: daily.category,
    articleSection: daily.category,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the case for: ${daily.resolution}`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${daily.pro.title}. ${daily.pro.argument}`,
        },
      },
      {
        "@type": "Question",
        name: `What is the case against: ${daily.resolution}`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${daily.con.title}. ${daily.con.argument}`,
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqLd} />

      <article className="mx-auto mb-10 max-w-3xl">
        <p className="label text-muted">{formatDisplayDate(daily.dateKey)}</p>
        <p className="mt-2 label text-accent">
          <Link href={categoryPath(daily.category)} className="hover:text-foreground">
            {daily.category}
          </Link>
          <span className="mx-2 text-muted">·</span>
          No. {daily.debateNumber}
        </p>
        <h1 className="mt-3 font-display text-[1.65rem] font-semibold leading-tight text-foreground sm:text-4xl">
          {daily.resolution}
        </h1>
        {daily.context && (
          <p className="mt-4 text-base leading-7 text-muted sm:text-lg sm:leading-8">
            {daily.context}
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <section className="border border-border px-4 py-4 sm:px-5 sm:py-5">
            <p className="label text-accent">The case for</p>
            <h2 className="mt-2 font-display text-lg font-semibold text-foreground sm:text-xl">
              {daily.pro.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">{daily.pro.argument}</p>
          </section>
          <section className="border border-border px-4 py-4 sm:px-5 sm:py-5">
            <p className="label text-accent">The case against</p>
            <h2 className="mt-2 font-display text-lg font-semibold text-foreground sm:text-xl">
              {daily.con.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">{daily.con.argument}</p>
          </section>
        </div>

        <AdSlot placement="debate-below-args" className="mt-6" />
      </article>

      <DebateFlow debate={daily} hideTitle />
    </>
  );
}
