/**
 * Helpers for writing to a column that may not exist yet in the deployed
 * database.
 *
 * `tips_consent` on `leads` and `game_scores` is one of those: the migration
 * that adds it can land before or after this code, and rows written earlier
 * have no value for it at all. Rather than couple a deploy to a migration,
 * every write tries the column first and, if Postgres says it does not exist,
 * retries without it. A missed consent flag is a far smaller loss than a
 * dropped lead or an unrecorded score.
 */

/** The bits of a Supabase/Postgrest error these helpers need. */
export interface WriteError {
  code?: string;
  message?: string;
}

/** Postgres "column does not exist", including PostgREST's schema-cache miss. */
export function isMissingColumnError(err: unknown, column: string): boolean {
  if (!err || typeof err !== "object") return false;
  const { code, message } = err as WriteError;
  // 42703 = undefined_column; PGRST204 = column not in PostgREST's schema
  // cache, which is what Supabase returns for an unknown column.
  if (code === "42703" || code === "PGRST204") return true;
  return typeof message === "string" && message.includes(column);
}

/**
 * Insert `row` with one optional column added, retrying without that column if
 * the database does not have it yet. Any other error is the caller's to handle.
 */
export async function insertWithOptionalColumn(
  column: string,
  value: unknown,
  row: Record<string, unknown>,
  insert: (row: Record<string, unknown>) => PromiseLike<{ error: WriteError | null }>,
): Promise<{ error: WriteError | null }> {
  const first = await insert({ ...row, [column]: value });
  if (first.error && isMissingColumnError(first.error, column)) {
    console.warn(`[supabase] ${column} column missing; retrying without it.`);
    return insert(row);
  }
  return first;
}
