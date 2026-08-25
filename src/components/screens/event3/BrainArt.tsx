/**
 * Warm "daylight ember" brain illustration for the event3 arena screens.
 *
 * The Figma design uses an uploaded 3D render that is not exportable from
 * this environment, so this is a hand-built SVG in the same palette: lit
 * yellow on the left (under the sparkle glow), ember orange on the right,
 * with circuit accents. To swap in the real render later, replace this
 * component's usage with an <img> of the exported asset - the SpinningBrain
 * wrapper does not care what it spins.
 */
export function BrainArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id="brain-body"
          gradientUnits="userSpaceOnUse"
          x1="40"
          y1="40"
          x2="240"
          y2="150"
        >
          <stop offset="0" stopColor="#ffe3ae" />
          <stop offset="0.42" stopColor="#fdc084" />
          <stop offset="1" stopColor="#ee8b52" />
        </linearGradient>
        <linearGradient
          id="brain-deep"
          gradientUnits="userSpaceOnUse"
          x1="150"
          y1="120"
          x2="240"
          y2="185"
        >
          <stop offset="0" stopColor="#f5a469" />
          <stop offset="1" stopColor="#dd7a44" />
        </linearGradient>
        <radialGradient id="brain-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe57a" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#ffe57a" stopOpacity="0.32" />
          <stop offset="1" stopColor="#ffe57a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="132" cy="196" rx="86" ry="10" fill="#e8b48e" opacity="0.35" />

      {/* Yellow light spilling over the left hemisphere */}
      <ellipse cx="84" cy="74" rx="86" ry="76" fill="url(#brain-glow)" />

      {/* Brainstem */}
      <path
        d="M158 152 C160 168 154 180 144 190 C156 192 168 186 172 174 C174 164 170 154 166 148 Z"
        fill="url(#brain-deep)"
      />

      {/* Cerebellum */}
      <g>
        <ellipse cx="192" cy="152" rx="38" ry="24" fill="url(#brain-deep)" />
        <path
          d="M164 146 C170 158 178 166 190 170 M180 140 C184 152 192 162 204 166 M196 138 C200 148 208 156 218 158"
          stroke="#c2622f"
          strokeOpacity="0.55"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Cerebrum: overlapping lumps sharing one continuous gradient */}
      <g fill="url(#brain-body)">
        <circle cx="62" cy="84" r="40" />
        <circle cx="98" cy="52" r="42" />
        <circle cx="146" cy="44" r="38" />
        <circle cx="190" cy="64" r="34" />
        <circle cx="212" cy="98" r="30" />
        <circle cx="178" cy="120" r="36" />
        <circle cx="122" cy="128" r="40" />
        <circle cx="74" cy="120" r="34" />
        <ellipse cx="134" cy="92" rx="98" ry="52" />
      </g>

      {/* Gyri: darker folds */}
      <g
        stroke="#d97a36"
        strokeOpacity="0.55"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M52 70 C66 58 84 62 92 76 C100 90 92 104 76 106" />
        <path d="M96 34 C114 28 130 38 132 54 C134 68 124 78 110 78" />
        <path d="M150 22 C168 22 180 36 176 52 C172 64 160 70 148 66" />
        <path d="M196 48 C210 54 216 68 210 80 C204 90 192 92 184 86" />
        <path d="M216 96 C222 108 218 120 206 126" />
        <path d="M160 96 C174 92 188 100 190 114 C192 128 182 138 168 138" />
        <path d="M104 96 C120 92 134 102 134 116 C134 132 120 140 106 136" />
        <path d="M56 108 C64 120 80 126 92 120" />
        <path d="M74 44 C82 40 92 42 96 50" />
      </g>

      {/* Highlights on the lit side */}
      <g
        stroke="#fff0cd"
        strokeOpacity="0.8"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M58 64 C70 52 88 54 96 68" />
        <path d="M100 40 C114 34 128 42 130 54" />
        <path d="M46 92 C50 82 60 76 70 78" />
      </g>

      {/* Circuit accents on the ember side */}
      <g stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1.6" fill="none">
        <path d="M168 74 L186 74 L194 84" />
        <path d="M176 104 L192 104 L200 96" />
        <path d="M150 118 L162 128" />
      </g>
      <g fill="#ffffff">
        <circle cx="168" cy="74" r="3" />
        <circle cx="194" cy="84" r="2.6" />
        <circle cx="176" cy="104" r="2.6" />
        <circle cx="200" cy="96" r="2.4" />
        <circle cx="150" cy="118" r="2.4" />
        <circle cx="162" cy="128" r="2.8" />
        <circle cx="186" cy="56" r="2" opacity="0.8" />
        <circle cx="206" cy="118" r="2" opacity="0.8" />
      </g>
    </svg>
  );
}
