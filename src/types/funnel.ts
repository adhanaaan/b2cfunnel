import type { Answers, AnswerValue } from "@/types/question";
import type { ScoreResult } from "@/types/engine";

/** Which quiz variant is being served. */
export type QuizVariant = "full" | "event" | "woman" | "event2";

/** A single step in the funnel flow. */
export type FunnelStep =
  | { kind: "hook" }
  | { kind: "nameGate" }
  | { kind: "question"; questionId: string }
  | { kind: "questionGroup"; title: string; questionIds: string[] }
  | { kind: "statCard"; cardId: string }
  | { kind: "emailGate" }
  | { kind: "analysing" }
  | { kind: "result" }
  | { kind: "game" }
  | { kind: "leaderboard" }
  | { kind: "paywall" }
  | { kind: "booking" }
  | { kind: "consult" } // event-only, non-sales closing
  | { kind: "instructions" } // event2: full-page how-to-play before the game
  | { kind: "gameResult" } // event2: time + rank + share + tip cards + opt-in
  | { kind: "closing" }; // event2: ReCOGnAIze assessment closing

export type StepKind = FunnelStep["kind"];

export interface FunnelState {
  variant: QuizVariant;
  cursor: number; // index into the resolved flow
  answers: Answers;
  name?: string;
  email?: string; // event: the Accenture/leaderboard email captured up front
  personalEmail?: string; // event: personal email captured at the end for results
  emailCaptured: boolean;
  result?: ScoreResult;
  gameTimeMs?: number; // reaction-game result (event only)
}

export type FunnelAction =
  | { type: "ANSWER"; questionId: string; value: AnswerValue }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SUBMIT_NAME"; name: string }
  | { type: "SUBMIT_EMAIL"; name: string; email: string }
  | { type: "SUBMIT_PERSONAL_EMAIL"; name: string; email: string }
  | { type: "ANALYSIS_DONE" }
  | { type: "GAME_DONE"; timeMs: number }
  // Jump forward to the first step of a kind (event2: decline from gameResult
  // lands on the closing screen rather than backing into the game).
  | { type: "SKIP_TO_KIND"; kind: StepKind };
