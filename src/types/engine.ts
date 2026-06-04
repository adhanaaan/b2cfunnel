/** Scoring engine output types. */

export type Persona =
  | "caregiver"
  | "perimenopausal"
  | "highPerformer"
  | "neutral";

export type BandName = "low" | "moderate" | "elevated" | "high";

export interface Band {
  name: BandName;
  totalMin: number; // inclusive lower bound on TOTAL score
  totalMax: number; // inclusive upper bound (Infinity for the top band)
  colour: string; // gauge colour
  order: number; // 0..3 — used for "worse of two axes" comparison
}

export interface DrivingFactor {
  id: string; // 'highBp'
  label: string; // 'Blood pressure' — resolved from copy.factorLabels
  axis: "risk"; // driving factors are lifestyle/biomedical ONLY (never symptoms)
}

export interface ScoreResult {
  riskScore: number; // 0..17
  symptomScore: number; // 0..8
  total: number; // 0..25
  band: BandName; // FINAL band (worse-of-axes + safety override)
  bandFromTotal: BandName; // band implied by total alone (transparency/debug)
  riskBand: BandName; // band implied by the risk axis
  symptomBand: BandName; // band implied by the symptom axis
  drivingFactors: DrivingFactor[]; // lifestyle/biomedical risks the user reported
  persona: Persona;
  safetyOverrideApplied: boolean;
}
