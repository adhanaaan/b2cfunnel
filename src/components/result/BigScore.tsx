import { COPY } from "@/config/copy";
import { useVariant } from "@/components/VariantContext";

interface BigScoreProps {
  score: number;
}

/** The headline number: big score, smaller secondary-colour suffix. */
export function BigScore({ score }: BigScoreProps) {
  const variant = useVariant();
  const woman = variant === "woman";

  return (
    <p className="text-center font-display leading-none">
      <span
        className={
          woman
            ? "text-7xl font-semibold text-[#475b47]"
            : "bg-gradient-to-br from-primary to-[#ec5e3b] bg-clip-text text-7xl font-extrabold text-transparent"
        }
      >
        {score}
      </span>
      <span
        className={
          woman
            ? "text-3xl font-medium text-[#6c886d]"
            : "text-3xl font-semibold text-outline"
        }
      >
        {COPY.screens.resultBase.scoreSuffix}
      </span>
    </p>
  );
}
