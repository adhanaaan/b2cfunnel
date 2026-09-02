import type { Answers, AnswerValue } from "@/types/question";
import type { ScoreResult } from "@/types/engine";

/** Which quiz variant is being served. */
export type QuizVariant =
  | "full"
  | "event"
  | "woman"
  | "event2"
  | "event3"
  // Preview-only: the daylight arc with a partner consent page. Submits nothing
  // (see PREVIEW_VARIANTS in config/variants.ts).
  | "event6";

/** A single step in the funnel flow. */
export type FunnelStep =
  | { kind: "hook" }
  | { kind: "nameGate" }
  | { kind: "consent" } // event3/event6: partner consent page between landing and game
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
  // Brain-health-tips consent from the landing page. Undefined when the variant
  // never asked, which is stored as null rather than false.
  tipsConsent?: boolean;
  // The partner (IHH) consent from the consent page. Same three states as
  // tipsConsent: ticked, left unticked, or undefined when the variant has no
  // consent page at all.
  partnerConsent?: boolean;
}

export type FunnelAction =
  | { type: "ANSWER"; questionId: string; value: AnswerValue }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SUBMIT_NAME"; name: string }
  | { type: "SUBMIT_EMAIL"; name: string; email: string; tipsConsent?: boolean }
  | { type: "SUBMIT_PERSONAL_EMAIL"; name: string; email: string }
  // Consent page: records the partner consent, ticked or not, and moves on.
  | { type: "SUBMIT_CONSENT"; partnerConsent: boolean }
  | { type: "ANALYSIS_DONE" }
  | { type: "GAME_DONE"; timeMs: number }
  // Jump forward to the first step of a kind (event2: decline from gameResult
  // lands on the closing screen rather than backing into the game).
  | { type: "SKIP_TO_KIND"; kind: StepKind }
  // Jump back to the game step and clear the previous time (event2: "Retake
  // the test" from the post-game result screen).
  | { type: "RETAKE_GAME" };
