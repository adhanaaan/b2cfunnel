import { describe, expect, it } from "vitest";
import { resolveFlow } from "@/config/funnelFlow";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";

const idsIn = (flow: FunnelStep[]): string[] =>
  flow.flatMap((s) =>
    s.kind === "question"
      ? [s.questionId]
      : s.kind === "questionGroup"
        ? s.questionIds
        : [],
  );

const kindsIn = (flow: FunnelStep[]) => flow.map((s) => s.kind);

describe("event3 flow", () => {
  // Event v3 redesigns the arena screens and drops the statistics
  // interstitials, but its QUESTION set must stay identical to event2 so
  // normalised scores, bands and the shared leaderboard remain comparable.
  it("asks exactly the event2 questions", () => {
    const answerSets: Answers[] = [
      {},
      { forgetfulness: "notNotice" },
      { forgetfulness: "almostDaily", sex: "female" },
    ];
    for (const answers of answerSets) {
      expect(idsIn(resolveFlow(answers, "event3"))).toEqual(
        idsIn(resolveFlow(answers, "event2")),
      );
    }
  });

  it("is the event2 step sequence minus the statistics pages, plus the consent page", () => {
    const v3 = kindsIn(resolveFlow({}, "event3"));
    expect(v3.filter((k) => k !== "consent")).toEqual(
      kindsIn(resolveFlow({}, "event2")).filter((k) => k !== "statCard"),
    );
    expect(v3).not.toContain("statCard");
  });

  // The consent page has to be answered before anything is played, and the
  // demo round lives on the instructions screen - so it sits between the
  // landing and the instructions, not anywhere later.
  it("asks for consent after the landing and before the instructions", () => {
    const v3 = kindsIn(resolveFlow({}, "event3"));
    expect(v3.indexOf("consent")).toBe(v3.indexOf("nameGate") + 1);
    expect(v3.indexOf("consent")).toBeLessThan(v3.indexOf("instructions"));
    expect(v3.indexOf("consent")).toBeLessThan(v3.indexOf("game"));
  });

  it("shows the consent page exactly once", () => {
    expect(kindsIn(resolveFlow({}, "event3")).filter((k) => k === "consent"))
      .toHaveLength(1);
  });
});
