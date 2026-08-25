"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

/** The exported design asset: glowing frontal lobe, sparkle and label baked in. */
const BRAIN_SRC = "/images/event3/brain.webp";

/** Cruise speed of the idle spin, degrees per second. Slow, showroom-like. */
const BASE_SPEED = 24;
/** Degrees of rotation per pixel of horizontal drag. */
const DRAG_FACTOR = 0.6;
/** Fling velocity cap, degrees per second. */
const MAX_FLING = 720;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/**
 * The landing/result hero brain: idles on a slow 360deg Y-axis spin, and the
 * user can grab it to spin it themselves - a release flings it with the drag
 * momentum, easing back to the cruise speed (keeping the flung direction).
 * Honours prefers-reduced-motion by rendering the brain static.
 */
export function SpinningBrain({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const rotateY = useMotionValue(0);
  const velocity = useRef(BASE_SPEED);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastT = useRef(0);

  useAnimationFrame((_, delta) => {
    if (reduced || dragging.current || delta <= 0) return;
    // Ease any fling back toward cruise speed, preserving spin direction.
    const target = velocity.current >= 0 ? BASE_SPEED : -BASE_SPEED;
    velocity.current += (target - velocity.current) * Math.min(1, delta / 900);
    rotateY.set(rotateY.get() + (velocity.current * delta) / 1000);
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    dragging.current = true;
    lastX.current = e.clientX;
    lastT.current = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const now = performance.now();
    const dx = e.clientX - lastX.current;
    const dt = Math.max(1, now - lastT.current);
    lastX.current = e.clientX;
    lastT.current = now;
    rotateY.set(rotateY.get() + dx * DRAG_FACTOR);
    velocity.current = clamp(
      (dx * DRAG_FACTOR * 1000) / dt,
      -MAX_FLING,
      MAX_FLING,
    );
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ perspective: 900, touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="img"
      aria-label="A warm 3D brain, slowly spinning. Drag to spin it yourself."
    >
      <motion.div
        className="h-full w-full cursor-grab active:cursor-grabbing"
        style={{ rotateY, transformStyle: "preserve-3d" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BRAIN_SRC}
          alt=""
          draggable={false}
          className="pointer-events-none h-full w-full select-none object-contain"
        />
      </motion.div>
    </div>
  );
}
