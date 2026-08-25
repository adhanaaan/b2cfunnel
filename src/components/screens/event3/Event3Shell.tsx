"use client";

/**
 * Daylight sibling of ArenaShell for the event3 arc: warm cream radial
 * backdrop with the rotated yellow "pill" lines gliding along their diagonal
 * axis, plus optional twinkling sparkle glyphs and soft ambient blobs. Fixed
 * backdrop, same overscroll trick as ScreenShell/ArenaShell.
 */

interface Event3ShellProps {
  children: React.ReactNode;
  /** The rotated yellow pill lines (landing + result). */
  pills?: boolean;
  /** Twinkling ✦ glyphs (result page). */
  sparkles?: boolean;
  /** Soft peach blobs instead of pills (instructions page). */
  blobs?: boolean;
}

// One solid + one soft gradient pill per corner cluster, as designed.
// Deterministic (SSR-safe); positions are viewport-anchored.
const PILL_CLUSTERS = [
  // Top-right, peeking in from the corner.
  {
    pos: "right-[-130px] top-[0px]",
    solid: true,
    duration: 10,
    delay: 0,
  },
  {
    pos: "right-[-105px] top-[75px]",
    solid: false,
    duration: 12,
    delay: 1.6,
  },
  // Left edge, mid-screen.
  {
    pos: "left-[-200px] top-[300px]",
    solid: true,
    duration: 11,
    delay: 0.8,
  },
  {
    pos: "left-[-180px] top-[380px]",
    solid: false,
    duration: 13,
    delay: 2.4,
  },
];

const SPARKLES = [
  { pos: "left-[8px] top-[83px]", size: "text-[44px]", min: 0.35, max: 0.7, duration: 5, delay: 0 },
  { pos: "right-[-14px] top-[231px]", size: "text-[44px]", min: 0.3, max: 0.6, duration: 6, delay: 1.4 },
  { pos: "right-[36px] top-[80px]", size: "text-[36px]", min: 0.4, max: 0.85, duration: 4.4, delay: 0.6 },
  { pos: "left-[10px] top-[320px]", size: "text-[36px]", min: 0.3, max: 0.65, duration: 5.6, delay: 2.1 },
];

export function Event3Shell({
  children,
  pills = true,
  sparkles = false,
  blobs = false,
}: Event3ShellProps) {
  return (
    <main className="variant-event2 relative isolate flex min-h-dvh flex-col items-center overflow-hidden px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-charcoal">
      <div
        aria-hidden
        className="event3-daylight pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {blobs && (
          <>
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#f9c89a]/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#fde68a]/35 blur-3xl" />
          </>
        )}

        {pills &&
          PILL_CLUSTERS.map((p, i) => (
            <div key={`pill-${i}`} className={`absolute ${p.pos} rotate-[24deg]`}>
              <div
                className={[
                  "animate-pill-drift rounded-full",
                  p.solid
                    ? "h-16 w-[340px] bg-[#fde68a]"
                    : "h-11 w-[300px] bg-gradient-to-b from-[#ffff70]/30 to-[#f59e0a]/10",
                ].join(" ")}
                style={{
                  ["--pill-duration" as string]: `${p.duration}s`,
                  ["--pill-delay" as string]: `${p.delay}s`,
                  ["--pill-from" as string]: "-18px",
                  ["--pill-to" as string]: "18px",
                }}
              />
            </div>
          ))}

        {sparkles &&
          SPARKLES.map((s, i) => (
            <span
              key={`sparkle-${i}`}
              className={`animate-sparkle-breathe absolute ${s.pos} ${s.size} font-bold leading-none text-[#f6c76d]`}
              style={{
                ["--sparkle-min" as string]: s.min,
                ["--sparkle-max" as string]: s.max,
                ["--sparkle-duration" as string]: `${s.duration}s`,
                ["--sparkle-delay" as string]: `${s.delay}s`,
              }}
            >
              ✦
            </span>
          ))}
      </div>

      <div className="relative z-10 flex w-full max-w-lg flex-1 flex-col">
        {children}
      </div>
    </main>
  );
}
