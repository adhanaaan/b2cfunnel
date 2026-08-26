import type { Metadata } from "next";
import Link from "next/link";
import { PRIVACY } from "@/config/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | Brain Health Check",
  description:
    "How Gray Matter Solutions collects, uses, discloses and protects personal data in the Reaction Time Challenge and Brain Health Check, under Singapore's Personal Data Protection Act 2012.",
};

/**
 * Privacy policy for the Reaction Time Challenge and Brain Health Check,
 * written against Singapore's PDPA 2012 and against what the funnel actually
 * stores (see /api/lead, /api/score, /api/newsletter and /api/response).
 *
 * Styled in the event-v3 "Daylight Ember" system - the same cream radial
 * backdrop, ember accents and Plus Jakarta Sans as the arena screens - but
 * scrollable, since it is a document rather than one of the locked screens.
 */

interface Section {
  heading: string;
  /** Paragraphs and lists, rendered in order. */
  blocks: (string | { list: string[] } | { table: [string, string][] })[];
}

const SECTIONS: Section[] = [
  {
    heading: "1. About this policy",
    blocks: [
      `${PRIVACY.organisation} (${PRIVACY.organisationNote}) runs the Reaction Time Challenge and the Brain Health Check. In this policy, “we” and “us” mean ${PRIVACY.organisation}, and “personal data” has the meaning given to it in Singapore’s Personal Data Protection Act 2012 (the “PDPA”).`,
      "This policy explains what we collect when you play, why we collect it, who we share it with, how long we keep it, and how you can get it back, correct it or have it deleted. It applies to this website and to the event booth experience it powers.",
      "The Brain Health Check is an educational tool. It is not a medical diagnosis, and the results are not medical records.",
    ],
  },
  {
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
  },
  {
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
  },
  {
    heading: "4. Consent, and how to withdraw it",
    blocks: [
      "We collect and use your personal data on the basis of the consent you give on the first screen. There are two separate choices there, and they do different things.",
      {
        list: [
          "Agreeing to be contacted about your results and the prize is required to play, because it is what lets us send you your result and reach you if you win.",
          "Agreeing to receive brain health tips and updates is entirely optional. Declining it does not change your experience or your standing on the leaderboard.",
        ],
      },
      `You can withdraw either consent at any time by emailing ${PRIVACY.dpoEmail}, or by using the unsubscribe link in any email we send you. We will act on it within a reasonable time and tell you the likely consequences: if you withdraw consent to be contacted, we can no longer send you your results or notify you about the prize.`,
      "Withdrawing consent does not make anything we did beforehand unlawful, and it does not require us to delete data we are legally required to keep. If you also want your data deleted, tell us and we will treat it as a deletion request under section 6 below.",
      "We only send marketing by email, and only to people who asked for it.",
    ],
  },
  {
    heading: "5. Who we share it with",
    blocks: [
      "We do not sell your personal data, and we do not share it for anyone else's marketing.",
      "We do share it with service providers who process it on our behalf, as data intermediaries under the PDPA, and only so far as they need it to do their job for us: our website hosting provider, and the managed database that stores results and leaderboard entries. They are bound to protect it and to use it only on our instructions.",
      "We may also disclose personal data where the law requires it, where it is necessary to investigate a suspected breach or to establish or defend a legal claim, or in any other circumstance permitted under the PDPA.",
      "If the challenge is run together with an event partner, we tell you at the booth before you play, and any sharing is limited to what that partner needs for the event itself.",
    ],
  },
  {
    heading: "6. Your rights: access, correction and deletion",
    blocks: [
      "Under the PDPA you may ask us for a copy of the personal data we hold about you and information about how it has been used or disclosed in the past year, and you may ask us to correct anything that is wrong or incomplete.",
      `Write to our Data Protection Officer at ${PRIVACY.dpoEmail}. We will respond as soon as we reasonably can, and in any case within 30 days. If we cannot meet that timeline we will tell you when to expect a response. We may need to verify your identity first, and a reasonable fee may apply to an access request, which we will tell you about before we start.`,
      "You can also ask us to delete your personal data, including removing your entry from the leaderboard. We will do so unless we are required to keep it.",
    ],
  },
  {
    heading: "7. How long we keep it",
    blocks: [
      {
        table: [
          ["Leaderboard entries and game times", `Kept for ${PRIVACY.retention.leaderboard}.`],
          ["Your name, email and quiz answers", `Kept for ${PRIVACY.retention.contact}.`],
          ["Anonymised, aggregate statistics", `Kept ${PRIVACY.retention.aggregates}.`],
        ],
      },
      "We stop keeping personal data once the purpose it was collected for no longer applies and we have no legal or business reason to retain it.",
    ],
  },
  {
    heading: "8. How we protect it",
    blocks: [
      "Data is sent over an encrypted connection and stored in access-controlled systems, with access limited to the people who need it for the purposes described above. We review these arrangements as the experience changes.",
      "No system is perfectly secure, but if a data breach occurs that is likely to result in significant harm to you, or that is of a significant scale, we will notify you and the Personal Data Protection Commission in line with the PDPA's breach notification requirements.",
    ],
  },
  {
    heading: "9. Transfers outside Singapore",
    blocks: [
      "Our hosting and database providers may store or process personal data on servers outside Singapore. Where that happens, we take steps to ensure the recipient is bound to a standard of protection comparable to the PDPA, as the Transfer Limitation Obligation requires.",
    ],
  },
  {
    heading: "10. Cookies and measurement",
    blocks: [
      "We do not use advertising or tracking cookies. We store a randomly generated session identifier in your browser so we can count how many people reach each step and where they stop. It is not linked to your name or email, and it is cleared when you close the tab.",
    ],
  },
  {
    heading: "11. Children",
    blocks: [
      "This experience is intended for adults. If you are under 18, please play only with the consent of a parent or guardian. If you believe a child has given us personal data without that consent, write to us and we will delete it.",
    ],
  },
  {
    heading: "12. Changes to this policy",
    blocks: [
      `We may update this policy as the experience changes. The date at the top tells you when it was last revised, and the version shown here is always the current one. This policy was last updated on ${PRIVACY.lastUpdated}.`,
    ],
  },
  {
    heading: "13. How to contact us",
    blocks: [
      `For anything about your personal data, including access, correction, deletion or withdrawing consent, write to our Data Protection Officer at ${PRIVACY.dpoEmail}.`,
      "If you are not satisfied with how we have handled your request, you may raise the matter with Singapore's Personal Data Protection Commission at pdpc.gov.sg.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="relative isolate min-h-dvh px-5 pb-16 pt-8 text-charcoal">
      {/* Same daylight backdrop as the arena screens, fixed so overscroll
          never reveals a pale band. */}
      <div
        aria-hidden
        className="event3-daylight pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#fde68a]/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#f9c89a]/35 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/event-v3"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-ember-core transition hover:opacity-75"
        >
          <span aria-hidden>←</span> Back to the challenge
        </Link>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-ember-core">
          {PRIVACY.organisation}
        </p>
        <h1 className="mt-3 text-[2.15rem] font-bold leading-[1.07] text-[#171717]">
          Privacy{" "}
          <span className="bg-gradient-to-b from-[#e8782e] via-[#f09452] to-[#ffbb88] bg-clip-text text-transparent">
            Policy
          </span>
        </h1>
        <p className="mt-3 text-sm text-outline">
          Last updated {PRIVACY.lastUpdated} · Singapore Personal Data
          Protection Act 2012
        </p>

        <div className="mt-8 space-y-4">
          {SECTIONS.map((section) => (
            <section
              key={section.heading}
              className="rounded-2xl bg-[#fdfaf7]/85 px-5 py-6 shadow-[0_2px_16px_-8px_rgba(51,18,0,0.18)] backdrop-blur-[2px] sm:px-7"
            >
              <h2 className="text-lg font-bold leading-snug text-[#171717]">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.blocks.map((block, i) => {
                  if (typeof block === "string") {
                    return (
                      <p key={i} className="text-[15px] leading-relaxed text-secondary">
                        {block}
                      </p>
                    );
                  }
                  if ("list" in block) {
                    return (
                      <ul key={i} className="space-y-2">
                        {block.list.map((entry) => (
                          <li key={entry} className="flex gap-3">
                            <span
                              aria-hidden
                              className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-ember-core"
                            />
                            <span className="text-[15px] leading-relaxed text-secondary">
                              {entry}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <dl key={i} className="space-y-2.5">
                      {block.table.map(([term, detail]) => (
                        <div
                          key={term}
                          className="rounded-xl bg-white/70 px-4 py-3"
                        >
                          <dt className="text-[13px] font-bold text-[#171717]">
                            {term}
                          </dt>
                          <dd className="mt-1 text-[14.5px] leading-relaxed text-secondary">
                            {detail}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gms-ntu-logo.png"
            alt="Gray Matter Solutions - a spin-off from Nanyang Technological University, Singapore"
            className="h-9 w-auto"
          />
          <p className="text-center text-xs text-outline">
            © {new Date().getFullYear()} {PRIVACY.organisation}
          </p>
        </div>
      </div>
    </main>
  );
}
