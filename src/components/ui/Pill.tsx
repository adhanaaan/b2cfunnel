interface PillProps {
  label: string;
}

/** Coral "what's driving this" factor chip. */
export function Pill({ label }: PillProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-pill-bg px-3.5 py-1.5 text-sm font-semibold text-pill-text">
      {label}
    </span>
  );
}
