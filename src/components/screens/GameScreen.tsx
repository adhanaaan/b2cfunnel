"use client";

import { SymbolMatchGame } from "@/components/game/symbol-match/SymbolMatchGame";

interface GameScreenProps {
  onComplete: (timeMs: number) => void;
  /** "warm" = event2 brand light-orange look. */
  theme?: "default" | "warm";
  hideBack?: boolean;
  /** Music bed + finish sting (event2 only). */
  music?: boolean;
}

/**
 * The Reaction Time Challenge - your real symbol-matching game (Task2Game),
 * wrapped with the race-to-20 timer. A game: its result never feeds the
 * brain-health score.
 */
export function GameScreen({
  onComplete,
  theme,
  hideBack,
  music,
}: GameScreenProps) {
  return (
    <SymbolMatchGame
      onComplete={onComplete}
      theme={theme}
      hideBack={hideBack}
      music={music}
    />
  );
}
