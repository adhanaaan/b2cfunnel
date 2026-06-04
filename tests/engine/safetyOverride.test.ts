import { describe, it, expect } from "vitest";
import { computeScore } from "@/engine/scoring";
import type { Answers } from "@/types/question";

describe("safety override", () => {
  it("forces at LEAST Elevated when persistence=yes AND noticed=yes, even on a low total", () => {
    const answers: Answers = {
      age: "20-34",
      sex: "male",
      familyHistory: "none",
      forgetfulness: "yes",
      persistence: "yes", // 3
      someoneElseNoticed: "yes", // 2
    };
    const r = computeScore(answers);
    expect(r.safetyOverrideApplied).toBe(true);
    // total = 6 -> 'low' by total alone, but a symptomatic person must never be
    // routed below Elevated. (Here the symptom axis already reaches it too.)
    expect(["elevated", "high"]).toContain(r.band);
    expect(r.bandFromTotal).toBe("low"); // proves the floor came from the safety logic
  });

  it("never downgrades an already-High band", () => {
    const answers: Answers = {
      age: "55+",
      sex: "male",
      familyHistory: "immediate",
      highBp: "yes",
      highCholesterol: "yes",
      diabetes: "yes",
      hearingLoss: "yes",
      visionLoss: "yes",
      smoking: "current",
      sleep: "lt6",
      exercise: "lt90",
      diet: "poor",
      alcohol: "gt21",
      concentrating: "yes",
      judgement: "yes",
      forgetfulness: "yes",
      persistence: "yes",
      someoneElseNoticed: "yes",
    };
    const r = computeScore(answers);
    expect(r.safetyOverrideApplied).toBe(true);
    expect(r.band).toBe("high"); // override is max(), never lowers
  });

  it("does not trigger when only one symptom flag is yes", () => {
    expect(
      computeScore({ persistence: "yes", someoneElseNoticed: "no" })
        .safetyOverrideApplied,
    ).toBe(false);
    expect(
      computeScore({ persistence: "no", someoneElseNoticed: "yes" })
        .safetyOverrideApplied,
    ).toBe(false);
  });
});
