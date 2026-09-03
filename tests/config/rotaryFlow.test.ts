import { describe, expect, it, vi } from "vitest";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";

/**
 * Rotary KL-WAM (/rotaryklwam) is the v3 arc with no partner in the event.
 *
 * The v3 challenge switch is pinned OPEN here so the two arcs are compared
 * like for like; that closing v3 leaves rotary alone whichever way the live
 * switch is set is asserted separately, against the real config, below.
 */
vi.mock("@/config/event", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/config/event")>()),
  EVENT3_CHALLENGE_CLOSED: false,
}));

const { resolveFlow, achievableAxisMax } = await import("@/config/funnelFlow");

const idsIn = (flow: FunnelStep[]): string[] =>
  flow.flatMap((s) =>
    s.kind === "question"
      ? [s.questionId]
      : s.kind === "questionGroup"
        ? s.questionIds
        : [],
  );

const kindsIn = (flow: FunnelStep[]) => flow.map((s) => s.kind);

describe("rotary flow", () => {
  it("asks exactly the event2/event3 questions", () => {
    const answerSets: Answers[] = [
      {},
      { forgetfulness: "notNotice" },
      { forgetfulness: "almostDaily", sex: "female" },
    ];
    for (const answers of answerSets) {
      expect(idsIn(resolveFlow(answers, "rotary"))).toEqual(
        idsIn(resolveFlow(answers, "event2")),
      );
    }
  });

  // No partner in this event, so nothing to consent to: the landing leads
  // straight into the instructions and their demo round.
  it("goes from the landing to the instructions with no consent page", () => {
    const rotary = kindsIn(resolveFlow({}, "rotary"));
    expect(rotary).not.toContain("consent");
    expect(rotary.indexOf("instructions")).toBe(
      rotary.indexOf("nameGate") + 1,
    );
  });

  it("is the v3 step sequence minus the consent page", () => {
    expect(kindsIn(resolveFlow({}, "rotary"))).toEqual(
      kindsIn(resolveFlow({}, "event3")).filter((k) => k !== "consent"),
    );
  });

  it("never ends on the wrap screen", () => {
    expect(kindsIn(resolveFlow({}, "rotary"))).not.toContain("wrap");
  });
});

/**
 * The two things that would be silent if they broke: closing the DBS challenge
 * reaching across into this event, and the question set drifting off event2's
 * (which is what keeps a rotary score comparable with every score already
 * recorded). Both asserted against the REAL config, not the mock above.
 */
describe("rotary against the live config", () => {
  it("is untouched by the v3 challenge switch", async () => {
    vi.doUnmock("@/config/event");
    vi.resetModules();
    const live = await import("@/config/funnelFlow");
    const { EVENT3_CHALLENGE_CLOSED } = await import("@/config/event");

    // Proof the unmock took, whichever way the live switch is set.
    expect(live.resolveFlow({}, "event3").some((s) => s.kind === "wrap")).toBe(
      EVENT3_CHALLENGE_CLOSED,
    );

    expect(kindsIn(live.resolveFlow({}, "rotary"))).toEqual(
      kindsIn(resolveFlow({}, "rotary")),
    );
    expect(live.resolveFlow({}, "rotary").some((s) => s.kind === "wrap")).toBe(
      false,
    );

    for (const axis of ["risk", "symptom"] as const) {
      expect(live.achievableAxisMax("rotary", axis)).toBe(
        live.achievableAxisMax("event2", axis),
      );
      expect(achievableAxisMax("rotary", axis)).toBeGreaterThan(0);
    }
  });
});
