"use client";

import type { ReactNode } from "react";
import { useState } from "react";

/**
 * An image that may not have been uploaded yet. While the file is missing the
 * `fallback` renders in its place (or nothing), never a broken-image icon;
 * the moment the file lands under public/ it appears with no code change.
 * `onMissing` lets a parent hide a frame that would otherwise sit empty.
 */
export function OptionalImage({
  src,
  alt,
  className = "",
  fallback = null,
  onMissing,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: ReactNode;
  onMissing?: () => void;
}) {
  const [missing, setMissing] = useState(false);
  if (missing) return <>{fallback}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        setMissing(true);
        onMissing?.();
      }}
    />
  );
}
