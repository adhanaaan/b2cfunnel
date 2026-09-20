import { describe, expect, it } from "vitest";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";
import { achievableAxisMax, resolveFlow } from "@/config/funnelFlow";
import { EISAI_SOURCE, eventSource } from "@/config/event";
import { EVENT_PATHS } from "@/config/eventLinks";
import { isPreviewVariant, usesDaylightScreens } from "@/config/variants";
import { COPY, arcCopyFor } from "@/config/copy";

/**
 * Eisai's World Alzheimer's Day challenge (/eisai) is /general's arc with the
 * host's name in the hero and a bucket of its own.
 *
 * What must hold: the STEPS are /general's exactly, so the question set, the
 * scoring maxima and therefore every score recorded stay comparable with
 * /general, /phkl and event2; and this event's rows carry a tag of their own,
 * so an internal staff event's standings never mix with another event's.
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

describe("eisai flow", () => {
  it("is /general's arc, step for step", () => {
    for (const answers of ANSWER_SETS) {
      expect(kindsIn(resolveFlow(answers, "eisai"))).toEqual(
        kindsIn(resolveFlow(answers, "general")),
      );
      expect(idsIn(resolveFlow(answers, "eisai"))).toEqual(
        idsIn(resolveFlow(answers, "general")),
      );
    }
  });

  it("scores on the same maxima, so results stay comparable", () => {
    for (const axis of ["risk", "symptom"] as const) {
      expect(achievableAxisMax("eisai", axis)).toBe(
        achievableAxisMax("general", axis),
      );
    }
  });

  it("ranks in a bucket of its own", () => {
    expect(eventSource("eisai")).toBe(EISAI_SOURCE);
    expect(EISAI_SOURCE).not.toBe(eventSource("general"));
    // A live event: its walk-throughs are real players, and must be recorded.
    expect(isPreviewVariant("eisai")).toBe(false);
  });

  it("is served at its own route, and wears the daylight screens", () => {
    expect(EVENT_PATHS.eisai).toBe("/eisai");
    expect(usesDaylightScreens("eisai")).toBe(true);
  });

  it("names the host in the hero, and reads /general's arc copy otherwise", () => {
    expect(COPY.screens.eisai.splash.heading).toContain("Eisai");
    expect(COPY.screens.general.splash.heading).not.toContain("Eisai");
    // Everything but the hero is /general's, so the report cannot drift.
    expect(arcCopyFor("eisai").report).toEqual(arcCopyFor("general").report);
  });

  it("takes no partner consent: GMS keeps the data", () => {
    // An internal staff event. A partner block here would be a promise to
    // share that nobody has agreed to.
    expect(COPY.screens.eisai.splash).not.toHaveProperty("partnerConsent");
    expect(COPY.screens.eisai.splash.consentForm).toBe(
      COPY.screens.general.splash.consentForm,
    );
  });
});
