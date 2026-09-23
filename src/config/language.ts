import type { QuizVariant } from "@/types/funnel";

/**
 * The languages a funnel can be taken in.
 *
 * Two events offer a choice today - see `offersLanguageChoice` in
 * config/variants.ts - and each offers its own list (`languagesFor`): the
 * Siloam Neuroscience Summit (/siloamneurosciencesummit) English and Bahasa
 * Indonesia, and /phkl-2 English, 中文 and Bahasa Indonesia. Every other event
 * is English-only, and for them the whole layer is inert: `useLanguage()`
 * hands back "en", and `copyFor()` hands back the English COPY object itself
 * rather than a merged copy of it.
 */

/** A language tag, as written to storage and read by `copyFor()`. */
export type Language = "en" | "zh" | "id";

/**
 * Every language this build can render. Each label is written in its OWN
 * language: someone who cannot read the page cannot be expected to find
 * "Indonesian" in a list, but they will find "Bahasa Indonesia".
 */
export const LANGUAGES: readonly { id: Language; label: string }[] = [
  { id: "en", label: "English" },
  { id: "zh", label: "中文" },
  { id: "id", label: "Bahasa Indonesia" },
];

/**
 * What an event's picker shows, in the order it shows them.
 *
 * Per event, because the right list depends on the room. The summit is in
 * Indonesia, so it offers English and Bahasa Indonesia and deliberately not
 * 中文 (`tests/config/siloamLanguage.test.ts` pins that). /phkl-2 offers all
 * three. An event that offers no choice gets English alone.
 */
export function languagesFor(
  variant: QuizVariant,
): readonly { id: Language; label: string }[] {
  const ids: Language[] =
    variant === "siloam"
      ? ["en", "id"]
      : variant === "phkl2"
        ? ["en", "zh", "id"]
        : ["en"];
  return LANGUAGES.filter((l) => ids.includes(l.id));
}

/**
 * Where the funnel opens before anyone chooses.
 *
 * English on purpose, even for an Indonesian event: it is the language every
 * screen is written in and the one every fallback resolves to, so a missing
 * translation can only ever read as English rather than as a blank. The picker
 * is the first thing on the landing, above the fold.
 */
export const DEFAULT_LANGUAGE: Language = "en";

/** The label for a language, or its tag if it is not one we offer. */
export function languageLabel(language: Language): string {
  return LANGUAGES.find((l) => l.id === language)?.label ?? language;
}

/** True when `value` is a language this build knows how to render. */
export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((l) => l.id === value);
}

/**
 * Where the choice is kept for the rest of the session.
 *
 * sessionStorage rather than localStorage: an event runs on shared phones and
 * on a player's own, and the next person to scan the code should get the
 * landing in the language the PICKER defaults to, not in whatever the last
 * player chose. It survives a step change and a reload, and nothing more.
 */
export const LANGUAGE_STORAGE_KEY = "gms_lang";
