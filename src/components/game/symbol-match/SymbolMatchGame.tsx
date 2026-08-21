"use client";

import { useEffect, useRef, useState } from "react";
import { Task2Game } from "./Task2Game";
import { SymbolMatchTour } from "./demo/SymbolMatchTour";
import { formatTime } from "@/lib/format";
import {
  finish as finishSound,
  isMuted,
  setMuted,
  setIntensity,
  startMusic,
  stopMusic,
  tick,
} from "@/lib/gameAudio";

const GOAL = 20;
const TILES = 10;

interface Props {
  /** Called when the player reaches GOAL correct. timeMs = time taken. */
  onComplete: (timeMs: number) => void;
  /**
   * "warm" = the event2 look: the brand light-orange backdrop the ported board
   * was designed for. "default" keeps the original lavender.
   */
  theme?: "default" | "warm";
  /** Hide the mid-tour Back button (event2, per the v2 design notes). */
  hideBack?: boolean;
  /** Skip the guided tour entirely (event2 "Skip, I've got it" path). */
  skipDemo?: boolean;
  /** Play the music bed and the finish sting (event2 only). */
  music?: boolean;
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
      {muted ? (
        <path d="m16 9.5 5 5m0-5-5 5" />
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 6a8 8 0 0 1 0 12" />
        </>
      )}
    </svg>
  );
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
  music = false,
}: Props) {
  const warm = theme === "warm";
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
  const [soundOff, setSoundOff] = useState(false);
  const startRef = useRef(0);

  // Reflect the stored preference once mounted (server render has no window).
  useEffect(() => setSoundOff(isMuted()), []);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (count <= 0) {
      startRef.current = performance.now();
      setPhase("play");
      return;
    }
    if (warm) {
      // A tick in the hand and in the ear: booths are loud and bright.
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(count === 1 ? 60 : 30);
        } catch {
          /* ignore */
        }
      }
      if (music) tick(count === 1);
    }
    const t = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [phase, count, warm, music]);

  // The bed runs from the countdown to the last correct answer.
  useEffect(() => {
    if (!music || phase === "demo") return;
    startMusic();
    return () => stopMusic();
  }, [music, phase]);

  useEffect(() => {
    if (music) setIntensity(correct / GOAL);
  }, [music, correct]);

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
      if (nc >= GOAL) {
        if (music) finishSound();
        onComplete(performance.now() - startRef.current);
      }
      return nc;
    });
  };

  const toggleSound = () => {
    const next = !soundOff;
    setSoundOff(next);
    setMuted(next);
    if (!next && music && phase === "play") startMusic();
  };

  const muteButton = music ? (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={soundOff}
      aria-label={soundOff ? "Turn sound on" : "Turn sound off"}
      className={[
        // Above the HUD: that row is a flex item carrying z-40, so it would
        // otherwise tie with this button and swallow the tap on DOM order.
        "absolute right-4 z-[60] flex h-11 w-11 items-center justify-center rounded-full border transition",
        warm
          ? "border-outline-variant bg-surface-lowest/80 text-secondary hover:text-primary"
          : "border-white/50 bg-white/60 text-[#5b2c6f]",
      ].join(" ")}
      style={{ top: "max(0.75rem, env(safe-area-inset-top))" }}
    >
      <SpeakerIcon muted={soundOff} />
    </button>
  ) : null;

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
        className={[
          "fixed inset-0 z-50 cc text-center",
          warm ? "game-warm" : "",
        ].join(" ")}
        style={{
          background: warm ? undefined : "radial-gradient(#E4E3FF78, #D68DE878)",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {warm && (
          <div
            aria-hidden
            className="animate-wash-out pointer-events-none absolute inset-0 z-30 bg-[#fff4ee]"
          />
        )}
        {muteButton}
        <div>
          <p
            className={[
              "text-sm font-bold uppercase tracking-widest",
              warm ? "text-primary" : "text-[#8735AC]",
            ].join(" ")}
          >
            {warm ? "Get ready" : "Reaction Time Challenge"}
          </p>
          <p
            className={[
              "mx-auto mt-3 max-w-xs text-base",
              warm ? "text-secondary" : "text-charcoal",
            ].join(" ")}
          >
            Match {GOAL} symbols as fast as you can. Ready…
          </p>
          <div
            key={count}
            className={[
              "mt-6 font-display font-extrabold tabular-nums animate-fade-up",
              // The deep orange holds its own at this size; brand primary goes
              // washed out against the cream backdrop.
              warm
                ? count === 0
                  ? "font-serif text-8xl italic text-[#b7430a]"
                  : "text-9xl text-[#b7430a] [text-shadow:0_0_50px_rgba(247,117,40,0.35)]"
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
      className={[
        "fixed inset-0 z-50 overflow-hidden",
        warm ? "game-warm" : "",
      ].join(" ")}
      style={warm ? undefined : { background: "radial-gradient(#E4E3FF78, #D68DE878)" }}
    >
      {muteButton}
      <Task2Game
        tiles={TILES}
        background={warm ? "transparent" : undefined}
        onSuccess={onSuccess}
        onError={() => {}}
      >
        {/* Live timer + progress, rendered at the top of the game. */}
        <div className={["z-40 w-full max-w-md", music ? "pr-14" : ""].join(" ")}>
          <div className="flex items-end justify-between">
            <div>
              <p
                className={[
                  "text-[10px] font-bold uppercase tracking-widest",
                  warm ? "text-outline" : "text-[#5b2c6f]",
                ].join(" ")}
              >
                Time
              </p>
              <p
                className={[
                  "font-display text-3xl font-extrabold tabular-nums",
                  warm ? "text-charcoal" : "text-[#3a0c52]",
                ].join(" ")}
              >
                {formatTime(elapsed)}
              </p>
            </div>
            <p
              className={[
                "font-display text-3xl font-extrabold tabular-nums",
                warm ? "text-primary" : "text-[#8735AC]",
              ].join(" ")}
            >
              {correct}
              <span
                className={
                  warm ? "text-lg text-outline" : "text-lg text-[#5b2c6f]"
                }
              >
                /{GOAL}
              </span>
            </p>
          </div>
          <div
            className={[
              "mt-1 h-2 w-full overflow-hidden rounded-full",
              warm ? "bg-surface-high" : "bg-white/50",
            ].join(" ")}
          >
            <div
              className={[
                "h-full origin-left rounded-full transition-transform duration-200",
                warm
                  ? "bg-gradient-to-r from-primary to-[#ffc29e]"
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
          warm ? "text-outline" : "text-[#5b2c6f]/70",
        ].join(" ")}
        style={{ bottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        Reaction-time games are fun, but not a cognitive assessment.
      </p>
    </div>
  );
}
