"use client";

import { COPY } from "@/config/copy";

/**
 * Two illustrative curves of thinking speed with age: one where the modifiable
 * risk factors are managed, one where they are not.
 *
 * Deliberately value-free. There are no y-axis numbers and no hover readout,
 * because there is no underlying dataset for this person and either would imply
 * a precision we do not have. Identity comes from solid versus dashed as well
 * as colour, so it survives colour blindness and greyscale print, and the whole
 * figure carries an aria-label that states the trend in words.
 */

// Plot geometry. The viewBox is tall enough to include the age labels, so the
// card never grows a nested scrollbar.
const AGE_X = [54, 136, 218, 300];
const MANAGED_PATH = "M 54 34 C 130 40 205 58 300 86";
const UNMANAGED_PATH = "M 54 34 C 138 52 196 104 300 152";
// The managed curve forward, then the unmanaged one reversed, closed into a band.
const GAP_PATH =
  "M 54 34 C 130 40 205 58 300 86 L 300 152 C 196 104 138 52 54 34 Z";

// An emphasis pair, not a categorical one: ink for the reference path, a single
// hue for the path that carries the meaning. The categorical palette checks
// (lightness band, chroma floor) do not apply and will "fail" by design if run;
// the ones that do apply pass with room to spare, adjacent CVD separation at
// dE 12.5 against a target of 8 and contrast above 3:1 on white.
const INK = "#2d2d2d"; // managed: the neutral reference line
const ALERT = "#ba1a1a"; // unmanaged: the one hue carrying meaning
const GRID = "#e6d3ca";
const LABEL = "#85736b";

function LineKey({ dashed }: { dashed: boolean }) {
  return (
    <svg viewBox="0 0 22 6" className="h-1.5 w-6 shrink-0" aria-hidden>
      <line
        x1="1"
        y1="3"
        x2="21"
        y2="3"
        stroke={dashed ? ALERT : INK}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={dashed ? "5 4" : undefined}
      />
    </svg>
  );
}

export function TrajectoryChart() {
  const c = COPY.screens.event2.report.chart;

  return (
    <section className="rounded-2xl bg-surface-lowest p-5 shadow-card">
      <h2 className="text-base font-bold leading-snug text-charcoal">
        {c.heading}
      </h2>

      {/* Legend: always present for two series, in text tokens, never coloured text. */}
      <ul className="mt-3 space-y-1.5">
        <li className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
          <LineKey dashed={false} />
          {c.managedLabel}
        </li>
        <li className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
          <LineKey dashed />
          {c.unmanagedLabel}
        </li>
      </ul>

      <figure className="mt-3">
        <svg
          viewBox="0 0 320 180"
          className="w-full"
          role="img"
          aria-label={c.ariaLabel}
        >
          {/* Age gridlines: solid hairlines, one step off the surface. */}
          {AGE_X.map((x) => (
            <line
              key={x}
              x1={x}
              y1={16}
              x2={x}
              y2={156}
              stroke={GRID}
              strokeWidth="1"
            />
          ))}

          <path d={GAP_PATH} fill={ALERT} fillOpacity={0.1} />
          <path
            d={UNMANAGED_PATH}
            fill="none"
            stroke={ALERT}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 5"
          />
          <path
            d={MANAGED_PATH}
            fill="none"
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Direction of the y axis, stated rather than numbered. */}
          <text x="6" y="22" fontSize="9" fontWeight="600" fill={LABEL}>
            {c.fasterLabel}
          </text>
          <text x="6" y="154" fontSize="9" fontWeight="600" fill={LABEL}>
            {c.slowerLabel}
          </text>

          {/* Age ticks. The outer two anchor inwards so nothing clips. */}
          <text x={AGE_X[0]} y="172" fontSize="10" fill={LABEL} textAnchor="start">
            {c.ageLabel} 30
          </text>
          <text x={AGE_X[1]} y="172" fontSize="10" fill={LABEL} textAnchor="middle">
            45
          </text>
          <text x={AGE_X[2]} y="172" fontSize="10" fill={LABEL} textAnchor="middle">
            60
          </text>
          <text x={AGE_X[3]} y="172" fontSize="10" fill={LABEL} textAnchor="end">
            75
          </text>
        </svg>

        <figcaption className="mt-2 text-[11px] leading-snug text-outline">
          {c.footnote}
        </figcaption>
      </figure>
    </section>
  );
}
