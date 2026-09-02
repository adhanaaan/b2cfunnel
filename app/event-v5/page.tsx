import type { Metadata } from "next";
import { Event5Splash } from "@/components/screens/event5/Event5Splash";

export const metadata: Metadata = {
  title: "Consent preview - Event v5",
  // Keep an unapproved partner draft out of search results and link previews.
  robots: { index: false, follow: false },
};

/**
 * /event-v5 - a review copy of the event3 landing carrying IHH Healthcare
 * Singapore's consent wording.
 *
 * Landing only, and deliberately inert: it does not mount the funnel, so no
 * score, lead or opt-in can be written from here and nothing can reach the
 * leaderboard of a live event.
 */
export default function EventV5Page() {
  return <Event5Splash />;
}
