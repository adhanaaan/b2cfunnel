"use client";

import { useState } from "react";
import { SharpShotPoster } from "@/components/screens/twentyTwoGrams/SharpShotPoster";
import {
  SHARP_SHOT_THRESHOLD_LABEL,
  SHARP_SHOT_THRESHOLD_MS,
  isSharpShot,
} from "@/config/twentyTwoGrams";
import { formatStamp } from "@/lib/format";

/**
 * The controls behind /22grams/poster-preview: type a name, a time and a
 * moment, open the poster.
 *
 * The time box is deliberately NOT limited to qualifying runs. Part of what
 * this page is for is checking the rule itself - the panel says, for the
 * number typed in, whether the funnel would have raised the poster - so a
 * reviewer can see 29.9 earn it and 30.0 not, which is the boundary most
 * likely to be argued about.
 */

/** A sensible opening state: the run on the printed poster. */
const DEFAULT_SECONDS = "28.5";
const DEFAULT_NAME = "Konstance";

const field =
  "w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-[15px] text-charcoal outline-none transition focus:border-ember-core focus:ring-2 focus:ring-ember-core/30";
const label = "text-[12px] font-bold uppercase tracking-[0.18em] text-secondary";

export function SharpShotPosterPreview() {
  const [name, setName] = useState(DEFAULT_NAME);
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS);
  // A datetime-local value ("2026-09-21T12:35"), empty meaning "right now".
  const [stampInput, setStampInput] = useState("");
  const [open, setOpen] = useState(false);

  const parsed = Number(seconds);
  const timeMs = Number.isFinite(parsed) ? Math.round(parsed * 1000) : undefined;
  const qualifies = isSharpShot(timeMs);

  const stampAt = stampInput ? new Date(stampInput).getTime() : undefined;
  const finishedAt = Number.isFinite(stampAt) ? stampAt : undefined;

  return (
    <main className="min-h-dvh bg-surface px-5 py-10">
      <div className="mx-auto w-full max-w-md">
        <p className="text-[12px] font-bold uppercase tracking-[0.26em] text-primary">
          22 Grams · internal
        </p>
        <h1 className="mt-2 text-[26px] font-extrabold leading-tight text-charcoal">
          Sharp Shot poster preview
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-secondary">
          The poster players get for beating the clock, without having to beat
          it. This is the same component <code>/22grams</code> raises after a
          qualifying run, so what you see here is what they get.
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-outline">
          Nothing on this page is recorded: no score, no lead, no analytics, and
          nothing reaches the leaderboard.
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label className={label} htmlFor="preview-name">
              Name
            </label>
            <input
              id="preview-name"
              className={`${field} mt-2`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Konstance"
            />
          </div>

          <div>
            <label className={label} htmlFor="preview-seconds">
              Time (seconds)
            </label>
            <input
              id="preview-seconds"
              className={`${field} mt-2 tabular-nums`}
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              inputMode="decimal"
              placeholder={DEFAULT_SECONDS}
            />
            <p className="mt-2 text-[13px] leading-snug text-secondary">
              {timeMs == null ? (
                <span className="text-error">Not a number.</span>
              ) : qualifies ? (
                <>
                  <strong className="text-primary">Earns the drink.</strong>{" "}
                  Under {SHARP_SHOT_THRESHOLD_LABEL}, so the funnel raises the
                  poster.
                </>
              ) : (
                <>
                  <strong>No drink.</strong> The funnel only raises the poster
                  under {SHARP_SHOT_THRESHOLD_LABEL} (
                  {SHARP_SHOT_THRESHOLD_MS / 1000}.0 exactly does not count).
                  You can still open it here to check the layout.
                </>
              )}
            </p>
          </div>

          <div>
            <label className={label} htmlFor="preview-stamp">
              Recorded at
            </label>
            <input
              id="preview-stamp"
              type="datetime-local"
              className={`${field} mt-2`}
              value={stampInput}
              onChange={(e) => setStampInput(e.target.value)}
            />
            <p className="mt-2 text-[13px] text-secondary">
              Leave empty for now (
              <span className="tabular-nums">{formatStamp(new Date())}</span>).
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full rounded-full bg-gradient-to-r from-ember-core to-ember-bright px-6 py-4 text-[15px] font-bold text-white shadow-card transition hover:opacity-95"
          >
            Show the poster
          </button>

          <p className="text-center text-[13px] text-outline">
            Close it with Continue, or Escape.
          </p>
        </div>
      </div>

      <SharpShotPoster
        open={open}
        name={name.trim() || undefined}
        timeMs={timeMs}
        finishedAt={finishedAt}
        onClose={() => setOpen(false)}
      />
    </main>
  );
}
