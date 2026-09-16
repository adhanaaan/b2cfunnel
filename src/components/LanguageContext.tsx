"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { CopyConfig, PhklArcCopy, PhklReportSharedCopy } from "@/types/copy";
import type { Question } from "@/types/question";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  isLanguage,
  type Language,
} from "@/config/language";
import { arcCopyFor, copyFor, phklReportFor } from "@/config/copy";
import { questionsByIdFor } from "@/config/questions";
import { useVariant } from "@/components/VariantContext";

/**
 * The language the funnel is being read in, and the copy that follows from it.
 *
 * Deliberately a context rather than a step in the flow: changing language must
 * never move the cursor, re-ask a question or touch what is scored. It is
 * chosen on the landing (see `LanguagePicker`) and read by every screen behind
 * it through `useCopy()`.
 *
 * For every English-only event this layer is inert. Nothing mounts the
 * provider, so `useLanguage()` returns "en" and `copyFor()` hands back the
 * `COPY` object itself - not a merged copy of it - which is what keeps a
 * multilingual event from being able to change what any other event renders.
 */
interface LanguageValue {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageValue>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
});

/**
 * Holds the choice for the session.
 *
 * The initial value is read from sessionStorage inside the state initialiser,
 * so a mid-funnel reload (or a router remount) comes back in the language the
 * player chose rather than in English. It is only ever sessionStorage: an
 * event runs on shared phones, and the next person to scan the code should
 * start from the default, not from the last player's choice.
 */
export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setStored] = useState<Language>(() => {
    if (typeof window === "undefined") return DEFAULT_LANGUAGE;
    try {
      const saved = window.sessionStorage.getItem(LANGUAGE_STORAGE_KEY);
      return isLanguage(saved) ? saved : DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  const setLanguage = useCallback((next: Language) => {
    setStored(next);
    try {
      window.sessionStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {
      /* private mode, or storage disabled: the choice still holds in memory */
    }
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/** The language in play. "en" wherever no provider is mounted. */
export const useLanguage = (): Language => useContext(LanguageContext).language;

/** The language, and the setter the picker calls. */
export const useLanguageChoice = (): LanguageValue =>
  useContext(LanguageContext);

/**
 * The whole copy config, in the language in play.
 *
 * Every screen that can be reached in more than one language reads this
 * instead of importing `COPY` directly. In English it IS `COPY`, so switching
 * a screen over changes nothing for the events that only ever run in English.
 */
export function useCopy(): CopyConfig {
  return copyFor(useVariant(), useLanguage());
}

/** The PHKL-arc copy for the event being walked, in the language in play. */
export function useArcCopy(): PhklArcCopy {
  return arcCopyFor(useVariant(), useCopy());
}

/**
 * The three report sections /phkl and the summit draw with the same
 * components, for the event being walked, in the language in play.
 */
export function usePhklReportCopy(): PhklReportSharedCopy {
  return phklReportFor(useVariant(), useCopy());
}

/** The question bank, by id, in the language in play. */
export function useQuestionsById(): Record<string, Question> {
  return questionsByIdFor(useLanguage());
}
