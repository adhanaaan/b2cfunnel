"use client";

import { useFunnel } from "@/state/useFunnel";
import { computeScore } from "@/engine/scoring";
import { QUESTIONS_BY_ID } from "@/config/questions";
import { STAT_CARDS_BY_ID } from "@/config/statCards";
import { totalQuestions, questionNumber } from "@/config/funnelFlow";
import type { LeadPayload } from "@/lib/supabase/types";
import type { QuizVariant } from "@/types/funnel";
import { VariantProvider } from "@/components/VariantContext";

import { HookScreen } from "@/components/screens/HookScreen";
import { NameGateScreen } from "@/components/screens/NameGateScreen";
import { QuestionScreen } from "@/components/screens/QuestionScreen";
import { QuestionGroupScreen } from "@/components/screens/QuestionGroupScreen";
import { StatCardScreen } from "@/components/screens/StatCardScreen";
import { EmailGateScreen } from "@/components/screens/EmailGateScreen";
import { AnalysingScreen } from "@/components/screens/AnalysingScreen";
import { ResultScreen } from "@/components/screens/ResultScreen";
import { GameScreen } from "@/components/screens/GameScreen";
import { LeaderboardScreen } from "@/components/screens/LeaderboardScreen";
import { PaywallScreen } from "@/components/screens/PaywallScreen";
import { BookingScreen } from "@/components/screens/BookingScreen";

/** Client host: owns the funnel state machine and renders the current screen. */
export function Funnel({ variant = "full" }: { variant?: QuizVariant }) {
  const {
    state,
    step,
    answer,
    next,
    back,
    submitName,
    submitEmail,
    analysisDone,
    gameDone,
  } = useFunnel(variant);

  // Post the lead, then advance to the analysing screen. We don't block the
  // funnel on the network — advance regardless of the insert result.
  const handleEmailSubmit = async (name: string, email: string) => {
    const result = computeScore(state.answers);
    const payload: LeadPayload = {
      name,
      email,
      persona: result.persona,
      riskScore: result.riskScore,
      symptomScore: result.symptomScore,
      totalScore: result.total,
      band: result.band,
      answers: state.answers,
    };
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Soft-fail: capturing the lead must never block the reveal.
    }
    submitEmail(name, email);
  };

  const screen = (() => {
    switch (step.kind) {
    case "hook":
      return <HookScreen onStart={next} />;

    case "nameGate":
      return <NameGateScreen onSubmit={submitName} />;

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
        <EmailGateScreen onSubmit={handleEmailSubmit} knownName={state.name} />
      );

    case "analysing":
      return <AnalysingScreen name={state.name} onDone={analysisDone} />;

    case "result":
      return state.result ? (
        <ResultScreen result={state.result} onUnlock={next} />
      ) : null;

    case "game":
      return <GameScreen onComplete={gameDone} />;

    case "leaderboard":
      return (
        <LeaderboardScreen
          name={state.name}
          timeMs={state.gameTimeMs}
          onDone={next}
        />
      );

    case "paywall":
      return state.result ? (
        <PaywallScreen result={state.result} onBook={next} />
      ) : null;

    case "booking":
      return <BookingScreen />;

    default:
      return null;
    }
  })();

  return (
    <VariantProvider value={state.variant}>{screen}</VariantProvider>
  );
}
