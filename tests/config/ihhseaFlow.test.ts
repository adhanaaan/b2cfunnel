import { describe, expect, it, vi } from "vitest";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";

/**
 * IHH SEA Regatta (/ihhsearegatta) is the v3 arc with the partner consent
 * moved from its own page onto the landing and the questionnaire invite added
 * between the post-game result and the quiz.
 *
 * This file is the arc while the regatta is OPEN; ihhseaClosed.test.ts covers
 * it while IHHSEA_CHALLENGE_CLOSED is on. Both challenge switches are pinned
 * OPEN here so the two arcs are compared like for like; that neither event's
 * switch reaches into the other's is asserted separately, against the real
 * config, below.
 */
vi.mock("@/config/event", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/config/event")>()),
  EVENT3_CHALLENGE_CLOSED: false,
  IHHSEA_CHALLENGE_CLOSED: false,
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

  // "Not now" on the invite steps BACK to the result card (Funnel.tsx), which
  // is only one step because the invite sits directly behind it.
  it("puts the invite one step ahead of the result card, for the decline to step back to", () => {
    const flow = kindsIn(resolveFlow({}, "ihhsearegatta"));
    expect(flow[flow.indexOf("quizInvite") - 1]).toBe("gameResult");
  });

  // The standalone ReCOGnAIze closing page is gone from this arc: the report
  // carries that offer itself, and with the decline going backwards there is
  // nothing left that could reach the page.
  it("ends on the report, with no closing screen", () => {
    const flow = kindsIn(resolveFlow({}, "ihhsearegatta"));
    expect(flow).not.toContain("closing");
    expect(flow[flow.length - 1]).toBe("result");
  });

  // The closing page stays where it is for every other daylight arc.
  it("leaves the closing screen in the other daylight variants", () => {
    for (const variant of ["event2", "event3", "rotary", "ntuhomecoming"] as const) {
      expect(kindsIn(resolveFlow({}, variant))).toContain("closing");
    }
  });

  it("is the v3 step sequence minus the consent and closing pages, plus the invite", () => {
    expect(
      kindsIn(resolveFlow({}, "ihhsearegatta")).filter(
        (k) => k !== "quizInvite",
      ),
    ).toEqual(
      kindsIn(resolveFlow({}, "event3")).filter(
        (k) => k !== "consent" && k !== "closing",
      ),
    );
  });

  // While the regatta is open, nothing in this arc reaches the "That's a
  // wrap!" screen - only its own switch puts it there.
  it("never ends on the wrap screen while it is open", () => {
    expect(kindsIn(resolveFlow({}, "ihhsearegatta"))).not.toContain("wrap");
  });

  it("leaves the invite out of every other variant", () => {
    for (const variant of ["event3", "event2", "rotary", "event6"] as const) {
      expect(kindsIn(resolveFlow({}, variant))).not.toContain("quizInvite");
    }
  });
});

/**
 * The two things that would be silent if they broke: one event's challenge
 * switch reaching across into the other's (the regatta is closed by its own
 * switch and nothing else), and the question set drifting off event2's, which
 * is what keeps a regatta score comparable with every score already recorded.
 * Both asserted against the REAL config, not the mock above.
 */
describe("ihhsearegatta against the live config", () => {
  it("is closed by its own switch only, never by the v3 one", async () => {
    vi.doUnmock("@/config/event");
    vi.resetModules();
    const live = await import("@/config/funnelFlow");
    const { EVENT3_CHALLENGE_CLOSED, IHHSEA_CHALLENGE_CLOSED } = await import(
      "@/config/event"
    );

    // Proof the unmock took, whichever way the live switches are set.
    expect(live.resolveFlow({}, "event3").some((s) => s.kind === "wrap")).toBe(
      EVENT3_CHALLENGE_CLOSED,
    );

    // The regatta follows its own switch, and only its own.
    expect(
      live.resolveFlow({}, "ihhsearegatta").some((s) => s.kind === "wrap"),
    ).toBe(IHHSEA_CHALLENGE_CLOSED);

    if (!IHHSEA_CHALLENGE_CLOSED) {
      expect(kindsIn(live.resolveFlow({}, "ihhsearegatta"))).toEqual(
        kindsIn(resolveFlow({}, "ihhsearegatta")),
      );
    }

    for (const axis of ["risk", "symptom"] as const) {
      expect(live.achievableAxisMax("ihhsearegatta", axis)).toBe(
        live.achievableAxisMax("event2", axis),
      );
      expect(achievableAxisMax("ihhsearegatta", axis)).toBeGreaterThan(0);
    }
  });
});
