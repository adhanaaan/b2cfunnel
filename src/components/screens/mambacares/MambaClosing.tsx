"use client";

import { runCopyFor } from "@/config/copy";
import { campaignAmount, communityRunFor } from "@/config/communityRun";
import { useVariant } from "@/components/VariantContext";
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
  const variant = useVariant();
  const run = communityRunFor(variant);
  const c = runCopyFor(variant).report.closing;

  return (
    <section className="bg-[#fff8f3] px-6 pb-12 pt-12">
      <Reveal>
        <h2 className={`text-balance ${reportHeading}`}>{c.heading}</h2>
      </Reveal>

      <Reveal className="mt-6">
        <p className="text-[15px] leading-[1.6] text-[#41586b]">
          {c.body
            .replace("{goal}", campaignAmount(run, run.campaign.goal))
            .replace("{deadline}", run.campaign.deadline)}
        </p>
      </Reveal>

      <Reveal className="mt-7">
        <CampaignPhoto src={run.photos.closing} className="aspect-[16/9]" />
      </Reveal>

      <Reveal className="mt-7">
        <DonateActions placement="closing" share={share} />
      </Reveal>
    </section>
  );
}
