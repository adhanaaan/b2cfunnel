"use client";

import type { Answers, AnswerValue, Option, Question } from "@/types/question";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface QuestionGroupScreenProps {
  title: string;
  questions: Question[];
  answers: Answers;
  current: number;
  total: number;
  canGoBack: boolean;
  onAnswer: (questionId: string, value: AnswerValue) => void;
  onNext: () => void;
  onBack: () => void;
}

/** Choose how many columns of options to show, based on the longest label. */
function colsClass(options: Option[]): string {
  const maxLen = Math.max(...options.map((o) => o.label.length));
  if (maxLen <= 12) return "grid-cols-3"; // e.g. Yes / No / Not sure
  if (maxLen <= 22) return "grid-cols-2"; // e.g. sleep / exercise bands
  return "grid-cols-1"; // long labels (smoking, diet)
}

/** A page that stacks several yes/no/not-sure questions (e.g. health history). */
export function QuestionGroupScreen({
  title,
  questions,
  answers,
  current,
  total,
  canGoBack,
  onAnswer,
  onNext,
  onBack,
}: QuestionGroupScreenProps) {
  const allAnswered = questions.every(
    (q) => typeof answers[q.id] === "string",
  );

  return (
    <ScreenShell>
      <div className="mb-8">
        <ProgressBar current={current} total={total} />
      </div>

      <div className="animate-fade-up">
        <h1 className="font-display text-2xl font-bold leading-snug text-charcoal sm:text-3xl">
          {title}
        </h1>

        <div className="mt-6 divide-y divide-outline-variant">
          {questions.map((q) => {
            const selected = answers[q.id];
            return (
              <div key={q.id} className="py-5 first:pt-0">
                <p className="font-semibold text-charcoal">{q.prompt}</p>
                {q.helpText && (
                  <p className="mt-0.5 text-sm text-outline">{q.helpText}</p>
                )}
                <div
                  className={`mt-3 grid gap-2 ${colsClass(q.options ?? [])}`}
                >
                  {q.options?.map((opt) => {
                    const isSel = selected === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onAnswer(q.id, opt.id)}
                        aria-pressed={isSel}
                        className={[
                          "rounded-lg border-2 px-3 py-3 text-center text-sm font-medium transition",
                          isSel
                            ? "border-primary bg-primary text-primary-on"
                            : "border-outline-variant bg-surface-lowest text-charcoal hover:border-primary",
                        ].join(" ")}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
          <button
            type="button"
            onClick={onNext}
            disabled={!allAnswered}
            className="rounded-lg bg-primary px-6 py-3 text-base font-bold text-primary-on shadow-card transition hover:brightness-105 disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
