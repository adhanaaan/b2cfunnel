import { PRIVACY } from "@/config/privacy";

/**
 * The privacy policies, as data: one for the Reaction Time Challenge and Brain
 * Health Check in general (/privacy-policy), one for the IHH SEA Regatta
 * (/ihhsearegatta/privacy-policy), whose landing shares what it collects with
 * the event partner and whose policy therefore has to say so.
 *
 * Both are written against Singapore's PDPA 2012 and against what the funnel
 * actually stores (see /api/lead, /api/score, /api/newsletter and
 * /api/response). The sections the two have in common are defined once, so a
 * correction to either reaches both; the sections that differ are written out
 * in full, because legal text has to be readable top to bottom.
 */

export type PolicyBlock =
  | string
  | { list: string[] }
  | { table: [string, string][] };

export interface PolicySection {
  heading: string;
  /** Paragraphs, lists and term/detail tables, rendered in order. */
  blocks: PolicyBlock[];
}

// ---------------------------------------------------------------------------
// Shared sections
// ---------------------------------------------------------------------------

const WHAT_WE_COLLECT: PolicySection = {
  heading: "2. What we collect",
  blocks: [
    "We only collect what the experience needs. Specifically:",
    {
      table: [
        [
          "What you type in",
          "Your name and an email address, plus the consent choices you make on the first screen.",
        ],
        [
          "How you played",
          "Your reaction-time result, your best time, and your position on the leaderboard. Your name and time are shown on the leaderboard for other players at the event to see.",
        ],
        [
          "Your quiz answers (optional)",
          "If you go on to the Brain Health Check: your age band and sex, whether you have been told you have high blood pressure, high cholesterol or high blood sugar, lifestyle answers on smoking, sleep, exercise, diet and alcohol, and self-reported changes in memory, concentration and judgement.",
        ],
        [
          "What we work out from that",
          "Your Brain Health Score, the band it falls in, and the profile of factors behind it.",
        ],
        [
          "Technical data",
          "Your browser's user-agent string, and a random session identifier stored in your browser so we can measure where people stop, without knowing who they are.",
        ],
      ],
    },
    "We do not collect your NRIC or FIN, your address, your phone number, or any payment details through this experience. We do not use third-party advertising trackers, and we do not build advertising profiles.",
  ],
};

const WHY_WE_USE_IT: PolicySection = {
  heading: "3. Why we use it",
  blocks: [
    "We use your personal data for these purposes, and no others:",
    {
      list: [
        "To show you your reaction time and, if you take it, your Brain Health Score.",
        "To place you on the event leaderboard, using your name and your time.",
        "To email you your results and the recommendations that go with them.",
        "To contact you if you win the prize.",
        "To answer you if you write to us.",
        "To understand, in aggregate, who took part and how far people got, so we can improve the experience. This analysis does not use your name or email.",
        "To send you brain health tips and updates, but only if you ticked that second box.",
        "To meet our legal and regulatory obligations.",
      ],
    },
  ],
};

const TRANSFERS: PolicySection = {
  heading: "9. Transfers outside Singapore",
  blocks: [
    "Our hosting and database providers may store or process personal data on servers outside Singapore. Where that happens, we take steps to ensure the recipient is bound to a standard of protection comparable to the PDPA, as the Transfer Limitation Obligation requires.",
  ],
};

const COOKIES: PolicySection = {
  heading: "10. Cookies and measurement",
  blocks: [
    "We do not use advertising or tracking cookies. We store a randomly generated session identifier in your browser so we can count how many people reach each step and where they stop. It is not linked to your name or email, and it is cleared when you close the tab.",
  ],
};

const CHILDREN: PolicySection = {
  heading: "11. Children",
  blocks: [
    "This experience is intended for adults. If you are under 18, please play only with the consent of a parent or guardian. If you believe a child has given us personal data without that consent, write to us and we will delete it.",
  ],
};

const CHANGES: PolicySection = {
  heading: "12. Changes to this policy",
  blocks: [
    `We may update this policy as the experience changes. The date at the top tells you when it was last revised, and the version shown here is always the current one. This policy was last updated on ${PRIVACY.lastUpdated}.`,
  ],
};

const CONTACT: PolicySection = {
  heading: "13. How to contact us",
  blocks: [
    `For anything about your personal data, including access, correction, deletion or withdrawing consent, write to our Data Protection Officer at ${PRIVACY.dpoEmail}.`,
    "If you are not satisfied with how we have handled your request, you may raise the matter with Singapore's Personal Data Protection Commission at pdpc.gov.sg.",
  ],
};

// The opening two paragraphs of "About this policy" and the first two of
// "Consent" are word for word the same in both policies.
const ABOUT_INTRO = `${PRIVACY.organisation} (${PRIVACY.organisationNote}) runs the Reaction Time Challenge and the Brain Health Check. In this policy, “we” and “us” mean ${PRIVACY.organisation}, and “personal data” has the meaning given to it in Singapore’s Personal Data Protection Act 2012 (the “PDPA”).`;

