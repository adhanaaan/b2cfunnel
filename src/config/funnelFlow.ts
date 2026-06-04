import type { FunnelStep } from "@/types/funnel";
import type { Answers } from "@/types/question";
import { QUESTIONS_BY_ID } from "@/config/questions";

/**
 * The canonical funnel flow: a declarative, ordered list interleaving the hook,
 * questions, the three cited stat cards, the email gate, the suspense screen, the
 * result, and the paywall. Keeping the flow as data + a pure resolver makes the
 * interleave and conditional-branching logic testable in isolation.
 */
export const FUNNEL_FLOW: FunnelStep[] = [
  { kind: "hook" },

  { kind: "question", questionId: "age" },
  { kind: "question", questionId: "sex" },
  { kind: "question", questionId: "hotFlushes" }, // pruned if sex !== female
  { kind: "question", questionId: "familyHistory" },

  { kind: "statCard", cardId: "lancet2024" }, // stat card #1

  { kind: "question", questionId: "highBp" },
  { kind: "question", questionId: "highCholesterol" },
  { kind: "question", questionId: "diabetes" },
  { kind: "question", questionId: "hearingLoss" },
  { kind: "question", questionId: "visionLoss" },

  { kind: "statCard", cardId: "imhWise" }, // stat card #2

  { kind: "question", questionId: "smoking" },
  { kind: "question", questionId: "sleep" },
  { kind: "question", questionId: "exercise" },
  { kind: "question", questionId: "diet" },
  { kind: "question", questionId: "alcohol" },
  { kind: "question", questionId: "tracks" },

  // Cognitive symptom block
  { kind: "question", questionId: "concentrating" },
  { kind: "question", questionId: "judgement" },
  { kind: "question", questionId: "forgetfulness" },
  { kind: "question", questionId: "persistence" }, // pruned if forgetfulness !== yes
  { kind: "question", questionId: "someoneElseNoticed" },

  { kind: "statCard", cardId: "salthouse" }, // stat card #3, just before the gate

  { kind: "emailGate" },
  { kind: "analysing" },
  { kind: "result" },
  { kind: "paywall" },
];

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
 * Resolve the flow against the current answers, pruning question steps whose
 * showIf condition is not met (Q3 hot flushes when sex≠female; Q19 persistence
 * when forgetfulness≠yes).
 */
export function resolveFlow(answers: Answers): FunnelStep[] {
  return FUNNEL_FLOW.filter((step) =>
    step.kind === "question" ? questionVisible(step.questionId, answers) : true,
  );
}

/** Total number of question steps in the resolved flow (progress-bar denominator). */
export function totalQuestions(answers: Answers): number {
  return resolveFlow(answers).filter((s) => s.kind === "question").length;
}

/** 1-based index of a question step among questions in the resolved flow. */
export function questionNumber(answers: Answers, cursor: number): number {
  const flow = resolveFlow(answers);
  let n = 0;
  for (let i = 0; i <= cursor && i < flow.length; i++) {
    if (flow[i].kind === "question") n++;
  }
  return n;
}
