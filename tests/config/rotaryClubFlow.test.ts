import { describe, expect, it } from "vitest";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";
import { achievableAxisMax, resolveFlow } from "@/config/funnelFlow";
import {
  ROTARY_CLUB_SOURCE,
  ROTARY_SOURCE,
  eventSource,
} from "@/config/event";
import { EVENT_PATHS } from "@/config/eventLinks";
import { isPreviewVariant, usesDaylightScreens } from "@/config/variants";
import { COPY } from "@/config/copy";

/**
 * /rotary is KL-WAM's arc for a different club, on a bucket of its own.
 *
 * What must hold: the STEPS are KL-WAM's exactly, so the question set, the
 * scoring maxima and therefore every score recorded stay comparable with every
 * event before it; and the two clubs' rows carry different tags, so one club's
 * board can never show the other's room.
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

describe("rotary club flow", () => {
  it("is KL-WAM's arc, step for step", () => {
    for (const answers of ANSWER_SETS) {
      expect(kindsIn(resolveFlow(answers, "rotaryclub"))).toEqual(
        kindsIn(resolveFlow(answers, "rotary")),
      );
      expect(idsIn(resolveFlow(answers, "rotaryclub"))).toEqual(
        idsIn(resolveFlow(answers, "rotary")),
      );
    }
  });

  it("scores on the same maxima, so results stay comparable", () => {
    for (const axis of ["risk", "symptom"] as const) {
      expect(achievableAxisMax("rotaryclub", axis)).toBe(
        achievableAxisMax("rotary", axis),
      );
    }
  });

  it("ranks in a bucket of its own, never KL-WAM's", () => {
    expect(eventSource("rotaryclub")).toBe(ROTARY_CLUB_SOURCE);
    expect(ROTARY_CLUB_SOURCE).not.toBe(ROTARY_SOURCE);
    // A live event: its players are real and must be recorded.
    expect(isPreviewVariant("rotaryclub")).toBe(false);
  });

  it("is served at its own route, and wears the daylight screens", () => {
    expect(EVENT_PATHS.rotaryclub).toBe("/rotary");
    expect(EVENT_PATHS.rotaryclub).not.toBe(EVENT_PATHS.rotary);
    expect(usesDaylightScreens("rotaryclub")).toBe(true);
  });

  it("carries no club name: this event asked for the generic wording", () => {
    expect(COPY.screens.rotaryclub.splash).toEqual(COPY.screens.rotary.splash);
    expect(COPY.screens.rotaryclub.splash.heading).not.toMatch(/rotary/i);
  });
});
