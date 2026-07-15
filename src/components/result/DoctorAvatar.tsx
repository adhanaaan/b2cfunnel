"use client";

import { useState } from "react";

interface DoctorAvatarProps {
  image?: string;
  initials: string;
  className?: string;
}

/**
 * Doctor avatar: shows the photo when available, otherwise falls back to the
 * initials placeholder. The initials sit as a persistent background layer so we
 * don't depend on the <img> onLoad event (which can be missed for cached or
 * server-rendered images); the photo simply covers them once it paints.
 */
export function DoctorAvatar({
  image,
  initials,
  className = "h-16 w-16",
}: DoctorAvatarProps) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={`relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-dim text-xl font-bold text-outline ${className}`}
    >
      <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
        {initials}
      </span>
      {image && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />
      )}
    </span>
  );
}