const ABOUT_SCOPE =
  "This policy explains what we collect when you play, why we collect it, who we share it with, how long we keep it, and how you can get it back, correct it or have it deleted. It applies to this website and to the event booth experience it powers.";

const CONSENT_INTRO: PolicyBlock[] = [
  "We collect and use your personal data on the basis of the consent you give on the first screen. There are two separate choices there, and they do different things.",
  {
    list: [
      "Agreeing to be contacted about your results and the prize is required to play, because it is what lets us send you your result and reach you if you win.",
      "Agreeing to receive brain health tips and updates is entirely optional. Declining it does not change your experience or your standing on the leaderboard.",
    ],
  },
];

const CONSENT_OUTRO: PolicyBlock[] = [
  "Withdrawing consent does not make anything we did beforehand unlawful, and it does not require us to delete data we are legally required to keep. If you also want your data deleted, tell us and we will treat it as a deletion request under section 6 below.",
  "We only send marketing by email, and only to people who asked for it.",
];

const RIGHTS_INTRO: PolicyBlock[] = [
  "Under the PDPA you may ask us for a copy of the personal data we hold about you and information about how it has been used or disclosed in the past year, and you may ask us to correct anything that is wrong or incomplete.",
  `Write to our Data Protection Officer at ${PRIVACY.dpoEmail}. We will respond as soon as we reasonably can, and in any case within 30 days. If we cannot meet that timeline we will tell you when to expect a response. We may need to verify your identity first, and a reasonable fee may apply to an access request, which we will tell you about before we start.`,
];

const RETENTION_OUTRO =
  "We stop keeping personal data once the purpose it was collected for no longer applies and we have no legal or business reason to retain it.";

const PROTECT_INTRO =
  "Data is sent over an encrypted connection and stored in access-controlled systems, with access limited to the people who need it for the purposes described above. We review these arrangements as the experience changes.";

const DISCLOSURE_BY_LAW =
  "We may also disclose personal data where the law requires it, where it is necessary to investigate a suspected breach or to establish or defend a legal claim, or in any other circumstance permitted under the PDPA.";

const EVENT_PARTNER_NOTE =
  "If the challenge is run together with an event partner, we tell you at the booth before you play, and any sharing is limited to what that partner needs for the event itself.";

// ---------------------------------------------------------------------------
// The general policy (/privacy-policy)
// ---------------------------------------------------------------------------

export const PRIVACY_POLICY_SECTIONS: PolicySection[] = [
  {
    heading: "1. About this policy",
    blocks: [
      ABOUT_INTRO,
      ABOUT_SCOPE,
      "The Brain Health Check is an educational tool. It is not a medical diagnosis, and the results are not medical records.",
    ],
  },
  WHAT_WE_COLLECT,
  WHY_WE_USE_IT,
  {
    heading: "4. Consent, and how to withdraw it",
    blocks: [
      ...CONSENT_INTRO,
      `You can withdraw either consent at any time by emailing ${PRIVACY.dpoEmail}, or by using the unsubscribe link in any email we send you. We will act on it within a reasonable time and tell you the likely consequences: if you withdraw consent to be contacted, we can no longer send you your results or notify you about the prize.`,
      ...CONSENT_OUTRO,
    ],
  },
  {
    heading: "5. Who we share it with",
    blocks: [
      "We do not sell your personal data, and we do not share it for anyone else's marketing.",
      "We do share it with service providers who process it on our behalf, as data intermediaries under the PDPA, and only so far as they need it to do their job for us: our website hosting provider, and the managed database that stores results and leaderboard entries. They are bound to protect it and to use it only on our instructions.",
      DISCLOSURE_BY_LAW,
      EVENT_PARTNER_NOTE,
    ],
  },
  {
    heading: "6. Your rights: access, correction and deletion",
    blocks: [
      ...RIGHTS_INTRO,
      "You can also ask us to delete your personal data, including removing your entry from the leaderboard. We will do so unless we are required to keep it.",
    ],
  },
  {
    heading: "7. How long we keep it",
    blocks: [
      {
        table: [
          [
            "Leaderboard entries and game times",
            `Kept for ${PRIVACY.retention.leaderboard}.`,
          ],
          [
            "Your name, email and quiz answers",
            `Kept for ${PRIVACY.retention.contact}.`,
          ],
          [
            "Anonymised, aggregate statistics",
            `Kept ${PRIVACY.retention.aggregates}.`,
          ],
        ],
      },
      RETENTION_OUTRO,
    ],
  },
  {
    heading: "8. How we protect it",
    blocks: [
      PROTECT_INTRO,
      "No system is perfectly secure, but if a data breach occurs that is likely to result in significant harm to you, or that is of a significant scale, we will notify you and the Personal Data Protection Commission in line with the PDPA's breach notification requirements.",
    ],
  },
  TRANSFERS,
  COOKIES,
  CHILDREN,
  CHANGES,
  CONTACT,
];

