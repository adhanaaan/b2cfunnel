"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

/**
 * An image that may not have been uploaded yet. While the file is missing the
 * `fallback` renders in its place (or nothing), never a broken-image icon;
 * the moment the file lands under public/ it appears with no code change.
 * `onMissing` lets a parent hide a frame that would otherwise sit empty.
 *
 * Kept invisible until it has actually loaded. On a server-rendered screen
 * (the landing) a missing file's error fires before React has attached
 * onError, so the mount effect reads the element's own state instead: a
 * complete image with no natural width is a missing one.
 */
export function OptionalImage({
  src,
  alt,
  className = "",
  style,
  fallback = null,
  onMissing,
}: {
  src: string;
  alt: string;
  className?: string;
  /** For sizing a frame the class list cannot express (a flex ratio). */
  style?: CSSProperties;
  fallback?: ReactNode;
  onMissing?: () => void;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"pending" | "loaded" | "missing">(
    "pending",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || !el.complete) return;
    setState(el.naturalWidth > 0 ? "loaded" : "missing");
  }, []);

  useEffect(() => {
    if (state === "missing") onMissing?.();
  }, [state, onMissing]);

  if (state === "missing") return <>{fallback}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      style={style}
      className={`${className} ${state === "loaded" ? "" : "invisible"}`.trim()}
      onLoad={() => setState("loaded")}
      onError={() => setState("missing")}
    />
  );
}
