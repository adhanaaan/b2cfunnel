/**
 * The event3 hero brain: the exported design render (glowing frontal lobe,
 * sparkle and label baked in), shown static per the design revision - no
 * spin, no drag.
 */
export function BrainHero({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/event3/brain.webp"
      alt=""
      draggable={false}
      className={`pointer-events-none select-none object-contain ${className}`}
    />
  );
}
