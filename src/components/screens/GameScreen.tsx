"use client";

import { SymbolMatchGame } from "@/components/game/symbol-match/SymbolMatchGame";

interface GameScreenProps {
  onComplete: (timeMs: number) => void;
  /** "night" = event2 ember look; also hides the tour's back button. */
  theme?: "default" | "night";
  hideBack?: boolean;
}

/**
 * The Reaction Time Challenge - your real symbol-matching game (Task2Game),
 * wrapped with the race-to-20 timer. A game: its result never feeds the
 * brain-health score.
 */
export function GameScreen({ onComplete, theme, hideBack }: GameScreenProps) {
  return (
    <SymbolMatchGame onComplete={onComplete} theme={theme} hideBack={hideBack} />
  );
}
