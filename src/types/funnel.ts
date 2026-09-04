import type { Answers, AnswerValue } from "@/types/question";
import type { ScoreResult } from "@/types/engine";

/** Which quiz variant is being served. */
export type QuizVariant =
  | "full"
  | "event"
  | "woman"
  | "event2"
  | "event3"
  // Rotary KL-WAM (/rotaryklwam): the daylight arc with no partner consent
  // page - the landing leads straight into the instructions and their demo.
  | "rotary"
  // NTU Homecoming (/ntuhomecoming): the same arc as rotary - the daylight
  // flow with no partner consent page - on its own `ntuhomecoming` bucket.
  | "ntuhomecoming"
  // IHH SEA Regatta (/ihhsearegatta): the v3 arc, open (no "wrap" screen),
  // with every consent on the landing (no partner consent page), a redesigned
  // bridge card and a questionnaire invite before the quiz.
  | "ihhsearegatta"
  // Preview-only: the daylight arc with a partner consent page. Submits nothing
  // (see PREVIEW_VARIANTS in config/variants.ts).
  | "event6";

/** A single step in the funnel flow. */
export type FunnelStep =
  | { kind: "hook" }
  | { kind: "nameGate" }
  | { kind: "consent" } // event3/event6: partner consent page between landing and game
  | { kind: "wrap" } // event3: terminal screen while the challenge is closed
  // ihhsearegatta: the questionnaire invite between the post-game result and
  // the quiz - "Sure!" walks on, "Not now" ends on the closing screen.
  | { kind: "quizInvite" }
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
  // The partner (IHH) consent - from the consent page on /event-v3, from the
  // landing on /ihhsearegatta. Same three states as tipsConsent: ticked, left
  // unticked, or undefined when the variant never asks for it.
  partnerConsent?: boolean;
}

export type FunnelAction =
  | { type: "ANSWER"; questionId: string; value: AnswerValue }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SUBMIT_NAME"; name: string }
  // Landing capture. The consents ride along with it when the landing asks
  // for them: tips on every daylight landing, the partner's on the regatta's.
  | {
      type: "SUBMIT_EMAIL";
      name: string;
      email: string;
      tipsConsent?: boolean;
      partnerConsent?: boolean;
    }
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
