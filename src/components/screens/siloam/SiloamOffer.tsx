"use client";

import { SILOAM_OFFER_SECTION_ID } from "@/config/eventLinks";
import { useCopy } from "@/components/LanguageContext";
import { Reveal, reportCard, reportEyebrow, reportHeading } from "../phkl/ui";

/**
 * The close on the Siloam summit's report, in place of /phkl's Memory
 * Screening Package.
 *
 * This is NTU Homecoming's ending (`Event2Closing`), rebuilt in the PHKL
 * report's vocabulary so it sits on the same sheet as the sections above it:
 * the ReCOGnAIze assessment as the next step, what it is, and the team at the
 * booth to take it from there.
 *
 * There is no price, no poster and NOTHING TO CLICK THROUGH TO, and that is
 * the point rather than an omission. /phkl's buttons open a Malaysian booking
 * form; there is no Indonesian equivalent to send a reader to, and a button
 * that opened the Malaysian one would be worse than no button. The last line
 * is an instruction to walk ten metres, which at a summit is a shorter journey
 * than any form.
 */
export function SiloamOffer() {
  const c = useCopy().screens.siloam.report.offer;

  return (
    <section
      id={SILOAM_OFFER_SECTION_ID}
      className="scroll-mt-4 bg-[#fff8f3] px-6 pb-12 pt-11"
    >
      <Reveal>
        <p className={reportEyebrow}>{c.eyebrow}</p>
        <h2 className={`mt-6 text-balance ${reportHeading}`}>{c.heading}</h2>
        <p className="mt-6 text-base leading-[1.6] text-[#41586b]">{c.body}</p>
        <p className="mt-3 text-[14.5px] leading-[1.58] text-[#6b5245]">
          {c.reassurance}
        </p>
      </Reveal>

      <Reveal className="mt-7">
        <div className={`${reportCard} px-7 py-7`}>
          <p className="text-[19px] font-extrabold leading-[1.3] tracking-[-0.01em] text-[#1c110a]">
            {c.offerName}
          </p>
          <ul className="mt-4 space-y-3">
            {c.offerPoints.map((point) => (
              <li
                key={point}
                className="flex gap-3 text-[14.5px] leading-[1.58] text-[#5f4638]"
              >
                <span
                  aria-hidden
                  className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#ff8a1f] to-[#d62f16]"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* The call to action itself. Not a link and not a button: there is
          nowhere to send anyone, so it reads as the instruction it is. */}
      <Reveal className="mt-6">
        <p className="flex min-h-[54px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff8a1f] via-[#f9550f] to-[#d62f16] px-8 py-3 text-center text-base font-bold tracking-[0.025em] text-white shadow-[0_14px_34px_-14px_rgba(214,47,22,0.6)]">
          {c.cta}
        </p>
        <p className="mt-4 text-center text-[11px] leading-[1.6] text-[#b79c8e]">
          {c.credibility}
        </p>
      </Reveal>
    </section>
  );
}
