/**
 * Stylised tapping hand for the Speed Game self-playing demo (the design's
 * exported hand SVG is not fetchable from this environment, so this is a
 * faithful vector recreation). The demo's game symbols themselves come
 * straight from the real game's assets under /images/task-2/.
 */
export function TappingHand({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 46" className={className} aria-hidden>
      <defs>
        <linearGradient id="sg-hand" x1="8" y1="4" x2="34" y2="44" gradientUnits="userSpaceOnUse">
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
        fill="url(#sg-hand)"
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
