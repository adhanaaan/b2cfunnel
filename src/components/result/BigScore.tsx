"use client";

import { COPY } from "@/config/copy";
import { useIsEvent } from "@/components/VariantContext";

interface BigScoreProps {
  score: number;
}

/** The headline number: big score, smaller secondary-colour suffix. */
export function BigScore({ score }: BigScoreProps) {
  const event = useIsEvent();
  return (
    <p className="text-center font-display leading-none">
      <span
        className={[
          "text-7xl font-extrabold",
          event
            ? "bg-gradient-to-br from-primary to-[#ec5e3b] bg-clip-text text-transparent"
            : "text-charcoal",
        ].join(" ")}
      >
        {score}
      </span>
      <span className="text-3xl font-semibold text-outline">
        {COPY.screens.resultBase.scoreSuffix}
      </span>
    </p>
  );
}
