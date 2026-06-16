import type { StatCard } from "@/config/statCards";
import { ScreenShell } from "@/components/ui/ScreenShell";

interface StatCardScreenProps {
  card: StatCard;
  onNext: () => void;
}

/** Screen type 3 — a cited statistic interspersed between questions. */
export function StatCardScreen({ card, onNext }: StatCardScreenProps) {
  return (
    <ScreenShell>
      <div className="flex min-h-[80vh] flex-col justify-center text-center animate-fade-up">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Did you know
        </p>
        <p className="mt-6 font-display text-6xl font-extrabold text-primary sm:text-7xl">
          {card.stat}
        </p>
        <p className="mt-6 text-xl leading-relaxed text-charcoal">
          {card.body}
        </p>
        <p className="mt-5 text-xs italic text-outline">Source: {card.source}</p>

        <button
          type="button"
          onClick={onNext}
          className="mt-16 w-full rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-on shadow-float transition hover:brightness-105"
        >
          Continue
        </button>
      </div>
    </ScreenShell>
  );
}
