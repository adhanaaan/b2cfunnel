import type { Metadata } from "next";
import { PrivacyPolicyDocument } from "@/components/privacy/PrivacyPolicyDocument";
import { PHKL_PRIVACY_POLICY_SECTIONS } from "@/config/privacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | Reaction Time Challenge",
  description:
    "How Gray Matter Solutions collects, uses, discloses and protects personal data in the Reaction Time Challenge and Brain Health Check at Pantai Hospital Kuala Lumpur, under Singapore's Personal Data Protection Act 2012.",
};

/**
 * /phkl-3/privacy-policy - the policy behind the "Privacy Policy" link in the
 * /phkl-3 landing's required consent row.
 *
 * /phkl's policy, served on this route for /phkl-2's reason: the event shares
 * what it collects with IHH Healthcare Malaysia under the partner consent on
 * the same landing, and a reader checking that should not be walked off the
 * route they are consenting on.
 */
export default function Phkl3PrivacyPolicyPage() {
  return (
    <PrivacyPolicyDocument
      sections={PHKL_PRIVACY_POLICY_SECTIONS}
      backHref="/phkl-3"
    />
  );
}
