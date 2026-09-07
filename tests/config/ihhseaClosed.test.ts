import { describe, expect, it, vi } from "vitest";
import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";

/**
 * IHHSEA_CHALLENGE_CLOSED closes the regatta's Reaction Time Challenge and the
 * leaderboard it feeds. What has to be true while it is on: the landing still
 * runs (it is where this event takes its consents), and then the session ends
 * on the wrap screen with nothing behind it - no game, so no new score can
 * reach the board, and no questionnaire or report either.
 *
 * The DBS switch is pinned OPEN here, so anything that closes below is the
 * regatta's own switch doing it.
 */
vi.mock("@/config/event", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/config/event")>()),
  EVENT3_CHALLENGE_CLOSED: false,
  IHHSEA_CHALLENGE_CLOSED: true,
}));

const { resolveFlow, totalQuestions } = await import("@/config/funnelFlow");

const kindsIn = (flow: FunnelStep[]) => flow.map((s) => s.kind);

describe("ihhsearegatta with the challenge closed", () => {
  it("ends on the wrap screen straight after the landing", () => {
    expect(kindsIn(resolveFlow({}, "ihhsearegatta"))).toEqual([
      "nameGate",
      "wrap",
    ]);
  });

  it("leaves nothing playable or scorable behind it", () => {
    const kinds = kindsIn(resolveFlow({}, "ihhsearegatta"));
    for (const gone of [
      "instructions",
      "game",
      "gameResult",
      "quizInvite",
      "question",
      "questionGroup",
      "analysing",
      "result",
    ] as const) {
      expect(kinds, `${gone} must be unreachable`).not.toContain(gone);
    }
    expect(totalQuestions({}, "ihhsearegatta")).toBe(0);
  });

  it("puts the wrap screen last, whatever has been answered", () => {
    const answerSets: Answers[] = [
      {},
      { forgetfulness: "notNotice" },
      { forgetfulness: "almostDaily", sex: "female" },
    ];
    for (const answers of answerSets) {
      const flow = resolveFlow(answers, "ihhsearegatta");
      expect(flow[flow.length - 1].kind).toBe("wrap");
      expect(kindsIn(flow).filter((k) => k === "wrap")).toHaveLength(1);
    }
  });

  // Each event owns its own switch: closing the regatta must not close the DBS
  // challenge, Rotary, NTU Homecoming or the consent preview.
  it("does not close any other variant", () => {
    for (const variant of [
      "full",
      "event",
      "woman",
      "event2",
      "event3",
      "rotary",
      "ntuhomecoming",
      "event6",
    ] as const) {
      expect(kindsIn(resolveFlow({}, variant))).not.toContain("wrap");
    }
  });
});
