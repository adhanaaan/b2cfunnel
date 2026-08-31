import { NextResponse } from "next/server";
import { recordNewsletterOptIn } from "@/lib/supabase/newsletter";
import { markLeadTipsConsent } from "@/lib/supabase/leads";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface OptInPayload {
  email?: string;
  name?: string;
  variant?: string;
}

const str = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : undefined;

export async function POST(req: Request) {
  let payload: OptInPayload;
  try {
    payload = (await req.json()) as OptInPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = str(payload.email, 254);
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  // Also stamp the consent on the lead row so `leads.tips_consent` reflects the
  // report opt-in, not just the landing-page checkbox. Independent of the
  // opt-in table: neither write should be able to lose the other.
  // Awaited, not fire-and-forget: the response ends the serverless invocation
  // and a detached promise can be cut off mid-write.
  await markLeadTipsConsent(email).catch((err) => {
    console.error("[newsletter] lead consent update failed:", err);
  });

  try {
    await recordNewsletterOptIn(
      email,
      str(payload.name, 120),
      str(payload.variant, 16),
    );
  } catch (err) {
    // The table may not exist yet. Their email is already on the lead row, so
    // report success rather than showing the visitor a failure they can't fix.
    console.error("[newsletter] insert failed:", err);
    return NextResponse.json({ ok: true, stored: false });
  }

  return NextResponse.json({ ok: true, stored: true });
}
