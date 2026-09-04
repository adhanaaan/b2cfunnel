import { describe, expect, it, vi } from "vitest";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";
import { playUrlFor } from "@/config/eventLinks";

/**
 * NTU Homecoming (/ntuhomecoming) is the v3 arc with no partner in the event -
 * the same arc /rotaryklwam ships.
 *
 * The v3 challenge switch is pinned OPEN here so the arcs are compared like
 * for like; that closing v3 leaves this event alone whichever way the live
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

const ANSWER_SETS: Answers[] = [
  {},
  { forgetfulness: "notNotice" },
  { forgetfulness: "almostDaily", sex: "female" },
];

describe("ntuhomecoming flow", () => {
  it("asks exactly the event2/event3 questions", () => {
    for (const answers of ANSWER_SETS) {
      expect(idsIn(resolveFlow(answers, "ntuhomecoming"))).toEqual(
        idsIn(resolveFlow(answers, "event2")),
      );
    }
  });

  // No partner in this event, so nothing to consent to: the landing leads
  // straight into the instructions and their demo round.
  it("goes from the landing to the instructions with no consent page", () => {
    const ntu = kindsIn(resolveFlow({}, "ntuhomecoming"));
    expect(ntu).not.toContain("consent");
    expect(ntu.indexOf("instructions")).toBe(ntu.indexOf("nameGate") + 1);
  });

  it("is the v3 step sequence minus the consent page", () => {
    expect(kindsIn(resolveFlow({}, "ntuhomecoming"))).toEqual(
      kindsIn(resolveFlow({}, "event3")).filter((k) => k !== "consent"),
    );
  });

  // The point of the route: it is /rotaryklwam under a different name and a
  // different bucket, so the two arcs must not drift apart.
  it("walks the same steps as rotary", () => {
    for (const answers of ANSWER_SETS) {
      expect(kindsIn(resolveFlow(answers, "ntuhomecoming"))).toEqual(
        kindsIn(resolveFlow(answers, "rotary")),
      );
    }
  });

  it("never ends on the wrap screen", () => {
    expect(kindsIn(resolveFlow({}, "ntuhomecoming"))).not.toContain("wrap");
  });
});

/**
 * The two things that would be silent if they broke: closing the DBS challenge
 * reaching across into this event, and the question set drifting off event2's
 * (which is what keeps an NTU score comparable with every score already
 * recorded). Both asserted against the REAL config, not the mock above.
 */
describe("ntuhomecoming against the live config", () => {
  it("is untouched by the v3 challenge switch", async () => {
    vi.doUnmock("@/config/event");
    vi.resetModules();
    const live = await import("@/config/funnelFlow");
    const { EVENT3_CHALLENGE_CLOSED } = await import("@/config/event");

    // Proof the unmock took, whichever way the live switch is set.
    expect(live.resolveFlow({}, "event3").some((s) => s.kind === "wrap")).toBe(
      EVENT3_CHALLENGE_CLOSED,
    );

    expect(kindsIn(live.resolveFlow({}, "ntuhomecoming"))).toEqual(
      kindsIn(resolveFlow({}, "ntuhomecoming")),
    );
    expect(
      live.resolveFlow({}, "ntuhomecoming").some((s) => s.kind === "wrap"),
    ).toBe(false);

    for (const axis of ["risk", "symptom"] as const) {
      expect(live.achievableAxisMax("ntuhomecoming", axis)).toBe(
        live.achievableAxisMax("event2", axis),
      );
      expect(achievableAxisMax("ntuhomecoming", axis)).toBeGreaterThan(0);
    }
  });
});

/**
 * The board's QR and the share card a player sends their friends both read
 * playUrlFor, which falls back to the v3 route for any variant missing from
 * EVENT_PATHS - so a missing entry would quietly send NTU players to the DBS
 * link.
 */
describe("ntuhomecoming play URL", () => {
  it("points at /ntuhomecoming", () => {
    expect(playUrlFor("ntuhomecoming")).toMatch(/\/ntuhomecoming$/);
    expect(playUrlFor("ntuhomecoming")).not.toBe(playUrlFor("event3"));
    expect(playUrlFor("ntuhomecoming")).not.toBe(playUrlFor("rotary"));
  });
});
