import { useRef, useState } from "react";

export type ResultType = "" | "success" | "error";

/**
 * Local result state for the symbol-match round (ported from recognaizelite,
 * with the app's audio-manager replaced by simple Audio playback).
 */
export function useResult(cb: (x: ResultType) => void = () => {}) {
  const [result, setResult] = useState<ResultType>("");
  const correct = useRef<HTMLAudioElement | null>(null);
  const wrong = useRef<HTMLAudioElement | null>(null);

  const play = (x: ResultType) => {
    if (typeof window === "undefined") return;
    if (!correct.current) correct.current = new Audio("/sounds/correct.mp3");
    if (!wrong.current) wrong.current = new Audio("/sounds/wrong.mp3");
    const a = x === "success" ? correct.current : wrong.current;
    if (a) {
      a.currentTime = 0;
      void a.play().catch(() => {});
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
