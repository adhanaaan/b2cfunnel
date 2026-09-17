import type { QuizVariant } from "@/types/funnel";

/**
 * Variants that exist only to be shown, never to collect. A preview variant
 * walks the full experience but writes nothing anywhere: no lead, no score, no
 * newsletter opt-in, not even anonymous funnel analytics.
 *
 * This is the single list every write path checks, so adding a preview variant
 * cannot accidentally leave one endpoint live.
 */
export const PREVIEW_VARIANTS: readonly QuizVariant[] = ["event6", "event7"];

export function isPreviewVariant(variant: QuizVariant): boolean {
  return PREVIEW_VARIANTS.includes(variant);
}

/**
 * Variants served by the event3 "Daylight Ember" screens (landing,
 * instructions, post-game result). v6 is v3 with the partner consents split
 * one per tick, rotary and NTU Homecoming are v3 without a consent page, the
 * regatta is v3 with the partner consent moved onto the landing and an extra
 * page after the post-game result, PHKL is the regatta with its own screens
 * either side of the game, and #MambaCares is PHKL with no partner and a
 * fundraising report in place of the screening offer - so all of them share
 * the landing, the instructions and the warm game theme. 22 Grams (/22grams)
 * is NTU Homecoming again on a bucket of its own, so it lands here too.
 */
export function usesDaylightScreens(variant: QuizVariant): boolean {
  return (
    variant === "event3" ||
    variant === "event6" ||
    variant === "rotary" ||
    variant === "ntuhomecoming" ||
    variant === "ihhsearegatta" ||
    variant === "ihh" ||
    variant === "phkl" ||
    variant === "mambacares" ||
    variant === "urbanmilers" ||
    variant === "siloam" ||
    variant === "22grams" ||
    variant === "event7"
  );
}

/**
 * Variants served by the #MambaCares screens - the landing without a partner,
 * and the report that ends on the Dementia Singapore fundraiser rather than a
 * screening offer.
 *
 * Urban Milers (/urbanmilers) is the same run on a bucket of its own, and
 * /event-v7 is that arc again with the share moment on the report, so all three
 * read every one of those screens. One helper rather than a `||` repeated at
 * each branch, so adding the next variant to the arc cannot miss one.
 *
 * What the screens must NOT share is which run they are drawing: each reads its
 * words through `runCopyFor` and its campaign through `communityRunFor`, both
 * keyed on the variant.
 */
export function usesMambaScreens(variant: QuizVariant): boolean {
  return (
    variant === "mambacares" ||
    variant === "urbanmilers" ||
    variant === "event7"
  );
}

/**
 * Variants that put the language choice to the player.
 *
 * Only the Siloam Neuroscience Summit does: it is the first Indonesian event on
 * this funnel, and its landing offers English or Bahasa Indonesia (and only
 * those two - see LANGUAGES in config/language.ts). Every other event is
 * English-only and never mounts the picker, so `useLanguage()` hands them "en"
 * and `copyFor()` hands them the English COPY object itself, unchanged.
 *
 * One helper rather than a `===` repeated at each branch, so adding the next
 * multilingual event cannot miss one.
 */
export function offersLanguageChoice(variant: QuizVariant): boolean {
  return variant === "siloam";
}
