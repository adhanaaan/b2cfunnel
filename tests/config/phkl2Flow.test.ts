import { describe, expect, it } from "vitest";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";
import { achievableAxisMax, resolveFlow } from "@/config/funnelFlow";
import { PHKL2_SOURCE, PHKL_SOURCE, eventSource } from "@/config/event";
import { EVENT_PATHS } from "@/config/eventLinks";
import { isPreviewVariant, usesDaylightScreens } from "@/config/variants";
import { COPY, arcCopyFor } from "@/config/copy";

/**
 * /phkl-2 is /phkl run again for a second activation, on a bucket of its own.
 *
 * What must hold: the STEPS are /phkl's exactly, so the question set, the
 * scoring maxima and therefore every score recorded stay comparable with the
 * first activation; the two buckets differ, so one room's board never shows
 * the other's; and the partner consent is carried, because this event shares
 * what it collects with IHH Healthcare Malaysia exactly as /phkl does.
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

describe("phkl-2 flow", () => {
  it("is /phkl's arc, step for step", () => {
    for (const answers of ANSWER_SETS) {
      expect(kindsIn(resolveFlow(answers, "phkl2"))).toEqual(
        kindsIn(resolveFlow(answers, "phkl")),
      );
      expect(idsIn(resolveFlow(answers, "phkl2"))).toEqual(
        idsIn(resolveFlow(answers, "phkl")),
      );
    }
  });

  it("scores on the same maxima, so the two activations stay comparable", () => {
    for (const axis of ["risk", "symptom"] as const) {
      expect(achievableAxisMax("phkl2", axis)).toBe(
        achievableAxisMax("phkl", axis),
      );
    }
  });

  it("ranks in a bucket of its own, never /phkl's", () => {
    expect(eventSource("phkl2")).toBe(PHKL2_SOURCE);
    expect(PHKL2_SOURCE).not.toBe(PHKL_SOURCE);
    expect(isPreviewVariant("phkl2")).toBe(false);
  });

  it("is served at its own route, and wears the daylight screens", () => {
    expect(EVENT_PATHS.phkl2).toBe("/phkl-2");
    expect(EVENT_PATHS.phkl2).not.toBe(EVENT_PATHS.phkl);
    expect(usesDaylightScreens("phkl2")).toBe(true);
  });

  it("carries the partner consent, and links the policy on its own route", () => {
    // The same partner, so the same clauses - word for word, not a copy that
    // could drift from the wording IHH approved.
    expect(COPY.screens.phkl2.splash.partnerConsent).toBe(
      COPY.screens.phkl.splash.partnerConsent,
    );
    // ...but the link must not walk the reader off /phkl-2 mid-consent.
    expect(COPY.screens.phkl2.splash.privacyHref).toBe("/phkl-2/privacy-policy");
    expect(COPY.screens.phkl.splash.privacyHref).toBe("/phkl/privacy-policy");
  });

  it("reads /phkl's report, so the offer cannot drift", () => {
    expect(arcCopyFor("phkl2").report).toEqual(arcCopyFor("phkl").report);
  });
});
