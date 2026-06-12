import { COPY } from "@/config/copy";

interface BigScoreProps {
  score: number;
}

/** The headline number: big score, smaller secondary-colour suffix. */
export function BigScore({ score }: BigScoreProps) {
  return (
    <p className="text-center font-display leading-none">
      <span className="bg-gradient-to-br from-primary to-[#ec5e3b] bg-clip-text text-7xl font-extrabold text-transparent">
        {score}
      </span>
      <span className="text-3xl font-semibold text-outline">
        {COPY.screens.resultBase.scoreSuffix}
      </span>
    </p>
  );
}
