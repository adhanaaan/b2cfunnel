import type { Answers } from "@/types/question";
import type { BandName, Persona } from "@/types/engine";

/** Shape of a row in the public.leads table. */
export interface LeadRow {
  email: string;
  name?: string | null;
  persona?: Persona | null;
  risk_score?: number | null;
  symptom_score?: number | null;
  total_score?: number | null;
  band?: BandName | null;
  answers?: Answers | null;
  game_time_ms?: number | null;
  /**
   * Whether the visitor ticked the brain-health-tips consent (landing page, or
   * the opt-in on the report). Optional and nullable: leads captured before we
   * asked carry null, which means "unknown", not "declined".
   */
  tips_consent?: boolean | null;
  /**
   * Which event the report was generated at, matching `game_scores.source`
   * (see eventSource in config/event.ts). Null for the non-event funnels and
   * for leads captured before the column existed.
   */
  source?: string | null;
  user_agent?: string | null;
}

/** Payload accepted by POST /api/lead. */
export interface LeadPayload {
  email: string;
  name?: string;
  persona?: Persona;
  riskScore?: number;
  symptomScore?: number;
  totalScore?: number;
  band?: BandName;
  answers?: Answers;
  gameTimeMs?: number;
  tipsConsent?: boolean;
  source?: string;
}
