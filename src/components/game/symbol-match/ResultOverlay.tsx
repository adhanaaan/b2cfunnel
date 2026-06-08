import type { ResultType } from "./useResult";

/** Green tick / red cross flash on each answer (ported feel). */
export function ResultOverlay({ result }: { result: ResultType }) {
  if (!result) return null;
  const ok = result === "success";
  return (
    <div className="pointer-events-none absolute inset-0 z-50 c">
      <svg viewBox="0 0 96 96" className="size-48 drop-shadow-lg">
        <circle cx="48" cy="48" r="44" fill={ok ? "#22c55e" : "#ef4444"} />
        {ok ? (
          <path
            d="M30 50l12 12 24-26"
            fill="none"
            stroke="#fff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M34 34l28 28M62 34L34 62"
            fill="none"
            stroke="#fff"
            strokeWidth="7"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}
