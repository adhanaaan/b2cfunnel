/**
 * The three "do this now" actions on the event2 report.
 *
 * A rules table, not a generator: each modifiable risk factor the engine
 * surfaced maps to one concrete action, so the card reads as though it was
 * written for the person in front of it. Wording stays on the
 * wellness/educational side of the HSA line (see compliance.ts) and is swept by
 * tests/config/compliance.test.ts.
 */

import type { BandName } from "@/types/engine";

/** One action per modifiable factor. Non-modifiable ids are absent by design:
 *  age and family history have no action, so they fall through to the defaults. */
export const ACTIONS_BY_FACTOR: Record<string, string> = {
  sleep:
    "Aim for 7 to 9 hours of sleep. Memory consolidates overnight, and short nights show up first as poor focus.",
  exercise:
    "Build up to 150 minutes of brisk movement a week. Regular aerobic exercise is one of the best supported habits for brain health.",
  diet: "Add one Mediterranean style meal a day: vegetables, fish, olive oil, wholegrains.",
  alcohol: "Keep alcohol light, and give yourself a few dry days each week.",
  smoking:
    "Stopping smoking is the biggest single change available to you here. Ask us about support at the booth.",
  highBp:
    "Get your blood pressure checked and treated. Blood pressure in midlife shapes brain health decades later.",
  highCholesterol:
    "Ask your doctor about your cholesterol numbers and which target suits you.",
  diabetes:
    "Keep your blood sugar in range with your doctor. Steady glucose protects the small blood vessels in your brain.",
  hearingLoss:
    "Book a hearing test. Untreated hearing loss is one of the largest changeable risk factors in the 2024 Lancet report.",
  visionLoss: "Get your eyes checked, and keep your prescription current.",
};

/** Reaction-time lines, keyed off how the rest of the profile looks. */
export const SPEED_ACTIONS = {
  strong:
    "Keep doing what you are doing. Your reaction speed is strong, so protect it with consistent sleep and regular exercise.",
  build:
    "Your reaction speed is a snapshot, not a verdict. Sleep and regular movement are what shift it over time.",
} as const;

/** Filler for anyone whose answers surfaced fewer than three factors. */
export const DEFAULT_ACTIONS: string[] = [
  "Challenge your brain daily. Take a new route to work, learn a new skill, or switch up your routine.",
  "Stay social. Regular conversation is one of the strongest habits linked with staying sharp.",
  "Book a health screening if it has been more than a year. Knowing your numbers is the start of changing them.",
];

export interface PickActionsInput {
  /** Impact-sorted, straight from the engine. */
  drivingFactors: { id: string }[];
  band: BandName;
  /** Reaction game result, when they played one. */
  gameTimeMs?: number;
}

/**
 * Exactly three actions: the reaction-time line first when they played, then
 * their heaviest modifiable factors in the engine's order, then defaults.
 */
export function pickActions({
  drivingFactors,
  band,
  gameTimeMs,
}: PickActionsInput): string[] {
  const picked: string[] = [];
  const add = (text: string | undefined) => {
    if (!text || picked.length >= 3 || picked.includes(text)) return;
    picked.push(text);
  };

  if (gameTimeMs != null) {
    add(band === "low" ? SPEED_ACTIONS.strong : SPEED_ACTIONS.build);
  }
  for (const factor of drivingFactors) add(ACTIONS_BY_FACTOR[factor.id]);
  for (const fallback of DEFAULT_ACTIONS) add(fallback);

  return picked;
}
