/**
 * Helpers for writing to columns that may not exist yet in the deployed
 * database.
 *
 * `tips_consent` and `source` on `leads` (and `tips_consent` on `game_scores`)
 * are those: each is added by a migration that can land before or after the
 * code that writes it, and rows written earlier have no value for it at all.
 * Rather than couple a deploy to a migration, every write tries the columns
 * first and, if Postgres says one does not exist, retries without it. A missed
 * consent flag or event tag is a far smaller loss than a dropped lead or an
 * unrecorded score.
 */

/** The bits of a Supabase/Postgrest error these helpers need. */
export interface WriteError {
  code?: string;
  message?: string;
}

/** Postgres "column does not exist", including PostgREST's schema-cache miss. */
export function isMissingColumnError(err: unknown, column?: string): boolean {
  if (!err || typeof err !== "object") return false;
  const { code, message } = err as WriteError;
  // 42703 = undefined_column; PGRST204 = column not in PostgREST's schema
  // cache, which is what Supabase returns for an unknown column.
  if (code === "42703" || code === "PGRST204") return true;
  if (typeof message !== "string") return false;
  return column ? message.includes(column) : /column/i.test(message);
}

/**
 * Insert `row` plus a set of optional columns, dropping them one at a time as
 * the database rejects them, so the row still lands on a database that has none
 * of them. Errors that are not about a missing column are returned untouched
 * for the caller to handle.
 */
export async function insertWithOptionalColumns(
  optional: Record<string, unknown>,
  row: Record<string, unknown>,
  insert: (row: Record<string, unknown>) => PromiseLike<{ error: WriteError | null }>,
): Promise<{ error: WriteError | null }> {
  let remaining = Object.keys(optional);

  for (;;) {
    const values = { ...row };
    for (const key of remaining) values[key] = optional[key];

    const { error } = await insert(values);
    if (!error || remaining.length === 0) return { error };

    // Drop the column the database named, or (when it named none) the last one
    // still in play, and try again until only the required columns are left.
    const named = remaining.find((key) => isMissingColumnError(error, key));
    if (!named && !isMissingColumnError(error)) return { error };
    const drop = named ?? remaining[remaining.length - 1];
    console.warn(`[supabase] ${drop} column missing; retrying without it.`);
    remaining = remaining.filter((key) => key !== drop);
  }
}
