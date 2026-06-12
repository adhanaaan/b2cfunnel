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

/**
 * Discrete slider over an ordinal option set. Options are shown low→high
 * severity (the source array is worst-first, so we reverse it). An untouched
 * slider sits at the lowest-severity end and records nothing — which scores the
 * same as that option (0), so leaving it is equivalent to "no change noticed".
 */
function OptionSlider({
  question,
  value,
  onChange,
}: {
  question: Question;
  value?: AnswerValue;
  onChange: (id: string) => void;
}) {
  const opts = [...(question.options ?? [])].reverse(); // low → high severity
  const max = opts.length - 1;
  const found = opts.findIndex((o) => o.id === value);
  const idx = found >= 0 ? found : 0;

  return (
    <div className="mt-4">
      <p className="text-center text-base font-bold text-primary">
        {opts[idx]?.label}
      </p>
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={idx}
        onChange={(e) => onChange(opts[Number(e.target.value)].id)}
        aria-label={question.prompt}
        className="mt-3 w-full cursor-pointer accent-[#f77528]"
      />
      <div className="mt-2 flex justify-between text-[11px] font-medium text-outline">
        <span>{opts[0]?.label}</span>
        <span>{opts[max]?.label}</span>
      </div>
    </div>
  );
}

/** A page that stacks several questions (health history, or the symptom sliders). */
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
  // Slider questions always have a valid default position, so they don't gate
  // the Continue button; button questions must be explicitly answered.
  const allAnswered = questions.every(
    (q) => q.control === "slider" || typeof answers[q.id] === "string",
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

                {q.control === "slider" ? (
                  <OptionSlider
                    question={q}
                    value={selected}
                    onChange={(id) => onAnswer(q.id, id)}
                  />
                ) : (
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
                              ? "border-primary bg-primary-container text-primary-onContainer"
                              : "border-outline-variant bg-surface-lowest text-charcoal hover:border-primary",
                          ].join(" ")}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}
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
