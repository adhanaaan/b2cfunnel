import type { Band, BandName } from "@/types/engine";

/**
 * Band definitions on the native 0-100 scale.
 *
 * TOTAL-score thresholds are the build brief §5 bands scaled x4 onto /100:
 *   0-24 Low, 25-52 Moderate, 53-76 Elevated, 77-100 High.
 *
 * The per-axis thresholds below are working defaults (Audrey/clinical to ratify,
 * see build brief §12). They support the "final band = the worse of the two
 * axes" rule: a loud symptom signal must be able to push the band up on its own,
 * so a great lifestyle profile can never mask symptoms.
 *
 * Keep all of these as named constants so retuning is a one-line change.
 */

export const BANDS: Record<BandName, Band> = {
  low: { name: "low", totalMin: 0, totalMax: 25, colour: "#97c459", order: 0 },
  moderate: {
    name: "moderate",
    totalMin: 26,
    totalMax: 50,
    colour: "#fac775",
    order: 1,
  },
  elevated: {
    name: "elevated",
    totalMin: 51,
    totalMax: 75,
    colour: "#ef9f27",
    order: 2,
  },
  high: {
    name: "high",
    totalMin: 76,
    totalMax: Infinity,
    colour: "#f09595",
    order: 3,
  },
};

export const BAND_ORDER: BandName[] = ["low", "moderate", "elevated", "high"];

/** Map a TOTAL score (0-100) to its band. */
export function bandForTotal(total: number): BandName {
  if (total <= 25) return "low";
  if (total <= 50) return "moderate";
  if (total <= 75) return "elevated";
  return "high";
}

/**
 * Map the Risk Factor axis (max 68) to a band. WORKING DEFAULT, confirm.
 * Proportional to the axis maximum (the §5 risk-axis bands scaled x4).
 */
export function bandForRiskAxis(risk: number): BandName {
  if (risk <= 16) return "low";
  if (risk <= 36) return "moderate";
  if (risk <= 52) return "elevated";
  return "high";
}

/**
 * Map the Symptom Signal axis (max 32) to a band. WORKING DEFAULT, confirm.
 * Tuned so persistence (12) + someone-else-noticed (8) = 20 lands in 'elevated',
 * consistent with the safety override.
 */
export function bandForSymptomAxis(symptom: number): BandName {
  if (symptom <= 0) return "low";
  if (symptom <= 12) return "moderate";
  if (symptom <= 20) return "elevated";
  return "high";
}

/** Return whichever band is worse (higher order). */
export function worseBand(...bands: BandName[]): BandName {
  return bands.reduce((worst, b) =>
    BANDS[b].order > BANDS[worst].order ? b : worst,
  );
}
