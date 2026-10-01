import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { DebateFlow } from "@/components/debate-flow";
import { JsonLd } from "@/components/json-ld";
import { AdSlot } from "@/components/ad-slot";
import { CrowdPresence } from "@/components/crowd-presence";
import { RecentChallenges } from "@/components/recent-challenges";
import {
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
import type { Stance } from "@/types/debate";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ side?: string }>;
};

function sideToStance(side: string | undefined): Stance | null {
  if (side === "yes" || side === "pro" || side === "for") return "pro";
  if (side === "no" || side === "con" || side === "against") return "con";
  return null;
}

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

export default async function DebateSlugPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { side } = await searchParams;

  if (isDateParam(slug)) {
    if (!isValidDebateDate(slug)) notFound();
    const debate = getDailyDebate(slug);
    permanentRedirect(`/debate/${debate.id}`);
  }

  const daily = getDailyDebateForSlug(slug);
  if (!daily) notFound();

  const initialStance = sideToStance(side);

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

  const challengeHref = `/challenge?motion=${encodeURIComponent(daily.resolution)}&slug=${encodeURIComponent(daily.id)}`;

  return (
    <>
      <JsonLd data={jsonLd} />

      <article className="mx-auto mb-8 max-w-3xl animate-rise">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label rounded-full bg-con/15 px-2.5 py-1 text-con">
            Live now
          </span>
          {initialStance && (
            <span
              className={`label rounded-full px-2.5 py-1 ${
                initialStance === "pro"
                  ? "bg-pro/15 text-pro"
                  : "bg-con/15 text-con"
              }`}
            >
              You said {initialStance === "pro" ? "YES" : "NO"}
            </span>
          )}
        </div>

        <h1 className="mt-4 font-display text-[1.85rem] font-extrabold leading-tight text-foreground sm:text-4xl">
          {daily.resolution}
        </h1>

        <div className="mt-6">
          <CrowdPresence />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href={challengeHref} className="btn-primary flex-1 text-center">
            Challenge someone live
          </Link>
          <Link href="/watch" className="btn-ghost flex-1 text-center">
            Watch other rooms
          </Link>
        </div>

        <section className="mt-8">
          <p className="label text-con">In this motion</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
            Debates happening now
          </h2>
          <div className="mt-4">
            <RecentChallenges limit={4} />
          </div>
        </section>

        <AdSlot placement="debate-below-args" className="mt-6" />
      </article>

      <DebateFlow
        debate={daily}
        hideTitle
        initialStance={initialStance ?? undefined}
      />
    </>
  );
}
