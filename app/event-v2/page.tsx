import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { EVENT2_PAUSED } from "@/config/event";

export const metadata: Metadata = {
  title: "Reaction Time Challenge - Brain Health Check",
  description:
    "How fast does your brain process? A quick symbol-matching test, backed by NTU's Dementia Research Centre. See your score, then explore your full brain health profile.",
  openGraph: {
    title: "Reaction Time Challenge",
    description:
      "Fast reflexes. But how do you score on your overall brain health?",
    images: ["/og-event-v2.png"],
  },
};

export default function EventV2Page() {
  if (EVENT2_PAUSED) return <EventEnded />;
  return <Funnel variant="event2" />;
}
