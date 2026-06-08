import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";

export const metadata: Metadata = {
  title: "Brain Health Check — Event",
  description:
    "A quick, medically backed brain health quiz. Find out how well your brain is performing.",
};

export default function EventPage() {
  return <Funnel variant="event" />;
}
