"use client";

import type { Question, AnswerValue } from "@/types/question";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OptionButton } from "@/components/ui/OptionButton";

interface QuestionScreenProps {
  question: Question;
  value: AnswerValue | undefined;
  current: number;
  total: number;
  canGoBack: boolean;
  onAnswer: (value: AnswerValue) => void;
  onNext: () => void;
  onBack: () => void;
}

export function QuestionScreen({
  question,
  value,
  current,
  total,
  canGoBack,
  onAnswer,
  onNext,
  onBack,
}: QuestionScreenProps) {
  const isMulti = question.multiSelect === true;
  const selected: string[] = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? [value]
      : [];

  const handleSingle = (id: string) => {
    onAnswer(id);
    // Auto-advance after a brief beat so the selection is visible.
    setTimeout(onNext, 220);
  };

  const handleMulti = (id: string) => {
    // "Nothing in particular" is exclusive of the others.
    if (id === "nothing") {
      onAnswer(["nothing"]);
      return;
    }
    const base = selected.filter((s) => s !== "nothing");
    const nextSel = base.includes(id)
      ? base.filter((s) => s !== id)
      : [...base, id];
    onAnswer(nextSel);
  };

  return (
    <ScreenShell>
      <div className="mb-8">
        <ProgressBar current={current} total={total} />
      </div>

      <div key={question.id}>
        <h1 className="font-display text-2xl font-bold leading-snug text-charcoal sm:text-3xl">
          {question.prompt}
        </h1>
        {question.helpText && (
          <p className="mt-2 text-sm text-secondary">{question.helpText}</p>
        )}

        <div className="mt-6 space-y-3">
          {question.options?.map((opt) => (
            <OptionButton
              key={opt.id}
              label={opt.label}
              multi={isMulti}
              selected={selected.includes(opt.id)}
              onClick={() =>
                isMulti ? handleMulti(opt.id) : handleSingle(opt.id)
              }
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-secondary transition hover:bg-surface-container disabled:invisible"
          >
            ← Back
          </button>

          {isMulti && (
            <button
              type="button"
              onClick={onNext}
              disabled={selected.length === 0}
              className="rounded-lg bg-primary px-6 py-3 text-base font-bold text-primary-on shadow-card transition hover:brightness-105 disabled:opacity-40"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </ScreenShell>
  );
}
