import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { EVENT_PAUSED } from "@/config/event";

export const metadata: Metadata = {
  title: "Brain Health Check - Event",
  description:
    "A quick, medically backed brain health quiz. Find out how well your brain is performing.",
};

export default function EventPage() {
  if (EVENT_PAUSED) return <EventEnded />;
  return <Funnel variant="event" />;
}
