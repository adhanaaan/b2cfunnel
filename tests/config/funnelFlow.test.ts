import { describe, it, expect } from "vitest";
import { resolveFlow, totalQuestions } from "@/config/funnelFlow";

const idsIn = (flow: ReturnType<typeof resolveFlow>) =>
  flow.flatMap((s) =>
    s.kind === "question"
      ? [s.questionId]
      : s.kind === "questionGroup"
        ? s.questionIds
        : [],
  );

describe("event flow", () => {
  it("omits the questions removed from the event variant", () => {
    const removed = [
      "hotFlushes",
      "familyHistory",
      "hearingLoss",
      "visionLoss",
      "someoneElseNoticed",
    ];
    const present = idsIn(
      resolveFlow({ sex: "female", forgetfulness: "almostDaily" }, "event"),
    );
    for (const id of removed) expect(present).not.toContain(id);
  });

  it("has two stat cards", () => {
    const cards = resolveFlow({}, "event").filter((s) => s.kind === "statCard");
    expect(cards).toHaveLength(2);
  });

  it("prunes persistence unless forgetfulness is noticed", () => {
    expect(idsIn(resolveFlow({ forgetfulness: "notNotice" }, "event"))).not.toContain(
      "persistence",
    );
    expect(
      idsIn(resolveFlow({ forgetfulness: "almostDaily" }, "event")),
    ).toContain("persistence");
  });
});

describe("full flow", () => {
  it("includes the full question set", () => {
    const present = idsIn(
      resolveFlow({ sex: "female", forgetfulness: "almostDaily" }, "full"),
    );
    for (const id of [
      "familyHistory",
      "hearingLoss",
      "visionLoss",
      "hotFlushes",
      "someoneElseNoticed",
    ]) {
      expect(present).toContain(id);
    }
  });

  it("has three stat cards", () => {
    const cards = resolveFlow({}, "full").filter((s) => s.kind === "statCard");
    expect(cards).toHaveLength(3);
  });

  it("prunes hot flushes for non-female users", () => {
    expect(idsIn(resolveFlow({ sex: "male" }, "full"))).not.toContain(
      "hotFlushes",
    );
    expect(idsIn(resolveFlow({ sex: "female" }, "full"))).toContain(
      "hotFlushes",
    );
  });
});

describe("progress denominator", () => {
  it("counts grouped pages as one and respects pruning", () => {
    const base = totalQuestions({ forgetfulness: "notNotice" }, "event");
    const withPersistence = totalQuestions(
      { forgetfulness: "almostDaily" },
      "event",
    );
    expect(withPersistence - base).toBe(1);
  });
});
