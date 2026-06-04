import { describe, it, expect } from "vitest";
import { detectPersona } from "@/engine/persona";
import type { Answers } from "@/types/question";

describe("persona detection", () => {
  it("detects perimenopausal for a 45-54 woman with hot flushes", () => {
    const answers: Answers = {
      sex: "female",
      age: "45-54",
      hotFlushes: "yes",
    };
    expect(detectPersona(answers)).toBe("perimenopausal");
  });

  it("detects perimenopausal via hormone tracking signal", () => {
    expect(
      detectPersona({ sex: "female", age: "35-44", tracks: ["hormones"] }),
    ).toBe("perimenopausal");
  });

  it("detects caregiver when caring for family", () => {
    expect(
      detectPersona({ sex: "male", age: "45-54", tracks: ["family"] }),
    ).toBe("caregiver");
  });

  it("detects high performer for a younger, optimisation-led user", () => {
    expect(
      detectPersona({ sex: "male", age: "20-34", tracks: ["performance"] }),
    ).toBe("highPerformer");
  });

  it("defaults to neutral when there is no clear signal", () => {
    expect(detectPersona({ sex: "male", age: "45-54" })).toBe("neutral");
    expect(detectPersona({})).toBe("neutral");
  });
});
