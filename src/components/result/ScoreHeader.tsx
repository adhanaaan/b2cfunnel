import { COPY } from "@/config/copy";
import { DoctorAvatar } from "@/components/result/DoctorAvatar";

/** Header band with the reviewing neurologist's avatar + strapline. */
export function ScoreHeader() {
  const { reviewerInitials, reviewerStrap } = COPY.screens.resultBase;
  return (
    <div className="flex items-center gap-3 rounded-full bg-surface-container px-4 py-2.5">
      <DoctorAvatar
        image={COPY.screens.hook.doctor.image}
        initials={reviewerInitials}
        className="h-9 w-9 text-xs"
      />
      <span className="text-sm font-medium leading-snug text-charcoal">
        {reviewerStrap}
      </span>
    </div>
  );
}
