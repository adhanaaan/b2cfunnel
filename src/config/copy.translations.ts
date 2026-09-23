import type { CopyConfig } from "@/types/copy";
import type { DeepPartial } from "@/lib/deepMerge";
import type { Language } from "@/config/language";
import { COPY_ID } from "@/config/copy.id";
import { COPY_ZH } from "@/config/copy.zh";

/**
 * Every translation this build ships, by language tag.
 *
 * English is absent by design: it is the base config (`COPY`), not an overlay
 * on one, and `copyFor()` returns it untouched. A language listed in
 * `LANGUAGES` without an entry here would render entirely in English - which
 * the language tests treat as a failure, because a picker
 * that changes nothing is worse than no picker.
 *
 * Its own module so `config/copy.ts` can import the overlays without any
 * translation importing `COPY` back.
 */
export const COPY_BY_LANGUAGE: Record<
  Exclude<Language, "en">,
  DeepPartial<CopyConfig>
> = {
  zh: COPY_ZH,
  id: COPY_ID,
};
