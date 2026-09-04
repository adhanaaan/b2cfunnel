import type { Metadata } from "next";
import { PrivacyPolicyDocument } from "@/components/privacy/PrivacyPolicyDocument";
import { PRIVACY_POLICY_SECTIONS } from "@/config/privacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | Brain Health Check",
  description:
    "How Gray Matter Solutions collects, uses, discloses and protects personal data in the Reaction Time Challenge and Brain Health Check, under Singapore's Personal Data Protection Act 2012.",
};

/**
 * Privacy policy for the Reaction Time Challenge and Brain Health Check, as
 * linked from the /event-v3, /rotaryklwam and /ntuhomecoming landings. The
 * text lives in config/privacyPolicy.ts; /ihhsearegatta has a policy of its
 * own there, because its landing shares data with the event partner.
 */
export default function PrivacyPolicyPage() {
  return (
    <PrivacyPolicyDocument
      sections={PRIVACY_POLICY_SECTIONS}
      backHref="/event-v3"
    />
  );
}
