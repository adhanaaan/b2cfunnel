import type { FunnelAction, FunnelState, FunnelStep } from "@/types/funnel";
import { resolveFlow } from "@/config/funnelFlow";
import { computeScore } from "@/engine/scoring";

export const initialFunnelState: FunnelState = {
  cursor: 0,
  answers: {},
  emailCaptured: false,
};

/** The step currently shown, given the resolved (pruned) flow. */
export function currentStep(state: FunnelState): FunnelStep {
  const flow = resolveFlow(state.answers);
  const index = Math.min(state.cursor, flow.length - 1);
  return flow[index];
}

/** Pure reducer driving the seven-screen funnel. */
export function funnelReducer(
  state: FunnelState,
  action: FunnelAction,
): FunnelState {
  switch (action.type) {
    case "ANSWER": {
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.value },
      };
    }

    case "NEXT": {
      const flow = resolveFlow(state.answers);
      const next = Math.min(state.cursor + 1, flow.length - 1);
      return { ...state, cursor: next };
    }

    case "BACK": {
      return { ...state, cursor: Math.max(state.cursor - 1, 0) };
    }

    case "SUBMIT_EMAIL": {
      // Capture email and advance to the analysing screen.
      const flow = resolveFlow(state.answers);
      const next = Math.min(state.cursor + 1, flow.length - 1);
      return {
        ...state,
        email: action.email,
        emailCaptured: true,
        cursor: next,
      };
    }

    case "ANALYSIS_DONE": {
      // Compute the score once, store it, and advance to the result screen.
      const flow = resolveFlow(state.answers);
      const next = Math.min(state.cursor + 1, flow.length - 1);
      return {
        ...state,
        result: state.result ?? computeScore(state.answers),
        cursor: next,
      };
    }

    default:
      return state;
  }
}
