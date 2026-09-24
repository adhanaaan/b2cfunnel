"use client";

import { languagesFor } from "@/config/language";
import { track } from "@/lib/analytics";
import { useLanguageChoice } from "@/components/LanguageContext";
import { useVariant } from "@/components/VariantContext";

/**
 * The language choice on a landing that offers one: pills in a segmented
 * control, each labelled in its own language. Which pills is the event's own
 * list (`languagesFor`): two on the Siloam summit, three on /phkl-2 and
 * /phkl-3.
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
export function LanguagePicker({ label }: { label?: string }) {
  const { language, setLanguage } = useLanguageChoice();
  const variant = useVariant();
  const options = languagesFor(variant);
  // Three pills have to fit a 320px phone on one row, so they sit a little
  // tighter than the summit's two.
  const pad = options.length > 2 ? "px-3.5" : "px-4";

  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <p
          id="language-picker-label"
          className="text-[9px] font-bold uppercase tracking-[0.18em] text-ember-core"
        >
          {label}
        </p>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label ? "language-picker-label" : undefined}
        aria-label={label ? undefined : "Language · 语言 · Bahasa"}
        className="flex items-center gap-1 rounded-full bg-white/70 p-1 shadow-[0_2px_12px_-4px_rgba(51,18,0,0.12)]"
      >
        {options.map((option) => {
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
                `whitespace-nowrap rounded-full ${pad} py-1.5 text-[13px] font-bold transition`,
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
