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

describe("speedgame flow", () => {
  // /speedgame is an independent duplicate of event3's flow - same step
  // sequence and question set, which is what keeps normalised scores and
  // bands comparable across variants (achievableAxisMax sums max option
  // scores over a variant's own question set).
  it("is identical to the event3 flow", () => {
    const answerSets: Answers[] = [
      {},
      { forgetfulness: "notNotice" },
      { forgetfulness: "almostDaily", sex: "female" },
    ];
    for (const answers of answerSets) {
      expect(kindsIn(resolveFlow(answers, "speedgame"))).toEqual(
        kindsIn(resolveFlow(answers, "event3")),
      );
      expect(idsIn(resolveFlow(answers, "speedgame"))).toEqual(
        idsIn(resolveFlow(answers, "event3")),
      );
    }
  });
});
