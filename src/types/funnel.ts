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
  // IHH SEA Regatta (/ihhsearegatta): the v3 arc with every consent on the
  // landing (no partner consent page), a redesigned bridge card and a
  // questionnaire invite before the quiz. Closed by its own switch
  // (IHHSEA_CHALLENGE_CLOSED), which ends it on the "wrap" screen.
  | "ihhsearegatta"
  // IHH (/ihh): the regatta arc again, unchanged, on its own `ihh` bucket -
  // same landing, same invite, same report, with its own pause and
  // challenge-closed switches so the two events never move together. The
  // duplicate exists to keep this run's scores, leads and completion rate in
  // a column of their own rather than mixed into the regatta's history.
  | "ihh"
  // Pantai Hospital KL (/phkl): the regatta arc rebuilt for IHH Malaysia - a
  // processing-speed primer and the age question before the game, a "great
  // job" beat and a quiz primer instead of the post-game card (so the quiz is
  // no longer optional), and a long report ending on the memory screening
  // offer. Its own `phkl` bucket.
  | "phkl"
  // Preview-only: the daylight arc with a partner consent page. Submits nothing
  // (see PREVIEW_VARIANTS in config/variants.ts).
  | "event6";

/** A single step in the funnel flow. */
export type FunnelStep =
  | { kind: "hook" }
  | { kind: "nameGate" }
  | { kind: "consent" } // event3/event6: partner consent page between landing and game
  // event3/ihhsearegatta: terminal screen while that challenge is closed
  | { kind: "wrap" }
  // ihhsearegatta: the questionnaire invite between the post-game result and
  // the quiz - "Sure!" walks on, "Not now" goes back to the result card.
  | { kind: "quizInvite" }
  // phkl: what processing speed is, with the GAME / QUIZ / RESULTS rail,
  // between the landing and the age question.
  | { kind: "speedIntro" }
  // phkl: the quiz's `age` question, asked before the game on a daylight
  // screen. Its own kind so the quiz progress bar does not count it; the
  // answer is still `answers.age`, and questionIdsIn() counts it for scoring.
  | { kind: "ageSelect" }
  // phkl: the beat straight after the 20th match - the symbols take a bow and
  // the screen walks itself into the quiz primer.
  | { kind: "greatJob" }
  // phkl: "your brain speed isn't fixed" - the primer before the first
  // question, in place of the regatta's optional invite.
  | { kind: "quizIntro" }
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
  // How many times the game has been completed this session. The phkl report
  // reads it for "{name}'s 2nd record"; undefined until the first finish.
  gameAttempts?: number;
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
