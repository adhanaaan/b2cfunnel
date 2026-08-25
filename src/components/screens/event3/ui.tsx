/** Shared visual vocabulary for the event3 ("Daylight Ember") screens. */

/** Warm vertical gradient used on emphasised hero words. */
export const emberTextGradient =
  "bg-gradient-to-b from-[#e8782e] via-[#f09452] to-[#ffbb88] bg-clip-text text-transparent";

/** The near-solid ember gradient used on inverse-button labels and links. */
export const emberLabelGradient =
  "bg-gradient-to-l from-[#ea7a4b] to-[#f16d39] bg-clip-text text-transparent";

/** Primary CTA: ember gradient fill (Figma Button/Ember CTA, pressed = 97%). */
export const ctaPrimaryClass =
  "flex h-[60px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-ember-core to-ember-bright px-6 text-lg font-extrabold text-[#fafafa] shadow-[0_12px_40px_-12px_rgba(247,117,40,0.55)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-core";

/** Inverse CTA: white fill with the gradient label. */
export const ctaInverseClass =
  "flex h-[60px] w-full items-center justify-center rounded-xl bg-white px-6 text-lg font-extrabold shadow-[0_12px_40px_-12px_rgba(247,117,40,0.35)] transition hover:brightness-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-core";

/**
 * Renders copy where words wrapped in *asterisks* take the warm ember
 * gradient (e.g. "How *fast* does your *brain* process?").
 */
export function GradientWords({ text }: { text: string }) {
  return (
    <>
      {text.split("*").map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={emberTextGradient}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
