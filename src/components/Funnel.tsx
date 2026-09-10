"use client";

import { useEffect } from "react";
import { useFunnel } from "@/state/useFunnel";
import { track, recordResponse, setPreviewMode } from "@/lib/analytics";
import { computeScore } from "@/engine/scoring";
import type { FunnelStep } from "@/types/funnel";
import { QUESTIONS_BY_ID } from "@/config/questions";
import { STAT_CARDS_BY_ID } from "@/config/statCards";
import {
  AGE_SELECT_QUESTION_ID,
  totalQuestions,
  questionNumber,
} from "@/config/funnelFlow";
import type { LeadPayload } from "@/lib/supabase/types";
import type { QuizVariant } from "@/types/funnel";
import { VariantProvider } from "@/components/VariantContext";
import { eventSource } from "@/config/event";
import { isPreviewVariant, usesDaylightScreens } from "@/config/variants";

import { HookScreen } from "@/components/screens/HookScreen";
import { PostGameHook } from "@/components/screens/PostGameHook";
import { NameGateScreen } from "@/components/screens/NameGateScreen";
import { QuestionScreen } from "@/components/screens/QuestionScreen";
import { QuestionGroupScreen } from "@/components/screens/QuestionGroupScreen";
import { StatCardScreen } from "@/components/screens/StatCardScreen";
import { EmailGateScreen } from "@/components/screens/EmailGateScreen";
import { AnalysingScreen } from "@/components/screens/AnalysingScreen";
import { ResultScreen } from "@/components/screens/ResultScreen";
import { GameScreen } from "@/components/screens/GameScreen";
import { LeaderboardScreen } from "@/components/screens/LeaderboardScreen";
import { Event2Splash } from "@/components/screens/event2/Event2Splash";
import { Event2Instructions } from "@/components/screens/event2/Event2Instructions";
import { Event2GameResult } from "@/components/screens/event2/Event2GameResult";
import { Event2Closing } from "@/components/screens/event2/Event2Closing";
import { Event3Splash } from "@/components/screens/event3/Event3Splash";
import { Event3Consent } from "@/components/screens/event3/Event3Consent";
import { Event3Wrap } from "@/components/screens/event3/Event3Wrap";
import { Event3QuizInvite } from "@/components/screens/event3/Event3QuizInvite";
import { Event6Consent } from "@/components/screens/event6/Event6Consent";
import { Event3Instructions } from "@/components/screens/event3/Event3Instructions";
import { Event3GameResult } from "@/components/screens/event3/Event3GameResult";
import { PaywallScreen } from "@/components/screens/PaywallScreen";
import { BookingScreen } from "@/components/screens/BookingScreen";
import { ConsultScreen } from "@/components/screens/ConsultScreen";
import { PhklSpeedIntro } from "@/components/screens/phkl/PhklSpeedIntro";
import { PhklAgeSelect } from "@/components/screens/phkl/PhklAgeSelect";
import { PhklGreatJob } from "@/components/screens/phkl/PhklGreatJob";
import { PhklQuizIntro } from "@/components/screens/phkl/PhklQuizIntro";
import { PhklAnalysingScreen } from "@/components/screens/phkl/PhklAnalysingScreen";
import { PhklResultScreen } from "@/components/screens/phkl/PhklResultScreen";
import { MambaResultScreen } from "@/components/screens/mambacares/MambaResultScreen";

/** A stable, human-readable name for a funnel step (for drop-off analytics). */
function stepKey(step: FunnelStep): string {
  switch (step.kind) {
    case "question":
      return `question:${step.questionId}`;
    case "questionGroup":
      return `questionGroup:${step.title}`;
    case "statCard":
      return `statCard:${step.cardId}`;
    default:
      return step.kind;
  }
}

