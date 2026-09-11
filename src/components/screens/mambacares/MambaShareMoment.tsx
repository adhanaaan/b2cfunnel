"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { MAMBACARES_DONATION_URL } from "@/config/mambacares";
import { generateMambaStoryCard } from "@/lib/mambaStoryCard";
import { shareBlob } from "@/lib/shareCard";
import { springs } from "@/lib/motion";
import { ShareIcon } from "@/components/screens/event3/icons";
import { donateButtonClass } from "./ui";

const SEEN_KEY = "mamba_share_moment_seen";
const OPEN_DELAY_MS = 1100;

interface MambaShareMomentProps {
  name?: string;
  timeMs?: number;
  rank?: number | null;
  total?: number | null;
}

/**
 * The share moment: the report's first beat, instead of a button somebody has
 * to notice.
 *
 * It opens once, a beat after the header has landed (the sticky CTA arrives at
 * 0.7s - this comes in behind it), shows the story card that would be shared,
 * and asks. Dismiss is remembered for the session so a retake does not re-ask.
 *
 * It never calls navigator.share() by itself. iOS only opens a share sheet
 * inside a real tap, so an automatic one would be blocked and the moment spent
 * for nothing: the sheet is the prompt, the tap is the share. The card is
 * generated while the sheet animates in, for the same reason - by the time the
 * button can be pressed the blob is already waiting.
 */
export function MambaShareMoment({
  name,
  timeMs,
  rank,
  total,
}: MambaShareMomentProps) {
  const reduced = useReducedMotion();
  const qrHostRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<Blob | null>(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  // Open once per session, and only when there is a time worth sharing.
  useEffect(() => {
    if (timeMs == null) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      /* private mode: just show it */
    }
    const t = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(t);
  }, [timeMs]);

  // Draw the card as the sheet animates in, so the tap keeps its gesture.
  useEffect(() => {
    if (!open || timeMs == null || cardRef.current) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      const qrCanvas = qrHostRef.current?.querySelector("canvas") ?? null;
      const blob = await generateMambaStoryCard({
        name,
        timeMs,
        rank: rank ?? undefined,
        total: total ?? undefined,
        qrCanvas,
      });
      if (cancelled || !blob) return;
      cardRef.current = blob;
      setPreview(URL.createObjectURL(blob));
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [open, name, timeMs, rank, total]);

  // Release the preview object URL when the sheet goes away.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* nothing to remember it with; it will ask again next report */
    }
  };

  const share = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const outcome = await shareBlob(
        cardRef.current,
        "I tested my brain processing speed at the #MambaCares run. Help us reach our goal for Dementia Singapore:",
        MAMBACARES_DONATION_URL,
        "mambacares-brain-speed.png",
      );
      if (outcome === "shared") {
        close();
        return;
      }
      setNote(
        outcome === "downloaded"
          ? "Card saved. The caption is on your clipboard."
          : outcome === "copied"
            ? "Copied to your clipboard."
            : "Sharing is not available here.",
      );
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      {/* The QR the card is stamped with - the donation link, as printed. */}
      <div ref={qrHostRef} className="hidden" aria-hidden>
        <QRCodeCanvas value={MAMBACARES_DONATION_URL} size={240} marginSize={0} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute inset-0 bg-[#2d1a10]/45 backdrop-blur-[2px]"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Share your result"
              className="relative w-full max-w-lg rounded-t-[28px] bg-[#fff8f3] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-[0_-20px_50px_-24px_rgba(90,40,10,0.5)]"
              initial={reduced ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={reduced ? undefined : { y: "100%" }}
              transition={springs.enter}
            >
              <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[#e7cdbb]" />

              <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#c2410c]">
                Your result
              </p>
              <h2 className="mt-1.5 text-center text-[22px] font-extrabold leading-tight text-[#171717]">
                Share it, and the cause with it
              </h2>
              <p className="mx-auto mt-1.5 max-w-xs text-center text-[13px] leading-normal text-[#6b5245]">
                Your card carries the fundraiser. Every share puts the link in
                front of someone new.
              </p>

              <div className="mt-4 flex justify-center">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Your shareable result card"
                    className="h-[36dvh] w-auto rounded-2xl border border-[#f2ddce] object-contain shadow-[0_10px_30px_-18px_rgba(90,40,10,0.6)]"
                  />
                ) : (
                  <div className="h-[36dvh] w-[calc(36dvh*9/16)] animate-pulse rounded-2xl border border-[#f2ddce] bg-[#fdf1e7]" />
                )}
              </div>

              {note && (
                <p role="status" className="mt-3 text-center text-[12px] text-[#8a6a58]">
                  {note}
                </p>
              )}

              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={share}
                  disabled={sharing || !preview}
                  className={`${donateButtonClass} disabled:opacity-60`}
                >
                  <ShareIcon className="h-[22px] w-[22px]" />
                  {sharing ? "Sharing…" : "Share my card"}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="py-2 text-center text-[13px] font-semibold text-[#8a6a58] underline underline-offset-2"
                >
                  Not now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
