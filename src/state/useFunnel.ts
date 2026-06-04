"use client";

import { useReducer, useCallback } from "react";
import type { AnswerValue } from "@/types/question";
import {
  funnelReducer,
  initialFunnelState,
  currentStep,
} from "@/state/funnelMachine";

/** React hook wrapping the funnel reducer with convenience actions. */
export function useFunnel() {
  const [state, dispatch] = useReducer(funnelReducer, initialFunnelState);

  const answer = useCallback(
    (questionId: string, value: AnswerValue) =>
      dispatch({ type: "ANSWER", questionId, value }),
    [],
  );
  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const back = useCallback(() => dispatch({ type: "BACK" }), []);
  const submitEmail = useCallback(
    (email: string) => dispatch({ type: "SUBMIT_EMAIL", email }),
    [],
  );
  const analysisDone = useCallback(
    () => dispatch({ type: "ANALYSIS_DONE" }),
    [],
  );

  return {
    state,
    step: currentStep(state),
    answer,
    next,
    back,
    submitEmail,
    analysisDone,
  };
}
