"use client";

import { useState } from "react";
import { COPY } from "@/config/copy";
import { OptionalImage } from "../OptionalImage";
import {
  BookingLink,
  Reveal,
  SerifParts,
  rankPillCta,
  reportCard,
  reportEyebrow,
  reportHeading,
  reportOverline,
} from "../ui";

/**
 * The two report screenshots (Figma 697:25176-25177). Optional files: while
 * neither has been uploaded the frame is left out altogether rather than
 * shown empty.
 */
function ReportShots() {
  const [missing, setMissing] = useState(0);
  if (missing >= 2) return null;
  return (
    <div className="mt-4 flex justify-center gap-3 overflow-hidden rounded-[20px] bg-white p-4">
      <OptionalImage
        src="/images/phkl/report-1.png"
        alt="A page of the full ReCOGnAIze report"
        className="max-h-[240px] w-auto max-w-[48%] rounded-lg object-contain shadow-card"
        onMissing={() => setMissing((n) => n + 1)}
      />
      <OptionalImage
        src="/images/phkl/report-2.png"
        alt="Another page of the full ReCOGnAIze report"
        className="max-h-[240px] w-auto max-w-[48%] rounded-lg object-contain shadow-card"
        onMissing={() => setMissing((n) => n + 1)}
      />
    </div>
  );
}

/**
 * R5 (Figma 697:25127): the Memory Screening Package - what it rests on, the
 * institutions behind it, what the screening includes, the report it ends in,
 * the booking button and the clinician's word.
 */
export function PhklScreeningOffer() {
  const c = COPY.screens.phkl.report.offer;
  const heading3 =
    "text-[20px] font-extrabold leading-[1.3] tracking-[-0.01em] text-[#1c110a]";
  const body = "mt-2 text-[14.5px] leading-[1.58] text-[#6b5245]";

  return (
    <section className="bg-[#fff8f3] px-6 pb-12 pt-4">
      <Reveal>
        <p className={reportEyebrow}>{c.eyebrow}</p>
        <h2 className={`mt-5 text-balance ${reportHeading}`}>{c.heading}</h2>
        <p className="mt-5 text-[15.5px] leading-[1.6] text-[#6b5245]">
          <SerifParts parts={c.proofParts} />
        </p>
      </Reveal>

      <Reveal className="mt-6">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-2xl border border-[#f2ddce] bg-white/70 px-4 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gms-ntu-logo.png"
            alt="Gray Matter Solutions, a spin-off from Nanyang Technological University"
            className="h-[26px] w-auto"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/LKCMedicine-Dementia-Research-Centre-2.png"
            alt="Lee Kong Chian School of Medicine, Dementia Research Centre"
            className="h-9 w-auto"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pubmed-logo-blue.svg" alt="PubMed" className="h-7 w-auto" />
        </div>
      </Reveal>

      <Reveal className="mt-9">
        <p className={reportOverline}>{c.includesEyebrow}</p>
        <h3 className={`mt-2 ${heading3}`}>
          {c.assessmentHeading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h3>
        <p className={body}>{c.assessmentBody}</p>
        <div className="mt-4 overflow-hidden rounded-[20px] bg-white p-3">
          <OptionalImage
            src="/images/phkl/screening-devices.png"
            alt="The digital cognitive assessment on a phone, a tablet and a laptop"
            className="mx-auto max-h-[230px] w-auto"
            fallback={
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/landing/woman-tablet.png"
                alt="A woman reading her ReCOGnAIze brain health results on a tablet"
                className="w-full rounded-xl object-cover"
              />
            }
          />
        </div>
      </Reveal>

      <div className="my-7 h-px bg-[#f2ddce]" aria-hidden />

      <Reveal>
        <h3 className={heading3}>{c.reportHeading}</h3>
        <p className={body}>{c.reportBody}</p>
        <ReportShots />
      </Reveal>

      <Reveal className="mt-7">
        <BookingLink placement="offer" className={rankPillCta}>
          {c.cta}
        </BookingLink>
      </Reveal>

      <Reveal className="mt-7">
        <figure className={`${reportCard} px-6 pb-6 pt-4`}>
          <span aria-hidden className="block text-[40px] font-extrabold leading-none text-[#ffce9b]">
            “
          </span>
          <blockquote className="mt-1 text-[15px] leading-[1.55] text-[#1c110a]">
            {c.quote}
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Kandiah.png"
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="text-[14.5px] font-semibold leading-[1.45] text-[#1c110a]">
                {c.quoteName}
              </p>
              {c.quoteRole.map((line) => (
                <p key={line} className="text-[11.5px] leading-[1.6] text-[#8a6a58]">
                  {line}
                </p>
              ))}
            </div>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
