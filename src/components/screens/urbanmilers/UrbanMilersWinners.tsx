"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { URBANMILERS_SOURCE } from "@/config/event";
import { displayName, formatTime } from "@/lib/format";
import { springs } from "@/lib/motion";

/**
 * The Urban Milers prize-giving: one full screen per winner, third first.
 *
 * Built to be looked at from the back of a room while somebody reads a name
 * out - an ember-night stage rather than the daylight the board runs in, so
 * the moment reads as a moment and not as more standings. Each reveal slams
 * its place in, bursts confetti, counts the time up and floats the prize in
 * behind it.
 *
 * Frozen by design. The standings are fetched once on mount and nothing polls
 * after, so a runner finishing mid-sentence cannot change the name on screen.
 * Re-reading is deliberate ("Take again"), and the time of the reading is
 * printed so it is never a guess.
 */

/** Third, then second, then first - the order a prize-giving is announced in. */
const PLACES = [
  {
    rank: 3,
    ordinal: "3rd",
    eyebrow: "Third place",
    prize: "$20 Starbucks Gift Card",
    image: "/images/urbanmilers/board/prize-3rd.png",
    accent: "#cd7f32",
    glow: "#8a4b1e",
  },
  {
    rank: 2,
    ordinal: "2nd",
    eyebrow: "Second place",
    prize: "$30 Grab voucher",
    image: "/images/urbanmilers/board/prize-2nd.png",
    accent: "#dbe3ee",
    glow: "#5d6b80",
  },
  {
    rank: 1,
    ordinal: "1st",
    eyebrow: "Fastest mind",
    prize: "A pair of Novablast 6",
    image: "/images/urbanmilers/board/prize-1st.png",
    accent: "#f7c15c",
    glow: "#b87313",
  },
] as const;

const INK = "#1a1210";
const CREAM = "#fff4ec";
const CREAM_DIM = "#d8b9a6";
const EMBER = "#f77528";

interface Entry {
  name: string;
  timeMs: number;
}

/** The confetti the boards use, thrown wider for a full-screen stage. */
function Burst({ seed, accent }: { seed: number; accent: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-1/2 flex justify-center"
    >
      {Array.from({ length: 34 }, (_, i) => (
        <span
          key={`${seed}-${i}`}
          className="animate-ember-burst absolute rounded-full"
          style={{
            width: i % 4 === 0 ? "1.5vh" : "1vh",
            height: i % 4 === 0 ? "1.5vh" : "1vh",
            background:
              i % 5 === 0 ? accent : i % 3 === 0 ? "#f7b731" : EMBER,
            ["--burst-x" as string]: `${Math.round(Math.sin(i * 1.7) * 44)}vh`,
            ["--burst-y" as string]: `${-14 - Math.round(Math.abs(Math.cos(i * 2.3)) * 34)}vh`,
            ["--burst-delay" as string]: `${(i % 7) * 0.05}s`,
            ["--burst-duration" as string]: "1.5s",
          }}
        />
      ))}
    </span>
  );
}

