"use client";

import { useEffect } from "react";
import { useFunnel } from "@/state/useFunnel";
import { track, recordResponse } from "@/lib/analytics";
import { computeScore } from "@/engine/scoring";
import type { FunnelStep } from "@/types/funnel";
import { QUESTIONS_BY_ID } from "@/config/questions";
import { STAT_CARDS_BY_ID } from "@/config/statCards";
import { totalQuestions, questionNumber } from "@/config/funnelFlow";
import type { LeadPayload } from "@/lib/supabase/types";
import type { QuizVariant } from "@/types/funnel";
import { VariantProvider } from "@/components/VariantContext";
import { EVENT3_SOURCE } from "@/config/event";

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
import { Event3Instructions } from "@/components/screens/event3/Event3Instructions";
import { Event3GameResult } from "@/components/screens/event3/Event3GameResult";
import { PaywallScreen } from "@/components/screens/PaywallScreen";
import { BookingScreen } from "@/components/screens/BookingScreen";
import { ConsultScreen } from "@/components/screens/ConsultScreen";

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
    analysisDone,
    gameDone,
    skipToKind,
    retakeGame,
  } = useFunnel(variant);

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
    };
    void fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});

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
    void fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: state.name,
        email: state.email,
        timeMs,
        source:
          state.variant === "event3"
            ? EVENT3_SOURCE
            : state.variant === "event2"
              ? "event2"
              : "event",
      }),
    }).catch(() => {});
    gameDone(timeMs);
  };

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
      return state.variant === "event3" ? (
        <Event3Splash onSubmit={submitEmail} />
      ) : state.variant === "event2" ? (
        <Event2Splash onSubmit={submitEmail} />
      ) : (
        <NameGateScreen onSubmit={submitEmail} />
      );

    case "instructions": {
      const InstructionsScreen =
        state.variant === "event3" ? Event3Instructions : Event2Instructions;
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
      return <AnalysingScreen name={state.name} onDone={handleAnalysisDone} />;

    case "result":
      return state.result ? (
        <ResultScreen
          result={state.result}
          onUnlock={next}
          name={state.name}
          email={state.email}
          gameTimeMs={state.gameTimeMs}
        />
      ) : null;

    case "game": {
      const ember = state.variant === "event2" || state.variant === "event3";
      return (
        <GameScreen
          onComplete={handleGameDone}
          theme={ember ? "warm" : "default"}
          hideBack={ember}
          music={ember}
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
      if (state.variant === "event3") {
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
