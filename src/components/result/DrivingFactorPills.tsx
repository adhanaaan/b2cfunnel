import type { DrivingFactor } from "@/types/engine";
import { COPY } from "@/config/copy";
import { Pill } from "@/components/ui/Pill";

interface DrivingFactorPillsProps {
  factors: DrivingFactor[];
}

/** "What's driving this" - lifestyle/biomedical factor chips, dynamic per user. */
export function DrivingFactorPills({ factors }: DrivingFactorPillsProps) {
  if (factors.length === 0) {
    return (
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-secondary">
          {COPY.screens.resultBase.drivingHeading}
        </h2>
        <p className="text-sm text-outline">
          No notable lifestyle or biomedical factors stood out in your answers.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-secondary">
        {COPY.screens.resultBase.drivingHeading}
      </h2>
      <div className="flex flex-wrap gap-2">
        {factors.map((f) => (
          <Pill key={f.id} label={f.label} />
        ))}
      </div>
    </div>
  );
}
