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
}
