"use client";

import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import {
  MAMBACARES_CAMPAIGN,
  MAMBACARES_PHOTOS,
  campaignAmount,
  campaignProgress,
} from "@/config/mambacares";
import { ease } from "@/lib/motion";
import { Reveal, reportEyebrow, reportHeading } from "@/components/screens/phkl/ui";
import { CampaignPhoto, DonateActions } from "./ui";

/** The campaign thermometer: what has been raised, against the goal. */
function CampaignProgress() {
  const c = COPY.screens.mambacares.report.donate;
  const reduced = useReducedMotion();
  const raised = campaignAmount(MAMBACARES_CAMPAIGN.raised);
  const goal = campaignAmount(MAMBACARES_CAMPAIGN.goal);
  const pct = campaignProgress();

  // "$1,120 raised of $5,000" - the raised figure carries the emphasis, so it
  // is split out of the line rather than styled by matching on its text.
  const [before, after] = c.progressLabel.split("{raised}");

  return (
    <div className="rounded-[18px] border border-[#f2ddce] bg-white px-5 py-[18px] shadow-[0_14px_36px_-26px_rgba(90,40,10,0.3)]">
      <p className="text-[17px] leading-[1.45] text-[#41586b]">
        {before}
        <span className="text-[21px] font-extrabold text-[#d62f16]">{raised}</span>
        {after.replace("{goal}", goal)}
      </p>
      <div
        className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-[#f6e0d3]"
        role="img"
        aria-label={`${raised} raised of ${goal}`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#ff8a1f] via-[#f9550f] to-[#d62f16]"
          initial={reduced ? false : { width: 0 }}
          whileInView={{ width: `${Math.round(pct * 100)}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: ease.out }}
          style={reduced ? { width: `${Math.round(pct * 100)}%` } : undefined}
        />
      </div>
      <p className="mt-2.5 text-[11.5px] text-[#a8877a]">
        {c.progressUpdated.replace(
          "{lastUpdated}",
          MAMBACARES_CAMPAIGN.lastUpdated,
        )}
      </p>
    </div>
  );
}

/**
 * The campaign itself (Figma 775:17641): World Alzheimer's Month, the ask
 * measured against the round they just played, the thermometer, who is behind
 * the run, two photographs from Dementia Singapore's work, and the buttons.
 *
 * The heading quotes the player's own time in whole seconds - "It took you 18
 * seconds. Donating takes a minute." - which is the whole argument of the
 * section, so a session with no time falls back to a line that does not
 * pretend to have one.
 */
export function MambaDonate({
  timeMs,
  share,
}: {
  timeMs?: number;
  share: { share: () => void; sharing: boolean; note: string | null };
}) {
  const c = COPY.screens.mambacares.report.donate;
  const goal = campaignAmount(MAMBACARES_CAMPAIGN.goal);
  const heading =
    timeMs != null
      ? c.heading.replace("{seconds}", String(Math.round(timeMs / 1000)))
      : c.headingAnonymous;

  return (
    <section className="bg-[#fff8f3] px-6 pb-12 pt-11">
      <Reveal>
        <p className={reportEyebrow}>{c.eyebrow}</p>
        <h2 className={`mt-5 text-balance ${reportHeading}`}>{heading}</h2>
      </Reveal>

      <Reveal className="mt-6">
        <CampaignProgress />
      </Reveal>

      {c.paragraphs.map((para, i) => (
        <Reveal key={para} className={i === 0 ? "mt-7" : "mt-4"}>
          <p className="text-[15px] leading-[1.6] text-[#41586b]">
            {para.replace("{goal}", goal)}
          </p>
        </Reveal>
      ))}

      <Reveal className="mt-7">
        {/* The pair runs past the section's right edge in Figma; here it is a
            two-up that fits, so nothing is cropped away on a narrow phone. */}
        <div className="grid grid-cols-2 gap-3">
          {MAMBACARES_PHOTOS.campaignPair.map((src) => (
            <CampaignPhoto key={src} src={src} className="aspect-[16/9]" />
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-8">
        <DonateActions placement="donate-section" share={share} />
      </Reveal>
    </section>
  );
}
