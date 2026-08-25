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

  it("is the event2 step sequence minus the statistics pages", () => {
    expect(kindsIn(resolveFlow({}, "event3"))).toEqual(
      kindsIn(resolveFlow({}, "event2")).filter((k) => k !== "statCard"),
    );
    expect(kindsIn(resolveFlow({}, "event3"))).not.toContain("statCard");
  });
});
