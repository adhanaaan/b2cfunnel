"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { URBANMILERS_SOURCE } from "@/config/event";
import { displayName, formatTime } from "@/lib/format";
import { springs } from "@/lib/motion";

/**
 * The Urban Milers prize-giving: one full screen per winner, third first.
 *
 * Frozen by design. The standings are fetched once on mount and kept in a ref
 * that nothing polls, so the name on the screen cannot change while somebody
 * is reading it out. Re-reading is a deliberate act ("Take again"), and the
 * time of the reading is printed so it is never a guess.
 */

/** Third, then second, then first - the order a prize-giving is announced in. */
const PLACES = [
  {
    rank: 3,
    ordinal: "3rd",
    eyebrow: "Third place",
    prize: "$20 Starbucks Gift Card",
    image: "/images/urbanmilers/board/prize-3rd.png",
    accent: "#d99058",
  },
  {
    rank: 2,
    ordinal: "2nd",
    eyebrow: "Second place",
    prize: "$30 Grab voucher",
    image: "/images/urbanmilers/board/prize-2nd.png",
    accent: "#c3cad6",
  },
  {
    rank: 1,
    ordinal: "1st",
    eyebrow: "Fastest mind",
    prize: "A pair of Novablast 6",
    image: "/images/urbanmilers/board/prize-1st.png",
    accent: "#f7b731",
  },
] as const;

const CREAM = "#fff4ec";
const CHARCOAL = "#2d2d2d";
const INK_SOFT = "#7d5747";
const EMBER = "#f77528";

interface Entry {
  name: string;
  timeMs: number;
}

function takenAtLabel(d: Date) {
  return d.toLocaleTimeString("en-SG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function UrbanMilersWinners() {
  const reduced = useReducedMotion();
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [takenAt, setTakenAt] = useState<Date | null>(null);
  const [failed, setFailed] = useState(false);
  const [step, setStep] = useState(0);
  const loading = useRef(false);

  /** Read the standings once. Nothing here is on a timer. */
  const take = useCallback(async () => {
    if (loading.current) return;
    loading.current = true;
    try {
      const res = await fetch(
        `/api/leaderboard?limit=3&source=${encodeURIComponent(URBANMILERS_SOURCE)}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      if (!Array.isArray(data.entries)) throw new Error("bad payload");
      setEntries(data.entries as Entry[]);
      setTakenAt(new Date());
      setFailed(false);
      setStep(0);
    } catch {
      setFailed(true);
    } finally {
      loading.current = false;
    }
  }, []);

  useEffect(() => {
    void take();
  }, [take]);

  // Advance on click, space, or arrow - whatever the person at the laptop
  // reaches for. Back is there because prize-givings get interrupted.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setStep((s) => Math.min(s + 1, PLACES.length - 1));
      }
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const place = PLACES[step];
  const entry = entries?.[place.rank - 1] ?? null;

  return (
    <main
      className="relative flex h-dvh w-screen cursor-pointer flex-col overflow-hidden"
      style={{ background: CREAM, color: CHARCOAL }}
      onClick={() => setStep((s) => Math.min(s + 1, PLACES.length - 1))}
    >
      {/* Progress: which of the three is on screen. */}
      <div className="flex shrink-0 items-center justify-between px-[3vw] pt-[3vh]">
        <p
          className="text-[1.6vh] font-bold uppercase tracking-[0.3em]"
          style={{ color: EMBER }}
        >
          Urban Milers · Prize giving
        </p>
        <div className="flex items-center gap-[0.8vw]">
          {PLACES.map((p, i) => (
            <span
              key={p.rank}
              aria-hidden
              className="block h-[1vh] rounded-full transition-all"
              style={{
                width: i === step ? "4vw" : "1vh",
                background: i <= step ? EMBER : "#e7cdbb",
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-[6vw]">
        <AnimatePresence mode="wait">
          <motion.div
            key={place.rank}
            className="flex w-full max-w-[80vw] flex-col items-center text-center"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -20 }}
            transition={springs.enter}
          >
            <p
              className="text-[2.4vh] font-bold uppercase tracking-[0.32em]"
              style={{ color: INK_SOFT }}
            >
              {place.eyebrow}
            </p>

            <p
              className="mt-[1vh] font-extrabold leading-none tracking-tight"
              style={{ fontSize: "16vh", color: place.accent }}
            >
              {place.ordinal}
            </p>

            {entries === null && !failed && (
              <p className="mt-[4vh] text-[3vh] font-semibold" style={{ color: INK_SOFT }}>
                Reading the standings…
              </p>
            )}

            {failed && (
              <p className="mt-[4vh] text-[3vh] font-semibold" style={{ color: INK_SOFT }}>
                Could not read the standings. Tap “Take again”.
              </p>
            )}

            {entries !== null && !failed && (
              entry ? (
                <>
                  <p
                    className="mt-[2vh] max-w-full truncate font-extrabold leading-tight"
                    style={{ fontSize: "11vh" }}
                  >
                    {displayName(entry.name)}
                  </p>
                  <p
                    className="mt-[1vh] font-extrabold tabular-nums"
                    style={{ fontSize: "7vh", color: EMBER }}
                  >
                    {formatTime(entry.timeMs)}
                  </p>
                </>
              ) : (
                // Fewer than three played: say so rather than showing a blank
                // podium with a prize under it.
                <p className="mt-[3vh] text-[4vh] font-bold" style={{ color: INK_SOFT }}>
                  No {place.ordinal} place — not enough runners played.
                </p>
              )
            )}

            {entry && (
              <div className="mt-[4vh] flex items-center gap-[1.6vw]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={place.image}
                  alt=""
                  className="h-[12vh] w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <p className="text-[3.4vh] font-bold" style={{ color: CHARCOAL }}>
                  {place.prize}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Operator strip. Small on purpose: the room reads the name, not this. */}
      <div
        className="flex shrink-0 items-center justify-between px-[3vw] pb-[2.5vh] text-[1.5vh]"
        style={{ color: INK_SOFT }}
      >
        <span>
          {step < PLACES.length - 1
            ? "Click, space or → for the next winner"
            : "Last winner · ← to go back"}
        </span>
        <span className="flex items-center gap-[1.2vw]">
          {takenAt && <span>Standings taken at {takenAtLabel(takenAt)}</span>}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void take();
            }}
            className="rounded-full px-[1.4vw] py-[0.8vh] text-[1.5vh] font-bold"
            style={{ background: "#fff", border: `1px solid #e7cdbb`, color: CHARCOAL }}
          >
            Take again
          </button>
        </span>
      </div>
    </main>
  );
}