/** Client host: owns the funnel state machine and renders the current screen. */
export function Funnel({ variant = "full" }: { variant?: QuizVariant }) {
  const {
    state,
    step,
    answer,
    next,
    back,
    submitEmail,
    submitPersonalEmail,
    submitConsent,
    analysisDone,
    gameDone,
    skipToKind,
    retakeGame,
  } = useFunnel(variant);

  // Preview variants are walkthroughs: they render the whole experience but
  // must not write anything, so every submit below is skipped and analytics is
  // switched off for as long as this funnel is mounted.
  const preview = isPreviewVariant(state.variant);
  useEffect(() => {
    setPreviewMode(preview);
    return () => setPreviewMode(false);
  }, [preview]);

  // Anonymous drop-off tracking: a step view fires whenever the step changes.
  // Also reset scroll to the top so a new screen never lands mid-page (e.g. on
  // the paywall price after scrolling the result).
  const stepName = stepKey(step);
  useEffect(() => {
    track("step_view", { variant: state.variant, step: stepName });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      // Belt and braces: some mobile browsers scroll documentElement/body
      // instead of the window - reset both so every step opens from the top.
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [stepName, state.variant]);

  // Post the complete lead (name + email captured earlier, plus the computed
  // score and game time) when the profile is built. Fire-and-forget: capturing
  // the lead must never block the reveal.
  const handleAnalysisDone = () => {
    const result = computeScore(state.answers, state.variant);
    const payload: LeadPayload = {
      name: state.name,
      // Personal email (event end-gate) is where results go; fall back to the
      // up-front email for the full quiz.
      email: state.personalEmail ?? state.email ?? "",
      persona: result.persona,
      riskScore: result.riskScore,
      symptomScore: result.symptomScore,
      totalScore: result.total,
      band: result.band,
      answers: state.answers,
      gameTimeMs: state.gameTimeMs,
      tipsConsent: state.tipsConsent,
      // The partner consent, ticked or not - from the consent page on v3,
      // from the landing on the regatta.
      partnerConsent: state.partnerConsent,
      // Same tag as the score row, so the board's report rate can divide
      // reports by players for one event day.
      source: eventSource(state.variant) ?? undefined,
    };
    if (!preview) {
      void fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }

    // Anonymous audience profile (no name/email) for aggregate insights.
    recordResponse({
      variant: state.variant,
      age: typeof state.answers.age === "string" ? state.answers.age : undefined,
      sex: typeof state.answers.sex === "string" ? state.answers.sex : undefined,
      band: result.band,
      persona: result.persona,
      riskScore: result.riskScore,
      symptomScore: result.symptomScore,
      totalScore: result.total,
      gameTimeMs: state.gameTimeMs,
      answers: state.answers,
    });

    analysisDone();
  };

  // Record the game result to the leaderboard, then advance.
  const handleGameDone = (timeMs: number) => {
    if (preview) {
      gameDone(timeMs);
      return;
    }
    void fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: state.name,
        email: state.email,
        timeMs,
        tipsConsent: state.tipsConsent,
        partnerConsent: state.partnerConsent,
        source: eventSource(state.variant) ?? "event",
        // The age band, on the arcs that ask for it before the game (phkl);
        // absent everywhere else and stored as null.
        ageBand:
          typeof state.answers[AGE_SELECT_QUESTION_ID] === "string"
            ? state.answers[AGE_SELECT_QUESTION_ID]
            : undefined,
      }),
    }).catch(() => {});
    gameDone(timeMs);
  };

  // The age band the phkl arc asks for before the game, for the report.
  const ageBand =
    typeof state.answers[AGE_SELECT_QUESTION_ID] === "string"
      ? (state.answers[AGE_SELECT_QUESTION_ID] as string)
      : undefined;

  const screen = (() => {
    switch (step.kind) {
    case "hook":
      // Event: the post-game opt-in hook (recap + locked domains). Full quiz:
      // the cold-open intro hook.
      return state.variant === "event" ? (
        <PostGameHook
          name={state.name}
          email={state.email}
          timeMs={state.gameTimeMs}
          onStart={next}
          onDecline={() => {
            track("hook_declined", { variant: state.variant });
            back();
          }}
        />
      ) : (
        <HookScreen onStart={next} />
      );

    case "nameGate":
      // Event2/3: the single email capture (leaderboard key + results address).
      // The regatta's landing also carries the partner consent, which rides
      // along with the capture the same way the tips consent does.
      return usesDaylightScreens(state.variant) ? (
        <Event3Splash
          onSubmit={submitEmail}
          preview={preview}
          design={
            state.variant === "rotary" ||
            state.variant === "ntuhomecoming" ||
            state.variant === "ihhsearegatta" ||
            state.variant === "ihh" ||
            state.variant === "phkl" ||
            state.variant === "mambacares"
              ? state.variant
              : "v3"
          }
        />
      ) : state.variant === "event2" ? (
        <Event2Splash onSubmit={submitEmail} />
      ) : (
        <NameGateScreen onSubmit={submitEmail} />
      );

    case "consent":
      // v3 and v6 only: the partner's consents live on their own page, before
      // the instructions and their demo round; the landing keeps its own two.
      // v3 asks for them as one tick and records the answer; the v6 preview
      // keeps the split-tick treatment (one box per clause) for comparison and
      // stores nothing. The regatta has no such step - its landing carries the
      // partner's tick.
      return state.variant === "event6" ? (
        <Event6Consent onSubmit={() => next()} />
      ) : (
        <Event3Consent onSubmit={submitConsent} />
      );

    case "quizInvite":
      // ihhsearegatta and ihh: "Tell me more" on the result card lands here, and the
      // quiz is accepted or declined on this page. "Not now" hands the player
      // back to that result card - their time, rank and share - rather than
      // ending the session on a closing screen; the invite sits directly
      // behind it in the flow, so stepping back is exactly one step.
      return (
        <Event3QuizInvite
          onAccept={next}
          onDecline={() => {
            track("hook_declined", { variant: state.variant });
            back();
          }}
        />
      );

    case "wrap":
      // Challenge closed (EVENT3_CHALLENGE_CLOSED on v3,
      // IHHSEA_CHALLENGE_CLOSED on the regatta, IHH_CHALLENGE_CLOSED on /ihh):
      // the last step of that flow.
      // Terminal - there is nothing behind it to advance to.
      return <Event3Wrap />;

    case "speedIntro":
      // phkl: what processing speed is, before the age question and the game.
      return <PhklSpeedIntro onContinue={next} />;

    case "ageSelect":
      // phkl: the quiz's `age` question, asked before the game on a daylight
      // screen. The answer lands in `answers.age` exactly as the quiz's own
      // question would put it, so scoring reads it unchanged.
      return (
        <PhklAgeSelect
          value={ageBand}
          onAnswer={(id) => answer(AGE_SELECT_QUESTION_ID, id)}
          onNext={next}
          onBack={back}
        />
      );

    case "greatJob":
      // phkl: the beat after the 20th match. It moves on by itself (or on a
      // tap) into the quiz primer; there is no result card in this arc.
      return <PhklGreatJob onDone={next} />;

    case "quizIntro":
      // phkl: the quiz primer. No decline - the quiz is part of the arc.
      return <PhklQuizIntro name={state.name} onContinue={next} />;

    case "instructions": {
      const InstructionsScreen = usesDaylightScreens(state.variant)
        ? Event3Instructions
        : Event2Instructions;
      return (
        <InstructionsScreen
          onDemo={() => {
            // Make sure the guided tour runs even on a same-session replay.
            try {
              sessionStorage.removeItem("sm_demo_done");
            } catch {
              /* ignore */
            }
            next();
          }}
          onSkip={() => {
            try {
              sessionStorage.setItem("sm_demo_done", "1");
            } catch {
              /* ignore */
            }
            next();
          }}
        />
      );
    }

    case "question": {
      const question = QUESTIONS_BY_ID[step.questionId];
      return (
        <QuestionScreen
          question={question}
          value={state.answers[question.id]}
          current={questionNumber(state.answers, state.cursor, state.variant)}
          total={totalQuestions(state.answers, state.variant)}
          canGoBack={state.cursor > 0}
          onAnswer={(value) => answer(question.id, value)}
          onNext={next}
          onBack={back}
        />
      );
    }

    case "questionGroup":
      return (
        <QuestionGroupScreen
          title={step.title}
          questions={step.questionIds.map((id) => QUESTIONS_BY_ID[id])}
          answers={state.answers}
          current={questionNumber(state.answers, state.cursor, state.variant)}
          total={totalQuestions(state.answers, state.variant)}
          canGoBack={state.cursor > 0}
          onAnswer={answer}
          onNext={next}
          onBack={back}
        />
      );

    case "statCard":
      return (
        <StatCardScreen card={STAT_CARDS_BY_ID[step.cardId]} onNext={next} />
      );

    case "emailGate":
      return (
        <EmailGateScreen
          onSubmit={state.variant === "event" ? submitPersonalEmail : submitEmail}
          knownName={state.name}
        />
      );

    case "analysing":
      // The PHKL arc loads its report behind its own screen: a progress ring
      // counting to 100% with each part of the workup ticking off, one by one.
      // #MambaCares runs the same arc, so it gets the same screen.
      if (state.variant === "phkl" || state.variant === "mambacares") {
        return (
          <PhklAnalysingScreen
            name={state.name}
            onDone={handleAnalysisDone}
          />
        );
      }
      return <AnalysingScreen name={state.name} onDone={handleAnalysisDone} />;

    case "result":
      // Same header, same risk section, a different argument under them: the
      // #MambaCares report ends on the Dementia Singapore campaign where the
      // PHKL one ends on the Memory Screening Package.
      if (state.variant === "mambacares") {
        return state.result ? (
          <MambaResultScreen
            result={state.result}
            name={state.name}
            email={state.email}
            gameTimeMs={state.gameTimeMs}
            gameAttempts={state.gameAttempts}
            onRetake={() => {
              track("game_retake", { variant: state.variant, step: "result" });
              retakeGame();
            }}
          />
        ) : null;
      }
      if (state.variant === "phkl") {
        // The PHKL report carries the time and standing itself (there is no
        // post-game card in this arc) and its own "Retry": the reducer
        // brings a replay straight back here with the new time.
        return state.result ? (
          <PhklResultScreen
            result={state.result}
            name={state.name}
            email={state.email}
            gameTimeMs={state.gameTimeMs}
            gameAttempts={state.gameAttempts}
            ageBand={ageBand}
            onRetake={() => {
              track("game_retake", { variant: state.variant, step: "result" });
              retakeGame();
            }}
          />
        ) : null;
      }
      return state.result ? (
        <ResultScreen
          result={state.result}
          onUnlock={next}
          name={state.name}
          // The same address the lead row was written with, so the report
          // opt-in stamps consent on that row (the /event variant collects a
          // separate personal email at the end).
          email={state.personalEmail ?? state.email}
          gameTimeMs={state.gameTimeMs}
        />
      ) : null;

    case "game": {
      const ember =
        state.variant === "event2" || usesDaylightScreens(state.variant);
      return (
        <GameScreen
          onComplete={handleGameDone}
          theme={ember ? "warm" : "default"}
          hideBack={ember}
          music={ember}
          // A replay from the phkl or #MambaCares report goes straight to the
          // countdown,
          // whatever sessionStorage remembers about the guided tour.
          skipDemo={state.result != null}
        />
      );
    }

    case "leaderboard":
      return (
        <LeaderboardScreen
          name={state.name}
          email={state.email}
          timeMs={state.gameTimeMs}
          onDone={next}
        />
      );

    case "paywall":
      return state.result ? <PaywallScreen /> : null;

    case "booking":
      return <BookingScreen />;

    case "consult":
      return <ConsultScreen />;

    case "gameResult":
      if (usesDaylightScreens(state.variant)) {
        return (
          <Event3GameResult
            name={state.name}
            email={state.email}
            timeMs={state.gameTimeMs}
            onContinue={next}
            onRetake={() => {
              track("game_retake", { variant: state.variant });
              retakeGame();
            }}
          />
        );
      }
      return (
        <Event2GameResult
          name={state.name}
          email={state.email}
          timeMs={state.gameTimeMs}
          onContinue={next}
          onDecline={() => {
            track("hook_declined", { variant: state.variant });
            skipToKind("closing");
          }}
          onRetake={() => {
            track("game_retake", { variant: state.variant });
            retakeGame();
          }}
        />
      );

    case "closing":
      // Decliners jump here without a computed score - don't promise one.
      return <Event2Closing tookQuiz={state.result != null} />;

    default:
      return null;
    }
  })();

  return (
    <VariantProvider value={state.variant}>{screen}</VariantProvider>
  );
}
