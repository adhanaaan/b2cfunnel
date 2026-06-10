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

describe("event variant scoring (normalised to /100)", () => {
  // The event quiz drops several questions (lower achievable max), so its
  // scores are scaled back onto the /100 scale to stay comparable.
  const eventMax: Answers = {
    age: "60+", // 12
    sex: "female",
    highBp: "yes", // 4
    highCholesterol: "yes", // 4
    diabetes: "yes", // 4
    smoking: "current", // 4
    sleep: "lt6", // 4
    exercise: "lt75", // 4
    diet: "poor", // 4
    alcohol: "gt21", // 4  -> raw risk 44
    concentrating: "almostDaily", // 4
    judgement: "almostDaily", // 4
    forgetfulness: "almostDaily", // 4
    persistence: "yes", // 12  -> raw symptom 24
  };

  it("scales a maxed event profile up to 100 / High", () => {
    const r = computeScore(eventMax, "event");
    expect(r.riskScore).toBe(68); // 44 raw * 68/44
    expect(r.symptomScore).toBe(32); // 24 raw * 32/24
    expect(r.total).toBe(100);
    expect(r.band).toBe("high");
  });

  // A real, moderate event profile that the old (deflated) scoring buried.
  const eventModerate: Answers = {
    age: "50-59", // 8
    highBp: "yes", // 4
    diabetes: "yes", // 4
    exercise: "lt75", // 4
    diet: "poor", // 4  -> raw risk 24
  };

  it("lifts a mid event profile out of the artificial 'low' band", () => {
    const r = computeScore(eventModerate, "event");
    expect(r.total).toBe(37); // round(24 * 68/44)
    expect(r.band).toBe("moderate");
  });

  it("leaves the full quiz unchanged for the same answers", () => {
    const r = computeScore(eventModerate, "full");
    expect(r.total).toBe(24); // scale factor 1
    expect(r.band).toBe("low");
  });

  it("keeps a zero event profile at 0 / Low", () => {
    const r = computeScore(
      { age: "18-29", sex: "male", highBp: "no", smoking: "never" },
      "event",
    );
    expect(r.total).toBe(0);
    expect(r.band).toBe("low");
  });
});
