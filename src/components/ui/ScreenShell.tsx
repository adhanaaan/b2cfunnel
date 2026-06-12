"use client";

import { useIsEvent } from "@/components/VariantContext";

interface ScreenShellProps {
  children: React.ReactNode;
  wide?: boolean;
  /** Premium gradient backdrop + ambient glow (also always on for the event). */
  premium?: boolean;
}

/** Centred, responsive container shared by every screen. */
export function ScreenShell({
  children,
  wide = false,
  premium = false,
}: ScreenShellProps) {
  const event = useIsEvent();
  const glow = event || premium;

  return (
    <main
      className={[
        "relative flex min-h-screen flex-col items-center overflow-hidden px-4 py-8 sm:py-12",
        glow ? "bg-gradient-to-b from-[#fff4ee] via-surface to-[#fbe7de]" : "",
      ].join(" ")}
    >
      {/* Premium ambient glow. */}
      {glow && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#ffb37a]/30 blur-3xl"
          />
        </>
      )}

      <div className={["relative w-full", wide ? "max-w-2xl" : "max-w-lg"].join(" ")}>
        {children}
      </div>
    </main>
  );
}
