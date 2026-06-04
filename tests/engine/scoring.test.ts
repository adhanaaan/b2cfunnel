import { describe, it, expect } from "vitest";
import {
  computeScore,
  scoreRiskAxis,
  scoreSymptomAxis,
} from "@/engine/scoring";
import type { Answers } from "@/types/question";

const maxAnswers: Answers = {
  age: "60+", // 12
  sex: "female",
  hotFlushes: "yes", // 4
  familyHistory: "immediate", // 8
  highBp: "yes", // 4
  highCholesterol: "yes", // 4
  diabetes: "yes", // 4
  hearingLoss: "yes", // 8
  visionLoss: "yes", // 4
  smoking: "current", // 4
  sleep: "lt6", // 4
  exercise: "lt75", // 4
  diet: "poor", // 4
  alcohol: "gt21", // 4
  concentrating: "almostDaily", // 4
  judgement: "almostDaily", // 4
  forgetfulness: "almostDaily", // 4
  persistence: "yes", // 12
  someoneElseNoticed: "yes", // 8
};

describe("scoring engine", () => {
  it("sums a maximal profile to 100 and bands it High", () => {
    const r = computeScore(maxAnswers);
    expect(r.riskScore).toBe(68);
    expect(r.symptomScore).toBe(32);
    expect(r.total).toBe(100);
    expect(r.maxTotal).toBe(100);
    expect(r.band).toBe("high");
  });

  it("scores an all-zero profile as 0 / Low", () => {
    const r = computeScore({
      age: "18-29",
      sex: "male",
      familyHistory: "none",
      highBp: "no",
      smoking: "never",
      sleep: "7to9",
      exercise: "150to300",
      diet: "healthy",
      alcohol: "none",
    });
    expect(r.total).toBe(0);
    expect(r.band).toBe("low");
  });

  it("handles partial-credit lifestyle scores", () => {
    const partial: Answers = {
      smoking: "past", // 2
      sleep: "6to7", // 2
      exercise: "75to149", // 2
      diet: "moderate", // 2
      alcohol: "15to21", // 2
    };
    expect(scoreRiskAxis(partial)).toBe(10);
  });

  it("does not count hot flushes for males", () => {
    expect(scoreRiskAxis({ sex: "male", hotFlushes: "yes" })).toBe(0);
    expect(scoreRiskAxis({ sex: "female", hotFlushes: "yes" })).toBe(4);
  });

  it("sums the symptom axis independently", () => {
    expect(
      scoreSymptomAxis({
        concentrating: "almostDaily",
        judgement: "almostDaily",
        forgetfulness: "almostDaily",
        persistence: "yes",
        someoneElseNoticed: "yes",
      }),
    ).toBe(32);
  });

  it("exposes the per-axis bands for transparency", () => {
    const r = computeScore(maxAnswers);
    expect(r.riskBand).toBe("high");
    expect(r.symptomBand).toBe("high");
    expect(r.bandFromTotal).toBe("high");
  });
});
