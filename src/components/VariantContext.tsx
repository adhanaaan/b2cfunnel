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

/** Convenience flag for the v2 event ("Ember Arena") experience. */
export const useIsEvent2 = () => useContext(VariantContext) === "event2";

/** True for either event variant - shared booth behaviour (no paywall etc.). */
export const useIsEventFamily = () => {
  const variant = useContext(VariantContext);
  return variant === "event" || variant === "event2";
};
