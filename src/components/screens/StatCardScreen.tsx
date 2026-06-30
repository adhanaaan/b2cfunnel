import type { StatCard } from "@/config/statCards";
import { ScreenShell } from "@/components/ui/ScreenShell";

interface StatCardScreenProps {
  card: StatCard;
  onNext: () => void;
}

/** Screen type 3 - a cited statistic interspersed between questions. */
export function StatCardScreen({ card, onNext }: StatCardScreenProps) {
  return (
    <ScreenShell>
      <div className="flex min-h-[86vh] flex-col text-center animate-fade-up">
        {/* Stat centred in the available space. */}
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Did you know
          </p>
          <p className="mt-6 font-display text-6xl font-extrabold text-primary sm:text-7xl">
            {card.stat}
          </p>
          <p className="mt-6 text-xl leading-relaxed text-charcoal">
            {card.body}
          </p>
          <p className="mt-5 text-xs italic text-outline">
            Source: {card.source}
          </p>
        </div>

        {/* Pinned to the bottom. */}
        <button
          type="button"
          onClick={onNext}
          className="mt-8 w-full rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-on shadow-float transition hover:brightness-105"
        >
          Continue
        </button>
      </div>
    </ScreenShell>
  );
}
