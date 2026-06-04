import { describe, it, expect } from "vitest";
import {
  computeScore,
  scoreRiskAxis,
  scoreSymptomAxis,
} from "@/engine/scoring";
import type { Answers } from "@/types/question";

const maxAnswers: Answers = {
  age: "55+", // 3
  sex: "female",
  hotFlushes: "yes", // 1
  familyHistory: "immediate", // 2
  highBp: "yes", // 1
  highCholesterol: "yes", // 1
  diabetes: "yes", // 1
  hearingLoss: "yes", // 2
  visionLoss: "yes", // 1
  smoking: "current", // 1
  sleep: "lt6", // 1
  exercise: "lt90", // 1
  diet: "poor", // 1
  alcohol: "gt21", // 1
  concentrating: "yes", // 1
  judgement: "yes", // 1
  forgetfulness: "yes", // 1
  persistence: "yes", // 3
  someoneElseNoticed: "yes", // 2
};

describe("scoring engine", () => {
  it("sums a maximal profile to 25 and bands it High", () => {
    const r = computeScore(maxAnswers);
    expect(r.riskScore).toBe(17);
    expect(r.symptomScore).toBe(8);
    expect(r.total).toBe(25);
    expect(r.band).toBe("high");
  });

  it("scores an all-zero profile as 0 / Low", () => {
    const r = computeScore({
      age: "20-34",
      sex: "male",
      familyHistory: "none",
      highBp: "no",
      smoking: "never",
      sleep: "7to9",
      exercise: "gt150",
      diet: "healthy",
      alcohol: "lt14",
    });
    expect(r.total).toBe(0);
    expect(r.band).toBe("low");
  });

  it("handles half-point lifestyle scores", () => {
    const half: Answers = {
      smoking: "past", // .5
      sleep: "6to7", // .5
      exercise: "90to150", // .5
      diet: "moderate", // .5
      alcohol: "15to21", // .5
    };
    expect(scoreRiskAxis(half)).toBe(2.5);
  });

  it("does not count hot flushes for males", () => {
    expect(scoreRiskAxis({ sex: "male", hotFlushes: "yes" })).toBe(0);
    expect(scoreRiskAxis({ sex: "female", hotFlushes: "yes" })).toBe(1);
  });

  it("sums the symptom axis independently", () => {
    expect(
      scoreSymptomAxis({
        concentrating: "yes",
        judgement: "yes",
        forgetfulness: "yes",
        persistence: "yes",
        someoneElseNoticed: "yes",
      }),
    ).toBe(8);
  });

  it("exposes the per-axis bands for transparency", () => {
    const r = computeScore(maxAnswers);
    expect(r.riskBand).toBe("high");
    expect(r.symptomBand).toBe("high");
    expect(r.bandFromTotal).toBe("high");
  });
});
