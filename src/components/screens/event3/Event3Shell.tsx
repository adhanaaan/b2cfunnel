"use client";

import { useEffect } from "react";

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
  /**
   * Let the page scroll instead of pinning it to one viewport. Off by default,
   * so the arena screens keep their hard lock; used by longer-than-a-screen
   * content such as the /event-v5 consent preview.
   */
  scroll?: boolean;
  /**
   * Adds the partner's navy pill to the corners (event6 consent page, where
   * the backdrop carries both brands).
   */
  navyPills?: boolean;
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

/**
 * The partner's navy pills (event6 consent page). Kept clear of the content
 * column: the copy on that page runs nearly the full height, so these sit in
 * the top-right and bottom-left corners only.
 */
const NAVY_PILLS = [
  { pos: "right-[-165px] top-[-14px]", duration: 12, delay: 0.6 },
  { pos: "left-[-215px] bottom-[24px]", duration: 14, delay: 2 },
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
  scroll = false,
  navyPills = false,
}: Event3ShellProps) {
  // The arena screens are hard-locked to one viewport. h-dvh alone is not
  // enough on mobile: the document keeps the taller large-viewport height
  // (body min-h-screen = 100vh), so the page can still be dragged by the
  // browser-chrome offset and a step can open mid-page. Pin the document
  // itself for as long as an arena screen is mounted, and land at the top.
  useEffect(() => {
    if (scroll) return;
    const html = document.documentElement;
    html.classList.add("event3-locked");
    document.body.classList.add("event3-locked");
    window.scrollTo(0, 0);
    return () => {
      html.classList.remove("event3-locked");
      document.body.classList.remove("event3-locked");
    };
  }, [scroll]);

  return (
    <main
      className={`variant-event2 isolate flex flex-col items-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] text-charcoal ${
        scroll
          ? "relative min-h-dvh w-full overflow-x-hidden"
          : "fixed inset-0 overflow-hidden"
      }`}
    >
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

        {pills &&
          navyPills &&
          NAVY_PILLS.map((p, i) => (
            <div key={`navy-${i}`} className={`absolute ${p.pos} rotate-[24deg]`}>
              <div
                className="animate-pill-drift h-[38px] w-[340px] rounded-full bg-[#302d77]"
                style={{
                  ["--pill-duration" as string]: `${p.duration}s`,
                  ["--pill-delay" as string]: `${p.delay}s`,
                  ["--pill-from" as string]: "-14px",
                  ["--pill-to" as string]: "14px",
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

      <div className="relative z-10 flex min-h-0 w-full max-w-lg flex-1 flex-col">
        {children}
      </div>
    </main>
  );
}
