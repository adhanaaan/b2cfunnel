"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { springs, stagger } from "@/lib/motion";
import { Event3Shell } from "./Event3Shell";
import { PartnerLogo } from "./PartnerLogo";
import { ConsentText, ctaPrimaryClass } from "./ui";

interface Event3ConsentProps {
  /** Whether the partner-consent box was ticked. Recorded either way. */
  onSubmit: (partnerConsent: boolean) => void;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

/**
 * Partner consent page for /event-v3 (Figma "Option 2" / Consent): sits
 * between the landing and the instructions, so it is answered before the demo
 * round and the game.
 *
 * IHH's wording is one all-or-nothing agreement, so it is ONE tick over the
 * whole block rather than a tick per clause - the split-tick treatment lives
 * on in the /event-v5 and /event-v6 previews for comparison. /ihhsearegatta
 * puts the same block, under the same single tick, on its landing instead
 * (Event3Splash with design="ihhsearegatta"), so it has no page of this kind.
 *
 * The tick does not gate the CTA. Play is never blocked by a marketing
 * consent; what the player chose is recorded either way (`partner_consent` on
 * `game_scores` and `leads`), so a decline is stored as a decline rather than
 * turning into an abandoned session.
 */
export function Event3Consent({ onSubmit }: Event3ConsentProps) {
  const c = COPY.screens.event3.consent;
  const reduced = useReducedMotion();
  const [agreed, setAgreed] = useState(false);

  return (
    <Event3Shell pills navyPills>
      <motion.div
        className="flex h-full min-h-0 flex-col text-center"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : stagger.items } },
        }}
        initial={reduced ? "show" : "hidden"}
        animate="show"
      >
        <div aria-hidden className="h-[7.5dvh] min-h-0 shrink" />

        <motion.div
          variants={item}
          className="flex items-center justify-center gap-5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gms-ntu-logo.png"
            alt="Gray Matter Solutions, a spin-off from Nanyang Technological University, Singapore"
            className="h-[clamp(24px,3.5dvh,30px)] w-auto"
          />
          <PartnerLogo />
        </motion.div>

        <div aria-hidden className="h-[2.4dvh] min-h-0 shrink" />

        <motion.h1
          variants={item}
          className="text-[clamp(26px,4.3dvh,34.4px)] font-bold leading-[1.07] text-[#171717]"
        >
          {c.heading}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-2.5 text-[clamp(13px,1.9dvh,14.5px)] leading-[1.38] text-[#171717]"
        >
          {c.body}
        </motion.p>

        <motion.p
          variants={item}
          className="mt-4 text-[clamp(10.5px,1.5dvh,12px)] font-bold uppercase tracking-[0.22em] text-ember-core"
        >
          {c.eyebrow}
        </motion.p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(agreed);
          }}
          className="mt-[3.4dvh] flex min-h-0 flex-1 flex-col text-left"
        >
          {/* The clauses take the space that is left and scroll inside it, so
              the CTA is always reachable without the copy running under it. */}
          <motion.div
            variants={item}
            className="flex min-h-0 flex-1 flex-col gap-[1.6dvh] overflow-y-auto pb-2"
          >
            {/* One checkbox, drawn beside the first line, covering every clause
                below it - the same hidden-input + drawn-box pattern as the
                landing, at the larger size this page uses. */}
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={[
                  "mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border transition",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-ember-core/40 peer-focus-visible:ring-offset-1",
                  agreed
                    ? "border-transparent bg-gradient-to-br from-ember-core to-ember-bright"
                    : "border-[#e0c9ba] bg-white",
                ].join(" ")}
              >
                {agreed && (
                  <svg
                    viewBox="0 0 12 12"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.5 6.4 4.8 8.7 9.5 3.7" />
                  </svg>
                )}
              </span>
              <span className="flex flex-col gap-[1.4dvh] text-[11.5px] leading-[1.62] text-secondary">
                {c.clauses.map((clause) => (
                  <span key={clause.text.slice(0, 32)}>
                    <ConsentText text={clause.text} link={clause.link} />
                  </span>
                ))}
              </span>
            </label>

            {/* Not something to agree to - a statement of the right to
                withdraw, so it carries no box of its own. */}
            <p className="pl-8 text-[10.5px] leading-[1.7] text-secondary">
              <ConsentText
                text={c.withdrawal.text}
                link={c.withdrawal.link}
              />
            </p>
          </motion.div>

          <motion.button
            variants={item}
            type="submit"
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={springs.pop}
            className={`${ctaPrimaryClass} mt-[1.8dvh] shrink-0`}
          >
            {c.cta}
          </motion.button>
        </form>

        <div aria-hidden className="h-[2dvh] min-h-0 shrink" />
      </motion.div>
    </Event3Shell>
  );
}
