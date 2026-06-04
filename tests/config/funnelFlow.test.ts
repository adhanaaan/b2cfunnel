import { describe, it, expect } from "vitest";
import {
  resolveFlow,
  totalQuestions,
} from "@/config/funnelFlow";

describe("funnel flow resolution", () => {
  it("prunes the hot-flushes question for non-female users", () => {
    const male = resolveFlow({ sex: "male" });
    expect(
      male.some((s) => s.kind === "question" && s.questionId === "hotFlushes"),
    ).toBe(false);

    const female = resolveFlow({ sex: "female" });
    expect(
      female.some((s) => s.kind === "question" && s.questionId === "hotFlushes"),
    ).toBe(true);
  });

  it("prunes the persistence question unless forgetfulness is noticed", () => {
    const without = resolveFlow({ forgetfulness: "notNotice" });
    expect(
      without.some(
        (s) => s.kind === "question" && s.questionId === "persistence",
      ),
    ).toBe(false);

    const withIt = resolveFlow({ forgetfulness: "almostDaily" });
    expect(
      withIt.some(
        (s) => s.kind === "question" && s.questionId === "persistence",
      ),
    ).toBe(true);
  });

  it("keeps the progress denominator honest as branches prune", () => {
    const male = totalQuestions({ sex: "male", forgetfulness: "notNotice" });
    const female = totalQuestions({ sex: "female", forgetfulness: "almostDaily" });
    // Female + forgetfulness exposes 2 extra questions (hotFlushes, persistence).
    expect(female - male).toBe(2);
  });

  it("includes exactly three stat cards", () => {
    const cards = resolveFlow({}).filter((s) => s.kind === "statCard");
    expect(cards).toHaveLength(3);
  });
});
