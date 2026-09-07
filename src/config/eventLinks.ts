import type { QuizVariant } from "@/types/funnel";

/**
 * Where a scanned QR code has to land.
 *
 * Absolute on purpose: a TV board or a phone screen may be running from
 * localhost or a preview deploy, but a code scanned off it must always open
 * production - a relative URL would send the next player to a laptop that is
 * about to be closed.
 */
const PRODUCTION_ORIGIN = "https://brainhealthcheck.vercel.app";

/** The route each event's funnel is served at. */
export const EVENT_PATHS: Partial<Record<QuizVariant, string>> = {
  event3: "/event-v3",
  rotary: "/rotaryklwam",
  ntuhomecoming: "/ntuhomecoming",
  ihhsearegatta: "/ihhsearegatta",
  phkl: "/phkl",
};

/**
 * Where "Book memory screening" on the /phkl report sends people.
 *
 * PLACEHOLDER: Pantai Hospital Kuala Lumpur's health screening packages page,
 * until the hospital supplies the booking link for the Memory Screening
 * Package. Replace this one constant and every booking button on the report
 * follows.
 */
export const PHKL_BOOKING_URL =
  "https://www.pantai.com.my/kuala-lumpur/health-screening-packages";

/**
 * The absolute play link for a variant - used by the TV boards' QR codes and
 * by the share card a player sends their friends. Falls back to the v3 route
 * for the variants that have no board of their own.
 */
export function playUrlFor(variant: QuizVariant): string {
  return `${PRODUCTION_ORIGIN}${EVENT_PATHS[variant] ?? EVENT_PATHS.event3}`;
}
