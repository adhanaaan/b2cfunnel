import type { Band, BandName } from "@/types/engine";

/**
 * Band definitions.
 *
 * TOTAL-score thresholds are LOCKED by the build brief (§5):
 *   0–6 Low, 7–13 Moderate, 14–19 Elevated, 20+ High.
 *
 * The per-axis thresholds below are working defaults (Audrey/clinical to ratify,
 * see build brief §12). They exist to support the "final band = the worse of the
 * two axes" rule: a loud symptom signal must be able to push the band up on its
 * own, so a great lifestyle profile can never mask symptoms.
 *
 * Keep all of these as named constants so retuning is a one-line change.
 */

export const BANDS: Record<BandName, Band> = {
  low: { name: "low", totalMin: 0, totalMax: 6, colour: "#97c459", order: 0 },
  moderate: {
    name: "moderate",
    totalMin: 7,
    totalMax: 13,
    colour: "#fac775",
    order: 1,
  },
  elevated: {
    name: "elevated",
    totalMin: 14,
    totalMax: 19,
    colour: "#ef9f27",
    order: 2,
  },
  high: {
    name: "high",
    totalMin: 20,
    totalMax: Infinity,
    colour: "#f09595",
    order: 3,
  },
};

export const BAND_ORDER: BandName[] = ["low", "moderate", "elevated", "high"];

/** Map a TOTAL score (0–25) to its band. Thresholds locked by §5. */
export function bandForTotal(total: number): BandName {
  if (total <= 6) return "low";
  if (total <= 13) return "moderate";
  if (total <= 19) return "elevated";
  return "high";
}

/**
 * Map the Risk Factor axis (max 17) to a band. WORKING DEFAULT — confirm.
 * Proportional to the axis maximum.
 */
export function bandForRiskAxis(risk: number): BandName {
  if (risk <= 4) return "low";
  if (risk <= 9) return "moderate";
  if (risk <= 13) return "elevated";
  return "high";
}

/**
 * Map the Symptom Signal axis (max 8) to a band. WORKING DEFAULT — confirm.
 * Tuned so persistence (3) + someone-else-noticed (2) = 5 lands in 'elevated',
 * consistent with the safety override.
 */
export function bandForSymptomAxis(symptom: number): BandName {
  if (symptom <= 0) return "low";
  if (symptom <= 3) return "moderate";
  if (symptom <= 5) return "elevated";
  return "high";
}

/** Return whichever band is worse (higher order). */
export function worseBand(...bands: BandName[]): BandName {
  return bands.reduce((worst, b) =>
    BANDS[b].order > BANDS[worst].order ? b : worst,
  );
}
