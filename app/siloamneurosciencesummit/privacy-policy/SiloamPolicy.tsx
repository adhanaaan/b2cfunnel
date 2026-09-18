"use client";

import { useState } from "react";
import { LANGUAGES, type Language } from "@/config/language";
import {
  INDONESIA_POLICY_LAW,
  SILOAM_PRIVACY_POLICY_SECTIONS,
} from "@/config/privacyPolicyIndonesia";
import {
  PrivacyPolicyDocument,
  type PrivacyPolicyChrome,
} from "@/components/privacy/PrivacyPolicyDocument";

/**
 * The words around the policy, per language. Kept beside the toggle that
 * switches them rather than in the copy config: this page is served outside
 * the funnel, so it never sees `COPY` or the language the funnel is in.
 */
const CHROME: Record<Language, PrivacyPolicyChrome> = {
  en: {
    back: "Back to the challenge",
    title: ["Privacy", "Policy"],
    lastUpdated: "Last updated",
    law: INDONESIA_POLICY_LAW.en,
  },
  id: {
    back: "Kembali ke tantangan",
    title: ["Kebijakan", "Privasi"],
    lastUpdated: "Terakhir diperbarui",
    law: INDONESIA_POLICY_LAW.id,
  },
};

/**
 * The summit's policy, in Bahasa Indonesia or English.
 *
 * **It opens in Indonesian.** This is an Indonesian event under Indonesian
 * law, and UU PDP art. 22 requires a request for consent to be put in
 * Indonesian and to be plainly understandable - so the document the consent
 * row links has to be readable to the person ticking that row. English is one
 * tap away for everyone else.
 *
 * The toggle is local state and nothing more. It deliberately does NOT read
 * the funnel's language: the consent row opens this page in a new tab, and a
 * new tab's sessionStorage is a copy at best and empty at worst, so inheriting
 * it would mean a policy that sometimes opens in a language nobody chose. A
 * two-pill toggle in plain sight is honest about what it does and always
 * works.
 */
export function SiloamPolicy() {
  const [language, setLanguage] = useState<Language>("id");

  return (
    <PrivacyPolicyDocument
      sections={SILOAM_PRIVACY_POLICY_SECTIONS[language]}
      backHref="/siloamneurosciencesummit"
      chrome={CHROME[language]}
      toolbar={
        <div
          role="radiogroup"
          aria-label="Bahasa · Language"
          className="inline-flex items-center gap-1 rounded-full bg-white/70 p-1 shadow-[0_2px_12px_-4px_rgba(51,18,0,0.12)]"
        >
          {LANGUAGES.map((option) => {
            const active = option.id === language;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setLanguage(option.id)}
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
      }
    />
  );
}
