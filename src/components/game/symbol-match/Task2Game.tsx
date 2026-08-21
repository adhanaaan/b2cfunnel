"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { NumberPad } from "./NumberPad";
import { ReferenceIcons } from "./ReferenceIcons";
import { ResultOverlay } from "./ResultOverlay";
import { useResult } from "./useResult";
import { IconList, genRandomIconList } from "./utils";

/**
 * Symbol-matching round, ported faithfully from recognaizelite (default look).
 * Calls onSuccess/onError after each answer; the wrapper owns scoring/timing.
 */
export const Task2Game: React.FC<{
  tiles: number;
  onSuccess: () => void;
  onError: () => void;
  children?: React.ReactNode;
  /** Backdrop override (event2 night theme). Defaults to the original look. */
  background?: string;
}> = ({
  tiles,
  onSuccess,
  onError,
  children,
  background = "radial-gradient(#E4E3FF78, #D68DE878)",
}) => {
  const [refreshKey, updateRefreshKey] = useState(1);
  const [activeEle, setActiveEle] = useState(7);
  const { result, setResult, resetResult } = useResult();

  const randomList = useMemo(
    () => genRandomIconList(tiles),
    [tiles, refreshKey],
  );

  useEffect(() => {
    if (!result) return;
    const timeout = setTimeout(() => {
      resetResult();
      if (result === "success") onSuccess();
      else onError();

      const nextEle = Math.round(Math.random() * (tiles - 1));
      setActiveEle(nextEle === activeEle ? (nextEle + tiles - 1) % tiles : nextEle);
      updateRefreshKey(refreshKey * -1);
    }, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <div
      className="items-center h-full fc px-6 justify-between gap-1"
      style={{
        background,
        paddingTop: "max(0.75rem, env(safe-area-inset-top))",
        paddingBottom: "max(2.25rem, calc(env(safe-area-inset-bottom) + 1.5rem))",
      }}
    >
      <ResultOverlay result={result} />

      {children}

      <div
        id="sb-main-icon"
        className={[
          "relative shrink min-h-0 aspect-square w-20 md:scale-125 lg:scale-150",
          result === "success"
            ? "text-emerald-500"
            : result === "error"
              ? "text-red-500"
              : "",
        ].join(" ")}
        style={{ background: "radial-gradient(circle 60px, white, transparent)" }}
      >
        <AnimatePresence>
          <motion.img
            key={activeEle * 100 + refreshKey}
            initial={{ left: 250, height: "25%", width: "25%" }}
            animate={{ left: 0, height: "auto", width: "auto" }}
            exit={{ left: -200, height: "25%", width: "25%" }}
            className="absolute inset-y-0 my-auto animate-shake"
            src={`/images/task-2/${IconList[activeEle]}`}
            alt="Match this symbol"
          />
        </AnimatePresence>
      </div>

      <ReferenceIcons randomList={randomList} />

      <NumberPad
        randomList={randomList}
        activeElement={activeEle}
        setResult={setResult}
      />
    </div>
  );
};
