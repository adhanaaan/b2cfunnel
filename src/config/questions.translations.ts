import type { Language } from "@/config/language";
import type { QuestionText } from "@/config/questions.id";
import { QUESTIONS_ID } from "@/config/questions.id";
import { QUESTIONS_ZH } from "@/config/questions.zh";

/**
 * The question bank's words, by language. English is absent: it is the bank
 * itself (config/questions.ts), not an overlay on it.
 *
 * Its own module so `config/questions.ts` can reach the overlays without any
 * overlay importing the bank back.
 */
export const QUESTIONS_TEXT_BY_LANGUAGE: Record<
  Exclude<Language, "en">,
  Record<string, QuestionText>
> = {
  zh: QUESTIONS_ZH,
  id: QUESTIONS_ID,
};
