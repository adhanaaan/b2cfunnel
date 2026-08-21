import { describe, it, expect } from "vitest";
import {
  ACTIONS_BY_FACTOR,
  DEFAULT_ACTIONS,
  SPEED_ACTIONS,
  pickActions,
} from "@/config/actions";

const LIBRARY = [
  ...Object.values(ACTIONS_BY_FACTOR),
  ...DEFAULT_ACTIONS,
  SPEED_ACTIONS.strong,
  SPEED_ACTIONS.build,
];

const factors = (...ids: string[]) => ids.map((id) => ({ id }));

describe("pickActions", () => {
  it("always returns exactly three distinct actions from the library", () => {
    const cases = [
      { drivingFactors: [], band: "low" as const },
      { drivingFactors: factors("sleep"), band: "moderate" as const },
      {
        drivingFactors: factors("sleep", "diet", "exercise", "alcohol"),
        band: "high" as const,
      },
      // Non-modifiable factors have no action and must not leave a gap.
      { drivingFactors: factors("age", "familyHistory"), band: "elevated" as const },
      { drivingFactors: factors("sleep"), band: "low" as const, gameTimeMs: 14800 },
    ];
    for (const input of cases) {
      const picked = pickActions(input);
      expect(picked).toHaveLength(3);
      expect(new Set(picked).size).toBe(3);
      for (const text of picked) expect(LIBRARY).toContain(text);
    }
  });

  it("leads with the reaction-time line only when they played", () => {
    const withGame = pickActions({
      drivingFactors: factors("sleep"),
      band: "low",
      gameTimeMs: 12000,
    });
    expect(withGame[0]).toBe(SPEED_ACTIONS.strong);

    const withoutGame = pickActions({
      drivingFactors: factors("sleep"),
      band: "low",
    });
    expect(withoutGame).not.toContain(SPEED_ACTIONS.strong);
    expect(withoutGame).not.toContain(SPEED_ACTIONS.build);
  });

  it("picks the protective line for a strong band and the building line otherwise", () => {
    const strong = pickActions({ drivingFactors: [], band: "low", gameTimeMs: 1 });
    const building = pickActions({ drivingFactors: [], band: "high", gameTimeMs: 1 });
    expect(strong[0]).toBe(SPEED_ACTIONS.strong);
    expect(building[0]).toBe(SPEED_ACTIONS.build);
  });

  it("follows the engine's impact order for factor actions", () => {
    const picked = pickActions({
      drivingFactors: factors("diet", "sleep", "exercise"),
      band: "moderate",
    });
    expect(picked).toEqual([
      ACTIONS_BY_FACTOR.diet,
      ACTIONS_BY_FACTOR.sleep,
      ACTIONS_BY_FACTOR.exercise,
    ]);
  });

  it("fills from the defaults when few factors surfaced", () => {
    const picked = pickActions({ drivingFactors: factors("smoking"), band: "high" });
    expect(picked[0]).toBe(ACTIONS_BY_FACTOR.smoking);
    expect(picked.slice(1)).toEqual(DEFAULT_ACTIONS.slice(0, 2));
  });

  it("never duplicates when a factor action is also reachable elsewhere", () => {
    const picked = pickActions({
      drivingFactors: factors("sleep", "sleep", "sleep"),
      band: "moderate",
    });
    expect(new Set(picked).size).toBe(3);
  });
});
