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
    [25, "low"],
    [26, "moderate"],
    [46, "moderate"],
    [50, "moderate"],
    [51, "elevated"],
    [75, "elevated"],
    [76, "high"],
    [100, "high"],
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

describe("displayed band follows the total score", () => {
  it("does not escalate the band from a loud symptom axis alone", () => {
    // Symptom axis = concentrating(4)+judgement(4)+forgetfulness(4)+noticed(8)
    // = 20, total = 20. Without the safety override (persistence not 'yes'),
    // the band follows the total, so 20 -> Low.
    const answers: Answers = {
      age: "18-29",
      sex: "male",
      concentrating: "almostDaily",
      judgement: "almostDaily",
      forgetfulness: "almostDaily",
      someoneElseNoticed: "yes",
    };
    const r = computeScore(answers);
    expect(r.total).toBe(20);
    expect(r.bandFromTotal).toBe("low");
    expect(r.band).toBe("low"); // band tracks the score
  });

  it("a moderate score reads as Moderate, not High", () => {
    // 46 falls in the 26-50 Moderate band.
    expect(bandForTotal(46)).toBe("moderate");
  });
});
