import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { HALLOWEEN_PAUSED } from "@/config/event";

export const metadata: Metadata = {
  title: "Brain Speed Challenge - Halloween",
  description:
    "Sixty seconds, one symbol-matching test. Find out your brain's processing speed, see who in the room you can beat, and get your brain health report.",
  openGraph: {
    title: "Whose brain is quickest tonight?",
    description:
      "A 60-second brain speed race from Gray Matter Solutions. Scan, play, top the board.",
    images: ["/og-event-v3.png"],
  },
};

/**
 * /halloween - the brain speed race for Halloween gatherings.
 *
 * Built for a link handed round socially rather than stood up at a booth: a
 * birthday lunch, then a party, several rooms on one night, with friends
 * racing each other on one shared board. That shapes three things.
 *
 * **One bucket for the whole night.** HALLOWEEN_SOURCE is dated by year, not
 * by gathering, so everybody who plays lands on the same standings. Splitting
 * it per party would break the one thing the link is for.
 *
 * **The hook is the race, not a host.** Every other borrowed-arc route names
 * an organisation on its landing; this one has nobody to name, so it asks who
 * you can beat.
 *
 * **The board runs dark.** It goes up on a TV in a dim room, where a cream
 * 55" panel glares. See the note in the board file - the palette is local to
 * it, so no other event's screen changes.
 *
 * Otherwise this is /general's arc, shared rather than rebuilt (see
 * HALLOWEEN_FLOW): the processing-speed primer and age question before the
 * game, the questionnaire, and the booth report. Sharing the flow array keeps
 * the question set - and therefore every score - comparable with every event
 * before it, so a time set at a party sits on the same scale as one set at a
 * hospital.
 *
 * On the theming: it is the eyebrow, the word "tonight" and the night
 * palette, and no further. The obvious Halloween joke is a dead/slow pun, and
 * this is a brain health company - the slow end of a processing-speed score is
 * not a punchline GMS can make. The night is the occasion, not the subject.
 *
 * The full arc rather than /onetrickpony's game-only one: the reason to hand
 * this round at a gathering is the brain health teaser, and the report is the
 * teaser - the race is only what gets somebody to start it. Pointing
 * HALLOWEEN_FLOW at a game-only array is the change if that is ever not
 * wanted.
 */
export default function HalloweenPage() {
  if (HALLOWEEN_PAUSED) return <EventEnded />;
  return <Funnel variant="halloween" />;
}
