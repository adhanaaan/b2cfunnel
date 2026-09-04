import { describe, expect, it, vi } from "vitest";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";

/**
 * IHH SEA Regatta (/ihhsearegatta) is the v3 arc, open, with the partner
 * consent moved from its own page onto the landing and the questionnaire
 * invite added between the post-game result and the quiz.
 *
 * The v3 challenge switch is pinned OPEN here so the two arcs are compared
 * like for like; that closing v3 leaves the regatta alone whichever way the
 * live switch is set is asserted separately, against the real config, below.
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

describe("ihhsearegatta flow", () => {
  it("asks exactly the event2/event3 questions", () => {
    const answerSets: Answers[] = [
      {},
      { forgetfulness: "notNotice" },
      { forgetfulness: "almostDaily", sex: "female" },
    ];
    for (const answers of answerSets) {
      expect(idsIn(resolveFlow(answers, "ihhsearegatta"))).toEqual(
        idsIn(resolveFlow(answers, "event2")),
      );
    }
  });

  // IHH is the partner at this event too, but its consent is a row on the
  // landing (Event3Splash, design="ihhsearegatta") rather than a page of its
  // own - so the landing leads straight into the instructions.
  it("goes from the landing to the instructions with no consent page", () => {
    const flow = kindsIn(resolveFlow({}, "ihhsearegatta"));
    expect(flow).not.toContain("consent");
    expect(flow.indexOf("instructions")).toBe(flow.indexOf("nameGate") + 1);
  });

  it("puts the questionnaire invite between the result card and the first question", () => {
    const flow = kindsIn(resolveFlow({}, "ihhsearegatta"));
    const invite = flow.indexOf("quizInvite");
    expect(invite).toBe(flow.indexOf("gameResult") + 1);
    expect(invite).toBeLessThan(flow.indexOf("question"));
  });

  // "Not now" on the invite skips forward to the closing screen, so that step
  // has to be in the flow AND behind the invite for SKIP_TO_KIND to find it.
  it("has a closing screen for the decline path to land on", () => {
    const flow = kindsIn(resolveFlow({}, "ihhsearegatta"));
    expect(flow.indexOf("closing")).toBeGreaterThan(flow.indexOf("quizInvite"));
  });

  it("is the v3 step sequence minus the consent page, plus the invite", () => {
    expect(
      kindsIn(resolveFlow({}, "ihhsearegatta")).filter(
        (k) => k !== "quizInvite",
      ),
    ).toEqual(
      kindsIn(resolveFlow({}, "event3")).filter((k) => k !== "consent"),
    );
  });

  // The link is open: nothing in this arc ends on the "That's a wrap!" screen.
  it("never ends on the wrap screen", () => {
    expect(kindsIn(resolveFlow({}, "ihhsearegatta"))).not.toContain("wrap");
  });

  it("leaves the invite out of every other variant", () => {
    for (const variant of ["event3", "event2", "rotary", "event6"] as const) {
      expect(kindsIn(resolveFlow({}, variant))).not.toContain("quizInvite");
    }
  });
});

/**
 * The two things that would be silent if they broke: closing the DBS challenge
 * reaching across into this event (it must not - this link is open), and the
 * question set drifting off event2's, which is what keeps a regatta score
 * comparable with every score already recorded. Both asserted against the REAL
 * config, not the mock above.
 */
describe("ihhsearegatta against the live config", () => {
  it("is untouched by the v3 challenge switch", async () => {
    vi.doUnmock("@/config/event");
    vi.resetModules();
    const live = await import("@/config/funnelFlow");
    const { EVENT3_CHALLENGE_CLOSED } = await import("@/config/event");

    // Proof the unmock took, whichever way the live switch is set.
    expect(live.resolveFlow({}, "event3").some((s) => s.kind === "wrap")).toBe(
      EVENT3_CHALLENGE_CLOSED,
    );

    expect(kindsIn(live.resolveFlow({}, "ihhsearegatta"))).toEqual(
      kindsIn(resolveFlow({}, "ihhsearegatta")),
    );
    expect(
      live.resolveFlow({}, "ihhsearegatta").some((s) => s.kind === "wrap"),
    ).toBe(false);

    for (const axis of ["risk", "symptom"] as const) {
      expect(live.achievableAxisMax("ihhsearegatta", axis)).toBe(
        live.achievableAxisMax("event2", axis),
      );
      expect(achievableAxisMax("ihhsearegatta", axis)).toBeGreaterThan(0);
    }
  });
});
