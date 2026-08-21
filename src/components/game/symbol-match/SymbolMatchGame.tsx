"use client";

import { useEffect, useRef, useState } from "react";
import { Task2Game } from "./Task2Game";
import { SymbolMatchTour } from "./demo/SymbolMatchTour";
import { formatTime } from "@/lib/format";

const GOAL = 20;
const TILES = 10;

interface Props {
  /** Called when the player reaches GOAL correct. timeMs = time taken. */
  onComplete: (timeMs: number) => void;
  /** "night" = event2 ember-night look. Default keeps the original /event look. */
  theme?: "default" | "night";
  /** Hide the mid-tour Back button (event2, per the v2 design notes). */
  hideBack?: boolean;
  /** Skip the guided tour entirely (event2 "Skip, I've got it" path). */
  skipDemo?: boolean;
}

/**
 * Wraps the real Task2Game with the event mechanic: 3-2-1 countdown, then race
 * to GOAL correct as fast as possible. Reports the elapsed time.
 * NOTE: a game - its result never feeds the brain-health score.
 */
export function SymbolMatchGame({
  onComplete,
  theme = "default",
  hideBack = false,
  skipDemo = false,
}: Props) {
  const night = theme === "night";
  const [phase, setPhase] = useState<"demo" | "countdown" | "play">(() => {
    if (skipDemo) return "countdown";
    // Skip the guided tour on replays within the same session.
    if (typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem("sm_demo_done")) return "countdown";
      } catch {
        /* ignore */
      }
    }
    return "demo";
  });
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
    // A light tick in the hand sells the countdown at a loud booth.
    if (night && typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(count === 1 ? 60 : 30);
      } catch {
        /* ignore */
      }
    }
    const t = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [phase, count, night]);

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

  // The real recognaizelite guided tour, then the timed run.
  if (phase === "demo") {
    return (
      <SymbolMatchTour
        theme={theme}
        hideBack={hideBack}
        onDone={() => {
          try {
            sessionStorage.setItem("sm_demo_done", "1");
          } catch {
            /* ignore */
          }
          setPhase("countdown");
        }}
      />
    );
  }

  if (phase === "countdown") {
    return (
      <div
        className={["fixed inset-0 z-50 cc text-center", night ? "ember-night" : ""].join(" ")}
        style={{
          background: night ? undefined : "radial-gradient(#E4E3FF78, #D68DE878)",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div>
          <p
            className={[
              "text-sm font-bold uppercase tracking-widest",
              night ? "text-ember-core" : "text-[#8735AC]",
            ].join(" ")}
          >
            {night ? "Get ready" : "Reaction Time Challenge"}
          </p>
          <p
            className={[
              "mx-auto mt-3 max-w-xs text-base",
              night ? "text-cream-dim" : "text-charcoal",
            ].join(" ")}
          >
            Match {GOAL} symbols as fast as you can. Ready…
          </p>
          <div
            key={count}
            className={[
              "mt-6 font-display font-extrabold tabular-nums animate-fade-up",
              night
                ? count === 0
                  ? "font-serif text-8xl italic text-gold [text-shadow:0_0_60px_rgba(247,193,92,0.5)]"
                  : "text-9xl text-ember-bright [text-shadow:0_0_60px_rgba(247,117,40,0.45)]"
                : "text-8xl text-[#8735AC]",
            ].join(" ")}
          >
            {count === 0 ? "GO!" : count}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={["fixed inset-0 z-50 overflow-hidden", night ? "ember-night" : ""].join(" ")}
      style={night ? undefined : { background: "radial-gradient(#E4E3FF78, #D68DE878)" }}
    >
      <Task2Game
        tiles={TILES}
        background={night ? "transparent" : undefined}
        onSuccess={onSuccess}
        onError={() => {}}
      >
        {/* Live timer + progress, rendered at the top of the game. */}
        <div className="z-40 w-full max-w-md">
          <div className="flex items-end justify-between">
            <div>
              <p
                className={[
                  "text-[10px] font-bold uppercase tracking-widest",
                  night ? "text-cream-dim" : "text-[#5b2c6f]",
                ].join(" ")}
              >
                Time
              </p>
              <p
                className={[
                  "font-display text-3xl font-extrabold tabular-nums",
                  night ? "text-cream" : "text-[#3a0c52]",
                ].join(" ")}
              >
                {formatTime(elapsed)}
              </p>
            </div>
            <p
              className={[
                "font-display text-3xl font-extrabold tabular-nums",
                night ? "text-ember-bright" : "text-[#8735AC]",
              ].join(" ")}
            >
              {correct}
              <span className={night ? "text-lg text-cream-dim" : "text-lg text-[#5b2c6f]"}>
                /{GOAL}
              </span>
            </p>
          </div>
          <div
            className={[
              "mt-1 h-2 w-full overflow-hidden rounded-full",
              night ? "bg-night-raised" : "bg-white/50",
            ].join(" ")}
          >
            <div
              className={[
                "h-full origin-left rounded-full transition-transform duration-200",
                night
                  ? "bg-gradient-to-r from-ember-core to-ember-hot"
                  : "bg-[#8735AC]",
              ].join(" ")}
              style={{ transform: `scaleX(${correct / GOAL})` }}
            />
          </div>
        </div>
      </Task2Game>

      <p
        className={[
          "pointer-events-none absolute inset-x-0 px-4 text-center text-[11px] italic",
          night ? "text-cream-faint" : "text-[#5b2c6f]/70",
        ].join(" ")}
        style={{ bottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        Reaction-time games are fun, but not a cognitive assessment.
      </p>
    </div>
  );
}
