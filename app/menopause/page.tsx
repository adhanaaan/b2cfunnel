import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { MENOPAUSE_PAUSED } from "@/config/event";

export const metadata: Metadata = {
  title: "Brain Speed Challenge - Menopause Awareness Month",
  description:
    "Changes in focus and memory are among the most common experiences of menopause, and rarely measured. Take a 60-second symbol-matching test to see your brain's processing speed, then get your brain health report.",
  openGraph: {
    title: "Brain fog is real. Let's time it.",
    description:
      "A 60-second brain speed test for Menopause Awareness Month, from Gray Matter Solutions.",
    images: ["/og-event-v3.png"],
  },
};

/**
 * /menopause - the Menopause Awareness Month brain speed challenge.
 *
 * The /general arc, shared rather than rebuilt (see MENOPAUSE_FLOW, which is
 * /general's, which is the summit's, which is /phkl's): a processing-speed
 * primer and the age question before the game, a "great job" beat into the
 * quiz primer, the questionnaire, and the booth report. Sharing the flow array
 * is what keeps this route's question set - and therefore every score it
 * records - comparable with /general's and with every event before it.
 *
 * Two things only are its own:
 *
 * - **The landing speaks to the campaign** ("Brain fog is real. Let's time
 *   it."). Everything else is /general's, including the one-tick consent and
 *   the shared privacy policy.
 * - **Its own bucket**, dated `menopause-2026-10`, so the month's standings
 *   open empty and rank only what is played in it. Dated because this campaign
 *   comes round every October and next year's players must not be ranked
 *   against this year's.
 *
 * On the wording, since this one touches a health topic rather than a host's
 * name: brain fog around menopause is among the most commonly reported
 * experiences of it, and saying so is the hook. The copy stops there. It makes
 * no claim about cause, none about risk, and says of the game only that it
 * times how fast you take in what you see and respond - which is what it does.
 * The report at the end is /general's and carries the mandatory disclaimers
 * unchanged.
 *
 * This route runs the FULL arc, unlike /onetrickpony which is the game alone.
 * A month-long awareness campaign is the one place the questionnaire and the
 * report earn their keep: the report is the awareness, and the game is only
 * what gets someone to start. Pointing MENOPAUSE_FLOW at a game-only array
 * would be the change if that is ever not wanted.
 *
 * MENOPAUSE_PAUSED is its own switch. There is no challenge-closed switch; the
 * arc is open for as long as the route is up.
 */
export default function MenopausePage() {
  if (MENOPAUSE_PAUSED) return <EventEnded />;
  return <Funnel variant="menopause" />;
}
