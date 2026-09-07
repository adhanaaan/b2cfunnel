import type { Metadata } from "next";
import { PrivacyPolicyDocument } from "@/components/privacy/PrivacyPolicyDocument";
import { PHKL_PRIVACY_POLICY_SECTIONS } from "@/config/privacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | Reaction Time Challenge",
  description:
    "How Gray Matter Solutions collects, uses, discloses and protects personal data in the Reaction Time Challenge and Brain Health Check at Pantai Hospital Kuala Lumpur, under Singapore's Personal Data Protection Act 2012.",
};

/**
 * /phkl/privacy-policy - the policy behind the "Privacy Policy" link in the
 * PHKL landing's required consent row.
 *
 * Its own page because this event shares what it collects with IHH Healthcare
 * Malaysia, under the partner consent taken on the same landing, and the
 * policy has to say so. It is the regatta's policy with the partner renamed
 * (config/privacyPolicy.ts builds both from one set of sections).
 */
export default function PhklPrivacyPolicyPage() {
  return (
    <PrivacyPolicyDocument
      sections={PHKL_PRIVACY_POLICY_SECTIONS}
      backHref="/phkl"
    />
  );
}
