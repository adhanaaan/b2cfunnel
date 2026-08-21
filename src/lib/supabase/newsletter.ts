import { getServerSupabase, isSupabaseConfigured } from "./server";

/**
 * Newsletter and early-access opt-ins from the report page.
 *
 * Its own table rather than a column on `leads`: the lead row is written before
 * the report renders, and an additive table cannot break that insert if the
 * migration has not been run yet.
 */
export async function recordNewsletterOptIn(
  email: string,
  name: string | undefined,
  variant: string | undefined,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = getServerSupabase();
  const { error } = await sb
    .from("newsletter_optins")
    .insert({ email, name: name ?? null, variant: variant ?? null });
  if (error) throw error;
}
