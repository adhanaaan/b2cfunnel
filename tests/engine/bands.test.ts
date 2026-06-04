import { describe, it, expect } from "vitest";
import {
  bandForTotal,
  bandForRiskAxis,
  bandForSymptomAxis,
  worseBand,
} from "@/engine/bands";
import { computeScore } from "@/engine/scoring";
import type { Answers } from "@/types/question";

describe("band thresholds (total)", () => {
  it.each([
    [0, "low"],
    [6, "low"],
    [7, "moderate"],
    [13, "moderate"],
    [14, "elevated"],
    [19, "elevated"],
    [20, "high"],
    [25, "high"],
  ])("total %i -> %s", (total, expected) => {
    expect(bandForTotal(total)).toBe(expected);
  });
});

describe("worseBand", () => {
  it("returns the higher-order band", () => {
    expect(worseBand("low", "elevated")).toBe("elevated");
    expect(worseBand("moderate", "high", "low")).toBe("high");
    expect(worseBand("low", "low")).toBe("low");
  });
});

describe("worse-of-two-axes safety logic", () => {
  it("a low total but loud symptom axis lands at the worse band", () => {
    // Risk axis stays low; symptom axis = concentrating(1)+judgement(1)+
    // forgetfulness(1)+noticed(2) = 5 -> 'elevated' by per-axis map.
    const answers: Answers = {
      age: "18-29",
      sex: "male",
      familyHistory: "none",
      concentrating: "almostDaily",
      judgement: "almostDaily",
      forgetfulness: "almostDaily",
      someoneElseNoticed: "yes",
    };
    const r = computeScore(answers);
    expect(r.riskBand).toBe("low");
    expect(r.symptomBand).toBe("elevated");
    expect(bandForSymptomAxis(r.symptomScore)).toBe("elevated");
    expect(bandForRiskAxis(r.riskScore)).toBe("low");
    expect(r.band).toBe("elevated"); // worse of the two wins
  });
});
