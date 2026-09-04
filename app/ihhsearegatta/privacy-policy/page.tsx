import type { Metadata } from "next";
import { PrivacyPolicyDocument } from "@/components/privacy/PrivacyPolicyDocument";
import { IHHSEA_PRIVACY_POLICY_SECTIONS } from "@/config/privacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | Reaction Time Challenge",
  description:
    "How Gray Matter Solutions collects, uses, discloses and protects personal data in the Reaction Time Challenge and Brain Health Check at the IHH SEA Regatta, under Singapore's Personal Data Protection Act 2012.",
};

/**
 * /ihhsearegatta/privacy-policy - the policy behind the "Privacy Policy" link
 * in the regatta landing's required consent row.
 *
 * Its own page rather than /privacy-policy because this event shares what it
 * collects with IHH Healthcare Singapore, under the partner consent taken on
 * the same landing, and the policy has to say so: what GMS's policy covers and
 * what IHH's does, the sharing itself, and whose retention and deletion apply
 * to which copy. The events with no partner keep the general policy, which
 * must not carry that wording. The text lives in config/privacyPolicy.ts.
 */
export default function IhhSeaRegattaPrivacyPolicyPage() {
  return (
    <PrivacyPolicyDocument
      sections={IHHSEA_PRIVACY_POLICY_SECTIONS}
      backHref="/ihhsearegatta"
    />
  );
}
