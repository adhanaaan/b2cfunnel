import type { Question } from "@/types/question";

/**
 * The question bank. This is the single source of truth for scoring weights —
 * the engine reads option.score from here, so weights live in exactly one place.
 *
 * Weights match the build brief §5 exactly:
 *   Risk Factor Score (max 17) + Symptom Signal (max 8) = max 25.
 *
 * Numeric lifestyle inputs (sleep, exercise, alcohol) are modelled as bucketed
 * single-selects so the discrete thresholds map cleanly with no input validation.
 * Copy here is British English and avoids HSA off-limits language (see compliance.ts).
 */
export const QUESTIONS: Question[] = [
  // ---- Universal ----
  {
    id: "age",
    type: "single-select",
    axis: "risk",
    prompt: "What is your age?",
    citation: "caide",
    options: [
      { id: "20-34", label: "20–34", score: 0 },
      { id: "35-44", label: "35–44", score: 1 },
      { id: "45-54", label: "45–54", score: 2 },
      { id: "55+", label: "55 or older", score: 3 },
    ],
  },
  {
    id: "sex",
    type: "single-select",
    axis: "meta",
    prompt: "What is your sex assigned at birth?",
    options: [
      { id: "female", label: "Female", score: 0 },
      { id: "male", label: "Male", score: 0 },
      { id: "other", label: "Prefer not to say", score: 0 },
    ],
  },
  {
    id: "hotFlushes",
    type: "single-select",
    axis: "risk",
    prompt: "Have you noticed hot flushes, night sweats, or changes to your cycle?",
    citation: "straw10",
    showIf: { questionId: "sex", equals: "female" },
    options: [
      { id: "yes", label: "Yes", score: 1 },
      { id: "no", label: "No", score: 0 },
    ],
  },
  {
    id: "familyHistory",
    type: "single-select",
    axis: "risk",
    prompt: "Do you have a family history of dementia or Alzheimer's?",
    helpText:
      "Immediate means a parent or sibling. Extended means grandparents, aunts, or uncles.",
    citation: "caide",
    options: [
      { id: "immediate", label: "Yes — an immediate relative", score: 2 },
      { id: "extended", label: "Yes — an extended relative", score: 1 },
      { id: "none", label: "No", score: 0 },
    ],
  },
  {
    id: "highBp",
    type: "single-select",
    axis: "risk",
    prompt: "Do you have a history of high blood pressure?",
    citation: "lancet2024",
    options: [
      { id: "yes", label: "Yes", score: 1 },
      { id: "no", label: "No", score: 0 },
    ],
  },
  {
    id: "highCholesterol",
    type: "single-select",
    axis: "risk",
    prompt: "Do you have a history of high cholesterol?",
    citation: "lancet2024",
    options: [
      { id: "yes", label: "Yes", score: 1 },
      { id: "no", label: "No", score: 0 },
    ],
  },
  {
    id: "diabetes",
    type: "single-select",
    axis: "risk",
    prompt: "Do you have a history of diabetes or pre-diabetes?",
    citation: "lancet2024",
    options: [
      { id: "yes", label: "Yes", score: 1 },
      { id: "no", label: "No", score: 0 },
    ],
  },
  {
    id: "hearingLoss",
    type: "single-select",
    axis: "risk",
    prompt: "Do you have untreated hearing loss?",
    helpText: "Untreated means without hearing aids or other support.",
    citation: "lancet2024",
    options: [
      { id: "yes", label: "Yes", score: 2 },
      { id: "no", label: "No", score: 0 },
    ],
  },
  {
    id: "visionLoss",
    type: "single-select",
    axis: "risk",
    prompt: "Do you have untreated vision loss?",
    helpText: "Untreated means uncorrected by glasses, lenses, or surgery.",
    citation: "lancet2024",
    options: [
      { id: "yes", label: "Yes", score: 1 },
      { id: "no", label: "No", score: 0 },
    ],
  },
  {
    id: "smoking",
    type: "single-select",
    axis: "risk",
    prompt: "Are you a current smoker, or were you a smoker within the last 10 years?",
    citation: "lancet2024",
    options: [
      { id: "current", label: "I currently smoke", score: 1 },
      { id: "past", label: "I smoked within the last 10 years", score: 0.5 },
      { id: "never", label: "Never, or longer than 10 years ago", score: 0 },
    ],
  },
  {
    id: "sleep",
    type: "single-select",
    axis: "risk",
    prompt: "On average, how long do you sleep at night?",
    citation: "lancet2024",
    options: [
      { id: "lt6", label: "Less than 6 hours", score: 1 },
      { id: "6to7", label: "6–7 hours", score: 0.5 },
      { id: "7to9", label: "7–9 hours", score: 0 },
      { id: "gt9", label: "More than 9 hours", score: 0.5 },
    ],
  },
  {
    id: "exercise",
    type: "single-select",
    axis: "risk",
    prompt: "How much cardio exercise do you get per week?",
    citation: "lancet2024",
    options: [
      { id: "lt90", label: "Less than 90 minutes", score: 1 },
      { id: "90to150", label: "90–150 minutes", score: 0.5 },
      { id: "gt150", label: "More than 150 minutes", score: 0 },
    ],
  },
  {
    id: "diet",
    type: "single-select",
    axis: "risk",
    prompt: "How would you describe your diet?",
    citation: "lancet2024",
    options: [
      { id: "poor", label: "Mostly processed / high in sugar", score: 1 },
      { id: "moderate", label: "A mix of fresh and processed", score: 0.5 },
      { id: "healthy", label: "Mostly fresh, balanced meals", score: 0 },
    ],
  },
  {
    id: "alcohol",
    type: "single-select",
    axis: "risk",
    prompt: "How many alcoholic drinks do you have per week?",
    helpText: "1 drink ≈ 1 small wine, ½ pint of beer, or 1 shot of spirits.",
    citation: "whitehall",
    options: [
      { id: "gt21", label: "More than 21", score: 1 },
      { id: "15to21", label: "15–21", score: 0.5 },
      { id: "lt14", label: "Fewer than 14", score: 0 },
    ],
  },
  {
    id: "tracks",
    type: "multi-select",
    axis: "meta",
    multiSelect: true,
    prompt: "What do you already keep an eye on?",
    helpText: "Select all that apply.",
    options: [
      {
        id: "performance",
        label: "Productivity, focus or work performance",
        score: 0,
        personaSignal: "highPerformer",
      },
      {
        id: "biometrics",
        label: "Sleep, HRV, strength or supplements",
        score: 0,
        personaSignal: "highPerformer",
      },
      {
        id: "hormones",
        label: "Hormones, cycle or menopause symptoms",
        score: 0,
        personaSignal: "perimenopausal",
      },
      {
        id: "family",
        label: "A family member's health (I help care for someone)",
        score: 0,
        personaSignal: "caregiver",
      },
      {
        id: "nothing",
        label: "Nothing in particular",
        score: 0,
        personaSignal: "neutral",
      },
    ],
  },

  // ---- Cognitive symptom block (weighted higher) ----
  {
    id: "concentrating",
    type: "single-select",
    axis: "symptom",
    prompt: "Do you have trouble concentrating on meetings or sustained tasks?",
    citation: "scd",
    options: [
      { id: "yes", label: "Yes", score: 1 },
      { id: "no", label: "No", score: 0 },
    ],
  },
  {
    id: "judgement",
    type: "single-select",
    axis: "symptom",
    prompt:
      "Compared to a few years ago, do you have more problems with judgement or decision-making?",
    citation: "scd",
    options: [
      { id: "yes", label: "Yes", score: 1 },
      { id: "no", label: "No", score: 0 },
    ],
  },
  {
    id: "forgetfulness",
    type: "single-select",
    axis: "symptom",
    prompt:
      "Have you recently experienced forgetfulness — where you put things, what you meant to do, or explanations?",
    citation: "scd",
    options: [
      { id: "yes", label: "Yes", score: 1 },
      { id: "no", label: "No", score: 0 },
    ],
  },
  {
    id: "persistence",
    type: "single-select",
    axis: "symptom",
    prompt: "Has this decline been persistent rather than a one-off?",
    citation: "scd",
    showIf: { questionId: "forgetfulness", equals: "yes" },
    options: [
      { id: "yes", label: "Yes, it has persisted", score: 3 },
      { id: "no", label: "No, it comes and goes", score: 0 },
    ],
  },
  {
    id: "someoneElseNoticed",
    type: "single-select",
    axis: "symptom",
    prompt: "Has anyone else noticed these changes in your behaviour or habits?",
    citation: "scd",
    options: [
      { id: "yes", label: "Yes", score: 2 },
      { id: "no", label: "No", score: 0 },
    ],
  },
];

// Fast lookup by id.
export const QUESTIONS_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);
