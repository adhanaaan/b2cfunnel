import { NextResponse } from "next/server";
import { getReportRate } from "@/lib/supabase/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/report-rate?source=dbs-day1
 *
 * The board's completion stat: unique people who got their brain health report
 * over unique people who played, for one event bucket.
 */
export async function GET(req: Request) {
  const source = new URL(req.url).searchParams.get("source")?.trim();
  if (!source) {
    return NextResponse.json({ error: "Missing source." }, { status: 400 });
  }

  const { players, reports, rate, meaningful } = await getReportRate(source);

  return NextResponse.json({
    players,
    reports,
    // Whole percent: the board prints it as "N%".
    pct: Math.round(rate * 100),
    meaningful,
  });
}
