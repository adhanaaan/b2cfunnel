"use client";

import { useEffect, useRef, useState } from "react";
import { Task2Game } from "./Task2Game";
import { formatTime } from "@/lib/format";

const GOAL = 20;
const TILES = 10;

interface Props {
  /** Called when the player reaches GOAL correct. timeMs = time taken. */
  onComplete: (timeMs: number) => void;
}

/**
 * Wraps the real Task2Game with the event mechanic: 3-2-1 countdown, then race
 * to GOAL correct as fast as possible. Reports the elapsed time.
 * NOTE: a game — its result never feeds the brain-health score.
 */
export function SymbolMatchGame({ onComplete }: Props) {
  const [phase, setPhase] = useState<"countdown" | "play">("countdown");
  const [count, setCount] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);

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

  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(
      () => setElapsed(performance.now() - startRef.current),
      55,
    );
    return () => clearInterval(id);
  }, [phase]);

  const onSuccess = () => {
    setCorrect((c) => {
      const nc = c + 1;
      if (nc >= GOAL) onComplete(performance.now() - startRef.current);
      return nc;
    });
  };

  if (phase === "countdown") {
    return (
      <div
        className="cc h-dvh w-full text-center"
        style={{ background: "radial-gradient(#E4E3FF78, #D68DE878)" }}
      >
        <p className="text-sm font-bold uppercase tracking-widest text-[#8735AC]">
          Reaction Time Challenge
        </p>
        <p className="mt-3 max-w-xs text-base text-charcoal">
          Match {GOAL} symbols as fast as you can. Ready…
        </p>
        <div
          key={count}
          className="mt-6 font-display text-8xl font-extrabold text-[#8735AC] animate-fade-up"
        >
          {count === 0 ? "GO!" : count}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-dvh w-full">
      <Task2Game tiles={TILES} onSuccess={onSuccess} onError={() => {}}>
        {/* Live timer + progress, rendered at the top of the game. */}
        <div className="z-40 w-full max-w-md">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5b2c6f]">
                Time
              </p>
              <p className="font-display text-3xl font-extrabold tabular-nums text-[#3a0c52]">
                {formatTime(elapsed)}
              </p>
            </div>
            <p className="font-display text-3xl font-extrabold tabular-nums text-[#8735AC]">
              {correct}
              <span className="text-lg text-[#5b2c6f]">/{GOAL}</span>
            </p>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/50">
            <div
              className="h-full rounded-full bg-[#8735AC] transition-all duration-200"
              style={{ width: `${(correct / GOAL) * 100}%` }}
            />
          </div>
        </div>
      </Task2Game>
    </div>
  );
}
