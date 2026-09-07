import { describe, expect, it } from "vitest";
import type { FunnelStep, QuizVariant } from "@/types/funnel";
import type { Answers } from "@/types/question";
import {
  AGE_SELECT_QUESTION_ID,
  achievableAxisMax,
  questionNumber,
  resolveFlow,
  totalQuestions,
} from "@/config/funnelFlow";
import { computeScore } from "@/engine/scoring";

/**
 * Pantai Hospital KL (/phkl) is the regatta arc rebuilt so the quiz is no
 * longer optional: a primer and the age question before the game, a great-job
 * beat and a quiz primer instead of the post-game card and the invite, and the
 * report as the end. What must hold: the question SET is still event2's, with
 * age merely moved, so a phkl score is comparable with every score recorded.
 */

/** Question ids in flow order. An ageSelect step IS the age question. */
const idsIn = (flow: FunnelStep[]): string[] =>
  flow.flatMap((s) =>
    s.kind === "question"
      ? [s.questionId]
      : s.kind === "questionGroup"
        ? s.questionIds
        : s.kind === "ageSelect"
          ? [AGE_SELECT_QUESTION_ID]
          : [],
  );

const kindsIn = (flow: FunnelStep[]) => flow.map((s) => s.kind);

const ANSWER_SETS: Answers[] = [
  {},
  { forgetfulness: "notNotice" },
  { forgetfulness: "almostDaily", sex: "female" },
];

describe("phkl flow", () => {
  it("asks exactly the event2 questions, with age moved to the front", () => {
    for (const answers of ANSWER_SETS) {
      const phkl = idsIn(resolveFlow(answers, "phkl"));
      const event2 = idsIn(resolveFlow(answers, "event2"));
      expect([...phkl].sort()).toEqual([...event2].sort());
      expect(phkl[0]).toBe("age");
      expect(phkl.filter((id) => id !== "age")).toEqual(
        event2.filter((id) => id !== "age"),
      );
    }
  });

  it("runs the designed step sequence", () => {
    expect(kindsIn(resolveFlow({ forgetfulness: "almostDaily" }, "phkl"))).toEqual([
      "nameGate",
      "speedIntro",
      "ageSelect",
      "instructions",
      "game",
      "greatJob",
      "quizIntro",
      "question", // sex
      "questionGroup", // health history
      "questionGroup", // lifestyle
      "question", // tracks
      "question", // concentrating
      "question", // judgement
      "question", // forgetfulness
      "question", // persistence
      "analysing",
      "result",
    ]);
  });

  it("asks age before the instructions and never again in the quiz", () => {
    const flow = resolveFlow({}, "phkl");
    const kinds = kindsIn(flow);
    expect(kinds.indexOf("ageSelect")).toBeLessThan(kinds.indexOf("instructions"));
    expect(kinds.indexOf("ageSelect")).toBeLessThan(kinds.indexOf("game"));
    expect(
      flow.some((s) => s.kind === "question" && s.questionId === "age"),
    ).toBe(false);
  });

  it("goes game -> great job -> quiz primer -> first question, with no result card or invite", () => {
    const kinds = kindsIn(resolveFlow({}, "phkl"));
    const game = kinds.indexOf("game");
    expect(kinds[game + 1]).toBe("greatJob");
    expect(kinds[game + 2]).toBe("quizIntro");
    expect(kinds[game + 3]).toBe("question");
    for (const gone of [
      "gameResult",
      "quizInvite",
      "closing",
      "statCard",
      "consent",
      "wrap",
    ] as const) {
      expect(kinds).not.toContain(gone);
    }
  });

  it("puts the primer straight after the landing and ends on the report", () => {
    const kinds = kindsIn(resolveFlow({}, "phkl"));
    expect(kinds.indexOf("speedIntro")).toBe(kinds.indexOf("nameGate") + 1);
    expect(kinds.at(-1)).toBe("result");
  });

  // Load-bearing: achievableAxisMax sums the max option scores over a
  // variant's question steps. An ageSelect step has to count as the age
  // question, or every phkl risk score is normalised against a smaller maximum
  // than the answers it sums.
  it("keeps scoring parity with event2", () => {
    for (const axis of ["risk", "symptom"] as const) {
      expect(achievableAxisMax("phkl", axis)).toBe(
        achievableAxisMax("event2", axis),
      );
      expect(achievableAxisMax("phkl", axis)).toBeGreaterThan(0);
    }
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
    expect(computeScore(answers, "phkl")).toEqual(
      computeScore(answers, "event2"),
    );
  });

  // The quiz progress bar denominates the BRAIN HEALTH QUIZ leg of the rail;
  // age was answered on the GAME leg, so the first question is "1 of N".
  it("leaves age out of the quiz progress bar", () => {
    expect(totalQuestions({}, "phkl")).toBe(totalQuestions({}, "event2") - 1);
    const flow = resolveFlow({}, "phkl");
    const first = flow.findIndex((s) => s.kind === "question");
    expect(questionNumber({}, first, "phkl")).toBe(1);
    expect(questionNumber({}, flow.findIndex((s) => s.kind === "ageSelect"), "phkl")).toBe(0);
  });

  it("keeps its screens out of every other variant", () => {
    const others: QuizVariant[] = [
      "full",
      "event",
      "woman",
      "event2",
      "event3",
      "rotary",
      "ntuhomecoming",
      "ihhsearegatta",
      "event6",
    ];
    for (const variant of others) {
      const kinds = kindsIn(resolveFlow({}, variant));
      for (const kind of ["speedIntro", "ageSelect", "greatJob", "quizIntro"] as const) {
        expect(kinds, `${kind} leaked into ${variant}`).not.toContain(kind);
      }
    }
  });
});
