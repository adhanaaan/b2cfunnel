import { COPY } from "@/config/copy";

/** Header band: institutional / evidence credibility for the score. */
export function ScoreHeader() {
  const { reviewerStrap } = COPY.screens.resultBase;
  return (
    <div className="flex items-center gap-3 rounded-full bg-surface-container px-4 py-2.5">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-container text-primary-onContainer">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path
            d="M12 2l7 3v6c0 4.5-3 8.3-7 9-4-.7-7-4.5-7-9V5l7-3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 12l2.5 2.5L16 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-sm font-medium leading-snug text-charcoal">
        {reviewerStrap}
      </span>
    </div>
  );
}
