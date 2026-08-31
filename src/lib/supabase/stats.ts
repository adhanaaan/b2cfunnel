import { getServerSupabase, isSupabaseConfigured } from "./server";
import { computeReportRate, type ReportRate } from "@/lib/reportRate";
import { isMissingColumnError } from "./optionalColumn";

const EMPTY: ReportRate = {
  players: 0,
  reports: 0,
  rate: 0,
  meaningful: false,
};

/**
 * Completion rate for one event bucket: how many of the people who played the
 * game went on to get their brain health report.
 *
 * Both sides are scoped by `source`, so each event day stands alone - the same
 * tag that keeps the leaderboard clear of other events keeps this honest too.
 * Rows are counted in JS rather than with a distinct-count view: an event is a
 * few hundred rows, and it keeps the deployment to two nullable columns with no
 * database objects to migrate.
 */
export async function getReportRate(source: string): Promise<ReportRate> {
  if (!isSupabaseConfigured()) return EMPTY;
  const sb = getServerSupabase();

  const [scores, leads] = await Promise.all([
    sb.from("game_scores").select("email").eq("source", source),
    sb.from("leads").select("email").eq("source", source),
  ]);

  if (scores.error) return EMPTY;
  // A database without leads.source yet: players are known but reports are not,
  // so report nothing rather than a misleading 0%.
  if (leads.error) {
    if (isMissingColumnError(leads.error, "source")) {
      console.warn("[stats] leads.source column missing; no report rate yet.");
      return EMPTY;
    }
    return EMPTY;
  }

  const emails = (rows: { email: string | null }[] | null) =>
    (rows ?? []).map((r) => r.email ?? "");

  return computeReportRate(emails(scores.data), emails(leads.data));
}
