import type { FunnelStep, QuizVariant } from "@/types/funnel";
import type { Answers } from "@/types/question";
import { QUESTIONS_BY_ID } from "@/config/questions";

/**
 * Funnel flows, one per quiz variant. The full quiz (served at /) asks the
 * complete question set; the event quiz (served at /event) is a trimmed,
 * faster version. Keeping each flow as data + a pure resolver makes the
 * interleave and conditional-branching logic testable in isolation.
 */

const FULL_FLOW: FunnelStep[] = [
  { kind: "hook" },

  { kind: "question", questionId: "age" },
  { kind: "question", questionId: "sex" },
  { kind: "question", questionId: "hotFlushes" }, // pruned if sex !== female
  { kind: "question", questionId: "familyHistory" },

  {
    kind: "questionGroup",
    title: "A bit of health history",
    questionIds: [
      "highBp",
      "highCholesterol",
      "diabetes",
      "hearingLoss",
      "visionLoss",
    ],
  },

  { kind: "statCard", cardId: "lancet2024" },

  {
    kind: "questionGroup",
    title: "Your lifestyle",
    questionIds: ["smoking", "sleep", "exercise", "diet", "alcohol"],
  },

  { kind: "statCard", cardId: "imhWise" },

  { kind: "question", questionId: "tracks" },

  { kind: "question", questionId: "concentrating" },
  { kind: "question", questionId: "judgement" },
  { kind: "question", questionId: "forgetfulness" },
  { kind: "question", questionId: "persistence" }, // pruned if forgetfulness not noticed
  { kind: "question", questionId: "someoneElseNoticed" },

  { kind: "statCard", cardId: "salthouse" },

  { kind: "emailGate" },
  { kind: "analysing" },
  { kind: "result" },
  { kind: "paywall" },
  { kind: "booking" },
];

const EVENT_FLOW: FunnelStep[] = [
  // Page 1: the challenge pitch + name and Accenture email (for the leaderboard
  // and prize). The reaction game is a separate, non-clinical experience (its
  // result never feeds the brain-health score).
  { kind: "nameGate" },
  { kind: "game" },
  { kind: "leaderboard" },

  // Hook bridges from the game into the brain-health quiz.
  { kind: "hook" },

  { kind: "question", questionId: "age" },
  { kind: "question", questionId: "sex" },

  {
    kind: "questionGroup",
    title: "A bit of health history",
    questionIds: ["highBp", "highCholesterol", "diabetes"],
  },

  { kind: "statCard", cardId: "lancet2024" },

  {
    kind: "questionGroup",
    title: "Your lifestyle",
    questionIds: ["smoking", "sleep", "exercise", "diet", "alcohol"],
  },

  { kind: "question", questionId: "tracks" },

  { kind: "question", questionId: "concentrating" },
  { kind: "question", questionId: "judgement" },
  { kind: "question", questionId: "forgetfulness" },
  { kind: "question", questionId: "persistence" }, // pruned if forgetfulness not noticed

  { kind: "statCard", cardId: "salthouse" },

  // Personal email at the end, for the personalised score (separate from the
  // Accenture/leaderboard email captured on page 1).
  { kind: "emailGate" },
  { kind: "analysing" },
  { kind: "result" },
  { kind: "paywall" },
  { kind: "booking" },
];

const FLOWS: Record<QuizVariant, FunnelStep[]> = {
  full: FULL_FLOW,
  event: EVENT_FLOW,
};

/** True when a question's showIf condition is satisfied by the current answers. */
function questionVisible(questionId: string, answers: Answers): boolean {
  const question = QUESTIONS_BY_ID[questionId];
  if (!question?.showIf) return true;
  const { questionId: depId, equals } = question.showIf;
  const actual = answers[depId];
  const allowed = Array.isArray(equals) ? equals : [equals];
  return typeof actual === "string" && allowed.includes(actual);
}

/**
 * Resolve the variant's flow against the current answers, pruning question
 * steps whose showIf condition is not met (hot flushes when sex≠female;
 * persistence when forgetfulness isn't noticed).
 */
export function resolveFlow(
  answers: Answers,
  variant: QuizVariant,
): FunnelStep[] {
  return FLOWS[variant].filter((step) =>
    step.kind === "question" ? questionVisible(step.questionId, answers) : true,
  );
}

// A question page is either a single question or a grouped page; both count as
// one step for the progress bar.
const isQuestionPage = (kind: FunnelStep["kind"]) =>
  kind === "question" || kind === "questionGroup";

/** Total number of question pages in the resolved flow (progress-bar denominator). */
export function totalQuestions(answers: Answers, variant: QuizVariant): number {
  return resolveFlow(answers, variant).filter((s) =>
    isQuestionPage(s.kind),
  ).length;
}

/** 1-based index of the current question page among question pages. */
export function questionNumber(
  answers: Answers,
  cursor: number,
  variant: QuizVariant,
): number {
  const flow = resolveFlow(answers, variant);
  let n = 0;
  for (let i = 0; i <= cursor && i < flow.length; i++) {
    if (isQuestionPage(flow[i].kind)) n++;
  }
  return n;
}
