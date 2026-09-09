import type { Metadata } from "next";
import { PrivacyPolicyDocument } from "@/components/privacy/PrivacyPolicyDocument";
import { IHHSEA_PRIVACY_POLICY_SECTIONS } from "@/config/privacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | Reaction Time Challenge",
  description:
    "How Gray Matter Solutions collects, uses, discloses and protects personal data in the Reaction Time Challenge and Brain Health Check with IHH Healthcare Singapore, under Singapore's Personal Data Protection Act 2012.",
};

/**
 * /ihh/privacy-policy - the policy behind the "Privacy Policy" link in the
 * /ihh landing's required consent row.
 *
 * The same text as /ihhsearegatta/privacy-policy, shared rather than copied:
 * this event shares what it collects with IHH Healthcare Singapore under the
 * partner consent taken on the same landing, so the same partner policy
 * applies. It gets its own route only so the link never walks a reader off
 * /ihh mid-consent.
 */
export default function IhhPrivacyPolicyPage() {
  return (
    <PrivacyPolicyDocument
      sections={IHHSEA_PRIVACY_POLICY_SECTIONS}
      backHref="/ihh"
    />
  );
}
