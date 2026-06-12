"use client";

import { useState } from "react";

export interface PressItem {
  alt: string;
  src: string; // path under /public to the press logo
}

/** A single press logo that hides itself if the image isn't present yet. */
function PressLogo({ src, alt }: PressItem) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setOk(false)}
      className="h-7 w-auto object-contain opacity-80 sm:h-8"
    />
  );
}

/**
 * "As seen on" press logos. Each logo degrades gracefully — a not-yet-uploaded
 * asset simply renders nothing rather than a broken image, and appears once the
 * file exists in /public.
 */
export function PressLogos({
  items,
  className = "",
}: {
  items: PressItem[];
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-3 ${className}`}
    >
      {items.map((it) => (
        <PressLogo key={it.alt} {...it} />
      ))}
    </div>
  );
}
