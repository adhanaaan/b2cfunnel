import type { FunnelStep, QuizVariant } from "@/types/funnel";
import type { Answers, Axis } from "@/types/question";
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
    title: "Some risk factors",
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

  // The three experiential symptom questions share a frequency scale - merged
  // onto one page as sliders.
  {
    kind: "questionGroup",
    title: "Changes you might have noticed",
    questionIds: ["concentrating", "judgement", "forgetfulness"],
  },
  { kind: "question", questionId: "persistence" }, // pruned if forgetfulness not noticed
  { kind: "question", questionId: "someoneElseNoticed" },

  { kind: "statCard", cardId: "salthouse" },

  { kind: "emailGate" },
  { kind: "analysing" },
  { kind: "result" },
  // Final page: the paywall now carries the offer + a direct booking link
  // (the separate booking page was redundant).
  { kind: "paywall" },
];

const EVENT_FLOW: FunnelStep[] = [
  // Page 1: the challenge pitch + name and Accenture email (for the leaderboard
  // and prize). The reaction game is a separate, non-clinical experience (its
  // result never feeds the brain-health score).
  { kind: "nameGate" },
  { kind: "game" },

  // Straight from their time into the opt-in hook: processing-speed result +
  // locked cognitive domains + the invite into the brain-health check. The
  // full standings live on the TV board (/event/leaderboard), not here.
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
  // No selling at the event: close with a soft "speak to our team" instead of
  // the paywall + booking pages.
  { kind: "consult" },
];

/**
 * Event v2 ("Ember Arena", served at /event-v2). Same question set as
 * EVENT_FLOW - this is load-bearing: achievableAxisMax() sums max option
 * scores over a variant's questions, so an identical set keeps normalised
 * scores and bands comparable with /event and all historical leads
 * (guarded by tests/config/event2Flow.test.ts).
 *
 * Differences are all around the questions: a single email capture up front
 * (no trailing emailGate - the lead posts with the nameGate email), a
 * full-page instructions step, a redesigned post-game result (share +
 * pick-a-card tips live inside it), and a ReCOGnAIze closing instead of the
 * teleconsult pitch.
 */
const EVENT2_FLOW: FunnelStep[] = [
  { kind: "nameGate" },
  { kind: "instructions" },
  { kind: "game" },
  { kind: "gameResult" },

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

  { kind: "analysing" },
  { kind: "result" },
  { kind: "closing" },
];

const WOMAN_FLOW: FunnelStep[] = [
  { kind: "hook" },

  { kind: "question", questionId: "age" },
  { kind: "question", questionId: "menopauseSymptoms" },
  { kind: "question", questionId: "familyHistory" },

  {
    kind: "questionGroup",
    title: "Your health baseline",
    questionIds: ["highBp", "highCholesterol", "diabetes"],
  },

  {
    kind: "questionGroup",
    title: "Sleep, movement, and nutrition",
    questionIds: ["sleep", "exercise", "diet", "alcohol"],
  },

  { kind: "question", questionId: "tracks" },

  {
    kind: "questionGroup",
    title: "Brain fog signals",
    questionIds: ["concentrating", "judgement", "forgetfulness"],
  },
  { kind: "question", questionId: "persistence" },
  { kind: "question", questionId: "someoneElseNoticed" },

  { kind: "emailGate" },
  { kind: "analysing" },
  { kind: "result" },
  { kind: "paywall" },
];

/**
 * Event v3 ("Daylight Ember", served at /event-v3). The redesign touches the
 * arena screens (splash, instructions, post-game result) and drops the
 * statistics interstitials from the quiz arc; the question set is exactly
 * EVENT2_FLOW's, which is what keeps normalised scores and bands comparable
 * with /event-v2 and all historical leads (achievableAxisMax only sums
 * question steps - see the note above).
 */
const EVENT3_FLOW: FunnelStep[] = EVENT2_FLOW.filter(
  (step) => step.kind !== "statCard",
);

/**
 * Event v6 (/event-v6, preview): the v3 flow with the partner consent page
 * between the landing and the instructions - consent on the landing stays as
 * it is, and the partner's own consents get a page of their own.
 */
const EVENT6_FLOW: FunnelStep[] = EVENT3_FLOW.flatMap((step) =>
  step.kind === "nameGate" ? [step, { kind: "consent" } as FunnelStep] : [step],
);

const FLOWS: Record<QuizVariant, FunnelStep[]> = {
  full: FULL_FLOW,
  event: EVENT_FLOW,
  woman: WOMAN_FLOW,
  event2: EVENT2_FLOW,
  event3: EVENT3_FLOW,
  event6: EVENT6_FLOW,
};

/** All question ids in a variant's flow (single questions + grouped pages). */
function questionIdsIn(variant: QuizVariant): string[] {
  const ids: string[] = [];
  for (const step of FLOWS[variant]) {
    if (step.kind === "question") ids.push(step.questionId);
    else if (step.kind === "questionGroup") ids.push(...step.questionIds);
  }
  return ids;
}

const axisMaxCache = new Map<string, number>();

/**
 * The maximum score achievable on an axis for a variant - the sum of each
 * in-flow question's highest option score on that axis (assuming all
 * conditional questions fire). Used to normalise the trimmed event quiz back
 * onto the /100 scale so its bands match the full quiz. Memoised.
 */
export function achievableAxisMax(variant: QuizVariant, axis: Axis): number {
  const key = `${variant}:${axis}`;
  const cached = axisMaxCache.get(key);
  if (cached !== undefined) return cached;

  let max = 0;
  for (const id of questionIdsIn(variant)) {
    const q = QUESTIONS_BY_ID[id];
    if (!q || q.axis !== axis || !q.options) continue;
    max += Math.max(0, ...q.options.map((o) => o.score));
  }
  axisMaxCache.set(key, max);
  return max;
}

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
