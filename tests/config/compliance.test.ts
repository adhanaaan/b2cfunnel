import { describe, it, expect } from "vitest";
import { COPY } from "@/config/copy";
import { STAT_CARDS } from "@/config/statCards";
import { QUESTIONS } from "@/config/questions";
import { TIPS, BRAIN_FACTS } from "@/config/tips";
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
  const allCopy = [
    ...collectStrings(COPY),
    ...collectStrings(STAT_CARDS),
    ...collectStrings(QUESTIONS),
    ...collectStrings(TIPS),
    ...collectStrings(BRAIN_FACTS),
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
