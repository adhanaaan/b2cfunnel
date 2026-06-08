import { describe, it, expect } from "vitest";
import { computeScore } from "@/engine/scoring";
import type { Answers } from "@/types/question";

describe("persistent decline scoring", () => {
  it("counts persistence (12) and someone-noticed (8) toward the symptom score", () => {
    const r = computeScore({
      forgetfulness: "almostDaily", // 4
      persistence: "yes", // 12
      someoneElseNoticed: "yes", // 8
    });
    expect(r.symptomScore).toBe(24);
  });

  it("does not shift the band beyond the score (band follows the total)", () => {
    const answers: Answers = {
      age: "18-29",
      sex: "male",
      forgetfulness: "almostDaily",
      persistence: "yes",
      someoneElseNoticed: "yes",
    };
    const r = computeScore(answers);
    expect(r.total).toBe(24);
    expect(r.band).toBe(r.bandFromTotal);
    expect(r.band).toBe("low"); // 24 -> Low; persistence raised the score, not the band
  });

  it("still surfaces the persistent-decline flag for analytics", () => {
    expect(
      computeScore({ persistence: "yes", someoneElseNoticed: "yes" })
        .safetyOverrideApplied,
    ).toBe(true);
    expect(
      computeScore({ persistence: "yes", someoneElseNoticed: "no" })
        .safetyOverrideApplied,
    ).toBe(false);
  });
});
