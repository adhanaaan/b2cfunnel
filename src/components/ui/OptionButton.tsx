interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}

/** Large, tactile selection tile. Supports single- and multi-select styling. */
export function OptionButton({
  label,
  selected,
  onClick,
  multi = false,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "flex w-full items-center gap-3 rounded-lg border-2 px-5 py-4 text-left text-base font-medium transition",
        "shadow-card hover:-translate-y-0.5 hover:shadow-float",
        selected
          ? "border-primary bg-primary text-primary-on"
          : "border-outline-variant bg-surface-lowest text-charcoal hover:border-primary",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 transition",
          multi ? "rounded" : "rounded-full",
          selected ? "border-primary-on bg-primary-on" : "border-outline",
        ].join(" ")}
        aria-hidden
      >
        {selected && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-primary">
            <path
              d="M2 6l3 3 5-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </button>
  );
}