/** The time, counted up on reveal - the number earns its size. */
function CountUpTime({ timeMs, reduced }: { timeMs: number; reduced: boolean }) {
  const [shown, setShown] = useState(reduced ? timeMs : 0);
  useEffect(() => {
    if (reduced) {
      setShown(timeMs);
      return;
    }
    setShown(0);
    const DURATION = 620;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // Ease out, so it lands rather than stops.
      setShown(Math.round(timeMs * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [timeMs, reduced]);
  return <>{formatTime(shown)}</>;
}

function takenAtLabel(d: Date) {
  return d.toLocaleTimeString("en-SG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function UrbanMilersWinners() {
  const reduced = useReducedMotion() ?? false;
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

  // Advance on click, space or arrow - whatever the person at the laptop
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
  const ready = entries !== null && !failed;

  return (
    <main
      className="relative flex h-dvh w-screen cursor-pointer select-none flex-col overflow-hidden font-sans"
      style={{ background: INK, color: CREAM }}
      onClick={() => setStep((s) => Math.min(s + 1, PLACES.length - 1))}
    >
      {/* The stage: an ember glow that takes this place's colour. */}
      <motion.div
        aria-hidden
        key={`glow-${place.rank}`}
        className="pointer-events-none absolute inset-0"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: `radial-gradient(80% 60% at 50% 42%, ${place.glow}66 0%, ${INK} 70%)`,
        }}
      />

      {/* Masthead: GMS, which the board carries and this was missing. */}
      <header className="relative z-10 flex shrink-0 items-center justify-between px-[3vw] pt-[3vh]">
        <div className="flex items-center gap-[1.2vw]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gms-logo.png"
            alt="Gray Matter Solutions"
            className="h-[6vh] w-auto"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <div className="leading-tight">
            <p
              className="text-[1.5vh] font-bold uppercase tracking-[0.3em]"
              style={{ color: EMBER }}
            >
              Urban Milers · Prize giving
            </p>
            <p className="text-[1.4vh] font-semibold" style={{ color: CREAM_DIM }}>
              Reaction Time Challenge · Gray Matter Solutions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-[0.8vw]">
          {PLACES.map((p, i) => (
            <span
              key={p.rank}
              aria-hidden
              className="block h-[1vh] rounded-full transition-all duration-300"
              style={{
                width: i === step ? "4vw" : "1vh",
                background: i <= step ? EMBER : "#3e2a1f",
              }}
            />
          ))}
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-[6vw]">
        <AnimatePresence mode="wait">
          <motion.div
            key={place.rank}
            className="relative flex w-full flex-col items-center text-center"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.3 }}
          >
            {ready && entry && <Burst seed={place.rank} accent={place.accent} />}

            <motion.p
              className="text-[2.2vh] font-bold uppercase tracking-[0.36em]"
              style={{ color: CREAM_DIM }}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              {place.eyebrow}
            </motion.p>

            {/* The place slams in. */}
            <motion.p
              className="font-extrabold leading-[0.85] tracking-tight"
              style={{
                fontSize: "22vh",
                color: place.accent,
                textShadow: `0 0 8vh ${place.glow}aa`,
              }}
              initial={reduced ? false : { scale: 2.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springs.pop}
            >
              {place.ordinal}
            </motion.p>

            {!ready && (
              <p className="mt-[4vh] text-[3vh] font-semibold" style={{ color: CREAM_DIM }}>
                {failed ? "Could not read the standings — tap “Take again”." : "Reading the standings…"}
              </p>
            )}

            {ready && !entry && (
              <p className="mt-[3vh] text-[4vh] font-bold" style={{ color: CREAM_DIM }}>
                No {place.ordinal} place — not enough runners played.
              </p>
            )}

            {ready && entry && (
              <>
                <motion.p
                  className="mt-[1vh] max-w-[88vw] truncate font-extrabold leading-tight"
                  style={{ fontSize: "13vh" }}
                  initial={reduced ? false : { opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ ...springs.enter, delay: 0.16 }}
                >
                  {displayName(entry.name)}
                </motion.p>

                <motion.p
                  className="mt-[0.5vh] font-extrabold tabular-nums"
                  style={{ fontSize: "9vh", color: EMBER }}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <CountUpTime timeMs={entry.timeMs} reduced={reduced} />
                </motion.p>

                <motion.div
                  className="mt-[3.5vh] flex items-center gap-[1.6vw] rounded-full px-[2.4vw] py-[1.4vh]"
                  style={{ background: "#ffffff12", border: "1px solid #ffffff1f" }}
                  initial={reduced ? false : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.enter, delay: 0.42 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={place.image}
                    alt=""
                    className="h-[11vh] w-auto object-contain drop-shadow-2xl"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <p className="text-[3.6vh] font-extrabold">{place.prize}</p>
                </motion.div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Operator strip. Dim on purpose: the room reads the name, not this. */}
      <footer
        className="relative z-10 flex shrink-0 items-center justify-between px-[3vw] pb-[2.5vh] text-[1.4vh]"
        style={{ color: "#a8877a" }}
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
            className="rounded-full px-[1.4vw] py-[0.8vh] text-[1.4vh] font-bold"
            style={{ background: "#ffffff14", border: "1px solid #ffffff2b", color: CREAM }}
          >
            Take again
          </button>
        </span>
      </footer>
    </main>
  );
}
