interface ProgressBarProps {
  current: number; // 1-based
  total: number;
  /** The progress line, with {current} and {total} to fill in. */
  label?: string;
}

/** High-visibility orange funnel progress bar (always visible during questions). */
export function ProgressBar({
  current,
  total,
  label = "Question {current} of {total}",
}: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-secondary">
        <span>
          {label
            .replace("{current}", String(current))
            .replace("{total}", String(total))}
        </span>
        <span>{pct}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-surface-high"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
