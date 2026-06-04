import { describe, it, expect } from "vitest";
import {
  computeScore,
  scoreRiskAxis,
  scoreSymptomAxis,
} from "@/engine/scoring";
import type { Answers } from "@/types/question";

const maxAnswers: Answers = {
  age: "60+", // 3
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
  exercise: "lt75", // 1
  diet: "poor", // 1
  alcohol: "gt21", // 1
  concentrating: "almostDaily", // 1
  judgement: "almostDaily", // 1
  forgetfulness: "almostDaily", // 1
  persistence: "yes", // 3
  someoneElseNoticed: "yes", // 2
};

describe("scoring engine", () => {
  it("sums a maximal profile to 25 and bands it High", () => {
    const r = computeScore(maxAnswers);
    expect(r.riskScore).toBe(17);
    expect(r.symptomScore).toBe(8);
    expect(r.total).toBe(25);
    expect(r.scoreOutOf100).toBe(100);
    expect(r.band).toBe("high");
  });

  it("normalises the raw total onto a 0-100 scale for display", () => {
    expect(computeScore(maxAnswers).scoreOutOf100).toBe(100); // 25/25
    // A raw total of ~12.5 maps to ~50; check a mid case stays proportional.
    const mid = computeScore({ age: "60+", hearingLoss: "yes", highBp: "yes" }); // 3+2+1 = 6
    expect(mid.total).toBe(6);
    expect(mid.scoreOutOf100).toBe(Math.round((6 / 25) * 100)); // 24
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
    expect(r.scoreOutOf100).toBe(0);
    expect(r.band).toBe("low");
  });

  it("handles half-point lifestyle scores", () => {
    const half: Answers = {
      smoking: "past", // .5
      sleep: "6to7", // .5
      exercise: "75to149", // .5
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
        concentrating: "almostDaily",
        judgement: "almostDaily",
        forgetfulness: "almostDaily",
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
