/**
 * HSA wellness/educational rails (build brief §8). These are structural, not
 * decorative: the disclaimers render on every result screen, and the banned
 * patterns are enforced by a unit test (tests/config/compliance.test.ts) so
 * Audrey can iterate copy freely without drifting onto the medical-device side
 * of the line.
 */

export const MANDATORY_DISCLAIMERS = [
  "This is an educational tool and not a medical diagnosis.",
  "Speak to a doctor about any concerns.",
] as const;

/**
 * Off-limits language. If any of these appear in the copy config, the build
 * brief's regulatory rail has been crossed and the compliance test fails.
 *
 * We ban the clinical *claim*, not the bare word: the VERB "diagnose" (the tool
 * doing the diagnosing) is banned, but the NOUN "diagnosis" is allowed because
 * the mandatory disclaimer itself says "not a medical diagnosis". Likewise we
 * ban "detect/screen FOR dementia", not every use of "screen".
 */
export const BANNED_PATTERNS: RegExp[] = [
  /\bdiagnos(e|es|ed|ing)\b/i,
  /\bscreen(s|ing)?\s+for\s+dementia\b/i,
  /\bdetect(s|ing)?\s+(dementia|alzheimer|cognitive)/i,
  /risk of dementia is\s*\d/i,
  /clinically validated/i,
  /measures?\s+your\s+cognition/i,
  /FDA[\s-]?approved/i,
];
