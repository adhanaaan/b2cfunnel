"use client";

import { COPY } from "@/config/copy";
import type { MambaLogo } from "@/config/mambacares";
import {
  MAMBACARES_GIVEAWAY_SPONSORS,
  MAMBACARES_RUNNING_PARTNERS,
} from "@/config/mambacares";
import { Reveal } from "@/components/screens/phkl/ui";
import { OptionalImage } from "@/components/screens/phkl/OptionalImage";

/**
 * One logo slot. The artwork in Figma is a round crop, so the frame is a
 * circle whether or not the file has been uploaded: while it is missing the
 * slot shows the partner's name instead, which keeps the row at its designed
 * length and makes it plain which logo is still outstanding rather than
 * leaving a gap nobody notices.
 *
 * The supplied files are a mix - some are circular marks, some are wordmarks
 * centred on a square canvas - so the artwork is fitted inside the circle
 * (`object-contain` on a padded frame) rather than cropped to fill it. Filling
 * would push the ends of a wordmark under the mask and cut them off; fitting
 * costs a circular mark a hair of size and keeps every logo whole.
 */
function LogoSlot({ logo, size }: { logo: MambaLogo; size: string }) {
  return (
    <li
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-[3px] ring-1 ring-[#f0dccf]`}
    >
      <OptionalImage
        src={logo.src}
        alt={logo.name}
        className="h-full w-full rounded-full object-contain"
        fallback={
          <span className="text-center text-[7px] font-bold uppercase leading-[1.15] tracking-[0.02em] text-[#b79c8e]">
            {logo.name}
          </span>
        }
      />
    </li>
  );
}

function LogoRow({
  heading,
  logos,
  size,
}: {
  heading: string;
  logos: MambaLogo[];
  size: string;
}) {
  return (
    <div>
      <h3 className="text-center text-[13px] font-bold text-[#8a6a58]">
        {heading}
      </h3>
      {/* 8px, not 10: six 44px crew logos plus their gaps have to fit the
          content column on a 360px phone, which 10px misses by two pixels.
          Still wraps rather than overflows on anything narrower. */}
      <ul className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {logos.map((logo) => (
          <LogoSlot key={logo.src} logo={logo} size={size} />
        ))}
      </ul>
    </div>
  );
}

/**
 * Who put the run on (Figma 794:17895): the running crews, the giveaway
 * sponsors, and the event's wordmark under them. The end of the report - there
 * is no compliance footer on this arc, as on /phkl.
 *
 * Both rows read their logos from config/mambacares.ts, so a crew joining
 * before the event is one entry there and a file dropped into public/, with no
 * change here.
 */
export function MambaPartners() {
  const c = COPY.screens.mambacares.report.partners;

  return (
    <section className="bg-[#fbeadf] px-6 pb-32 pt-9">
      <Reveal>
        <LogoRow
          heading={c.runningHeading}
          logos={MAMBACARES_RUNNING_PARTNERS}
          size="h-11 w-11"
        />
      </Reveal>

      <Reveal className="mt-7">
        <LogoRow
          heading={c.sponsorsHeading}
          logos={MAMBACARES_GIVEAWAY_SPONSORS}
          size="h-10 w-10"
        />
      </Reveal>

      <Reveal className="mt-9">
        <p className="text-center text-[clamp(1.5rem,7.5vw,1.85rem)] font-extrabold leading-none tracking-[-0.01em] text-[#6b5245]">
          {c.wordmark}
        </p>
        <p className="mt-1.5 text-center text-[11.5px] font-extrabold leading-none tracking-[0.01em] text-[#6b5245]">
          {c.wordmarkNote}
        </p>
      </Reveal>
    </section>
  );
}
