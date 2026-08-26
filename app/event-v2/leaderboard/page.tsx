"use client";

/**
 * The 55-inch attract screen for /event-v2 (16:9, read from 2-5m away).
 * Ember-night theme: live top-8 standings with spring rank shuffles, a
 * breathing QR halo as the across-the-hall eye-catcher, a rotating brain-fact
 * strip, and a queued full-screen celebration when someone enters the podium.
 * Self-contained: polls /api/leaderboard every 8s and keeps the last good
 * standings on error.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { formatTime } from "@/lib/format";
import { EVENT2_PAUSED } from "@/config/event";
import { BRAIN_FACTS } from "@/config/tips";
import { springs } from "@/lib/motion";

interface Entry {
  name: string;
  timeMs: number;
}

const TOP_N = 8;
const POLL_MS = 8000;
const FACT_MS = 8000;
const PRIZE = "$50 Grab Voucher";

// Night board palette (kept local: the board is its own full-bleed canvas).
const INK = "#1a1210";
const RAISED = "#261812";
const STROKE = "#3e2a1f";
const EMBER = "#f77528";
const EMBER_BRIGHT = "#ff9a4d";
const CREAM = "#fff4ec";
const CREAM_DIM = "#d8b9a6";
const CREAM_FAINT = "#a8877a";
const GOLD = "#f7c15c";
const RANK_COLOR = [GOLD, "#9aa3b2", "#cd7f32"];

const HOW_TO = ["Scan the code", "Match 20 symbols, fast", "Top the board"];

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

const keyOf = (e: Entry) => `${e.name}·${Math.round(e.timeMs)}`;

/** Prize image at /public/prize.{webp,png,jpg} if present, else a brain. */
const PRIZE_SRCS = ["/prize.webp", "/prize.png", "/prize.jpg"];
function PrizeImage() {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const s of PRIZE_SRCS) {
        const ok = await new Promise<boolean>((res) => {
          const img = new Image();
          img.onload = () => res(true);
          img.onerror = () => res(false);
          img.src = s;
        });
        if (cancelled) return;
        if (ok) {
          setSrc(s);
          return;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  if (!src) return <span className="text-[10vh] leading-none">🧠</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={PRIZE} className="max-h-[16vh] w-auto rounded-xl object-contain" />;
}

export default function LeaderboardV2Board() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [total, setTotal] = useState(0);
  const [playUrl, setPlayUrl] = useState("");
  const [factIdx, setFactIdx] = useState(0);
  const [celebration, setCelebration] = useState<Entry | null>(null);
  const prevTopRef = useRef<Set<string>>(new Set());
  const firstLoadRef = useRef(true);
  const queueRef = useRef<Entry[]>([]);
  const busyRef = useRef(false);

  useEffect(() => {
    setPlayUrl(`${window.location.origin}/event-v2`);
  }, []);

  // Celebration queue: play one 4s takeover at a time, never overlapping.
  const pump = () => {
    if (busyRef.current) return;
    const nextUp = queueRef.current.shift();
    if (!nextUp) return;
    busyRef.current = true;
    setCelebration(nextUp);
    setTimeout(() => {
      setCelebration(null);
      // Let the exit animation finish before the next takeover.
      setTimeout(() => {
        busyRef.current = false;
        pump();
      }, 500);
    }, 4000);
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/leaderboard?limit=${TOP_N}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!active || !Array.isArray(data.entries)) return;
        const next: Entry[] = data.entries;
        setEntries(next);
        setTotal(data.total ?? next.length);

        // New podium entrants (skip the very first load: nothing is "new").
        const podium = next.slice(0, 3);
        if (!firstLoadRef.current && !EVENT2_PAUSED) {
          for (const e of podium) {
            if (!prevTopRef.current.has(keyOf(e))) queueRef.current.push(e);
          }
          pump();
        }
        prevTopRef.current = new Set(podium.map(keyOf));
        firstLoadRef.current = false;
      } catch {
        /* keep last good standings */
      }
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(
      () => setFactIdx((i) => (i + 1) % (BRAIN_FACTS.length + 1)),
      FACT_MS,
    );
    return () => clearInterval(id);
  }, []);

  const rows = Array.from({ length: TOP_N }, (_, i) => entries[i] ?? null);
  const leader = entries[0] ?? null;
  // Every (facts+1)th slot shows the how-to instead of a fact.
  const showHowTo = factIdx === BRAIN_FACTS.length;

  return (
    <main
      className="ember-night relative flex h-screen w-screen flex-col overflow-hidden font-sans"
      style={{ color: CREAM }}
    >
      {/* Ambient embers (CSS loops only; the board runs for hours). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { left: "6%", size: 8, o: 0.5, d: 16, delay: 0, drift: 30 },
          { left: "16%", size: 6, o: 0.35, d: 20, delay: 4, drift: -24 },
          { left: "30%", size: 9, o: 0.55, d: 14, delay: 8, drift: 20 },
          { left: "44%", size: 6, o: 0.4, d: 18, delay: 2, drift: -30 },
          { left: "58%", size: 8, o: 0.5, d: 15, delay: 10, drift: 26 },
          { left: "72%", size: 6, o: 0.35, d: 19, delay: 6, drift: -20 },
          { left: "84%", size: 9, o: 0.5, d: 13, delay: 12, drift: 24 },
          { left: "93%", size: 6, o: 0.4, d: 17, delay: 3, drift: -28 },
        ].map((e, i) => (
          <span
            key={i}
            className="animate-ember-float absolute bottom-0 rounded-full blur-[1px]"
            style={{
              left: e.left,
              width: e.size,
              height: e.size,
              background: EMBER_BRIGHT,
              ["--ember-opacity" as string]: e.o,
              ["--ember-duration" as string]: `${e.d}s`,
              ["--ember-delay" as string]: `${e.delay}s`,
              ["--ember-drift" as string]: `${e.drift}px`,
            }}
          />
        ))}
        <div className="absolute inset-0 [background:radial-gradient(closest-side,transparent_74%,rgba(0,0,0,0.4))]" />
      </div>

      {/* Masthead */}
      <header
        className="relative z-10 flex shrink-0 items-end justify-between px-[3vw] pb-[1.6vh] pt-[2.4vh]"
        style={{ borderBottom: `1px solid ${STROKE}` }}
      >
        <div className="flex items-center gap-[1.2vw]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/gms-logo.png" alt="Gray Matter Solutions" className="h-[5vh] w-auto brightness-0 invert opacity-90" />
          <div>
            <p className="text-[1.8vh] font-bold uppercase tracking-[0.3em]" style={{ color: EMBER }}>
              Reaction Time Challenge
            </p>
            <h1 className="font-serif text-[5.6vh] font-semibold leading-none" style={{ color: CREAM }}>
              The Fastest Minds Today
            </h1>
          </div>
        </div>
        <p
          className="flex items-center gap-[0.6vw] rounded-full px-[1.4vw] py-[1vh] text-[2vh] font-bold"
          style={{ background: RAISED, border: `1px solid ${STROKE}`, color: CREAM_DIM }}
        >
          {EVENT2_PAUSED ? (
            "Final standings"
          ) : (
            <>
              <span
                className="animate-live-pulse inline-block h-[1.4vh] w-[1.4vh] rounded-full"
                style={{ background: EMBER }}
              />
              LIVE
            </>
          )}
        </p>
      </header>

      {/* Body: standings | engage rail */}
      <div className="relative z-10 flex min-h-0 flex-1 gap-[1.6vw] px-[3vw] py-[2.2vh]">
        {/* Standings, top 8, hero leader row. */}
        <section className="flex min-h-0 flex-[1.5] flex-col">
          <ol className="flex min-h-0 flex-1 flex-col gap-[1vh]">
            {rows.map((e, i) => {
              const podium = i < 3;
              const isLeader = i === 0 && !!e;
              return (
                <motion.li
                  key={e ? keyOf(e) : `empty-${i}`}
                  layout
                  transition={springs.shuffle}
                  className="flex items-center gap-[1.1vw] rounded-[1vw] px-[1.2vw]"
                  style={{
                    flex: isLeader ? 1.6 : 1,
                    background: isLeader ? `${EMBER}1f` : RAISED,
                    border: isLeader ? `2px solid ${EMBER}90` : `1px solid ${STROKE}`,
                    boxShadow: isLeader
                      ? `0 0 6vh -1vh ${EMBER}80`
                      : undefined,
                  }}
                >
                  <span
                    className="flex aspect-square shrink-0 items-center justify-center rounded-full font-extrabold"
                    style={{
                      height: isLeader ? "6vh" : "4.6vh",
                      fontSize: isLeader ? "3vh" : "2.2vh",
                      background: podium ? RANK_COLOR[i] : "#3a2a20",
                      color: podium ? "#2a1006" : CREAM_DIM,
                    }}
                  >
                    {i + 1}
                  </span>

                  {e ? (
                    <>
                      <span
                        className="flex aspect-square shrink-0 items-center justify-center rounded-full font-bold"
                        style={{
                          height: isLeader ? "5.4vh" : "4.2vh",
                          fontSize: isLeader ? "2.2vh" : "1.8vh",
                          background: `${EMBER}22`,
                          color: EMBER_BRIGHT,
                        }}
                      >
                        {initials(e.name)}
                      </span>
                      <span
                        className="flex-1 truncate font-bold"
                        style={{ fontSize: isLeader ? "4.4vh" : "3.2vh", color: CREAM }}
                      >
                        {e.name}
                      </span>
                      {isLeader ? (
                        <span className="flex flex-col items-end leading-none">
                          <span
                            className="text-[1.4vh] font-bold uppercase tracking-[0.25em]"
                            style={{ color: CREAM_DIM }}
                          >
                            Time to beat
                          </span>
                          <span
                            className="mt-[0.5vh] font-extrabold tabular-nums text-[6vh]"
                            style={{ color: EMBER_BRIGHT }}
                          >
                            {formatTime(e.timeMs)}
                          </span>
                        </span>
                      ) : (
                        <span
                          className="font-extrabold tabular-nums text-[3.6vh]"
                          style={{ color: EMBER_BRIGHT }}
                        >
                          {formatTime(e.timeMs)}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span
                        className="flex aspect-square h-[4.2vh] shrink-0 rounded-full"
                        style={{ border: `2px dashed ${STROKE}` }}
                      />
                      <span className="flex-1 truncate text-[2.4vh] font-medium" style={{ color: CREAM_FAINT }}>
                        Scan to claim this spot
                      </span>
                      <span className="tabular-nums text-[2.4vh] font-bold" style={{ color: "#5a4030" }}>
                        -:-.-
                      </span>
                    </>
                  )}
                </motion.li>
              );
            })}
          </ol>
        </section>

        {/* Engage rail: QR halo, prize, player count. */}
        <section
          className="flex flex-[0.72] flex-col items-center justify-between rounded-[1vw] px-[1.4vw] py-[2.4vh] text-center"
          style={{ background: RAISED, border: `1px solid ${STROKE}` }}
        >
          {EVENT2_PAUSED ? (
            <div className="flex flex-1 flex-col items-center justify-center">
              <p className="text-[1.8vh] font-bold uppercase tracking-[0.3em]" style={{ color: EMBER }}>
                That&apos;s a wrap
              </p>
              <p className="mt-[2vh] font-serif text-[5vh] font-semibold leading-tight" style={{ color: CREAM }}>
                The challenge has ended
              </p>
              <p className="mt-[2vh] text-[2.4vh] font-semibold" style={{ color: CREAM_DIM }}>
                {total > 0 ? `${total} minds tested today` : "Thanks for playing"}
              </p>
            </div>
          ) : (
            <>
              <p className="text-[3.4vh] font-extrabold uppercase tracking-[0.08em]" style={{ color: CREAM }}>
                Scan to play
              </p>

              {/* The eye-catcher: a white QR tile on a breathing ember halo. */}
              <div className="relative mt-[1.6vh]">
                <span
                  aria-hidden
                  className="animate-glow-pulse absolute inset-[-3vh] rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${EMBER}66, transparent 70%)`,
                    ["--glow-duration" as string]: "2.6s",
                  }}
                />
                <div className="relative rounded-[1.2vh] bg-white p-[1.8vh]">
                  {playUrl && (
                    <QRCodeSVG value={playUrl} className="h-[26vh] w-[26vh]" level="M" />
                  )}
                </div>
              </div>

              {leader && (
                <p className="mt-[1.8vh] text-[2.1vh] font-bold" style={{ color: CREAM_DIM }}>
                  Time to beat:{" "}
                  <span className="tabular-nums" style={{ color: EMBER_BRIGHT }}>
                    {formatTime(leader.timeMs)}
                  </span>
                </p>
              )}

              <div className="mt-[1.6vh] flex flex-col items-center">
                <PrizeImage />
                <p className="mt-[1vh] text-[3.4vh] font-extrabold" style={{ color: GOLD }}>
                  {PRIZE}
                </p>
                <p className="text-[1.9vh] font-semibold" style={{ color: CREAM_DIM }}>
                  Fastest mind of the day takes it
                </p>
              </div>

              <p className="mt-[1.6vh] text-[2.2vh] font-bold" style={{ color: CREAM_DIM }}>
                {total > 0 ? `${total} minds tested today` : "Be the first today"}
              </p>
            </>
          )}
        </section>
      </div>

      {/* Brain-facts strip */}
      <div
        className="relative z-10 flex h-[7vh] shrink-0 items-center justify-center overflow-hidden px-[3vw]"
        style={{ borderTop: `1px solid ${STROKE}`, background: `${RAISED}cc` }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={factIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            className="truncate text-center text-[2.6vh]"
          >
            {showHowTo ? (
              <span className="font-bold" style={{ color: CREAM }}>
                {HOW_TO.map((t, i) => (
                  <span key={t}>
                    <span style={{ color: EMBER }}>{i + 1}</span> {t}
                    {i < HOW_TO.length - 1 && (
                      <span style={{ color: CREAM_FAINT }}> &nbsp;→&nbsp; </span>
                    )}
                  </span>
                ))}
              </span>
            ) : (
              <>
                <span className="font-bold uppercase tracking-[0.2em]" style={{ color: EMBER }}>
                  Brain fact&nbsp;&nbsp;
                </span>
                <span className="font-serif font-semibold" style={{ color: CREAM }}>
                  {BRAIN_FACTS[factIdx]}
                </span>
              </>
            )}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer
        className="relative z-10 shrink-0 px-[3vw] py-[1.2vh] text-center text-[1.5vh]"
        style={{ color: CREAM_FAINT, borderTop: `1px solid ${STROKE}` }}
      >
        Games are for entertainment. Reaction-time games are fun, but not a
        cognitive assessment. © Gray Matter Solutions · Built with NTU&apos;s
        Dementia Research Centre.
      </footer>

      {/* Podium celebration takeover (queued, one at a time). */}
      <AnimatePresence>
        {celebration && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            style={{ background: `${INK}e6` }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -30 }}
              transition={springs.soft}
              className="relative px-[4vw] py-[6vh] text-center"
            >
              {/* One-shot ember burst. */}
              <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 flex justify-center">
                {Array.from({ length: 18 }, (_, i) => (
                  <span
                    key={i}
                    className="animate-ember-burst absolute h-[1.2vh] w-[1.2vh] rounded-full"
                    style={{
                      background: i % 3 === 0 ? GOLD : EMBER_BRIGHT,
                      ["--burst-x" as string]: `${Math.round(Math.sin(i * 1.7) * 180)}px`,
                      ["--burst-y" as string]: `${-80 - Math.round(Math.abs(Math.cos(i * 2.3)) * 160)}px`,
                      ["--burst-delay" as string]: `${(i % 6) * 0.06}s`,
                      ["--burst-duration" as string]: "0.9s",
                    }}
                  />
                ))}
              </span>
              <p className="text-[2.4vh] font-bold uppercase tracking-[0.34em]" style={{ color: EMBER }}>
                New top 3
              </p>
              <p className="mt-[1.5vh] font-serif text-[9vh] font-semibold leading-none" style={{ color: CREAM }}>
                {celebration.name}
              </p>
              <p className="mt-[1.5vh] font-extrabold tabular-nums text-[11vh] leading-none" style={{ color: GOLD }}>
                {formatTime(celebration.timeMs)}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
