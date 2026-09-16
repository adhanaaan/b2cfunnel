/**
 * A translation overlay, applied to a copy config.
 *
 * Every field is optional at every depth, which is the whole point: a
 * translation names only the strings it changes, and anything it leaves out
 * stays as the base config wrote it. A missing translation therefore renders
 * in English rather than as a blank - the one failure mode worth designing
 * for, because it is the one that happens at an event.
 */
export type DeepPartial<T> = T extends readonly (infer U)[]
  ? readonly U[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  Object.getPrototypeOf(value) === Object.prototype;

/**
 * `base` with `overlay` applied over it, as a new object. Neither argument is
 * mutated.
 *
 * Plain objects merge key by key; ARRAYS ARE REPLACED WHOLE, never merged
 * element by element. That is deliberate and load-bearing: a list of consent
 * clauses, of report paragraphs or of heading fragments only reads correctly
 * as a set, and a per-index merge would silently leave one English paragraph
 * inside an Indonesian block. Translating a list means translating all of it.
 */
export function deepMerge<T>(base: T, overlay: DeepPartial<T> | undefined): T {
  if (overlay === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(overlay)) return overlay as T;

  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    if (value === undefined) continue;
    const current = out[key];
    out[key] = isPlainObject(current)
      ? deepMerge(current, value as DeepPartial<Record<string, unknown>>)
      : value;
  }
  return out as T;
}
