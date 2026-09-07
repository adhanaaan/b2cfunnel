import { describe, expect, it } from "vitest";
import {
  createInitialState,
  currentStep,
  funnelReducer,
} from "@/state/funnelMachine";
import type { FunnelState } from "@/types/funnel";

/**
 * The PHKL report carries a "Retry Game" button. A replay has to run the game
 * again and come straight back to the report with the new time: the quiz
 * answers and the computed score are kept, and nothing between the game and
 * the report (the great-job beat, the primer, the questions) is walked again.
 * Before the report exists, GAME_DONE is still the plain step forward.
 */

const ANSWERS = {
  age: "40-49",
  sex: "female",
  highBp: "no",
  highCholesterol: "no",
  diabetes: "no",
  smoking: "never",
  sleep: "7to9",
  exercise: "150plus",
  diet: "mediterranean",
  alcohol: "none",
  tracks: ["nothing"],
  concentrating: "rarely",
  judgement: "rarely",
  forgetfulness: "notNotice",
} as const;

function atReport(): FunnelState {
  let state = createInitialState("phkl");
  state = funnelReducer(state, {
    type: "SUBMIT_EMAIL",
    name: "Ada",
    email: "ada@example.com",
    tipsConsent: false,
    partnerConsent: true,
  });
  for (const [id, value] of Object.entries(ANSWERS)) {
    state = funnelReducer(state, {
      type: "ANSWER",
      questionId: id,
      value: value as string | string[],
    });
  }
  state = funnelReducer(state, { type: "SKIP_TO_KIND", kind: "game" });
  state = funnelReducer(state, { type: "GAME_DONE", timeMs: 21000 });
  state = funnelReducer(state, { type: "SKIP_TO_KIND", kind: "analysing" });
  state = funnelReducer(state, { type: "ANALYSIS_DONE" });
  expect(currentStep(state).kind).toBe("result");
  expect(state.result).toBeDefined();
  return state;
}

describe("retry from the phkl report", () => {
  it("replays the game and returns to the report with the new time", () => {
    const report = atReport();

    const replaying = funnelReducer(report, { type: "RETAKE_GAME" });
    expect(currentStep(replaying).kind).toBe("game");
    expect(replaying.gameTimeMs).toBeUndefined();
    expect(replaying.result).toBe(report.result);

    const back = funnelReducer(replaying, { type: "GAME_DONE", timeMs: 9000 });
    expect(currentStep(back).kind).toBe("result");
    expect(back.gameTimeMs).toBe(9000);
    expect(back.result).toBe(report.result);
    expect(back.answers).toEqual(report.answers);
  });

  it("counts the attempts, for the report's ordinal", () => {
    const report = atReport();
    expect(report.gameAttempts).toBe(1);
    const again = funnelReducer(
      funnelReducer(report, { type: "RETAKE_GAME" }),
      { type: "GAME_DONE", timeMs: 9000 },
    );
    expect(again.gameAttempts).toBe(2);
  });

  it("still steps forward from the game before the report exists", () => {
    for (const variant of ["phkl", "event2"] as const) {
      let state = createInitialState(variant);
      state = funnelReducer(state, { type: "SKIP_TO_KIND", kind: "game" });
      const game = state.cursor;
      const done = funnelReducer(state, { type: "GAME_DONE", timeMs: 15000 });
      expect(done.cursor).toBe(game + 1);
      expect(done.gameTimeMs).toBe(15000);
      expect(done.gameAttempts).toBe(1);
    }
    expect(
      currentStep(
        funnelReducer(
          funnelReducer(createInitialState("phkl"), {
            type: "SKIP_TO_KIND",
            kind: "game",
          }),
          { type: "GAME_DONE", timeMs: 15000 },
        ),
      ).kind,
    ).toBe("greatJob");
  });

  it("answers age on its own screen and walks into the instructions", () => {
    let state = createInitialState("phkl");
    state = funnelReducer(state, { type: "SKIP_TO_KIND", kind: "ageSelect" });
    expect(currentStep(state).kind).toBe("ageSelect");
    state = funnelReducer(state, {
      type: "ANSWER",
      questionId: "age",
      value: "40-49",
    });
    state = funnelReducer(state, { type: "NEXT" });
    expect(state.answers.age).toBe("40-49");
    expect(currentStep(state).kind).toBe("instructions");
  });
});
