import type { Metadata } from "next";
import { LandingSpin } from "@/components/landing-spin";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} — yes or no. then fight.`,
  description:
    "A motion hits you. Yes or no. Then you're in the live room where the crowd is already arguing.",
  alternates: { canonical: absoluteUrl("/") },
};

export default function HomePage() {
  return <LandingSpin />;
}
