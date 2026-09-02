/**
 * IHH Healthcare Singapore's consent wording, for the /event-v5 preview.
 *
 * Kept in its own file rather than in copy.ts on purpose: this is an unapproved
 * draft from a partner, and it must not sit in the typed CopyConfig that the
 * live event screens render from while an event is running.
 */

export const IHH_DPO_EMAIL = "pdpo@ihhhealthcare.com";
export const IHH_NOTICE_URL =
  "https://www.ihhhealthcare.com/singapore/data-protection-notice";

/** One consent line the player can tick. Every tick is optional. */
export interface ConsentTick {
  id: string;
  label: string;
  /** Shown under the tick when something about it needs calling out. */
  note?: string;
}

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
 * IHH's own wording, unchanged, but split into separate ticks - and every one
 * of them optional. Ticking nothing still lets you play and still shows your
 * result on screen.
 *
 * The trade-off to be explicit about: with no contact consent we cannot email
 * the report or reach the person if they win the prize. That is the price of
 * making everything optional, and it is a product decision, not a bug.
 */
export const IHH_SPLIT: {
  ticks: ConsentTick[];
  withdrawal: string;
  footnote: string;
} = {
  ticks: [
    {
      id: "service",
      label: IHH_VERBATIM.clauses[0],
      note: "Without this we cannot email your report or contact you about the prize.",
    },
    { id: "marketing", label: IHH_VERBATIM.clauses[1] },
    {
      id: "phone",
      label: IHH_VERBATIM.clauses[2],
      note: "No phone number is collected on this form.",
    },
  ],
  withdrawal: IHH_VERBATIM.clauses[3],
  footnote: IHH_VERBATIM.footnote,
};

/**
 * The same three purposes in our own plainer voice, in case IHH will accept a
 * reword. Also all optional.
 */
export const IHH_RECONCILED: {
  ticks: ConsentTick[];
  withdrawal: string;
  footnote: string;
} = {
  ticks: [
    {
      id: "service",
      label:
        "Email me my brain health report, and contact me if I win the prize. Details are in the {notice} and our {privacy}.",
      note: "Without this we cannot email your report or contact you about the prize.",
    },
    {
      id: "marketing",
      label:
        "Send me brain health tips, updates and promotions from Gray Matter Solutions and IHH Healthcare Singapore.",
    },
    {
      id: "phone",
      label:
        "Also contact me by SMS or phone call, even if my number is on the Do-Not-Call registry.",
      note: "No phone number is collected on this form.",
    },
  ],
  withdrawal:
    "You can withdraw any consent at any time using the unsubscribe link in our emails, by asking our staff, or by emailing {dpo}.",
  footnote: "",
};
