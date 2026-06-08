"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Symbol icons (from the recognaizelite symbol-matching game). */
const ICONS = [
  "sun.png",
  "camera.png",
  "flash.png",
  "lock.png",
  "moon.png",
  "next.png",
  "puzzle.png",
  "setting.png",
  "star.png",
  "mail.png",
];

const GOAL = 20;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** A permutation mapping each digit -> the icon index shown for it (the key). */
function makeKey(): number[] {
  return [...DIGITS].sort(() => Math.random() - 0.5);
}

const randIcon = () => Math.floor(Math.random() * ICONS.length);

interface Props {
  /** Called when the player reaches GOAL correct. timeMs = time taken. */
  onComplete: (timeMs: number) => void;
}

/**
 * Reaction Time Challenge: race to 20 correct symbol matches as fast as you can.
 * A key maps digits to symbols; a target symbol shows; tap the matching digit.
 * NOTE: this is a game — its result never feeds the brain-health score.
 */
export function SymbolMatchChallenge({ onComplete }: Props) {
  const [phase, setPhase] = useState<"countdown" | "play">("countdown");
  const [count, setCount] = useState(3);
  const keyRef = useRef<number[]>(makeKey());
  const [target, setTarget] = useState<number>(randIcon);
  const [correct, setCorrect] = useState(0);
  const [flash, setFlash] = useState<"none" | "good" | "bad">("none");
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const correctSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSound.current = new Audio("/sounds/correct.mp3");
    wrongSound.current = new Audio("/sounds/wrong.mp3");
  }, []);

  // Countdown 3 -> 2 -> 1 -> GO, then start the clock.
  useEffect(() => {
    if (phase !== "countdown") return;
    if (count <= 0) {
      startRef.current = performance.now();
      setPhase("play");
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [phase, count]);

  // Live timer.
  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(
      () => setElapsed(performance.now() - startRef.current),
      55,
    );
    return () => clearInterval(id);
  }, [phase]);

  const nextTarget = useCallback((prev: number) => {
    const n = randIcon();
    return n === prev ? (n + 1) % ICONS.length : n;
  }, []);

  const play = (ref: React.RefObject<HTMLAudioElement | null>) => {
    const a = ref.current;
    if (!a) return;
    a.currentTime = 0;
    void a.play().catch(() => {});
  };

  const onTap = (digit: number) => {
    if (phase !== "play") return;
    const isCorrect = keyRef.current[digit] === target;

    if (isCorrect) {
      const nc = correct + 1;
      setCorrect(nc);
      setFlash("good");
      play(correctSound);
      if (nc >= GOAL) {
        onComplete(performance.now() - startRef.current);
        return;
      }
      setTarget((t) => nextTarget(t));
    } else {
      setFlash("bad");
      play(wrongSound);
      setTarget((t) => nextTarget(t));
    }
    setTimeout(() => setFlash("none"), 170);
  };

  if (phase === "countdown") {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">
          Reaction Time Challenge
        </p>
        <p className="mt-3 text-base text-secondary">
          Match {GOAL} symbols as fast as you can. Ready…
        </p>
        <div
          key={count}
          className="mt-8 font-display text-8xl font-extrabold text-primary animate-fade-up"
        >
          {count === 0 ? "GO!" : count}
        </div>
      </div>
    );
  }

  const seconds = (elapsed / 1000).toFixed(1);
  const flashRing =
    flash === "good"
      ? "ring-4 ring-[#97c459]"
      : flash === "bad"
        ? "ring-4 ring-error"
        : "ring-1 ring-outline-variant";

  return (
    <div className="flex min-h-[88vh] flex-col">
      {/* Live timer + progress */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-outline">
            Time
          </p>
          <p className="font-display text-4xl font-extrabold tabular-nums text-charcoal">
            {seconds}s
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-outline">
            Correct
          </p>
          <p className="font-display text-4xl font-extrabold tabular-nums text-primary">
            {correct}
            <span className="text-xl text-outline">/{GOAL}</span>
          </p>
        </div>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-high">
        <div
          className="h-full rounded-full bg-primary transition-all duration-200"
          style={{ width: `${(correct / GOAL) * 100}%` }}
        />
      </div>

      {/* Target symbol */}
      <div className="flex flex-1 items-center justify-center py-4">
        <div
          className={[
            "flex h-40 w-40 items-center justify-center rounded-3xl bg-surface-lowest shadow-card transition",
            flashRing,
          ].join(" ")}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`${target}-${correct}`}
            src={`/images/task-2/${ICONS[target]}`}
            alt="Match this symbol"
            className="h-24 w-24 animate-fade-up object-contain"
          />
        </div>
      </div>

      {/* Reference key: digit -> symbol */}
      <div className="grid grid-cols-5 gap-1.5 rounded-2xl bg-surface-container/70 p-3">
        {DIGITS.map((d) => (
          <div key={d} className="flex flex-col items-center">
            <span className="text-sm font-bold text-charcoal">{d}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/images/task-2/${ICONS[keyRef.current[d]]}`}
              alt=""
              className="h-7 w-7 object-contain"
            />
          </div>
        ))}
      </div>

      {/* Number pad */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {DIGITS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onTap(d)}
            className="flex h-14 items-center justify-center rounded-xl bg-gradient-to-b from-primary to-[#ec5e3b] text-2xl font-extrabold text-primary-on shadow-card transition active:scale-95"
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
