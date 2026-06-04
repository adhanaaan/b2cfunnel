interface ScreenShellProps {
  children: React.ReactNode;
  wide?: boolean;
}

/** Centred, responsive container shared by every screen. */
export function ScreenShell({ children, wide = false }: ScreenShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:py-12">
      <div className={wide ? "w-full max-w-2xl" : "w-full max-w-lg"}>
        {children}
      </div>
    </main>
  );
}
