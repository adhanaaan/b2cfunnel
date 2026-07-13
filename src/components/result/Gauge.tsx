import type { BandName } from "@/types/engine";
import { BANDS, BAND_ORDER } from "@/engine/bands";
import { useVariant } from "@/components/VariantContext";

interface GaugeProps {
  score: number;
  max?: number;
  band: BandName;
  bandLabel: string;
  lowLabel: string;
  highLabel: string;
  caption?: string;
}

// Geometry. Top semicircle: left end = low, right end = high.
const CX = 100;
const CY = 100;
const R = 80;
const STROKE = 18;
const WOMAN_BAND_COLOURS: Record<BandName, string> = {
  low: "#6c886d",
  moderate: "#a9ad84",
  elevated: "#c2a46f",
  high: "#b9847b",
};

const deg2rad = (d: number) => (d * Math.PI) / 180;

// Map progress p∈[0,1] (left→right) to an arc angle. Left end = 180°, right = 0°.
const angleFor = (p: number) => 180 - p * 180;

function polar(angleDeg: number, radius = R) {
  const a = deg2rad(angleDeg);
  return { x: CX + radius * Math.cos(a), y: CY - radius * Math.sin(a) };
}

function arcPath(pStart: number, pEnd: number) {
  const start = polar(angleFor(pStart));
  const end = polar(angleFor(pEnd));
  // sweep-flag 1 draws clockwise (screen coords), tracing the top of the arc.
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${R} ${R} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

/** 4-band semicircular gauge with a score needle. */
export function Gauge({
  score,
  max = 100,
  band,
  bandLabel,
  lowLabel,
  highLabel,
  caption,
}: GaugeProps) {
  const woman = useVariant() === "woman";
  const clamped = Math.max(0, Math.min(score, max));
  const progress = clamped / max;
  const needleAngle = angleFor(progress);
  const needleTip = polar(needleAngle, R - STROKE / 2 - 4);

  const bandColour = woman ? WOMAN_BAND_COLOURS[band] : BANDS[band].colour;

  // The score is a Brain Health Score (high = healthy), so the arc runs red
  // (low score / high risk) on the LEFT to green (high score / low risk) on the
  // RIGHT - the risk bands reversed. The needle at score/max then lands in the
  // colour that matches the band.
  const widths = BAND_ORDER.map((name, i) => {
    const prevMax = i === 0 ? 0 : BANDS[BAND_ORDER[i - 1]].totalMax;
    const thisMax = BANDS[name].totalMax === Infinity ? max : BANDS[name].totalMax;
    return {
      name,
      colour: woman ? WOMAN_BAND_COLOURS[name] : BANDS[name].colour,
      width: thisMax - prevMax,
    };
  });
  let acc = 0;
  const segments = [...widths].reverse().map((w) => {
    const start = acc / max;
    acc += w.width;
    const end = acc / max;
    return { name: w.name, colour: w.colour, start, end };
  });

  return (
    <figure
      className="mx-auto w-full max-w-xs"
      role="img"
      aria-label={`Score ${score} out of ${max}: ${bandLabel}`}
    >
      <svg viewBox="0 0 200 120" className="w-full">
        {/* Band arcs sized to the real band ranges. */}
        {segments.map((seg) => (
          <path
            key={seg.name}
            d={arcPath(seg.start, seg.end)}
            fill="none"
            stroke={seg.colour}
            strokeWidth={STROKE}
            strokeLinecap="butt"
          />
        ))}

        {/* Needle. */}
        <line
          className="gauge-needle"
          x1={CX}
          y1={CY}
          x2={needleTip.x.toFixed(2)}
          y2={needleTip.y.toFixed(2)}
          stroke={woman ? "#475b47" : "#2d2d2d"}
          strokeWidth={3}
          strokeLinecap="round"
          style={{
            transformOrigin: `${CX}px ${CY}px`,
            transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        <circle cx={CX} cy={CY} r={7} fill={woman ? "#475b47" : "#2d2d2d"} />
        <circle cx={CX} cy={CY} r={3} fill={bandColour} />
      </svg>

      <figcaption className="mt-1">
        <div className="flex justify-between px-1 text-xs font-semibold uppercase tracking-wide text-outline">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
        <p
          className="mt-2 text-center text-lg font-bold"
          style={{ color: bandColour }}
        >
          {bandLabel}
        </p>
        {caption && (
          <p className="mx-auto mt-0.5 max-w-xs text-center text-xs text-outline">
            {caption}
          </p>
        )}
      </figcaption>
    </figure>
  );
}
