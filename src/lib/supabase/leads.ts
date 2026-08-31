import { getServerSupabase, isSupabaseConfigured } from "./server";
import { isMissingColumnError } from "./optionalColumn";

/**
 * Record the brain-health-tips consent on a visitor's lead row.
 *
 * The report opt-in is ticked after the lead row has already been written, so
 * this updates rather than inserts. Consent only ever moves to `true` here: the
 * report checkbox is an opt-in, and un-ticking it is not something the UI
 * offers, so there is nothing to withdraw through this path.
 *
 * Best effort by design - the visitor's email is already captured, and the
 * opt-in also lands in `newsletter_optins`, so a database without the column
 * yet must not turn into a visible failure.
 */
export async function markLeadTipsConsent(email: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = getServerSupabase();
  const { error } = await sb
    .from("leads")
    .update({ tips_consent: true })
    .eq("email", email);
  if (error) {
    if (isMissingColumnError(error, "tips_consent")) {
      console.warn("[leads] tips_consent column missing; opt-in not stamped.");
      return;
    }
    throw error;
  }
}
