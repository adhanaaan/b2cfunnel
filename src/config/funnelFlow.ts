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

  // Biomedical / history block — all on one page.
  {
    kind: "questionGroup",
    title: "A bit of health history",
    questionIds: ["highBp", "highCholesterol", "diabetes"],
  },

  { kind: "statCard", cardId: "lancet2024" }, // 45% modifiable-risk card, after history

  // Lifestyle block — all on one page.
  {
    kind: "questionGroup",
    title: "Your lifestyle",
    questionIds: ["smoking", "sleep", "exercise", "diet", "alcohol"],
  },

  { kind: "question", questionId: "tracks" },

  // Cognitive symptom block
  { kind: "question", questionId: "concentrating" },
  { kind: "question", questionId: "judgement" },
  { kind: "question", questionId: "forgetfulness" },
  { kind: "question", questionId: "persistence" }, // pruned if forgetfulness not noticed

  { kind: "statCard", cardId: "salthouse" }, // stat card #3, just before the gate

  { kind: "emailGate" },
  { kind: "analysing" },
  { kind: "result" },
  { kind: "paywall" },
  { kind: "booking" },
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

// A question page is either a single question or a grouped page; both count as
// one step for the progress bar.
const isQuestionPage = (kind: FunnelStep["kind"]) =>
  kind === "question" || kind === "questionGroup";

/** Total number of question pages in the resolved flow (progress-bar denominator). */
export function totalQuestions(answers: Answers): number {
  return resolveFlow(answers).filter((s) => isQuestionPage(s.kind)).length;
}

/** 1-based index of the current question page among question pages. */
export function questionNumber(answers: Answers, cursor: number): number {
  const flow = resolveFlow(answers);
  let n = 0;
  for (let i = 0; i <= cursor && i < flow.length; i++) {
    if (isQuestionPage(flow[i].kind)) n++;
  }
  return n;
}
