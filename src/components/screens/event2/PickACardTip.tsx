"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { TIPS, type TipCategory } from "@/config/tips";
import { track } from "@/lib/analytics";
import { generateTipCard, shareBlob } from "@/lib/shareCard";
import { springs } from "@/lib/motion";
import { useVariant } from "@/components/VariantContext";

/**
 * The pick-a-card moment (after the Max Mara "I wish for..." pattern the
 * design notes point at): three face-down cards fanned under "I want to…";
 * the chosen one flips into a cream poster tip card the player can save.
 */
export function PickACardTip({ playUrl }: { playUrl: string }) {
  const c = COPY.screens.event2.gameResult;
  const variant = useVariant();
  const reduced = useReducedMotion();
  const [chosen, setChosen] = useState<TipCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  const choose = (tip: TipCategory) => {
    setChosen(tip);
    setSavedNote(null);
    track("tip_selected", { variant, step: tip.id });
  };

  const saveCard = async () => {
    if (!chosen || saving) return;
    setSaving(true);
    try {
      const blob = await generateTipCard(chosen, playUrl);
      const outcome = await shareBlob(
        blob,
        `${chosen.headline}. Three brain care habits from the Brain Health Check.`,
        playUrl,
        "brain-care-card.png",
      );
      setSavedNote(
        outcome === "shared"
          ? "Shared."
          : outcome === "downloaded"
            ? "Saved. The caption is on your clipboard."
            : outcome === "copied"
              ? "Copied to your clipboard."
              : "Sharing is not available here.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8">
      <p className="text-center font-serif text-3xl font-semibold italic text-cream">
        {c.tipHeading}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {chosen === null ? (
          <motion.div
            key="fan"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24, transition: { duration: 0.18 } }}
            transition={springs.enter}
            className="mt-6 flex items-end justify-center gap-3"
          >
            {TIPS.map((tip, i) => (
              <motion.button
                key={tip.id}
                type="button"
                onClick={() => choose(tip)}
                whileTap={reduced ? undefined : { scale: 0.96 }}
                animate={
                  reduced
                    ? undefined
                    : { y: [0, -4, 0], transition: { duration: 3.5, repeat: Infinity, delay: i * 0.9 } }
                }
                className="group w-[30%] max-w-[130px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember-hot"
                style={{ rotate: `${(i - 1) * 8}deg`, translate: `0 ${i === 1 ? 0 : 8}px` }}
                aria-label={tip.label}
              >
                <span className="block aspect-[4/5] w-full rounded-xl border border-ember-core/50 bg-night-raised shadow-ember transition group-hover:border-ember-core">
                  {/* Card back: a quiet ember monogram. */}
                  <span className="flex h-full items-center justify-center font-serif text-4xl italic text-ember-shadow">
                    ?
                  </span>
                </span>
                <span className="mt-2 block text-center text-[13px] font-semibold leading-tight text-cream-dim">
                  {tip.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={chosen.id}
            className="mt-6 [perspective:1200px]"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <motion.div
              initial={reduced ? false : { rotateY: 180, scale: 0.7 }}
              animate={{ rotateY: 0, scale: 1 }}
              transition={springs.flip}
              className="mx-auto aspect-[4/5] w-full max-w-xs rounded-2xl bg-cream p-6 text-left shadow-ember [backface-visibility:hidden]"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ember-core">
                {chosen.eyebrow}
              </p>
              <p className="mt-2 font-serif text-[26px] font-semibold leading-tight text-[#2a1006]">
                {chosen.headline}
              </p>
              <ul className="mt-4 space-y-2.5">
                {chosen.tips.map((tip) => (
                  <li key={tip} className="flex gap-2 text-[13px] leading-snug text-charcoal">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-core" />
                    {tip}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[11px] font-bold text-ember-shadow">
                {playUrl.replace(/^https?:\/\//, "")}
              </p>
            </motion.div>

            <div className="mt-4 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={saveCard}
                disabled={saving}
                className="rounded-lg border border-night-stroke bg-night-raised px-4 py-2.5 text-sm font-bold text-cream transition hover:border-ember-core disabled:opacity-60"
              >
                {saving ? "Preparing…" : c.tipSaveCta}
              </button>
              <button
                type="button"
                onClick={() => setChosen(null)}
                className="text-sm font-semibold text-cream-dim underline-offset-4 hover:underline"
              >
                {c.tipPickAnother}
              </button>
            </div>
            {savedNote && (
              <p className="mt-2 text-center text-xs text-cream-faint" role="status">
                {savedNote}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
