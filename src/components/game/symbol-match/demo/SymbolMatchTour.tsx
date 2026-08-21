"use client";

import { useEffect, useRef, useState } from "react";
import { Task2Game } from "../Task2Game";
import { resetSkipShuffle } from "../utils";
import { Demo } from "./Demo";
import { DemoProvider } from "./DemoContext";
import { HandIcon } from "./icons";
import { demoNextStep, type DemoStep } from "./types";

const COLORS = {
  color: "#630092",
  secondaryColor: "#A969C7",
  previousBtn1: "#FDFDFD",
  previousBtn2: "#E0D0E7",
  arrow2: "#E0D0E7",
};

// Ember-night accents for the event2 arena arc.
const NIGHT_COLORS = {
  color: "#7a2e0c",
  secondaryColor: "#ff9a4d",
  previousBtn1: "#FDFDFD",
  previousBtn2: "#f7d2c1",
  arrow2: "#ffc29e",
};

function steps(hideBack: boolean): DemoStep[] {
  return [
    {
      elements: [
        {
          id: "sb-main-icon",
          className: "scale-105",
          instruction: "Focus on the symbol at the top of the screen.",
        },
      ],
      delay: 400,
    },
    {
      elements: [
        {
          id: "sb-reference-icon-7",
          className: "scale-125",
          side: "top",
          instruction:
            "Look for the matching symbol and its number. Here, it is 7.",
        },
      ],
    },
    {
      elements: [
        {
          id: "sb-number-pad-7",
          side: "top",
          className: "scale-125 rounded-full",
          instructionClassName: "mb-8",
          instruction: 'Tap "7" in the number pad below.',
          showPreviousBtn: !hideBack,
          showNextBtn: false,
          arrow: false,
        },
        {
          id: "sb-number-pad-7",
          className: "bg-transparent z-10",
          children: (
            <div className="translate-x-1/2 translate-y-2/3 animate-pulse">
              <HandIcon fill="#b7430a" background="white" className="size-14" />
            </div>
          ),
          onClick: () => {
            document.getElementById("sb-number-pad-7")?.click();
            demoNextStep();
          },
        },
      ],
      interactive: true,
    },
    {
      elements: [
        {
          id: "sb-reference-icons",
          side: "top",
          instruction:
            "Be careful, the order of the symbols can change after every turn.",
          showPreviousBtn: false,
        },
      ],
      delay: 1000,
    },
    {
      elements: [
        {
          id: "demo-center",
          instructionClassName: "-translate-y-1/2",
          instruction: "Now try the next few rounds yourself!",
          arrow: false,
          texts: { next: "Start practice" },
        },
      ],
    },
    { elements: [] },
  ];
}

/** The real recognaizelite guided tour, faithfully ported. */
export function SymbolMatchTour({
  onDone,
  hideBack = false,
  theme = "default",
}: {
  onDone: () => void;
  /** Hide the mid-tour Back button (event2, per the v2 design notes). */
  hideBack?: boolean;
  /** "night" swaps the lavender backdrop for the ember-night look. */
  theme?: "default" | "night";
}) {
  const [runKey, setRunKey] = useState(0);
  const score = useRef(-1);

  // Identity key so the highlighted "7" is the correct answer during the tour.
  resetSkipShuffle();

  useEffect(() => {
    const onReset = () => {
      score.current = -1;
      resetSkipShuffle();
      setRunKey((k) => k + 1);
    };
    window.addEventListener("demo.reset", onReset);
    return () => window.removeEventListener("demo.reset", onReset);
  }, []);

  const night = theme === "night";
  return (
    <div
      key={runKey}
      className={["fixed inset-0 z-50 overflow-hidden", night ? "ember-night" : ""].join(" ")}
      style={night ? undefined : { background: "radial-gradient(#E4E3FF78, #D68DE878)" }}
    >
      <div id="demo-center" className="absolute left-1/2 top-1/2 -z-10 size-0" />
      <DemoProvider
        value={{
          title: "Symbol Matching",
          steps: steps(hideBack),
          texts: {},
          colors: night ? NIGHT_COLORS : COLORS,
          onComplete: onDone,
        }}
      >
        <Demo />
        <Task2Game
          tiles={10}
          background={night ? "transparent" : undefined}
          onError={() => {}}
          onSuccess={() => {
            score.current++;
            if (score.current % 3 === 0) demoNextStep();
          }}
        >
          <div className="z-40 flex w-full max-w-md items-center justify-between">
            <span
              className={[
                "font-display text-2xl font-extrabold",
                night ? "text-cream" : "text-[#630092]",
              ].join(" ")}
            >
              Practice
            </span>
            <span
              className={[
                "rounded-full border-2 px-4 py-1 text-sm font-bold",
                night
                  ? "border-cream-dim text-cream-dim"
                  : "border-[#3A3A3A] text-[#3A3A3A]",
              ].join(" ")}
            >
              Demo
            </span>
          </div>
        </Task2Game>
      </DemoProvider>
    </div>
  );
}
