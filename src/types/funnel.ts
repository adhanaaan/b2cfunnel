import type { Answers, AnswerValue } from "@/types/question";
import type { ScoreResult } from "@/types/engine";

/** A single step in the funnel flow. */
export type FunnelStep =
  | { kind: "hook" }
  | { kind: "question"; questionId: string }
  | { kind: "statCard"; cardId: string }
  | { kind: "emailGate" }
  | { kind: "analysing" }
  | { kind: "result" }
  | { kind: "paywall" }
  | { kind: "booking" };

export type StepKind = FunnelStep["kind"];

export interface FunnelState {
  cursor: number; // index into the resolved flow
  answers: Answers;
  name?: string;
  email?: string;
  emailCaptured: boolean;
  result?: ScoreResult;
}

export type FunnelAction =
  | { type: "ANSWER"; questionId: string; value: AnswerValue }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SUBMIT_EMAIL"; name: string; email: string }
  | { type: "ANALYSIS_DONE" };
