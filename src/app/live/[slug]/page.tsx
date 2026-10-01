import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiveTopicRoom } from "@/components/live-topic-room";
import { getDebateBySlug, getScheduledDebates } from "@/lib/debate-service";
import { LANDING_HOOKS } from "@/data/landing-hooks";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import type { Corner } from "@/types/debate";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ side?: string }>;
};

function sideToCorner(side: string | undefined): Corner {
  if (side === "no" || side === "con" || side === "against") return "con";
  return "pro";
}

export async function generateStaticParams() {
  const fromDebates = getScheduledDebates().map((d) => ({ slug: d.id }));
  const fromHooks = LANDING_HOOKS.map((h) => ({ slug: h.debateId }));
  const seen = new Set<string>();
  return [...fromHooks, ...fromDebates].filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const debate = getDebateBySlug(slug);
  const hook = LANDING_HOOKS.find((h) => h.debateId === slug);
  const title = hook?.hook ?? debate?.resolution ?? "Live room";
  return {
    title: `${title} — live`,
    description: `Live chat on: ${title}`,
    alternates: { canonical: absoluteUrl(`/live/${slug}`) },
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      url: absoluteUrl(`/live/${slug}`),
    },
  };
}

export default async function LiveTopicPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { side } = await searchParams;

  const debate = getDebateBySlug(slug);
  const hook = LANDING_HOOKS.find((h) => h.debateId === slug);
  if (!debate && !hook) notFound();

  const motion = hook?.hook ?? debate!.resolution;

  return (
    <LiveTopicRoom
      slug={slug}
      motion={motion}
      initialSide={sideToCorner(side)}
    />
  );
}
