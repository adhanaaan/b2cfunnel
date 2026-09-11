import { describe, expect, it } from "vitest";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";
import { achievableAxisMax, resolveFlow } from "@/config/funnelFlow";
import { eventSource } from "@/config/event";
import { EVENT_PATHS } from "@/config/eventLinks";
import {
  isPreviewVariant,
  usesDaylightScreens,
  usesMambaScreens,
} from "@/config/variants";

/**
 * /event-v7 is the #MambaCares arc with the share moment on the report. The
 * moment is a component, not a step, so the two arcs must stay identical
 * underneath: if v7's steps ever drift from mambacares', the experiment stops
 * measuring the moment and starts measuring a different funnel.
 */

const idsIn = (flow: FunnelStep[]): string[] =>
  flow.flatMap((s) =>
    s.kind === "question"
      ? [s.questionId]
      : s.kind === "questionGroup"
        ? s.questionIds
        : [],
  );

const kindsIn = (flow: FunnelStep[]) => flow.map((s) => s.kind);

const ANSWER_SETS: Answers[] = [
  {},
  { forgetfulness: "notNotice" },
  { forgetfulness: "almostDaily", sex: "female" },
];

describe("event7 flow", () => {
  it("is the mambacares arc, step for step", () => {
    for (const answers of ANSWER_SETS) {
      const v7 = resolveFlow(answers, "event7");
      const mamba = resolveFlow(answers, "mambacares");
      expect(kindsIn(v7)).toEqual(kindsIn(mamba));
      expect(idsIn(v7)).toEqual(idsIn(mamba));
    }
  });

  it("scores on the same maxima, so results are comparable", () => {
    for (const axis of ["risk", "symptom"] as const) {
      expect(achievableAxisMax("event7", axis)).toBe(
        achievableAxisMax("mambacares", axis),
      );
    }
  });

  it("records nothing: it is a preview", () => {
    expect(isPreviewVariant("event7")).toBe(true);
    // A preview must never carry an event's bucket, or a walk-through could be
    // tagged into real standings if a write path were ever missed.
    expect(eventSource("event7")).toBeNull();
  });

  it("wears the mambacares screens", () => {
    expect(usesMambaScreens("event7")).toBe(true);
    expect(usesDaylightScreens("event7")).toBe(true);
  });

  it("sends a shared card to the real run, not to the preview", () => {
    expect(EVENT_PATHS.event7).toBe(EVENT_PATHS.mambacares);
  });
});
