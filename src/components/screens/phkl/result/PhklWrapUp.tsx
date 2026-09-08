"use client";

import { COPY } from "@/config/copy";
import { Reveal, SerifParts } from "../ui";

/**
 * R7 (Figma 697:25241): a word from someone who went on to the full test,
 * a soft close for anyone not ready, the research credit, and the "speak to a
 * doctor" line. This report does not carry the shared ComplianceFooter: the
 * "educational tool, not a medical diagnosis" line was dropped from the PHKL
 * report at the client's request, so only the doctor line closes it.
 */
export function PhklWrapUp({ ageBand }: { ageBand?: string }) {
  const c = COPY.screens.phkl.report.wrapUp;
  const attribution =
    ageBand === c.attributionAgeBand ? c.attributionPeer : c.attribution;

  return (
    <section className="bg-[#fff8f3] px-6 pb-32 pt-8">
      <Reveal>
        <span aria-hidden className="block text-[64px] font-extrabold leading-none text-[#f2ddce]">
          “
        </span>
        <blockquote className="mt-4 text-[21px] leading-[1.55] tracking-[-0.01em] text-[#1c110a]">
          <SerifParts parts={c.quoteParts} />
        </blockquote>
        <p className="mt-5 text-[14.5px] leading-[1.58] text-[#8a6a58]">{attribution}</p>
      </Reveal>

      <Reveal className="mt-8">
        <div className="rounded-[26px] border border-[#eedacd] bg-[#fffdfb] px-7 py-7">
          <h3 className="text-[21px] font-extrabold leading-[1.3] tracking-[-0.015em] text-[#1c110a]">
            {c.thinkingHeading}
          </h3>
          {c.thinkingBody.map((para) => (
            <p key={para} className="mt-3 text-[14.5px] leading-[1.58] text-[#6b5245]">
              {para}
            </p>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-8">
        <p className="text-center text-[11px] leading-[1.6] text-[#c9b4a6]">{c.credit}</p>
        <p className="mt-6 text-center text-xs leading-relaxed text-outline">{c.doctorNote}</p>
      </Reveal>
    </section>
  );
}
