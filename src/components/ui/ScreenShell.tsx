"use client";

import { useVariant } from "@/components/VariantContext";

interface ScreenShellProps {
  children: React.ReactNode;
  wide?: boolean;
}

/**
 * Centred, responsive container shared by every screen. Carries the premium
 * gradient backdrop + ambient glow across the whole quiz.
 */
export function ScreenShell({ children, wide = false }: ScreenShellProps) {
  const variant = useVariant();
  return (
    <main
      className={[
        "relative isolate flex min-h-screen flex-col items-center overflow-hidden px-4 py-8 sm:py-12",
        `variant-${variant}`,
      ].join(" ")}
    >
      {/* Fixed full-viewport gradient backdrop + glow: every scroll position
          shows the same gradient, so no pale/white band ever appears at the
          top or bottom on mobile. */}
      <div
        aria-hidden
        className="quiz-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#fff4ee] via-surface to-[#fbe7de]"
      >
        <div className="quiz-glow-a absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="quiz-glow-b absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#ffb37a]/30 blur-3xl" />
      </div>

      <div className={["relative z-10 w-full", wide ? "max-w-2xl" : "max-w-lg"].join(" ")}>
        {children}
      </div>
    </main>
  );
}
