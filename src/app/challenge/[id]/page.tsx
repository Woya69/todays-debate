import type { Metadata } from "next";
import { ChallengeArena } from "@/components/challenge-arena";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = `Live challenge · ${SITE_NAME}`;
  const description =
    "Watch a structured debate. Cheer a corner. Comment from your side. Share the link.";
  const url = absoluteUrl(`/challenge/${id}`);
  const og = absoluteUrl(`/api/og/challenge?code=${encodeURIComponent(id)}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og],
    },
  };
}

export default async function ChallengeDetailPage({ params }: Props) {
  const { id } = await params;
  return <ChallengeArena initialCode={id} />;
}
