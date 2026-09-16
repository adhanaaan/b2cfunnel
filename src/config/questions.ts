import type { Question } from "@/types/question";
import type { Language } from "@/config/language";
import { QUESTIONS_TEXT_BY_LANGUAGE } from "@/config/questions.translations";

/**
 * The question bank. This is the single source of truth for scoring weights:
 * the engine reads option.score from here, so weights live in exactly one place.
 *
 * Scores natively sum to 100 (Risk Factor Score max 68 + Symptom Signal max 32).
 * These are the build brief §5 weights scaled up x4 so the headline score is a
 * native 0-100 with whole-number points; the relative proportions, the two-axis
 * "worse of" logic, and the safety override are unchanged.
 * Copy is British English and avoids HSA off-limits language (see compliance.ts).
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
      { id: "18-29", label: "18 to 29", score: 0 },
      { id: "30-39", label: "30 to 39", score: 0 },
      { id: "40-49", label: "40 to 49", score: 4 },
      { id: "50-59", label: "50 to 59", score: 8 },
      { id: "60+", label: "60 and older", score: 12 },
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
      { id: "yes", label: "Yes", score: 4 },
      { id: "no", label: "No", score: 0 },
    ],
  },
  {
    id: "menopauseSymptoms",
    type: "single-select",
    axis: "risk",
    prompt: "Are hormonal changes affecting your sleep, mood, or brain fog?",
    citation: "straw10",
    options: [
      { id: "often", label: "Often", score: 4 },
      { id: "sometimes", label: "Sometimes", score: 2 },
      { id: "notReally", label: "Not really", score: 0 },
      { id: "notSure", label: "Not sure", score: 0 },
    ],
  },
  {
    id: "familyHistory",
    type: "single-select",
    axis: "risk",
    prompt: "Do you have a family history of dementia or Alzheimer's?",
    citation: "caide",
    options: [
      {
        id: "immediate",
        label: "Yes, immediate family (parents or siblings)",
        score: 8,
      },
      {
        id: "extended",
        label: "Yes, extended family (grandparents, aunts, and uncles)",
        score: 4,
      },
      { id: "none", label: "No", score: 0 },
      { id: "unsure", label: "I'm not sure", score: 0 },
    ],
  },
  {
    id: "highBp",
    type: "single-select",
    axis: "risk",
    prompt: "High blood pressure?",
    citation: "lancet2024",
    options: [
      { id: "yes", label: "Yes", score: 4 },
      { id: "no", label: "No", score: 0 },
      { id: "unsure", label: "Not sure", score: 0 },
    ],
  },
  {
    id: "highCholesterol",
    type: "single-select",
    axis: "risk",
    prompt: "High cholesterol?",
    citation: "lancet2024",
    options: [
      { id: "yes", label: "Yes", score: 4 },
      { id: "no", label: "No", score: 0 },
      { id: "unsure", label: "Not sure", score: 0 },
    ],
  },
  {
    id: "diabetes",
    type: "single-select",
    axis: "risk",
    prompt: "Diabetes or pre-diabetes?",
    citation: "lancet2024",
    options: [
      { id: "yes", label: "Yes", score: 4 },
      { id: "no", label: "No", score: 0 },
      { id: "unsure", label: "Not sure", score: 0 },
    ],
  },
  {
    id: "hearingLoss",
    type: "single-select",
    axis: "risk",
    prompt: "Untreated hearing loss?",
    helpText: "Without hearing aids or other support.",
    citation: "lancet2024",
    options: [
      { id: "yes", label: "Yes", score: 8 },
      { id: "no", label: "No", score: 0 },
      { id: "unsure", label: "Not sure", score: 0 },
    ],
  },
  {
    id: "visionLoss",
    type: "single-select",
    axis: "risk",
    prompt: "Untreated vision loss?",
    helpText: "Uncorrected by glasses, lenses, or surgery.",
    citation: "lancet2024",
    options: [
      { id: "yes", label: "Yes", score: 4 },
      { id: "no", label: "No", score: 0 },
      { id: "unsure", label: "Not sure", score: 0 },
    ],
  },
  {
    id: "smoking",
    type: "single-select",
    axis: "risk",
    prompt: "Are you a current smoker, or were you a smoker within the last 10 years?",
    citation: "lancet2024",
    options: [
      { id: "current", label: "I currently smoke", score: 4 },
      { id: "past", label: "I smoked within the last 10 years", score: 2 },
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
      { id: "lt6", label: "Less than 6 hours", score: 4 },
      { id: "6to7", label: "6 to 7 hours", score: 2 },
      { id: "7to9", label: "7 to 9 hours", score: 0 },
      { id: "gt9", label: "More than 9 hours", score: 2 },
    ],
  },
  {
    id: "exercise",
    type: "single-select",
    axis: "risk",
    prompt: "How much cardio exercise do you get per week?",
    citation: "lancet2024",
    options: [
      { id: "lt75", label: "Less than 75 minutes", score: 4 },
      { id: "75to149", label: "75 to 149 minutes", score: 2 },
      { id: "150to300", label: "150 to 300 minutes", score: 0 },
      { id: "gt300", label: "More than 300 minutes", score: 0 },
    ],
  },
  {
    id: "diet",
    type: "single-select",
    axis: "risk",
    prompt: "How would you describe your diet?",
    citation: "lancet2024",
    options: [
      { id: "poor", label: "Mostly processed or high in sugar", score: 4 },
      { id: "moderate", label: "A mix of fresh and processed", score: 2 },
      { id: "healthy", label: "Mostly fresh, balanced meals", score: 0 },
    ],
  },
  {
    id: "alcohol",
    type: "single-select",
    axis: "risk",
    prompt: "How many alcoholic drinks do you have per week?",
    helpText: "1 drink is about 1 small wine, half a pint of beer, or 1 shot of spirits.",
    citation: "whitehall",
    options: [
      { id: "none", label: "None", score: 0 },
      { id: "1to7", label: "1 to 7", score: 0 },
      { id: "8to14", label: "8 to 14", score: 0 },
      { id: "15to21", label: "15 to 21", score: 2 },
      { id: "gt21", label: "More than 21", score: 4 },
    ],
  },
  {
    id: "tracks",
    type: "multi-select",
    axis: "meta",
    multiSelect: true,
    prompt: "What do you currently measure?",
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
  // The three experiential symptom questions use a shared frequency scale.
  {
    id: "concentrating",
    type: "single-select",
    axis: "symptom",
    prompt: "How often do you have trouble concentrating on meetings or sustained tasks?",
    citation: "scd",
    control: "slider",
    options: [
      { id: "almostDaily", label: "Almost daily", score: 4 },
      { id: "severalWeek", label: "Several times a week", score: 2 },
      { id: "rarely", label: "Rarely", score: 0 },
      { id: "notNotice", label: "Not that I notice", score: 0 },
    ],
  },
  {
    id: "judgement",
    type: "single-select",
    axis: "symptom",
    prompt:
      "Compared to a few years ago, how often do you have problems with judgement or decision-making?",
    citation: "scd",
    control: "slider",
    options: [
      { id: "almostDaily", label: "Almost daily", score: 4 },
      { id: "severalWeek", label: "Several times a week", score: 2 },
      { id: "rarely", label: "Rarely", score: 0 },
      { id: "notNotice", label: "Not that I notice", score: 0 },
    ],
  },
  {
    id: "forgetfulness",
    type: "single-select",
    axis: "symptom",
    prompt:
      "How often do you experience forgetfulness, such as where you put things or what you meant to do?",
    citation: "scd",
    control: "slider",
    options: [
      { id: "almostDaily", label: "Almost daily", score: 4 },
      { id: "severalWeek", label: "Several times a week", score: 2 },
      { id: "rarely", label: "Rarely", score: 0 },
      { id: "notNotice", label: "Not that I notice", score: 0 },
    ],
  },
  {
    id: "persistence",
    type: "single-select",
    axis: "symptom",
    prompt: "Has this forgetfulness been persistent rather than a one-off?",
    citation: "scd",
    // Shown whenever the person notices forgetfulness at all.
    showIf: {
      questionId: "forgetfulness",
      equals: ["almostDaily", "severalWeek", "rarely"],
    },
    options: [
      { id: "yes", label: "Yes, it has persisted", score: 12 },
      { id: "no", label: "No, it comes and goes", score: 0 },
    ],
  },
  {
    id: "someoneElseNoticed",
    type: "single-select",
    axis: "symptom",
    prompt: "Has anyone else noticed these changes in your behaviour or habits?",
    citation: "scd",
    // Follow-up: only when forgetfulness is frequent (several times a week) or
    // almost daily.
    showIf: {
      questionId: "forgetfulness",
      equals: ["almostDaily", "severalWeek"],
    },
    options: [
      { id: "yes", label: "Yes", score: 8 },
      { id: "no", label: "No", score: 0 },
    ],
  },
];

// Fast lookup by id.
export const QUESTIONS_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);

/**
 * The question bank in a given language.
 *
 * English returns the bank itself, the same object, so nothing about the
 * English funnels can change here. Any other language returns a COPY whose
 * prompts, help text and option labels have been replaced from the overlay
 * for that language - and nothing else.
 *
 * What is carried across verbatim is the load-bearing part: `id`, `axis`,
 * `score`, `showIf`, `control`, `personaSignal`. A translation cannot move a
 * weight, drop a branch or rename an option id, so an Indonesian answer is
 * scored by exactly the code and exactly the numbers an English one is
 * (tests/config/siloamLanguage.test.ts holds this).
 *
 * Memoised: the map is built once per language, not once per render.
 */
const questionCache = new Map<Language, Question[]>();

export function questionsFor(language: Language): Question[] {
  if (language === "en") return QUESTIONS;
  const cached = questionCache.get(language);
  if (cached) return cached;

  const text = QUESTIONS_TEXT_BY_LANGUAGE[language];
  const translated = QUESTIONS.map((q): Question => {
    const t = text[q.id];
    if (!t) return q;
    return {
      ...q,
      prompt: t.prompt ?? q.prompt,
      // Only override help text the question actually has: a translation must
      // not invent one where the English question shows none.
      ...(q.helpText !== undefined && t.helpText !== undefined
        ? { helpText: t.helpText }
        : {}),
      options: q.options?.map((o) => ({
        ...o,
        label: t.options?.[o.id] ?? o.label,
      })),
    };
  });
  questionCache.set(language, translated);
  return translated;
}

/** The same bank, by id - what the screens look a question up in. */
export function questionsByIdFor(
  language: Language,
): Record<string, Question> {
  if (language === "en") return QUESTIONS_BY_ID;
  return Object.fromEntries(questionsFor(language).map((q) => [q.id, q]));
}
