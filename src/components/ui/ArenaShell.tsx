"use client";

/**
 * Night-theme sibling of ScreenShell for the event2 arena arc: warm
 * brown-black "ember night" backdrop, a fixed vignette, and an ambient layer
 * of rising ember dots and ghosted game symbols. Same fixed-backdrop trick as
 * ScreenShell so overscroll never reveals a pale band on mobile.
 */

interface ArenaShellProps {
  children: React.ReactNode;
  /** Ambient particles; switch off behind gameplay. */
  ambient?: boolean;
}

// Deterministic particle fields (SSR-safe: no randomness at render time).
const EMBERS = [
  { left: "12%", size: 5, opacity: 0.6, duration: 13, delay: 0, drift: 18 },
  { left: "28%", size: 4, opacity: 0.45, duration: 16, delay: 3.2, drift: -14 },
  { left: "44%", size: 6, opacity: 0.7, duration: 11, delay: 6.1, drift: 10 },
  { left: "63%", size: 4, opacity: 0.5, duration: 15, delay: 1.4, drift: -20 },
  { left: "78%", size: 5, opacity: 0.65, duration: 12, delay: 4.6, drift: 16 },
  { left: "90%", size: 4, opacity: 0.4, duration: 17, delay: 8.3, drift: -10 },
];

const GHOST_SYMBOLS = [
  { src: "/images/task-2/star.png", left: "8%", top: "16%", size: 36, duration: 14, delay: 0, tilt: -8, tiltTo: 4 },
  { src: "/images/task-2/puzzle.png", left: "82%", top: "24%", size: 42, duration: 12, delay: 2.5, tilt: 6, tiltTo: -4 },
  { src: "/images/task-2/flash.png", left: "16%", top: "68%", size: 32, duration: 16, delay: 5, tilt: -4, tiltTo: 8 },
  { src: "/images/task-2/moon.png", left: "74%", top: "74%", size: 38, duration: 13, delay: 1.2, tilt: 8, tiltTo: -6 },
];

export function ArenaShell({ children, ambient = true }: ArenaShellProps) {
  return (
    <main className="variant-event2 relative isolate flex min-h-dvh flex-col items-center overflow-hidden px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 text-cream sm:py-12">
      {/* Fixed backdrop: ember-night gradient + glow orbs + vignette. */}
      <div
        aria-hidden
        className="ember-night pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-ember-core/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-ember-shadow/40 blur-3xl" />
        {/* Vignette keeps edges quiet under expo lighting. */}
        <div className="absolute inset-0 [background:radial-gradient(closest-side,transparent_70%,rgba(0,0,0,0.35))]" />

        {ambient && (
          <>
            {EMBERS.map((e, i) => (
              <span
                key={`ember-${i}`}
                className="animate-ember-float absolute bottom-0 rounded-full bg-ember-bright blur-[1px]"
                style={{
                  left: e.left,
                  width: e.size,
                  height: e.size,
                  ["--ember-opacity" as string]: e.opacity,
                  ["--ember-duration" as string]: `${e.duration}s`,
                  ["--ember-delay" as string]: `${e.delay}s`,
                  ["--ember-drift" as string]: `${e.drift}px`,
                }}
              />
            ))}
            {GHOST_SYMBOLS.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`ghost-${i}`}
                src={s.src}
                alt=""
                className="animate-symbol-drift absolute select-none opacity-[0.06] brightness-0 invert"
                style={{
                  left: s.left,
                  top: s.top,
                  width: s.size,
                  height: s.size,
                  ["--drift-duration" as string]: `${s.duration}s`,
                  ["--drift-delay" as string]: `${s.delay}s`,
                  ["--drift-tilt" as string]: `${s.tilt}deg`,
                  ["--drift-tilt-to" as string]: `${s.tiltTo}deg`,
                  ["--drift-x" as string]: "8px",
                  ["--drift-y" as string]: "-14px",
                }}
              />
            ))}
          </>
        )}
      </div>

      <div className="relative z-10 flex w-full max-w-lg flex-1 flex-col">
        {children}
      </div>
    </main>
  );
}
