import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";
import { EventEnded } from "@/components/screens/EventEnded";
import { OTP_PAUSED } from "@/config/event";

export const metadata: Metadata = {
  title: "Bonus Round - One Trick Pony Quiz Night",
  description:
    "Round 5: the brain speed challenge. One minute, one game, and your time goes on the board for your team.",
  openGraph: {
    title: "Round 5 · Brain Speed Challenge",
    description: "One minute, one game. Your time goes on the board for your team.",
    images: ["/og-event-v3.png"],
  },
};

/**
 * /onetrickpony - the bonus round of the One Trick Pony quiz night, for World
 * Alzheimer's Month.
 *
 * /general's arc, shared rather than rebuilt (see OTP_FLOW). What makes this
 * one different is the TEAM: the landing asks for one and every score carries
 * it, because the round is scored by team rather than by player. Anyone may
 * play as many times as they like - each attempt is a row tagged with its
 * team, and the scoring is done from those rows afterwards rather than by this
 * app.
 *
 * The score is written the moment the game finishes, before the questionnaire
 * behind it, so the board fills whether or not a single person goes on to
 * answer the brain-health questions in the middle of a quiz night.
 *
 * Its own bucket, `onetrickpony`, so a pub's bonus round never mixes with a
 * hospital activation's standings. OTP_PAUSED is its own switch.
 */
export default function OneTrickPonyPage() {
  if (OTP_PAUSED) return <EventEnded />;
  return <Funnel variant="otp" />;
}
