import { describe, it, expect } from "vitest";
import {
  resolveFlow,
  totalQuestions,
} from "@/config/funnelFlow";

describe("funnel flow resolution", () => {
  it("does not include the removed questions in the lite flow", () => {
    const removed = [
      "hotFlushes",
      "familyHistory",
      "hearingLoss",
      "visionLoss",
      "someoneElseNoticed",
    ];
    const flow = resolveFlow({ sex: "female", forgetfulness: "almostDaily" });
    const presentIds = flow.flatMap((s) =>
      s.kind === "question"
        ? [s.questionId]
        : s.kind === "questionGroup"
          ? s.questionIds
          : [],
    );
    for (const id of removed) expect(presentIds).not.toContain(id);
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
    const base = totalQuestions({ forgetfulness: "notNotice" });
    const withPersistence = totalQuestions({ forgetfulness: "almostDaily" });
    // Noticing forgetfulness exposes 1 extra question (persistence).
    expect(withPersistence - base).toBe(1);
  });

  it("includes the lite flow's two stat cards", () => {
    const cards = resolveFlow({}).filter((s) => s.kind === "statCard");
    expect(cards).toHaveLength(2);
  });
});
