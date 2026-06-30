import type { Answers } from "@/types/question";
import type { Persona } from "@/types/engine";

/**
 * Persona detection - pure. Combination of age, sex, and the Q15 "what do you
 * track" answer (build brief §7). Priority-ordered, first match wins, defaults
 * to 'neutral' when there's no clear signal.
 *
 * Thresholds (which ages count as "40+", tie-break order) are WORKING DEFAULTS,
 * encoded as constants so they're trivial to retune - see build brief §12.
 */

// Age bands that count as "40+" for the perimenopausal persona proxy.
const PERIMENOPAUSAL_AGE_BANDS = ["40-49", "50-59", "60+"];
// Age bands that count as "younger / optimisation-led" for the high performer.
const HIGH_PERFORMER_AGE_BANDS = ["18-29", "30-39", "40-49"];

function asArray(value: Answers[string] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value];
  return [];
}

export function detectPersona(answers: Answers): Persona {
  const sex = answers.sex;
  const age = typeof answers.age === "string" ? answers.age : undefined;
  const tracks = asArray(answers.tracks);
  const hotFlushes = answers.hotFlushes;

  // 1. Perimenopausal woman (40+): female, 40+ proxy, with a hormonal signal.
  if (
    sex === "female" &&
    age !== undefined &&
    PERIMENOPAUSAL_AGE_BANDS.includes(age) &&
    (hotFlushes === "yes" || tracks.includes("hormones"))
  ) {
    return "perimenopausal";
  }

  // 2. Caregiver: explicitly caring for someone, or a third party has noticed
  //    changes (the worried-about-a-parent-or-self signal).
  if (tracks.includes("family") || answers.someoneElseNoticed === "yes") {
    return "caregiver";
  }

  // 3. High performer: younger, optimisation-led, tracks performance/biometrics.
  if (
    age !== undefined &&
    HIGH_PERFORMER_AGE_BANDS.includes(age) &&
    (tracks.includes("performance") || tracks.includes("biometrics"))
  ) {
    return "highPerformer";
  }

  return "neutral";
}
