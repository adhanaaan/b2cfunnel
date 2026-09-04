import type { QuizVariant } from "@/types/funnel";

/**
 * Variants that exist only to be shown, never to collect. A preview variant
 * walks the full experience but writes nothing anywhere: no lead, no score, no
 * newsletter opt-in, not even anonymous funnel analytics.
 *
 * This is the single list every write path checks, so adding a preview variant
 * cannot accidentally leave one endpoint live.
 */
export const PREVIEW_VARIANTS: readonly QuizVariant[] = ["event6"];

export function isPreviewVariant(variant: QuizVariant): boolean {
  return PREVIEW_VARIANTS.includes(variant);
}

/**
 * Variants served by the event3 "Daylight Ember" screens (landing,
 * instructions, post-game result). v6 is v3 plus a partner consent page,
 * rotary and NTU Homecoming are v3 without one, and the regatta is v3 with an
 * extra page after the post-game result - so all five share every one of those
 * screens.
 */
export function usesDaylightScreens(variant: QuizVariant): boolean {
  return (
    variant === "event3" ||
    variant === "event6" ||
    variant === "rotary" ||
    variant === "ntuhomecoming" ||
    variant === "ihhsearegatta"
  );
}
