"use client";

import { createContext, useContext } from "react";
import type { QuizVariant } from "@/types/funnel";

/**
 * Variant context so screens can apply variant-specific styling (e.g. the
 * premium event theme) without prop-drilling through the funnel state machine.
 */
const VariantContext = createContext<QuizVariant>("full");

export const VariantProvider = VariantContext.Provider;

export const useVariant = () => useContext(VariantContext);

/** Convenience flag for the premium event theme. */
export const useIsEvent = () => useContext(VariantContext) === "event";

/**
 * Convenience flag for the v2-style event experience. Event v3 only redesigns
 * the arena screens (splash, instructions, post-game result); everything
 * downstream - the quiz arc, report and closing - is intentionally identical
 * to v2, so v3 shares this flag. Speed Game is an independent duplicate of
 * v3's arena screens, built on the same downstream arc, so it shares it too.
 */
export const useIsEvent2 = () => {
  const variant = useContext(VariantContext);
  return variant === "event2" || variant === "event3" || variant === "speedgame";
};

/** Convenience flag for the v3 event ("Daylight Ember") arena screens. */
export const useIsEvent3 = () => useContext(VariantContext) === "event3";

/** Convenience flag for the Speed Game (/speedgame) arena screens. */
export const useIsSpeedgame = () => useContext(VariantContext) === "speedgame";

/** True for any event variant - shared booth behaviour (no paywall etc.). */
export const useIsEventFamily = () => {
  const variant = useContext(VariantContext);
  return (
    variant === "event" ||
    variant === "event2" ||
    variant === "event3" ||
    variant === "speedgame"
  );
};