// ---------------------------------------------------------------------------
// The IHH SEA Regatta policy (/ihhsearegatta/privacy-policy)
// ---------------------------------------------------------------------------

/** The partner named throughout the regatta policy. */
const IHH = "IHH Healthcare Singapore";
const IHH_NOTICE = "IHH Singapore Personal Data Protection Notice";

/**
 * The regatta's landing shares what it collects with IHH, under the partner's
 * own consent, so its policy differs from the general one wherever the partner
 * comes into it: what GMS's policy covers and what IHH's does, the sharing
 * itself, whose retention and deletion apply to which copy, and how a breach
 * is notified. Everything else is the general policy, word for word.
 */
export const IHHSEA_PRIVACY_POLICY_SECTIONS: PolicySection[] = [
  {
    heading: "1. About this policy",
    blocks: [
      ABOUT_INTRO,
      `This policy explains how ${PRIVACY.organisation} (“GMS”) handles personal data through ReCOGnAIze Lite. ${IHH} separately handles the personal data it receives in accordance with the ${IHH_NOTICE}.`,
      ABOUT_SCOPE,
      `The Brain Health Check is an educational tool. It is not a medical diagnosis. IHH may handle the information and results it receives as health information in accordance with the ${IHH_NOTICE}.`,
    ],
  },
  WHAT_WE_COLLECT,
  WHY_WE_USE_IT,
  {
    heading: "4. Consent, and how to withdraw it",
    blocks: [
      ...CONSENT_INTRO,
      `You can withdraw either consent at any time by emailing ${PRIVACY.dpoEmail}, or by using the unsubscribe link in any email we send you. We will act on it within a reasonable time and tell you the likely consequences: if you withdraw consent to be contacted, we can no longer send you your results or notify you about the prize. Your GMS marketing choice applies only to communications from GMS; IHH manages its own communications and marketing preferences under its privacy notice.`,
      ...CONSENT_OUTRO,
    ],
  },
  {
    heading: "5. Who we share it with",
    blocks: [
      "We do not sell your personal data, and we do not share it for anyone else's marketing.",
      "We share personal data with service providers that process it on our behalf, as data intermediaries under the PDPA. These include our website hosting provider, managed database provider, and email-delivery or marketing platform. They may process personal data only as necessary to provide their services to us, are required to protect it, and must follow our instructions.",
      `We share your name, email address, reaction-time results, leaderboard information, optional quiz answers, Brain Health Score and factor profile with ${IHH} for the administration of ReCOGnAIze Lite and participant follow-up. IHH handles the personal data and results it receives, including their use, disclosure, retention and related requests, in accordance with the ${IHH_NOTICE}.`,
      DISCLOSURE_BY_LAW,
      EVENT_PARTNER_NOTE,
    ],
  },
  {
    heading: "6. Your rights: access, correction and deletion",
    blocks: [
      ...RIGHTS_INTRO,
      "You may also ask GMS to delete your personal data, including your leaderboard entry. We will assess the request and delete or anonymise the data where it is no longer required for a legal or business purpose. Requests made to GMS apply only to data under GMS’s possession or control. Requests regarding data held independently by IHH should be submitted directly to IHH.",
    ],
  },
  {
    heading: "7. How long we keep it",
    blocks: [
      {
        table: [
          [
            "Leaderboard entries and game times",
            "Kept for the run of the event and up to 6 months afterwards.",
          ],
          [
            "Your name, email and quiz answers",
            "Kept for up to 24 months from your last interaction with GMS, unless deleted earlier following a request or retained longer where required for a legal or business purpose. These retention periods apply only to data held by GMS and its service providers; IHH retains its copy in accordance with its own privacy notice.",
          ],
          [
            "Anonymised, aggregate statistics",
            "Kept indefinitely, once they can no longer identify you.",
          ],
        ],
      },
      RETENTION_OUTRO,
    ],
  },
  {
    heading: "8. How we protect it",
    blocks: [
      PROTECT_INTRO,
      // The supplied text left this sentence unfinished after "of a significant
      // scale," and began a new one at "If a data breach is notifiable"; the two
      // are joined here into one sentence, keeping both halves as written.
      "No system is perfectly secure, but if a data breach occurs that is likely to result in significant harm to you, or that is of a significant scale, and is notifiable under the PDPA, we will notify the Personal Data Protection Commission and, where required, affected individuals within the applicable time limits.",
    ],
  },
  TRANSFERS,
  COOKIES,
  CHILDREN,
  CHANGES,
  CONTACT,
];
