"use client";

/**
 * Minimal, privacy-safe funnel analytics. Fires anonymous step events to
 * /api/event so we can measure drop-off (no PII - just a random per-session id,
 * the step name and the variant). No third-party processor.
 */

const SID_KEY = "gms_sid";

/** Stable random id for this browser tab/session (sessionStorage). */
function sessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SID_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

export interface TrackProps {
  variant?: string;
  step?: string;
}

/** POST a JSON body to an analytics endpoint. Fire-and-forget; never blocks. */
function send(url: string, payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({ sessionId: sessionId(), ...payload });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    } else {
      void fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* analytics must never break the funnel */
  }
}

/** Fire an anonymous funnel event (drop-off tracking). */
export function track(event: string, props: TrackProps = {}): void {
  send("/api/event", { event, ...props });
}

/**
 * Anonymous audience profile, recorded when the score is computed. No name or
 * email - keyed to the random session id only, so it can never identify a
 * person. Lets us understand who showed up in aggregate.
 */
export interface ResponsePayload {
  variant?: string;
  age?: string;
  sex?: string;
  band?: string;
  persona?: string;
  riskScore?: number;
  symptomScore?: number;
  totalScore?: number;
  gameTimeMs?: number;
  answers?: Record<string, unknown>;
}

export function recordResponse(p: ResponsePayload): void {
  send("/api/response", { ...p });
}
