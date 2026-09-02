import { describe, expect, it, vi } from "vitest";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";

/**
 * EVENT3_CHALLENGE_CLOSED temporarily closes the Reaction Time Challenge and
 * the leaderboard it feeds. What has to be true while it is on: a player can
 * still be asked for the partner consent, and then the session ends on the
 * wrap screen with nothing behind it - no game, so no new score can reach the
 * board, and no questionnaire or report either.
 */
vi.mock("@/config/event", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/config/event")>()),
  EVENT3_CHALLENGE_CLOSED: true,
}));

const { resolveFlow, totalQuestions } = await import("@/config/funnelFlow");

const kindsIn = (flow: FunnelStep[]) => flow.map((s) => s.kind);

describe("event3 with the challenge closed", () => {
  it("ends on the wrap screen straight after the consent page", () => {
    expect(kindsIn(resolveFlow({}, "event3"))).toEqual([
      "nameGate",
      "consent",
      "wrap",
    ]);
  });

  it("leaves nothing playable or scorable behind it", () => {
    const kinds = kindsIn(resolveFlow({}, "event3"));
    for (const gone of [
      "instructions",
      "game",
      "gameResult",
      "question",
      "questionGroup",
      "analysing",
      "result",
      "closing",
    ] as const) {
      expect(kinds, `${gone} must be unreachable`).not.toContain(gone);
    }
    expect(totalQuestions({}, "event3")).toBe(0);
  });

  it("puts the wrap screen last, whatever has been answered", () => {
    const answerSets: Answers[] = [
      {},
      { forgetfulness: "notNotice" },
      { forgetfulness: "almostDaily", sex: "female" },
    ];
    for (const answers of answerSets) {
      const flow = resolveFlow(answers, "event3");
      expect(flow[flow.length - 1].kind).toBe("wrap");
      expect(kindsIn(flow).filter((k) => k === "wrap")).toHaveLength(1);
    }
  });

  it("does not close any other variant", () => {
    for (const variant of ["full", "event", "woman", "event2", "event6"] as const) {
      expect(kindsIn(resolveFlow({}, variant))).not.toContain("wrap");
    }
  });

  // The consent preview exists to compare consent treatments; closing a live
  // event must not take it down.
  it("leaves the v6 consent preview walking the whole arc", () => {
    const v6 = kindsIn(resolveFlow({}, "event6"));
    expect(v6).toContain("consent");
    expect(v6).toContain("game");
    expect(v6[v6.length - 1]).toBe("closing");
  });
});
