"use client";

import { COPY } from "@/config/copy";
import { BrainHero } from "@/components/screens/event3/BrainHero";
import { Reveal, SerifParts } from "../ui";

/**
 * R2 (Figma 697:25033): what processing speed is - the brain, the mixed
 * serif/sans heading, and the three everyday perks the speed popup already
 * lists, so the explanation is the same wherever the player meets it.
 *
 * Sits straight under the standing chips on the open backdrop, not in the
 * report's white sheet, so the brain and the start of "Processing speed" land
 * above the fold. Its ground is the brain's own light: a yellow glow behind
 * the frontal lobe, spilling into a wash that fades down into the cream
 * before the sheet begins.
 */
export function PhklSpeedExplainer() {
  const c = COPY.screens.phkl.report.speed;
  const points = COPY.screens.event3.speedPopup.points;

  return (
    <section className="relative -mx-4 mt-3 px-6 pb-10 pt-3">
      {/* The wash: gathers to full yellow behind the brain, gone by the bottom. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(253,234,164,0)_0%,#fdeaa4_22%,#fff3cf_58%,rgba(255,248,243,0)_100%)]"
      />
      {/* The glow itself, centred on the brain. Not clipped to the section: it
          spills up behind the standing chips, the way light would, rather than
          stopping at a line. Both layers sit under the header's content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-110px] -z-10 h-[380px] w-[min(130vw,640px)] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,222,84,0.8)_0%,rgba(255,230,140,0.4)_45%,transparent_100%)]"
      />

      <div className="relative">
        <Reveal className="flex justify-center">
          <BrainHero className="h-[clamp(120px,17dvh,150px)] w-auto" />
        </Reveal>

        <Reveal>
          <h2 className="mt-4 text-balance text-[clamp(2rem,9.2vw,2.375rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-charcoal">
            <SerifParts parts={c.headingParts} />
          </h2>
        </Reveal>

        <Reveal>
          <p className="mt-5 text-[17px] leading-[1.6] text-charcoal">{c.intro}</p>
        </Reveal>

        <Reveal>
          <ol className="mt-4 space-y-3">
            {points.map((point, i) => (
              <li
                key={point}
                className="flex items-start gap-3.5 rounded-2xl bg-gradient-to-l from-[#fcf5ed] to-[#f7e3d4] p-4"
              >
                <span className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-charcoal text-[10px] font-bold text-white/85">
                  {i + 1}
                </span>
                <span className="text-[15px] font-medium leading-[1.45] text-charcoal/90">
                  {point}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
