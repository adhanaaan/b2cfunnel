/**
 * Question data model. Questions are config-driven (see src/config/questions.ts)
 * so screens render purely from data and Audrey can iterate copy without code.
 */

// Which score axis a question feeds.
//  - 'risk'    -> Risk Factor Score (max 17)
//  - 'symptom' -> Symptom Signal (max 8)
//  - 'meta'    -> 0 points; drives branching/persona only (e.g. sex, what-you-track)
export type Axis = "risk" | "symptom" | "meta";

export type QuestionType = "single-select" | "multi-select" | "number";

// Citation a question/stat relates to (for "why this question?" provenance).
export type CitationTag =
  | "lancet2024"
  | "caide"
  | "scd"
  | "straw10"
  | "salthouse"
  | "imhWise"
  | "whitehall"
  | null;

// Persona a Q15-style option nudges the user toward.
export type PersonaSignal =
  | "caregiver"
  | "perimenopausal"
  | "highPerformer"
  | "neutral";

export interface Option {
  id: string; // stable key, e.g. 'immediate' - this is what gets stored as the answer
  label: string; // British English display text
  score: number; // contribution to this question's axis (supports 0.5 increments)
  personaSignal?: PersonaSignal; // optional nudge toward a persona (Q15)
}

// Conditional visibility: show this question only if another answer matches.
export interface ShowCondition {
  questionId: string; // e.g. 'sex' or 'forgetfulness'
  equals: string | string[]; // show only when that answer equals / is one of these
}

export interface Question {
  id: string; // 'age', 'sex', 'hotFlushes', ...
  type: QuestionType;
  axis: Axis;
  prompt: string; // British English
  helpText?: string;
  options?: Option[]; // for select types
  showIf?: ShowCondition; // conditional visibility (Q3 hot flushes, Q19 persistence)
  citation?: CitationTag;
  multiSelect?: boolean; // convenience flag for Q15
  // Render hint for single-select ordinal scales: "slider" shows a discrete
  // slider over the options instead of buttons.
  control?: "slider";
}

export type AnswerValue = string | number | string[];
export type Answers = Record<string, AnswerValue>; // keyed by Question.id
