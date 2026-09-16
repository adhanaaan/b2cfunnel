"use client";

import { LANGUAGES } from "@/config/language";
import { track } from "@/lib/analytics";
import { useLanguageChoice } from "@/components/LanguageContext";
import { useVariant } from "@/components/VariantContext";

/**
 * The language choice on the Siloam summit's landing: two pills in a segmented
 * control, each labelled in its own language.
 *
 * Deliberately NOT a `<select>`. A dropdown hides the options behind a tap,
 * which is the wrong trade for a two-option choice that has to be obvious to
 * someone who cannot read the rest of the page; two visible pills say "this
 * page can be read in Bahasa Indonesia" without being opened. It is also the
 * whole reason the picker sits at the very top of the landing rather than in a
 * corner.
 *
 * A radio group rather than buttons, so arrow keys move between the options
 * and a screen reader announces which is selected.
 */
export function LanguagePicker({ label }: { label: string }) {
  const { language, setLanguage } = useLanguageChoice();
  const variant = useVariant();

  return (
    <div className="flex flex-col items-center gap-1.5">
      <p
        id="language-picker-label"
        className="text-[9px] font-bold uppercase tracking-[0.18em] text-ember-core"
      >
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby="language-picker-label"
        className="flex items-center gap-1 rounded-full bg-white/70 p-1 shadow-[0_2px_12px_-4px_rgba(51,18,0,0.12)]"
      >
        {LANGUAGES.map((option) => {
          const active = option.id === language;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                if (active) return;
                setLanguage(option.id);
                track("language_selected", { variant, language: option.id });
              }}
              className={[
                "rounded-full px-4 py-1.5 text-[13px] font-bold transition",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-core",
                active
                  ? "bg-gradient-to-r from-ember-core to-ember-bright text-white shadow-[0_6px_18px_-8px_rgba(247,117,40,0.8)]"
                  : "text-secondary hover:text-charcoal",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
