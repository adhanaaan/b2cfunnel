"use client";

import { useState } from "react";

interface CredibilitySignalsProps {
  heading?: string;
  points: string[];
  logo?: string;
  className?: string;
}

/**
 * Institutional / evidence credibility block. Leans on the partner institution
 * and the published science. The logo degrades gracefully — if the file isn't
 * present it simply renders nothing (so a not-yet-uploaded asset never shows a
 * broken image), and appears automatically once the file exists.
 */
export function CredibilitySignals({
  heading,
  points,
  logo,
  className = "",
}: CredibilitySignalsProps) {
  const [logoOk, setLogoOk] = useState(true);
  return (
    <div
      className={`rounded-xl border border-outline-variant bg-surface-low px-4 py-3 text-left ${className}`}
    >
      {heading && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          {heading}
        </p>
      )}
      <ul className={heading ? "mt-2 space-y-1.5" : "space-y-1.5"}>
        {points.map((p) => (
          <li key={p} className="flex gap-2 text-xs leading-snug text-charcoal">
            <svg viewBox="0 0 16 16" className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary">
              <path
                d="M3 8.5l3 3 7-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      {logo && logoOk && (
        <div className="mt-3 flex justify-center border-t border-outline-variant pt-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt="Gray Matter Solutions and NTU Lee Kong Chian School of Medicine"
            onError={() => setLogoOk(false)}
            className="h-auto w-full max-w-[180px]"
          />
        </div>
      )}
    </div>
  );
}
