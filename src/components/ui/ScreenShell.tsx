interface ScreenShellProps {
  children: React.ReactNode;
  wide?: boolean;
}

/**
 * Centred, responsive container shared by every screen. Carries the premium
 * gradient backdrop + ambient glow across the whole quiz.
 */
export function ScreenShell({ children, wide = false }: ScreenShellProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-gradient-to-b from-[#fff4ee] via-surface to-[#fbe7de] px-4 py-8 sm:py-12">
      {/* Premium ambient glow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#ffb37a]/30 blur-3xl"
      />

      <div className={["relative w-full", wide ? "max-w-2xl" : "max-w-lg"].join(" ")}>
        {children}
      </div>
    </main>
  );
}
