"use client";

/**
 * The 55-inch attract screen for /event-v3 (16:9, read from 2-5m away).
 * Daylight redesign of the v2 board in the funnel's own light design system:
 * warm peach canvas, Plus Jakarta Sans throughout, floating white cards, and
 * two across-the-hall eye-catchers - an oversized QR tile and a saturated
 * "Win a Fitbit Air" prize card. Self-contained: polls /api/leaderboard every
 * 8s and keeps the last good standings on error.
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
const PRIZE_NAME = "Fitbit Air";
const PRIZE_VALUE = "$189";

// Light board palette (kept local: the board is its own full-bleed canvas).
const CHARCOAL = "#2d2d2d";
const INK_SOFT = "#7d5747";
const INK_FAINT = "#a98d80";
const ORANGE = "#f77528";
const ORANGE_DEEP = "#e35d0e";
const ORANGE_SOFT = "#ff9a4d";
const CARD = "#ffffff";
const CARD_LINE = "#f3ddd2";
const GOLD = "#f7b731";
const RANK_COLOR = [GOLD, "#c3cad6", "#d99058"];

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

export default function LeaderboardV3Board() {
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
      className="relative flex h-screen w-screen flex-col overflow-hidden font-sans"
      style={{
        color: CHARCOAL,
        background: "linear-gradient(150deg, #fff8f6 0%, #fdeee4 45%, #fbe3d3 100%)",
      }}
    >
      {/* Soft capsule shapes from the funnel's splash art, tilted off-canvas. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-[6vw] -top-[18vh] h-[16vh] w-[38vw] rotate-[38deg] rounded-full"
          style={{ background: "linear-gradient(90deg, #ffe382, #ffd75e)", opacity: 0.65 }}
        />
        <div
          className="absolute -right-[8vw] top-[4vh] h-[14vh] w-[34vw] rotate-[-32deg] rounded-full"
          style={{ background: "linear-gradient(90deg, #ffd75e, #ffe9a8)", opacity: 0.5 }}
        />
        <div
          className="absolute -bottom-[16vh] left-[30vw] h-[15vh] w-[36vw] rotate-[24deg] rounded-full"
          style={{ background: `linear-gradient(90deg, ${ORANGE_SOFT}, #ffd0ae)`, opacity: 0.28 }}
        />
        <div
          className="animate-glow-pulse absolute right-[22vw] top-[30vh] h-[46vh] w-[46vh] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${ORANGE}2e, transparent 70%)`,
            ["--glow-duration" as string]: "7s",
          }}
        />
      </div>

      {/* Masthead */}
      <header
        className="relative z-10 flex shrink-0 items-end justify-between px-[3vw] pb-[1.8vh] pt-[2.4vh]"
        style={{ borderBottom: `1px solid ${CARD_LINE}` }}
      >
        <div className="flex items-center gap-[1.2vw]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/gms-logo.png" alt="Gray Matter Solutions" className="h-[5vh] w-auto" />
          <div>
            <p
              className="text-[1.8vh] font-bold uppercase tracking-[0.3em]"
              style={{ color: ORANGE }}
            >
              Reaction Time Challenge
            </p>
            <h1 className="text-[5.4vh] font-extrabold leading-none tracking-tight">
              How <span style={{ color: ORANGE }}>fast</span> is the room today?
            </h1>
          </div>
        </div>
        <p
          className="flex items-center gap-[0.6vw] rounded-full px-[1.4vw] py-[1vh] text-[2vh] font-bold shadow-card"
          style={{ background: CARD, border: `1px solid ${CARD_LINE}`, color: INK_SOFT }}
        >
          {EVENT2_PAUSED ? (
            "Final standings"
          ) : (
            <>
              <span
                className="animate-live-pulse inline-block h-[1.4vh] w-[1.4vh] rounded-full"
                style={{ background: ORANGE }}
              />
              LIVE
            </>
          )}
        </p>
      </header>

      {/* Body: standings | engage rail */}
      <div className="relative z-10 flex min-h-0 flex-1 gap-[1.6vw] px-[3vw] py-[2.2vh]">
        {/* Standings, top 8, hero leader row. */}
        <section className="flex min-h-0 flex-[1.42] flex-col">
          <ol className="flex min-h-0 flex-1 flex-col gap-[1.1vh]">
            {rows.map((e, i) => {
              const podium = i < 3;
              const isLeader = i === 0 && !!e;
              return (
                <motion.li
                  key={e ? keyOf(e) : `empty-${i}`}
                  layout
                  transition={springs.shuffle}
                  className="flex items-center gap-[1.1vw] rounded-[1.2vw] px-[1.2vw]"
                  style={{
                    flex: isLeader ? 1.6 : 1,
                    background: isLeader
                      ? `linear-gradient(120deg, ${ORANGE} 0%, ${ORANGE_SOFT} 100%)`
                      : e
                        ? CARD
                        : "#ffffff8c",
                    border: e ? "none" : `2px dashed ${CARD_LINE}`,
                    boxShadow: isLeader
                      ? "0 18px 48px -14px rgba(247, 117, 40, 0.55)"
                      : e
                        ? "0 8px 24px -8px rgba(51, 18, 0, 0.12), 0 2px 8px -2px rgba(51, 18, 0, 0.08)"
                        : "none",
                  }}
                >
                  <span
                    className="flex aspect-square shrink-0 items-center justify-center rounded-full font-extrabold"
                    style={{
                      height: isLeader ? "6vh" : "4.6vh",
                      fontSize: isLeader ? "3vh" : "2.2vh",
                      background: isLeader
                        ? "#ffffff"
                        : podium
                          ? RANK_COLOR[i]
                          : "#f6e8e0",
                      color: isLeader ? ORANGE_DEEP : podium ? "#4a2408" : INK_SOFT,
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
                          background: isLeader ? "#ffffff2e" : "#ffe9dc",
                          color: isLeader ? "#ffffff" : ORANGE_DEEP,
                        }}
                      >
                        {initials(e.name)}
                      </span>
                      <span
                        className="flex-1 truncate font-extrabold"
                        style={{
                          fontSize: isLeader ? "4.4vh" : "3.2vh",
                          color: isLeader ? "#ffffff" : CHARCOAL,
                        }}
                      >
                        {e.name}
                      </span>
                      {isLeader ? (
                        <span className="flex flex-col items-end leading-none">
                          <span
                            className="text-[1.4vh] font-bold uppercase tracking-[0.25em]"
                            style={{ color: "#fff0e4" }}
                          >
                            Time to beat
                          </span>
                          <span className="mt-[0.5vh] text-[6vh] font-extrabold tabular-nums text-white">
                            {formatTime(e.timeMs)}
                          </span>
                        </span>
                      ) : (
                        <span
                          className="text-[3.6vh] font-extrabold tabular-nums"
                          style={{ color: ORANGE_DEEP }}
                        >
                          {formatTime(e.timeMs)}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span
                        className="flex aspect-square h-[4.2vh] shrink-0 rounded-full"
                        style={{ border: `2px dashed ${CARD_LINE}` }}
                      />
                      <span
                        className="flex-1 truncate text-[2.4vh] font-semibold"
                        style={{ color: INK_FAINT }}
                      >
                        Scan to claim this spot
                      </span>
                      <span
                        className="text-[2.4vh] font-bold tabular-nums"
                        style={{ color: "#dcc4b6" }}
                      >
                        -:-.-
                      </span>
                    </>
                  )}
                </motion.li>
              );
            })}
          </ol>
        </section>

        {/* Engage rail: QR tile + prize card. */}
        <section className="flex min-h-0 flex-[0.78] flex-col gap-[1.8vh]">
          {EVENT2_PAUSED ? (
            <div
              className="flex flex-1 flex-col items-center justify-center rounded-[1.2vw] p-[2vw] text-center shadow-card"
              style={{ background: CARD, border: `1px solid ${CARD_LINE}` }}
            >
              <p
                className="text-[1.8vh] font-bold uppercase tracking-[0.3em]"
                style={{ color: ORANGE }}
              >
                That&apos;s a wrap
              </p>
              <p className="mt-[2vh] text-[4.6vh] font-extrabold leading-tight">
                The challenge has ended
              </p>
              <p className="mt-[2vh] text-[2.4vh] font-semibold" style={{ color: INK_SOFT }}>
                {total > 0 ? `${total} minds tested today` : "Thanks for playing"}
              </p>
            </div>
          ) : (
            <div
              className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.2vw] shadow-float"
              style={{
                background: `linear-gradient(160deg, ${ORANGE_DEEP} 0%, ${ORANGE} 45%, ${ORANGE_SOFT} 100%)`,
              }}
            >
              <span
                aria-hidden
                className="animate-glow-pulse absolute left-1/2 top-[24%] h-[44vh] w-[44vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: "radial-gradient(circle, #ffffff59, transparent 68%)",
                  ["--glow-duration" as string]: "4s",
                }}
              />

              {/* Prize hero: the band is the across-the-hall headline. */}
              <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-[1.6vw] pt-[2vh] text-center">
                <p
                  className="rounded-full bg-white px-[1.1vw] py-[0.7vh] text-[1.8vh] font-extrabold uppercase tracking-[0.18em]"
                  style={{ color: ORANGE_DEEP }}
                >
                  Today&apos;s prize
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/fitbit-air.webp"
                  alt={`${PRIZE_NAME} fitness band`}
                  className="animate-symbol-drift mt-[1.2vh] min-h-0 flex-1 rotate-[8deg] object-contain drop-shadow-[0_18px_28px_rgba(74,26,0,0.45)]"
                  style={{
                    ["--drift-y" as string]: "-12px",
                    ["--drift-x" as string]: "0px",
                    ["--drift-tilt" as string]: "8deg",
                    ["--drift-tilt-to" as string]: "8deg",
                    ["--drift-duration" as string]: "5s",
                  }}
                />
                <p className="mt-[1.4vh] text-[5.6vh] font-extrabold leading-none text-white">
                  Win a {PRIZE_NAME}
                </p>
                <p className="mt-[1.2vh] text-[2.6vh] font-bold leading-none" style={{ color: "#ffe4cf" }}>
                  Worth <span className="text-white">{PRIZE_VALUE}</span> · fastest mind takes
                  it home
                </p>
              </div>

              {/* Scan strip: label and QR side by side, still readable from afar. */}
              <div className="relative z-10 m-[1.6vh] flex shrink-0 items-center gap-[1.2vw] rounded-[1vw] bg-white py-[1.4vh] pl-[1.6vw] pr-[1.4vh] shadow-card">
                <div className="flex-1 text-left">
                  <p className="text-[3.4vh] font-extrabold leading-[1.1] tracking-tight">
                    Scan
                    <br />
                    to play
                  </p>
                  <p className="mt-[1.2vh] text-[1.9vh] font-bold" style={{ color: INK_SOFT }}>
                    {leader ? (
                      <>
                        Time to beat{" "}
                        <span className="tabular-nums" style={{ color: ORANGE_DEEP }}>
                          {formatTime(leader.timeMs)}
                        </span>
                      </>
                    ) : total > 0 ? (
                      `${total} minds tested today`
                    ) : (
                      "Be the first today"
                    )}
                  </p>
                </div>
                <div
                  className="rounded-[1.2vh] bg-white p-[1vh]"
                  style={{ border: `2px solid ${CARD_LINE}` }}
                >
                  {playUrl && (
                    <QRCodeSVG
                      value={playUrl}
                      className="h-[17vh] w-[17vh]"
                      level="M"
                      fgColor="#331200"
                      bgColor="#ffffff"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Brain-facts strip */}
      <div
        className="relative z-10 flex h-[7vh] shrink-0 items-center justify-center overflow-hidden px-[3vw]"
        style={{ borderTop: `1px solid ${CARD_LINE}`, background: "#ffffffb8" }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={factIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            className="truncate text-center text-[2.5vh]"
          >
            {showHowTo ? (
              <span className="font-bold">
                {HOW_TO.map((t, i) => (
                  <span key={t}>
                    <span style={{ color: ORANGE }}>{i + 1}</span> {t}
                    {i < HOW_TO.length - 1 && (
                      <span style={{ color: INK_FAINT }}> &nbsp;→&nbsp; </span>
                    )}
                  </span>
                ))}
              </span>
            ) : (
              <>
                <span
                  className="font-bold uppercase tracking-[0.2em]"
                  style={{ color: ORANGE }}
                >
                  Brain fact&nbsp;&nbsp;
                </span>
                <span className="font-semibold">{BRAIN_FACTS[factIdx]}</span>
              </>
            )}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer
        className="relative z-10 shrink-0 px-[3vw] py-[1.2vh] text-center text-[1.5vh]"
        style={{ color: INK_FAINT, borderTop: `1px solid ${CARD_LINE}` }}
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
            style={{ background: "#fff8f6f0" }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -30 }}
              transition={springs.soft}
              className="relative px-[4vw] py-[6vh] text-center"
            >
              {/* One-shot confetti burst. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-1/2 flex justify-center"
              >
                {Array.from({ length: 18 }, (_, i) => (
                  <span
                    key={i}
                    className="animate-ember-burst absolute h-[1.2vh] w-[1.2vh] rounded-full"
                    style={{
                      background: i % 3 === 0 ? GOLD : ORANGE,
                      ["--burst-x" as string]: `${Math.round(Math.sin(i * 1.7) * 180)}px`,
                      ["--burst-y" as string]: `${-80 - Math.round(Math.abs(Math.cos(i * 2.3)) * 160)}px`,
                      ["--burst-delay" as string]: `${(i % 6) * 0.06}s`,
                      ["--burst-duration" as string]: "0.9s",
                    }}
                  />
                ))}
              </span>
              <p
                className="text-[2.4vh] font-bold uppercase tracking-[0.34em]"
                style={{ color: ORANGE }}
              >
                New top 3
              </p>
              <p className="mt-[1.5vh] text-[9vh] font-extrabold leading-none tracking-tight">
                {celebration.name}
              </p>
              <p
                className="mt-[1.5vh] text-[11vh] font-extrabold tabular-nums leading-none"
                style={{ color: ORANGE }}
              >
                {formatTime(celebration.timeMs)}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
