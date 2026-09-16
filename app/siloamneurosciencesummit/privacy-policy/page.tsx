import type { Metadata } from "next";
import { PrivacyPolicyDocument } from "@/components/privacy/PrivacyPolicyDocument";
import { SILOAM_PRIVACY_POLICY_SECTIONS } from "@/config/privacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | Reaction Time Challenge",
  description:
    "How Gray Matter Solutions collects, uses, discloses and protects personal data in the Reaction Time Challenge and Brain Health Check at the Siloam Neuroscience Summit.",
};

/**
 * /siloamneurosciencesummit/privacy-policy - the policy behind the "Privacy
 * Policy" link in the summit's required consent row.
 *
 * A route of its own even though the text is currently the general policy's,
 * word for word (`SILOAM_PRIVACY_POLICY_SECTIONS` shares that array rather
 * than copying it). This event runs in Indonesia and its policy is being
 * rewritten against Indonesia's Personal Data Protection Law (UU No. 27/2022);
 * having the route already means that rewrite is one edit in
 * config/privacyPolicy.ts, with no chance of it reaching the Singapore policy
 * every other event links.
 *
 * The document itself stays in English until the reviewed Indonesian text is
 * supplied. It is the one thing on this route that is deliberately NOT
 * machine-translated with the rest of the funnel: it is what people are
 * consenting to.
 */
export default function SiloamPrivacyPolicyPage() {
  return (
    <PrivacyPolicyDocument
      sections={SILOAM_PRIVACY_POLICY_SECTIONS}
      backHref="/siloamneurosciencesummit"
    />
  );
}
