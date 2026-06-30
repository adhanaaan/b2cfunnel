import { MANDATORY_DISCLAIMERS } from "@/config/compliance";

/**
 * Mandatory wellness disclaimers. Renders the §8 lines unconditionally - must
 * appear on every result screen. Do not make this conditional.
 */
export function ComplianceFooter() {
  return (
    <div className="mt-6 space-y-1 text-center text-xs leading-relaxed text-outline">
      {MANDATORY_DISCLAIMERS.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}
