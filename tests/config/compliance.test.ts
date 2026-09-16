import { describe, it, expect } from "vitest";
import { COPY, copyFor } from "@/config/copy";
import { LANGUAGES } from "@/config/language";
import { questionsFor } from "@/config/questions";
import { STAT_CARDS } from "@/config/statCards";
import { QUESTIONS } from "@/config/questions";
import { TIPS, BRAIN_FACTS } from "@/config/tips";
import {
  ACTIONS_BY_FACTOR,
  DEFAULT_ACTIONS,
  SPEED_ACTIONS,
  pickActions,
} from "@/config/actions";
import { BANNED_PATTERNS, MANDATORY_DISCLAIMERS } from "@/config/compliance";

/** Recursively collect every string in an object. */
function collectStrings(value: unknown, acc: string[] = []): string[] {
  if (typeof value === "string") acc.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, acc));
  else if (value && typeof value === "object")
    Object.values(value).forEach((v) => collectStrings(v, acc));
  return acc;
}

describe("regulatory compliance (HSA wellness rails)", () => {
  // Every language, not just English: a translation is user-facing copy, and
  // the em-dash rule below is exactly the one a pasted translation breaks.
  const translated = LANGUAGES.flatMap((l) => [
    ...collectStrings(copyFor("siloam", l.id)),
    ...collectStrings(questionsFor(l.id)),
  ]);

  const allCopy = [
    ...collectStrings(COPY),
    ...translated,
    ...collectStrings(STAT_CARDS),
    ...collectStrings(QUESTIONS),
    ...collectStrings(TIPS),
    ...collectStrings(BRAIN_FACTS),
    ...collectStrings(ACTIONS_BY_FACTOR),
    ...collectStrings(DEFAULT_ACTIONS),
    ...collectStrings(SPEED_ACTIONS),
    // The Indonesian action tables, through the function that picks from them.
    ...LANGUAGES.flatMap((l) =>
      (["low", "moderate", "elevated", "high"] as const).flatMap((band) =>
        pickActions({
          drivingFactors: [
            { id: "sleep" },
            { id: "highBp" },
            { id: "smoking" },
          ],
          band,
          gameTimeMs: 41800,
          language: l.id,
        }),
      ),
    ),
  ];

  it("contains no off-limits language", () => {
    for (const text of allCopy) {
      for (const pattern of BANNED_PATTERNS) {
        expect(
          pattern.test(text),
          `Banned pattern ${pattern} matched copy: "${text}"`,
        ).toBe(false);
      }
    }
  });

  it("contains no em dashes in user-facing copy", () => {
    for (const text of allCopy) {
      expect(text.includes("—"), `Em dash found in copy: "${text}"`).toBe(
        false,
      );
    }
  });

  it("ships the mandatory disclaimers in the copy config", () => {
    // They live in compliance.ts and are rendered by ComplianceFooter, but assert
    // the constant is intact so the result screen always has them to render.
    expect(MANDATORY_DISCLAIMERS).toContain(
      "This is an educational tool and not a medical diagnosis.",
    );
    expect(MANDATORY_DISCLAIMERS).toContain(
      "Speak to a doctor about any concerns.",
    );
  });
});
