import type { Transition } from "framer-motion";

/**
 * Shared motion vocabulary for the event2 ("Ember Arena") screens. One place
 * for spring characters and durations so every screen moves with the same
 * accent: taps snap, entrances settle, big cards glide.
 */

export const springs = {
  /** Taps, chips, toggles: fast and confident. */
  pop: { type: "spring", stiffness: 520, damping: 30, mass: 0.7 },
  /** Screen and element entrances. */
  enter: { type: "spring", stiffness: 300, damping: 26, mass: 0.9 },
  /** Large cards, celebrations, layout moves. */
  soft: { type: "spring", stiffness: 150, damping: 22, mass: 1 },
  /** The pick-a-card flip. */
  flip: { type: "spring", stiffness: 220, damping: 24 },
  /** TV leaderboard rank shuffles. */
  shuffle: { type: "spring", stiffness: 170, damping: 26 },
} satisfies Record<string, Transition>;

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  in: [0.64, 0, 0.78, 0] as const,
};

/** Durations in seconds. `reveal` is the sanctioned long beat (count-ups). */
export const dur = {
  tap: 0.1,
  fast: 0.15,
  base: 0.25,
  page: 0.35,
  reveal: 0.9,
};

export const stagger = {
  items: 0.06,
  options: 0.04,
  delayChildren: 0.08,
};

/** Standard entrance for a stacked element (pair with springs.enter). */
export const riseIn = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};
