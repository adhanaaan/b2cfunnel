/**
 * IHH Healthcare Singapore's consent wording, exactly as supplied, for the
 * /event-v5 preview.
 *
 * Kept in its own file rather than in copy.ts on purpose: this is an unapproved
 * draft from a partner, and it must not sit in the typed CopyConfig that the
 * live event screens render from while an event is running.
 *
 * VERBATIM is the text as received. RECONCILED is the same substance split so
 * that consenting to marketing is not a condition of playing - which is how the
 * rest of this funnel (and our published privacy policy) already works.
 */

export const IHH_DPO_EMAIL = "pdpo@ihhhealthcare.com";
export const IHH_NOTICE_URL =
  "https://www.ihhhealthcare.com/singapore/data-protection-notice";

/** The block exactly as IHH sent it, as one all-or-nothing agreement. */
export const IHH_VERBATIM = {
  clauses: [
    "By providing the information set out in this form, I consent to IHH Healthcare Singapore and their representatives and/or agents collecting, using and disclosing my personal data to provide me with medical treatment and other reasonably related purposes. Such purposes are set out in the IHH Healthcare Singapore Data Protection Notice, accessible at {notice} or available on request.",
    "I also consent to IHH Healthcare Singapore, their representatives, agents and/or business partners collecting, using and disclosing my personal data for marketing and promotional purposes.",
    "I agree to receiving marketing messages via SMS, telephone call and other Singapore phone number-based messaging, regardless of my registration with the Do-Not-Call registry.",
    "I understand that I may withdraw such consent at any time via unsubscribe facilities OR forms available on request from our staff OR by email to IHH Healthcare Singapore DPO at {dpo}.",
  ],
  footnote: "All fields marked with an asterisk (*) are mandatory.",
  /** One tick covering everything above. */
  agreeLabel: "I agree to all of the above.",
} as const;

/**
 * The same clauses, separated by purpose. Service consent is required (we
 * cannot email a result without it); each marketing channel is its own
 * optional tick and neither blocks play.
 */
export const IHH_RECONCILED = {
  required: {
    label:
      "(Required) I consent to Gray Matter Solutions and IHH Healthcare Singapore collecting and using my personal data to give me my results and contact me about the prize. Full details are in the {notice} and our {privacy}.",
  },
  optional: [
    {
      id: "marketing",
      label:
        "Send me brain health tips, updates and promotions by email from Gray Matter Solutions and IHH Healthcare Singapore.",
    },
    {
      id: "phone",
      label:
        "Also contact me by SMS or phone call, even if my number is on the Do-Not-Call registry.",
      /** Nothing on this form asks for a phone number - see the preview notes. */
      note: "No phone number is collected on this form.",
    },
  ],
  withdrawal:
    "You can withdraw any consent at any time using the unsubscribe link in our emails, by asking our staff, or by emailing {dpo}.",
} as const;
