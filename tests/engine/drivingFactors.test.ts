import { describe, it, expect } from "vitest";
import { getDrivingFactors } from "@/engine/drivingFactors";
import { computeScore } from "@/engine/scoring";
import type { Answers } from "@/types/question";

describe("driving factors", () => {
  it("includes only risk-axis factors the user reported (score > 0)", () => {
    const answers: Answers = {
      highBp: "yes",
      highCholesterol: "yes",
      exercise: "lt90",
      sleep: "lt6",
      diet: "healthy", // score 0 -> excluded
      smoking: "never", // score 0 -> excluded
    };
    const ids = getDrivingFactors(answers).map((f) => f.id);
    expect(ids).toEqual(
      expect.arrayContaining(["highBp", "highCholesterol", "exercise", "sleep"]),
    );
    expect(ids).not.toContain("diet");
    expect(ids).not.toContain("smoking");
  });

  it("never includes symptom items", () => {
    const answers: Answers = {
      highBp: "yes",
      concentrating: "yes",
      persistence: "yes",
      someoneElseNoticed: "yes",
    };
    const factors = computeScore(answers).drivingFactors;
    expect(factors.every((f) => f.axis === "risk")).toBe(true);
    expect(factors.map((f) => f.id)).not.toContain("concentrating");
  });

  it("resolves human-readable labels", () => {
    const factors = getDrivingFactors({ highBp: "yes" });
    expect(factors[0].label).toBe("Blood pressure");
  });
});
