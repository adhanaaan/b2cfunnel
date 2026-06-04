import { describe, it, expect } from "vitest";
import { detectPersona } from "@/engine/persona";
import type { Answers } from "@/types/question";

describe("persona detection", () => {
  it("detects perimenopausal for a 50-59 woman with hot flushes", () => {
    const answers: Answers = {
      sex: "female",
      age: "50-59",
      hotFlushes: "yes",
    };
    expect(detectPersona(answers)).toBe("perimenopausal");
  });

  it("detects perimenopausal via hormone tracking signal", () => {
    expect(
      detectPersona({ sex: "female", age: "40-49", tracks: ["hormones"] }),
    ).toBe("perimenopausal");
  });

  it("detects caregiver when caring for family", () => {
    expect(
      detectPersona({ sex: "male", age: "50-59", tracks: ["family"] }),
    ).toBe("caregiver");
  });

  it("detects high performer for a younger, optimisation-led user", () => {
    expect(
      detectPersona({ sex: "male", age: "18-29", tracks: ["performance"] }),
    ).toBe("highPerformer");
  });

  it("defaults to neutral when there is no clear signal", () => {
    expect(detectPersona({ sex: "male", age: "50-59" })).toBe("neutral");
    expect(detectPersona({})).toBe("neutral");
  });
});
