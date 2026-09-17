import type { CSSProperties } from "react";

/**
 * The drink, while the photograph has not landed.
 *
 * Both places Sharp Shot Week shows the cup - the poster and the report's
 * banner - fall back to this, so neither is ever a hole where the artwork
 * goes and neither can drift into drawing a different cup. Its box is the
 * poster's 184x332; the banner's 103x185 is the same shape, so one viewBox
 * serves both and each scales it.
 *
 * It is a stand-in, not artwork: drop `sharp-shot-drink.png` in and both
 * replace it (see public/images/22grams/README.md).
 */
export function SharpShotCup({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 184 332"
      aria-hidden
      className={className}
      style={style}
      role="presentation"
    >
      {/* Lid: the clear dome, so it reads as a takeaway cup. */}
      <rect x="34" y="110" width="116" height="13" rx="6.5" fill="rgba(255,255,255,0.26)" />
      <path d="M42 123h100l-7 13H49z" fill="rgba(255,255,255,0.16)" />
      {/* Cup, tapering like a tumbler, standing on the bottom edge. */}
      <path d="M48 136h88l-11 196H59z" fill="#2a1408" />
      {/* Coffee, with the milk cap the artwork shows. */}
      <path d="M52 148h80l-2 26H54z" fill="rgba(255,214,170,0.75)" />
      <path d="M54 174h76l-9 158H63z" fill="#4a1c07" />
      <text
        x="92"
        y="250"
        textAnchor="middle"
        fill="rgba(255,255,255,0.5)"
        fontSize="20"
        fontWeight="700"
        letterSpacing="1"
      >
        22g
      </text>
    </svg>
  );
}
