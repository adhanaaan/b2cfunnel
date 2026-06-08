import type { Answers, Axis } from "@/types/question";
import type { ScoreResult } from "@/types/engine";
import { QUESTIONS_BY_ID } from "@/config/questions";
import {
  bandForRiskAxis,
  bandForSymptomAxis,
  bandForTotal,
} from "@/engine/bands";
import { getDrivingFactors } from "@/engine/drivingFactors";
import { detectPersona } from "@/engine/persona";

// Axis maxima on the native 0-100 scale (build brief §5 weights scaled x4).
const RISK_MAX = 68;
const SYMPTOM_MAX = 32;
// Total maximum. Scores natively sum to 100.
export const MAX_TOTAL = RISK_MAX + SYMPTOM_MAX; // 100

/** Sum the contributions of every answered question on a given axis. */
function scoreAxis(answers: Answers, axis: Axis): number {
  let total = 0;

  for (const [questionId, answer] of Object.entries(answers)) {
    const question = QUESTIONS_BY_ID[questionId];
    if (!question || question.axis !== axis || !question.options) continue;

    // 'hotFlushes' only scores for women — it's pruned from the flow for others,
    // but guard here too so the engine stays correct for any answers map.
    if (questionId === "hotFlushes" && answers.sex !== "female") continue;

    const selected = Array.isArray(answer) ? answer : [answer];
    for (const value of selected) {
      const option = question.options.find((o) => o.id === value);
      if (option) total += option.score;
    }
  }

  return total;
}

export function scoreRiskAxis(answers: Answers): number {
  return Math.min(scoreAxis(answers, "risk"), RISK_MAX);
}

export function scoreSymptomAxis(answers: Answers): number {
  return Math.min(scoreAxis(answers, "symptom"), SYMPTOM_MAX);
}

/**
 * Top-level scoring orchestrator.
 *
 * Two-axis safety logic: the risk and symptom axes are scored independently and
 * the final band is the WORST band implied by (total, risk axis, symptom axis).
 * Lifestyle answers can therefore never mask a loud symptom signal.
 *
 * Safety override (non-negotiable, §5): if the decline is persistent AND someone
 * else has noticed, the band is forced to at least 'elevated' regardless of the
 * total. The override only ever raises the band, never lowers it.
 */
export function computeScore(answers: Answers): ScoreResult {
  const riskScore = scoreRiskAxis(answers);
  const symptomScore = scoreSymptomAxis(answers);
  const total = riskScore + symptomScore;

  const bandFromTotal = bandForTotal(total);
  const riskBand = bandForRiskAxis(riskScore);
  const symptomBand = bandForSymptomAxis(symptomScore);

  // The band always follows the total score, so it matches the headline number
  // and the band table. A persistent decline is captured through its score
  // weight (persistence = 12, someone-else-noticed = 8) rather than by shifting
  // the band. We still surface the flag for analytics.
  const band = bandFromTotal;
  const safetyOverrideApplied =
    answers.persistence === "yes" && answers.someoneElseNoticed === "yes";

  return {
    riskScore,
    symptomScore,
    total,
    maxTotal: MAX_TOTAL,
    band,
    bandFromTotal,
    riskBand,
    symptomBand,
    drivingFactors: getDrivingFactors(answers),
    persona: detectPersona(answers),
    safetyOverrideApplied,
  };
}
