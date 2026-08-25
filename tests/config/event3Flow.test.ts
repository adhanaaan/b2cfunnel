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
  // Event v3 only redesigns the arena screens; its question set and step
  // sequence must stay identical to event2 so normalised scores, bands and
  // the shared leaderboard remain comparable across both funnels.
  it("is exactly the event2 flow", () => {
    const answerSets: Answers[] = [
      {},
      { forgetfulness: "notNotice" },
      { forgetfulness: "almostDaily", sex: "female" },
    ];
    for (const answers of answerSets) {
      expect(idsIn(resolveFlow(answers, "event3"))).toEqual(
        idsIn(resolveFlow(answers, "event2")),
      );
      expect(kindsIn(resolveFlow(answers, "event3"))).toEqual(
        kindsIn(resolveFlow(answers, "event2")),
      );
    }
  });
});
