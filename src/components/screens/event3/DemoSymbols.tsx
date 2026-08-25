/**
 * Gradient demo symbols for the event3 instructions screen (Figma "02
 * challenge 1"). The design's exported SVGs are not fetchable from this
 * environment, so these are faithful vector recreations: a round-rayed sun,
 * a crescent moon and a tilted five-point star in the design's warm
 * pink-to-purple gradients, plus the tapping hand.
 */

const sunRays = Array.from({ length: 8 }, (_, i) => i * 45);

export function SunSymbol({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden>
      <defs>
        <linearGradient id="e3-sun" x1="20" y1="10" x2="76" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f97316" />
          <stop offset="0.55" stopColor="#e0489c" />
          <stop offset="1" stopColor="#c026d3" />
        </linearGradient>
      </defs>
      <g fill="url(#e3-sun)">
        {sunRays.map((deg) => (
          <rect
            key={deg}
            x="44"
            y="6"
            width="8"
            height="19"
            rx="4"
            transform={`rotate(${deg} 48 48)`}
          />
        ))}
        <circle cx="48" cy="48" r="17" />
      </g>
    </svg>
  );
}

export function MoonSymbol({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden>
      <defs>
        <linearGradient id="e3-moon" x1="20" y1="12" x2="70" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a855f7" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <path
        d="M62 10 A42 42 0 1 0 62 86 A34 34 0 1 1 62 10 Z"
        fill="url(#e3-moon)"
      />
    </svg>
  );
}

export function StarSymbol({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden>
      <defs>
        <linearGradient id="e3-star" x1="16" y1="16" x2="80" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ec4899" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path
        transform="rotate(-8 48 48)"
        d="M48 6 L59.6 34.6 L90 36.8 L66.6 56.4 L74.4 86 L48 69.4 L21.6 86 L29.4 56.4 L6 36.8 L36.4 34.6 Z"
        fill="url(#e3-star)"
      />
    </svg>
  );
}

/** Stylised tapping hand (index finger up), warm brown like the design. */
export function TappingHand({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 46" className={className} aria-hidden>
      <defs>
        <linearGradient id="e3-hand" x1="8" y1="4" x2="34" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#c2622f" />
          <stop offset="1" stopColor="#8a3d13" />
        </linearGradient>
      </defs>
      <path
        d="M15 6.5 C15 4 17 2 19.5 2 C22 2 24 4 24 6.5 L24 20
           C26 19 28.5 19 30.5 20.5 C33.5 22.5 35 26 34.5 29.5
           L33.5 36 C33 41 28.5 44.5 23.5 44.5 L18 44.5
           C13 44.5 8.5 41 8 36 L7 28 C6.5 24 9 21 12.5 20.5
           C13.5 20.3 14.3 20.4 15 20.7 Z"
        fill="url(#e3-hand)"
      />
      <path
        d="M15 6.5 C15 4 17 2 19.5 2 C22 2 24 4 24 6.5 L24 14"
        fill="none"
        stroke="#ffdcb8"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
    </svg>
  );
}
