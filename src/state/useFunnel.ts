"use client";

import { useReducer, useCallback } from "react";
import type { AnswerValue } from "@/types/question";
import type { QuizVariant, StepKind } from "@/types/funnel";
import {
  funnelReducer,
  createInitialState,
  currentStep,
} from "@/state/funnelMachine";

/** React hook wrapping the funnel reducer with convenience actions. */
export function useFunnel(variant: QuizVariant) {
  const [state, dispatch] = useReducer(
    funnelReducer,
    variant,
    createInitialState,
  );

  const answer = useCallback(
    (questionId: string, value: AnswerValue) =>
      dispatch({ type: "ANSWER", questionId, value }),
    [],
  );
  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const back = useCallback(() => dispatch({ type: "BACK" }), []);
  const submitName = useCallback(
    (name: string) => dispatch({ type: "SUBMIT_NAME", name }),
    [],
  );
  const submitEmail = useCallback(
    (name: string, email: string, tipsConsent?: boolean) =>
      dispatch({ type: "SUBMIT_EMAIL", name, email, tipsConsent }),
    [],
  );
  const submitPersonalEmail = useCallback(
    (name: string, email: string) =>
      dispatch({ type: "SUBMIT_PERSONAL_EMAIL", name, email }),
    [],
  );
  const analysisDone = useCallback(
    () => dispatch({ type: "ANALYSIS_DONE" }),
    [],
  );
  const gameDone = useCallback(
    (timeMs: number) => dispatch({ type: "GAME_DONE", timeMs }),
    [],
  );
  const skipToKind = useCallback(
    (kind: StepKind) => dispatch({ type: "SKIP_TO_KIND", kind }),
    [],
  );
  const retakeGame = useCallback(
    () => dispatch({ type: "RETAKE_GAME" }),
    [],
  );

  return {
    state,
    step: currentStep(state),
    answer,
    next,
    back,
    submitName,
    submitEmail,
    submitPersonalEmail,
    analysisDone,
    gameDone,
    skipToKind,
    retakeGame,
  };
}
