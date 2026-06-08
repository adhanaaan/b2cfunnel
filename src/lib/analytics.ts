"use client";

/**
 * Minimal, privacy-safe funnel analytics. Fires anonymous step events to
 * /api/event so we can measure drop-off (no PII — just a random per-session id,
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

/** Fire an anonymous funnel event. Fire-and-forget; never blocks the UI. */
export function track(event: string, props: TrackProps = {}): void {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({ sessionId: sessionId(), event, ...props });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/event",
        new Blob([body], { type: "application/json" }),
      );
    } else {
      void fetch("/api/event", {
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
