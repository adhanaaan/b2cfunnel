import { COPY } from "@/config/copy";

/** Header band with the reviewing neurologist's avatar + strapline. */
export function ScoreHeader() {
  const { reviewerInitials, reviewerStrap } = COPY.screens.resultBase;
  return (
    <div className="flex items-center gap-3 rounded-full bg-surface-container px-4 py-2.5">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-on">
        {reviewerInitials}
      </span>
      <span className="text-sm font-medium leading-snug text-charcoal">
        {reviewerStrap}
      </span>
    </div>
  );
}
