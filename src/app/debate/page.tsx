import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDailyDebate, debatePath } from "@/lib/debate-service";
import { toDateKey } from "@/lib/dates";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Today's motion",
  description:
    "Take a side on today's debate — read both cases, then cast your verdict.",
  alternates: { canonical: absoluteUrl("/debate") },
};

export default function DebatePage() {
  const debate = getDailyDebate(toDateKey());
  redirect(debatePath(debate));
}
