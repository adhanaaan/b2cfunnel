/**
 * Inline icons for the Speed Game result screen, recreated from the design's
 * named glyphs (humbleicons:share, stash:arrow-retry-duotone,
 * ant-design:question-circle-outlined). Stroke/fill follow currentColor so
 * they can sit on the gradient-label buttons.
 */

export function ShareIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9 11.5H6.5A1.5 1.5 0 0 0 5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13a1.5 1.5 0 0 0-1.5-1.5H15" />
      <path d="M12 15V4m0 0L9 7m3-3 3 3" />
    </svg>
  );
}

export function RetryIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
      <path d="M17.8 2.8v4h-4" />
    </svg>
  );
}

export function QuestionCircleIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.3 9.2a2.8 2.8 0 1 1 4.2 2.9c-.9.6-1.5 1.1-1.5 2.2v.3" />
      <circle cx="12" cy="17.4" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
