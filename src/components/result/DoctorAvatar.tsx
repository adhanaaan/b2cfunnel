"use client";

import { useState } from "react";

interface DoctorAvatarProps {
  image?: string;
  initials: string;
  className?: string;
}

/**
 * Doctor avatar: shows the photo when it loads, otherwise falls back to the
 * initials placeholder. This keeps the card graceful before the real photo is
 * uploaded to /public (drop-in, like the brand logo).
 */
export function DoctorAvatar({
  image,
  initials,
  className = "h-16 w-16",
}: DoctorAvatarProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(image) && !failed;

  return (
    <span
      className={`relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-dim text-xl font-bold text-outline ${className}`}
    >
      {/* Initials sit underneath; the photo covers them once it loads. */}
      {(!showImage || !loaded) && <span aria-hidden>{initials}</span>}
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </span>
  );
}
