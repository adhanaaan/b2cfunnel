import Link from "next/link";
import { PRIVACY } from "@/config/privacy";
import type { PolicySection } from "@/config/privacyPolicy";

/**
 * The page's own words, around the policy. Defaults are English, which is what
 * every policy but the Siloam summit's is written in.
 */
export interface PrivacyPolicyChrome {
  back: string;
  /** The title, split so the second word keeps the ember gradient. */
  title: [string, string];
  /** Precedes the date, e.g. "Last updated". */
  lastUpdated: string;
  /** The law the policy is written against, after the date. */
  law: string;
}

const DEFAULT_CHROME: PrivacyPolicyChrome = {
  back: "Back to the challenge",
  title: ["Privacy", "Policy"],
  lastUpdated: "Last updated",
  law: "Singapore Personal Data Protection Act 2012",
};

interface PrivacyPolicyDocumentProps {
  /** The policy's sections, in order (see config/privacyPolicy.ts). */
  sections: PolicySection[];
  /** Where "Back to the challenge" returns to: the landing that linked here. */
  backHref: string;
  /**
   * The words around the policy, for a document not written in English or not
   * written against the PDPA. Omitted everywhere but the Siloam summit, which
   * is the only policy on this site under another country's law.
   */
  chrome?: PrivacyPolicyChrome;
  /** Rendered above the title - the summit's language toggle. */
  toolbar?: React.ReactNode;
}

/**
 * A privacy policy, rendered as a document in the event-v3 "Daylight Ember"
 * system - the same cream radial backdrop, ember accents and Plus Jakarta Sans
 * as the arena screens - but scrollable, since it is a document rather than
 * one of the locked screens. Shared by every policy the site serves, so they
 * differ only in what they say.
 */
export function PrivacyPolicyDocument({
  sections,
  backHref,
  chrome = DEFAULT_CHROME,
  toolbar,
}: PrivacyPolicyDocumentProps) {
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
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-ember-core transition hover:opacity-75"
        >
          <span aria-hidden>←</span> {chrome.back}
        </Link>

        {toolbar && <div className="mt-6">{toolbar}</div>}

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-ember-core">
          {PRIVACY.organisation}
        </p>
        <h1 className="mt-3 text-[2.15rem] font-bold leading-[1.07] text-[#171717]">
          {chrome.title[0]}{" "}
          <span className="bg-gradient-to-b from-[#e8782e] via-[#f09452] to-[#ffbb88] bg-clip-text text-transparent">
            {chrome.title[1]}
          </span>
        </h1>
        <p className="mt-3 text-sm text-outline">
          {chrome.lastUpdated} {PRIVACY.lastUpdated} · {chrome.law}
        </p>

        <div className="mt-8 space-y-4">
          {sections.map((section) => (
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
