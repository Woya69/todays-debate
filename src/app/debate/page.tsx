import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDailyDebate, debatePath } from "@/lib/debate-service";
import { toDateKey } from "@/lib/dates";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Today's main event",
  description:
    "Pick a corner on today's debate. Read both sides. Call the crowd. Challenge a friend.",
  alternates: { canonical: absoluteUrl("/debate") },
};

export default function DebatePage() {
  const debate = getDailyDebate(toDateKey());
  redirect(debatePath(debate));
}
