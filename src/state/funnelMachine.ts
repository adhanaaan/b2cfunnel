import type {
  FunnelAction,
  FunnelState,
  FunnelStep,
  QuizVariant,
} from "@/types/funnel";
import { resolveFlow } from "@/config/funnelFlow";
import { computeScore } from "@/engine/scoring";

export function createInitialState(variant: QuizVariant): FunnelState {
  return { variant, cursor: 0, answers: {}, emailCaptured: false };
}

/** The step currently shown, given the resolved (pruned) flow. */
export function currentStep(state: FunnelState): FunnelStep {
  const flow = resolveFlow(state.answers, state.variant);
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
      const flow = resolveFlow(state.answers, state.variant);
      const next = Math.min(state.cursor + 1, flow.length - 1);
      return { ...state, cursor: next };
    }

    case "BACK": {
      return { ...state, cursor: Math.max(state.cursor - 1, 0) };
    }

    case "SUBMIT_NAME": {
      const flow = resolveFlow(state.answers, state.variant);
      const next = Math.min(state.cursor + 1, flow.length - 1);
      return { ...state, name: action.name, cursor: next };
    }

    case "SUBMIT_EMAIL": {
      // Capture name + email and advance to the analysing screen.
      const flow = resolveFlow(state.answers, state.variant);
      const next = Math.min(state.cursor + 1, flow.length - 1);
      return {
        ...state,
        name: action.name,
        email: action.email,
        emailCaptured: true,
        cursor: next,
      };
    }

    case "SUBMIT_PERSONAL_EMAIL": {
      // Event: personal email at the end, kept separate from the Accenture
      // address. Advance to the analysing screen.
      const flow = resolveFlow(state.answers, state.variant);
      const next = Math.min(state.cursor + 1, flow.length - 1);
      return {
        ...state,
        name: action.name || state.name,
        personalEmail: action.email,
        cursor: next,
      };
    }

    case "GAME_DONE": {
      const flow = resolveFlow(state.answers, state.variant);
      const next = Math.min(state.cursor + 1, flow.length - 1);
      return { ...state, gameTimeMs: action.timeMs, cursor: next };
    }

    case "ANALYSIS_DONE": {
      // Compute the score once, store it, and advance to the result screen.
      const flow = resolveFlow(state.answers, state.variant);
      const next = Math.min(state.cursor + 1, flow.length - 1);
      return {
        ...state,
        result: state.result ?? computeScore(state.answers, state.variant),
        cursor: next,
      };
    }

    default:
      return state;
  }
}
