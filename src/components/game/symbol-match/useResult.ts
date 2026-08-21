import { useEffect, useRef, useState } from "react";
import { isMuted } from "@/lib/gameAudio";

export type ResultType = "" | "success" | "error";

const SRC: Record<"success" | "error", string> = {
  success: "/sounds/correct.mp3",
  error: "/sounds/wrong.mp3",
};

/** Two elements per sound so quick answers don't cut each other off. */
const POOL_SIZE = 2;

/**
 * Local result state for the symbol-match round (ported from recognaizelite,
 * with the app's audio-manager replaced by simple Audio playback). Sounds are
 * preloaded on mount, so the first correct answer isn't silent, and respect the
 * player's mute preference.
 */
export function useResult(cb: (x: ResultType) => void = () => {}) {
  const [result, setResult] = useState<ResultType>("");
  const pool = useRef<Record<"success" | "error", HTMLAudioElement[]>>({
    success: [],
    error: [],
  });
  const cursor = useRef({ success: 0, error: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      for (const key of ["success", "error"] as const) {
        if (pool.current[key].length) continue;
        pool.current[key] = Array.from({ length: POOL_SIZE }, () => {
          const el = new Audio(SRC[key]);
          el.preload = "auto";
          return el;
        });
      }
    } catch {
      /* playback is optional */
    }
  }, []);

  const play = (x: "success" | "error") => {
    if (typeof window === "undefined" || isMuted()) return;
    try {
      const elements = pool.current[x];
      if (!elements.length) {
        void new Audio(SRC[x]).play().catch(() => {});
        return;
      }
      const el = elements[cursor.current[x] % elements.length];
      cursor.current[x] += 1;
      el.currentTime = 0;
      void el.play().catch(() => {});
    } catch {
      /* ignore */
    }
  };

  return {
    result,
    setResult(x: ResultType) {
      if (result) return result;
      cb(x);
      setResult(x);
      if (x === "success" || x === "error") play(x);
    },
    resetResult() {
      setResult("");
    },
  };
}
