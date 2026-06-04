import type { Answers } from "@/types/question";
import type { DrivingFactor } from "@/types/engine";
import { QUESTIONS } from "@/config/questions";
import { FACTOR_LABELS } from "@/config/copy";

/**
 * The "what's driving this" pills. Lifestyle + biomedical factors ONLY — never
 * symptoms (those stay blurred behind the paywall). A factor is "driving" the
 * score when the user's chosen option on a risk-axis question contributed > 0.
 */
export function getDrivingFactors(answers: Answers): DrivingFactor[] {
  const factors: DrivingFactor[] = [];

  for (const q of QUESTIONS) {
    if (q.axis !== "risk" || !q.options) continue;
    const answer = answers[q.id];
    if (typeof answer !== "string") continue;
    const option = q.options.find((o) => o.id === answer);
    if (!option || option.score <= 0) continue;

    factors.push({
      id: q.id,
      label: FACTOR_LABELS[q.id] ?? q.id,
      axis: "risk",
    });
  }

  return factors;
}
