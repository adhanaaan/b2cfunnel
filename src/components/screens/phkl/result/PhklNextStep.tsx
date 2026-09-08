"use client";

import { COPY } from "@/config/copy";
import { PHKL_PACKAGE_SECTION_ID } from "@/config/eventLinks";
import { OptionalImage } from "../OptionalImage";
import { BookingLink, Reveal, rankPillCta, reportEyebrow } from "../ui";

/**
 * The Memory Screening Package poster, drawn in HTML from its own words until
 * the artwork lands at public/images/phkl/memory-screening-package.png. The
 * hospital's blue and the package's green are approximated; the real poster
 * replaces this the moment the file exists.
 */
function PosterCard() {
  const p = COPY.screens.phkl.report.nextStep.poster;
  const [currency, amount] = [p.price.replace(/[\d,]/g, ""), p.price.replace(/[^\d,]/g, "")];
  return (
    <div
      className="overflow-hidden rounded-[19px] bg-gradient-to-br from-[#eef6fb] via-[#dbe9f4] to-[#9dbfd8] px-5 pb-6 pt-6 text-center shadow-[0_18px_46px_-28px_rgba(31,79,140,0.5)]"
      role="img"
      aria-label={`${p.hospital}. ${p.title.join(" ")}, ${p.price}. ${p.includesHeading}: ${p.includes.join(", ")}. ${p.whoHeading} ${p.who.join(", ")}.`}
    >
      <p className="text-[17px] font-extrabold uppercase tracking-[0.04em] text-[#1c4f9c]">
        {p.hospital}
      </p>
      <p className="mt-0.5 text-[11px] font-bold text-[#1c4f9c]">{p.hospitalNote}</p>

      <p className="mt-5 text-[clamp(2rem,10vw,2.5rem)] font-extrabold leading-[1.05] text-[#1c4f9c]">
        {p.title.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white text-left shadow-[0_10px_30px_-18px_rgba(31,79,140,0.5)]">
        <div className="bg-[#4caf50] px-5 py-3 text-center text-white">
          <span className="align-top text-sm font-bold">{currency}</span>
          <span className="text-[34px] font-extrabold leading-none">{amount}</span>
        </div>
        <div className="px-5 py-4">
          <p className="text-[13px] font-extrabold text-[#1c4f9c]">{p.includesHeading}</p>
          <ul className="mt-2.5 space-y-2">
            {p.includes.map((line) => (
              <li key={line} className="flex items-center gap-2.5 text-[13px] text-[#1c110a]">
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-[#1c4f9c]" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl bg-white text-left shadow-[0_10px_30px_-18px_rgba(31,79,140,0.5)]">
        <p className="bg-[#1c4f9c] px-5 py-2.5 text-[14px] font-extrabold text-white">
          {p.whoHeading}
        </p>
        <ul className="grid gap-2 px-5 py-4">
          {p.who.map((line) => (
            <li key={line} className="flex items-start gap-2 text-[12.5px] leading-snug text-[#1c110a]">
              <svg viewBox="0 0 8 10" className="mt-1 h-2.5 w-2 shrink-0 text-[#1aa8a0]" aria-hidden>
                <path d="M0 0 8 5 0 10z" fill="currentColor" />
              </svg>
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * 6 (Figma 697:25188): the one ask, with the hospital's own poster for it.
 */
export function PhklNextStep() {
  const c = COPY.screens.phkl.report.nextStep;
  return (
    <section
      id={PHKL_PACKAGE_SECTION_ID}
      className="scroll-mt-4 bg-[#fff8f3] px-6 pb-12 pt-4"
    >
      <Reveal>
        <p className={`${reportEyebrow} text-[14px] tracking-[0.24em]`}>{c.eyebrow}</p>
        <h2 className="mt-3 text-[clamp(1.75rem,7.6vw,1.875rem)] font-extrabold leading-[1.12] tracking-[-0.025em] text-[#1c110a]">
          {c.heading}
        </h2>
        <p className="mt-4 text-[15.5px] leading-[1.6] text-[#6b5245]">{c.body}</p>
      </Reveal>

      <Reveal className="mt-7">
        <OptionalImage
          src="/images/phkl/memory-screening-package.png"
          alt={`${c.poster.hospital} ${c.poster.title.join(" ")}, ${c.poster.price}`}
          className="w-full rounded-[19px]"
          fallback={<PosterCard />}
        />
      </Reveal>

      <Reveal className="mt-7">
        <BookingLink placement="poster" className={rankPillCta}>
          {c.cta}
        </BookingLink>
      </Reveal>
    </section>
  );
}
