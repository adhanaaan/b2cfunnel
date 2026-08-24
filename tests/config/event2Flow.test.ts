import { describe, it, expect } from "vitest";
import { resolveFlow } from "@/config/funnelFlow";
import type { Answers } from "@/types/question";
import {
  funnelReducer,
  createInitialState,
  currentStep,
} from "@/state/funnelMachine";
import { computeScore } from "@/engine/scoring";

const idsIn = (flow: ReturnType<typeof resolveFlow>) =>
  flow.flatMap((s) =>
    s.kind === "question"
      ? [s.questionId]
      : s.kind === "questionGroup"
        ? s.questionIds
        : [],
  );

const kindsIn = (flow: ReturnType<typeof resolveFlow>) =>
  flow.map((s) => s.kind);

describe("event2 flow", () => {
  // Load-bearing: achievableAxisMax() sums max option scores over a variant's
  // question set, so event2 must ask exactly the event questions or its
  // normalised scores/bands silently diverge from /event and historical leads.
  it("asks exactly the same questions as the event flow (scoring parity)", () => {
    const scenarios: Answers[] = [
      {},
      { forgetfulness: "almostDaily" },
      { forgetfulness: "notNotice" },
      { sex: "female", forgetfulness: "almostDaily" },
    ];
    for (const answers of scenarios) {
      expect(idsIn(resolveFlow(answers, "event2"))).toEqual(
        idsIn(resolveFlow(answers, "event")),
      );
    }
  });

  it("computes identical scores to the event variant", () => {
    const answers: Answers = {
      age: "50-59",
      sex: "male",
      highBp: "yes",
      highCholesterol: "no",
      diabetes: "unsure",
      smoking: "past",
      sleep: "6to7",
      exercise: "75to149",
      diet: "moderate",
      alcohol: "8to14",
      tracks: ["biometrics"],
      concentrating: "severalWeek",
      judgement: "rarely",
      forgetfulness: "severalWeek",
      persistence: "yes",
    };
    expect(computeScore(answers, "event2")).toEqual(
      computeScore(answers, "event"),
    );
  });

  it("captures email exactly once, up front", () => {
    const kinds = kindsIn(resolveFlow({}, "event2"));
    expect(kinds).toContain("nameGate");
    expect(kinds).not.toContain("emailGate");
  });

  it("orders the arena arc: instructions before game, result right after", () => {
    const kinds = kindsIn(resolveFlow({}, "event2"));
    const game = kinds.indexOf("game");
    expect(kinds.indexOf("instructions")).toBe(game - 1);
    expect(kinds.indexOf("gameResult")).toBe(game + 1);
    expect(kinds.at(-1)).toBe("closing");
  });

  it("prunes persistence unless forgetfulness is noticed", () => {
    expect(
      idsIn(resolveFlow({ forgetfulness: "notNotice" }, "event2")),
    ).not.toContain("persistence");
    expect(
      idsIn(resolveFlow({ forgetfulness: "almostDaily" }, "event2")),
    ).toContain("persistence");
  });
});

describe("SKIP_TO_KIND", () => {
  it("jumps forward to the first step of the kind", () => {
    let state = createInitialState("event2");
    state = funnelReducer(state, { type: "SKIP_TO_KIND", kind: "closing" });
    expect(currentStep(state).kind).toBe("closing");
  });

  it("no-ops for a kind absent from the flow", () => {
    const state = createInitialState("event2");
    expect(funnelReducer(state, { type: "SKIP_TO_KIND", kind: "paywall" })).toBe(
      state,
    );
  });

  it("never moves the cursor backwards", () => {
    let state = createInitialState("event2");
    state = funnelReducer(state, { type: "SKIP_TO_KIND", kind: "closing" });
    const atClosing = state.cursor;
    state = funnelReducer(state, { type: "SKIP_TO_KIND", kind: "game" });
    expect(state.cursor).toBe(atClosing);
  });
});

describe("RETAKE_GAME", () => {
  it("jumps back to the game step and clears the previous time", () => {
    let state = createInitialState("event2");
    state = funnelReducer(state, { type: "SKIP_TO_KIND", kind: "closing" });
    state = { ...state, gameTimeMs: 12345 };
    state = funnelReducer(state, { type: "RETAKE_GAME" });
    expect(currentStep(state).kind).toBe("game");
    expect(state.gameTimeMs).toBeUndefined();
  });

  it("no-ops for a variant whose flow has no game step", () => {
    const state = createInitialState("full");
    expect(funnelReducer(state, { type: "RETAKE_GAME" })).toBe(state);
  });
});
