"use client";

import { COPY } from "@/config/copy";
import {
  MAMBACARES_CAMPAIGN,
  MAMBACARES_PHOTOS,
  campaignAmount,
} from "@/config/mambacares";
import { Reveal, reportHeading } from "@/components/screens/phkl/ui";
import { CampaignPhoto, DonateActions } from "./ui";

/**
 * "One minute before you go." (Figma 775:17758) - the last ask, after the risk
 * report has had its say. Same two buttons as the campaign section above, on
 * purpose: a reader who scrolled past the first ask meets the identical one at
 * the end rather than a new argument to work through.
 */
export function MambaClosing({
  share,
}: {
  share: { share: () => void; sharing: boolean; note: string | null };
}) {
  const c = COPY.screens.mambacares.report.closing;

  return (
    <section className="bg-[#fff8f3] px-6 pb-12 pt-12">
      <Reveal>
        <h2 className={`text-balance ${reportHeading}`}>{c.heading}</h2>
      </Reveal>

      <Reveal className="mt-6">
        <p className="text-[15px] leading-[1.6] text-[#41586b]">
          {c.body
            .replace("{goal}", campaignAmount(MAMBACARES_CAMPAIGN.goal))
            .replace("{deadline}", MAMBACARES_CAMPAIGN.deadline)}
        </p>
      </Reveal>

      <Reveal className="mt-7">
        <CampaignPhoto src={MAMBACARES_PHOTOS.closing} className="aspect-[16/9]" />
      </Reveal>

      <Reveal className="mt-7">
        <DonateActions placement="closing" share={share} />
      </Reveal>
    </section>
  );
}
