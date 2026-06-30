import type { Answers } from "@/types/question";
import type { DrivingFactor } from "@/types/engine";
import { QUESTIONS } from "@/config/questions";
import { FACTOR_LABELS } from "@/config/copy";

/**
 * The "what's driving this" pills. Lifestyle + biomedical factors ONLY - never
 * symptoms (those stay blurred behind the paywall). A factor is "driving" the
 * score when the user's chosen option on a risk-axis question contributed > 0.
 * Ordered by impact (highest-scoring contributor first) so the section reads as
 * a clear, answer-driven summary.
 */
export function getDrivingFactors(answers: Answers): DrivingFactor[] {
  const scored: Array<{ factor: DrivingFactor; score: number }> = [];

  for (const q of QUESTIONS) {
    if (q.axis !== "risk" || !q.options) continue;
    const answer = answers[q.id];
    if (typeof answer !== "string") continue;
    const option = q.options.find((o) => o.id === answer);
    if (!option || option.score <= 0) continue;

    scored.push({
      factor: { id: q.id, label: FACTOR_LABELS[q.id] ?? q.id, axis: "risk" },
      score: option.score,
    });
  }

  return scored.sort((a, b) => b.score - a.score).map((s) => s.factor);
}
