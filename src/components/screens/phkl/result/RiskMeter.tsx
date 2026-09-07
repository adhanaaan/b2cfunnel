"use client";

import type { BandName } from "@/types/engine";
import { COPY } from "@/config/copy";
import { BANDS, BAND_ORDER } from "@/engine/bands";
import { reportCard } from "../ui";

/** "Moderate risk" -> "Moderate": the band on its own, for the meter's labels. */
export function shortBandLabel(band: BandName): string {
  return COPY.bandLabels[band].replace(/\s+risk$/i, "");
}

/**
 * The four risk bands side by side, in the gauge's own colours, with the
 * player's band at full strength and marked; the rest recede (Figma "Risk
 * Meter", 697:25075). Every segment is labelled, so the band is never colour
 * alone, and the whole figure states the result in words.
 */
export function RiskMeter({ band }: { band: BandName }) {
  const c = COPY.screens.phkl.report.risk;
  const label = shortBandLabel(band);

  return (
    <figure
      role="img"
      aria-label={`${c.riskLevelLabel} ${label}`}
      className={`${reportCard} px-6 py-6`}
    >
      <p className="text-[15px] font-bold text-[#41586b]">
        {c.riskLevelLabel}{" "}
        <span className="text-[17px] font-extrabold text-[#1c110a]">{label}</span>
      </p>
      <div className="mt-4 flex gap-1.5" aria-hidden>
        {BAND_ORDER.map((name) => {
          const active = name === band;
          return (
            <div key={name} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className="h-[7px] w-full rounded-full"
                style={{
                  backgroundColor: BANDS[name].colour,
                  opacity: active ? 1 : 0.45,
                }}
              />
              <span
                className={[
                  "text-[10px] font-extrabold uppercase tracking-[0.1em]",
                  active ? "text-[#5f4638]" : "text-[#c9b4a6]",
                ].join(" ")}
              >
                {shortBandLabel(name)}
              </span>
              <svg
                viewBox="0 0 10 6"
                className={`h-1.5 w-2.5 text-[#5f4638] ${active ? "" : "invisible"}`}
              >
                <path d="M5 0 10 6H0z" fill="currentColor" />
              </svg>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
