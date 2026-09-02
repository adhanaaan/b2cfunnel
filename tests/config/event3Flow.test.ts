import { describe, expect, it, vi } from "vitest";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";

/**
 * These are the invariants of the FULL v3 arc, so they are asserted with the
 * challenge open regardless of what the live switch is set to - closing it is a
 * temporary state, and its own behaviour is pinned in event3Closed.test.ts.
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

describe("event3 flow", () => {
  // Event v3 redesigns the arena screens and drops the statistics
  // interstitials, but its QUESTION set must stay identical to event2 so
  // normalised scores, bands and the shared leaderboard remain comparable.
  it("asks exactly the event2 questions", () => {
    const answerSets: Answers[] = [
      {},
      { forgetfulness: "notNotice" },
      { forgetfulness: "almostDaily", sex: "female" },
    ];
    for (const answers of answerSets) {
      expect(idsIn(resolveFlow(answers, "event3"))).toEqual(
        idsIn(resolveFlow(answers, "event2")),
      );
    }
  });

  it("is the event2 step sequence minus the statistics pages, plus the consent page", () => {
    const v3 = kindsIn(resolveFlow({}, "event3"));
    expect(v3.filter((k) => k !== "consent")).toEqual(
      kindsIn(resolveFlow({}, "event2")).filter((k) => k !== "statCard"),
    );
    expect(v3).not.toContain("statCard");
  });

  // The consent page has to be answered before anything is played, and the
  // demo round lives on the instructions screen - so it sits between the
  // landing and the instructions, not anywhere later.
  it("asks for consent after the landing and before the instructions", () => {
    const v3 = kindsIn(resolveFlow({}, "event3"));
    expect(v3.indexOf("consent")).toBe(v3.indexOf("nameGate") + 1);
    expect(v3.indexOf("consent")).toBeLessThan(v3.indexOf("instructions"));
    expect(v3.indexOf("consent")).toBeLessThan(v3.indexOf("game"));
  });

  it("shows the consent page exactly once", () => {
    expect(kindsIn(resolveFlow({}, "event3")).filter((k) => k === "consent"))
      .toHaveLength(1);
  });
});

/**
 * The scoring maxima are summed over what a variant's flow is MADE of, not
 * what a given session walks - which is what keeps a v3 score comparable with
 * a v2 score and with every score already in the database. Asserted against
 * the real switch (not the mock above): closing the challenge must not move
 * these, or reopening would rescale everyone.
 */
describe("event3 scoring maxima", () => {
  it("are unmoved by the challenge switch", async () => {
    vi.doUnmock("@/config/event");
    vi.resetModules();
    const live = await import("@/config/funnelFlow");
    const { EVENT3_CHALLENGE_CLOSED } = await import("@/config/event");

    // Proof the unmock took, whichever way the live switch is set: this copy
    // of the flow resolves against the real one.
    expect(live.resolveFlow({}, "event3").some((s) => s.kind === "wrap")).toBe(
      EVENT3_CHALLENGE_CLOSED,
    );

    for (const axis of ["risk", "symptom"] as const) {
      expect(live.achievableAxisMax("event3", axis)).toBe(
        live.achievableAxisMax("event2", axis),
      );
      expect(live.achievableAxisMax("event3", axis)).toBeGreaterThan(0);
      // The same number the open flow gives, so the switch is provably inert.
      expect(achievableAxisMax("event3", axis)).toBe(
        live.achievableAxisMax("event3", axis),
      );
    }
  });
});
