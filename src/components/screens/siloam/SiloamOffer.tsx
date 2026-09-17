"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SILOAM_OFFER_SECTION_ID } from "@/config/eventLinks";
import { boothReportFor } from "@/config/copy";
import { track } from "@/lib/analytics";
import { springs } from "@/lib/motion";
import { useCopy } from "@/components/LanguageContext";
import { useVariant } from "@/components/VariantContext";
import { Reveal, reportCard, reportEyebrow, reportHeading } from "../phkl/ui";

/**
 * The close on the booth report, in place of /phkl's Memory Screening Package.
 *
 * Two events draw it - the Siloam summit and 22 Grams - so it reads whichever
 * one is being walked through `boothReportFor` rather than naming a block. The
 * summit invites people to a stand ten metres away; /22grams is a coffee
 * counter at Frasers Tower, and printing the summit's line there would send
 * players looking for a booth that is not in the building.
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
  const variant = useVariant();
  const c = boothReportFor(variant, useCopy()).offer;
  const reduced = useReducedMotion();
  // Whether the reader has said they are interested. Only ever true on an
  // event whose copy has a thank-you to give them - see `ctaThanks`.
  const [interested, setInterested] = useState(false);

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

      {/* The call to action. Where the event has a thank-you to give, it is a
          real button and the tap is answered in place; where it has none
          (the summit: nowhere to send anyone, and the team is in the room),
          it stays the instruction it reads as. */}
      <Reveal className="mt-6">
        <AnimatePresence mode="wait" initial={false}>
          {c.ctaThanks && interested ? (
            <motion.p
              key="thanks"
              role="status"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springs.enter}
              className="flex min-h-[54px] w-full items-center justify-center rounded-full bg-[#fff1e6] px-8 py-3 text-center text-base font-bold tracking-[0.025em] text-[#b4460f]"
            >
              {c.ctaThanks}
            </motion.p>
          ) : c.ctaThanks ? (
            <motion.button
              key="cta"
              type="button"
              onClick={() => {
                track("interest_click", { variant, step: "report_offer" });
                setInterested(true);
              }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
              transition={springs.pop}
              className="flex min-h-[54px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff8a1f] via-[#f9550f] to-[#d62f16] px-8 py-3 text-center text-base font-bold tracking-[0.025em] text-white shadow-[0_14px_34px_-14px_rgba(214,47,22,0.6)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d62f16]"
            >
              {c.cta}
            </motion.button>
          ) : (
            <p className="flex min-h-[54px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff8a1f] via-[#f9550f] to-[#d62f16] px-8 py-3 text-center text-base font-bold tracking-[0.025em] text-white shadow-[0_14px_34px_-14px_rgba(214,47,22,0.6)]">
              {c.cta}
            </p>
          )}
        </AnimatePresence>
        <p className="mt-4 text-center text-[11px] leading-[1.6] text-[#b79c8e]">
          {c.credibility}
        </p>
      </Reveal>
    </section>
  );
}
