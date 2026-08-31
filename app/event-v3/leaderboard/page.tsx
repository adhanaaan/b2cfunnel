"use client";

/**
 * The attract screen for /event-v3 (designed against a 1920x1080 55" panel,
 * read from 2-5m away, but laid out to reflow down to a phone).
 *
 * Three columns on a wide screen - scan card, live standings, prize card -
 * collapsing to standings-over-cards on tablet and a single column on mobile.
 * Type is clamped between a mobile floor and the panel size so the same markup
 * serves both. Self-contained: polls /api/leaderboard every 8s and keeps the
 * last good standings on error.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { formatTime } from "@/lib/format";
import { EVENT3_PAUSED, EVENT3_SOURCE } from "@/config/event";
import { BRAIN_FACTS } from "@/config/tips";
import { springs } from "@/lib/motion";

interface Entry {
  name: string;
  timeMs: number;
}

const TOP_N = 8;
const POLL_MS = 8000;
const FACT_MS = 8000;

/**
 * Where the QR sends players. Absolute on purpose: the board itself may run
 * from localhost or a preview deploy, but a scanned phone must always land on
 * production.
 */
const PLAY_URL = "https://brainhealthcheck.vercel.app/event-v3";

/** Share of players who finish the quiz, shown on the scan card's stat tile. */
const REPORT_RATE = 0.7;

const HOW_TO = [
  "Play the speed game",
  "1-min quiz on what's slowing you",
  "Get your brain health report",
];

// Board palette (kept local: the board is its own full-bleed canvas).
const ORANGE_DEEP = "#e35d0e";
const CARD_LINE = "#f3ddd2";
const RANK_CHIP_BG = "#f6e8e0";
const INITIALS_BG = "#ffe9dc";
const INK_FAINT = "#a98d80";
const EMPTY_TIME = "#dcc4b6";
const RANK_SILVER = "#c3cad6";
const RANK_BRONZE = "#d99058";
const PRIZE_WARM = "#ffe4cf";
const STAT_SURFACE = "#fdfaf7";

const CANVAS =
  "linear-gradient(150deg, #fff8f6 15%, #fdeee4 46%, #fbe3d3 85%)";
const LEADER_GRADIENT = "linear-gradient(90deg, #f77528 0%, #ff9a4d 100%)";
const PRIZE_GRADIENT =
  "linear-gradient(147deg, #ff6002 3%, #f77528 46%, rgba(255,199,156,0.87) 99%)";
const PROGRESS_GRADIENT =
  "linear-gradient(169deg, #ff8a1f 7%, #f9550f 52%, #d62f16 94%)";

/**
 * Clamped type sizes. The middle term is `min(vh, vw)` on purpose: the board is
 * sized off viewport height for the 55" panel, but on a tall narrow phone a
 * height-only clamp produces TV-sized text that overflows the width.
 */
const T = {
  eyebrow: "text-[clamp(0.625rem,min(1.75vh,2.6vw),1.1875rem)]",
  chip: "text-[clamp(0.625rem,min(2vh,3vw),1.375rem)]",
  h1: "text-[clamp(1.375rem,min(5.4vh,7vw),3.625rem)]",
  rankL: "text-[clamp(0.9375rem,min(3vh,4.2vw),2rem)]",
  rank: "text-[clamp(0.75rem,min(2.2vh,3.2vw),1.5rem)]",
  leaderName: "text-[clamp(1.125rem,min(4.4vh,5.5vw),3rem)]",
  leaderTime: "text-[clamp(1.375rem,min(6vh,8vw),4.0625rem)]",
  micro: "text-[clamp(0.5rem,min(1.4vh,2.2vw),0.9375rem)]",
  rowName: "text-[clamp(0.9375rem,min(3.25vh,4.4vw),2.1875rem)]",
  rowTime: "text-[clamp(1rem,min(3.6vh,4.8vw),2.4375rem)]",
  rowEmpty: "text-[clamp(0.8125rem,min(2.4vh,3.6vw),1.625rem)]",
  prizeChip: "text-[clamp(0.5625rem,min(1.75vh,2.6vw),1.1875rem)]",
  prizeTitle: "text-[clamp(1.375rem,min(5.5vh,7.5vw),3.75rem)]",
  prizeWorth: "text-[clamp(0.8125rem,min(2.6vh,3.6vw),1.75rem)]",
  scanTitle: "text-[clamp(1rem,min(3vh,4.4vw),2rem)]",
  scanList: "text-[clamp(0.8125rem,min(2.2vh,3.4vw),1.5rem)]",
  statBig: "text-[clamp(1rem,min(2.8vh,4vw),1.875rem)]",
  statBody: "text-[clamp(0.75rem,min(2.15vh,3.2vw),1.4375rem)]",
  fact: "text-[clamp(0.75rem,min(2.5vh,3.4vw),1.6875rem)]",
  footer: "text-[clamp(0.5625rem,min(1.5vh,2.2vw),1rem)]",
};

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

/* ------------------------------- Masthead ------------------------------- */

function Masthead({ live }: { live: boolean }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 sm:flex-1">
        <div className="flex items-center gap-4">
          <p
            className={`${T.eyebrow} font-bold uppercase tracking-[0.3em] text-primary`}
          >
            Reaction Time Challenge
          </p>
          <p
            className={`${T.chip} flex shrink-0 items-center gap-2 rounded-full bg-white px-[1.1em] py-[0.5em] font-bold text-secondary shadow-card`}
            style={{ border: `1px solid ${CARD_LINE}` }}
          >
            {live ? (
              <>
                <span
                  aria-hidden
                  className="animate-live-pulse inline-block h-[0.6em] w-[0.6em] rounded-full bg-primary"
                />
                LIVE
              </>
            ) : (
              "Final standings"
            )}
          </p>
        </div>
        <h1
          className={`${T.h1} mt-2 font-extrabold leading-none tracking-tight text-charcoal`}
        >
          How <span className="text-primary">fast</span> is the room today?
        </h1>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/gms-ntu-logo.png"
        alt="Gray Matter Solutions, a spin-off from Nanyang Technological University, Singapore"
        className="h-[clamp(1.5rem,min(4.3vh,6vw),2.875rem)] w-auto shrink-0 self-start sm:self-auto"
      />
    </div>
  );
}

/* ------------------------------ Standings ------------------------------- */

function StandingRow({
  rank,
  entry,
  leader,
}: {
  rank: number;
  entry: Entry | null;
  leader: boolean;
}) {
  const badgeBg = leader
    ? "#ffffff"
    : rank === 2
      ? RANK_SILVER
      : rank === 3
        ? RANK_BRONZE
        : RANK_CHIP_BG;
  const badgeColor = leader
    ? ORANGE_DEEP
    : rank === 2 || rank === 3
      ? "#2d2d2d"
      : entry
        ? "#7d5747"
        : INK_FAINT;

  return (
    <motion.li
      layout
      transition={springs.shuffle}
      className="flex min-h-0 items-center gap-[0.9em] rounded-2xl px-[0.7em] py-[0.4em] sm:px-[1.1em] lg:py-0"
      style={{
        flex: leader ? 1.6 : 1,
        background: leader
          ? LEADER_GRADIENT
          : entry
            ? "#ffffff"
            : "rgba(255,255,255,0.55)",
        border: entry ? "none" : `2px dashed ${CARD_LINE}`,
        boxShadow: leader
          ? "0 16px 40px -12px rgba(51,18,0,0.18)"
          : entry
            ? "0 8px 24px -8px rgba(51,18,0,0.12), 0 2px 8px -2px rgba(51,18,0,0.08)"
            : "none",
      }}
    >
      <span
        className={`${leader ? T.rankL : T.rank} flex aspect-square shrink-0 items-center justify-center rounded-full font-extrabold leading-none`}
        style={{
          height: leader
            ? "clamp(1.625rem,min(6vh,8vw),4.0625rem)"
            : "clamp(1.25rem,min(4.6vh,6vw),3.125rem)",
          background: badgeBg,
          color: badgeColor,
        }}
      >
        {rank}
      </span>

      {entry ? (
        <>
          <span
            className={`${leader ? "text-[clamp(0.625rem,min(2.2vh,3vw),1.5rem)]" : "text-[clamp(0.5rem,min(1.8vh,2.5vw),1.1875rem)]"} hidden aspect-square shrink-0 items-center justify-center rounded-full font-bold leading-none sm:flex`}
            style={{
              height: leader
                ? "clamp(1.5rem,min(5.4vh,7vw),3.625rem)"
                : "clamp(1.125rem,min(4.2vh,5.5vw),2.8125rem)",
              background: leader ? "rgba(255,255,255,0.22)" : INITIALS_BG,
              color: leader ? "#ffffff" : ORANGE_DEEP,
            }}
          >
            {initials(entry.name)}
          </span>
          <span
            className={`${leader ? T.leaderName : T.rowName} min-w-0 flex-1 truncate font-extrabold ${leader ? "text-white" : "text-charcoal"}`}
          >
            {entry.name}
          </span>
          {leader ? (
            <span className="flex shrink-0 flex-col items-end leading-none">
              <span
                className={`${T.micro} font-bold uppercase tracking-[0.25em]`}
                style={{ color: PRIZE_WARM }}
              >
                Time to beat
              </span>
              <span
                className={`${T.leaderTime} mt-[0.15em] font-extrabold tabular-nums text-white`}
              >
                {formatTime(entry.timeMs)}
              </span>
            </span>
          ) : (
            <span
              className={`${T.rowTime} shrink-0 font-extrabold tabular-nums`}
              style={{ color: ORANGE_DEEP }}
            >
              {formatTime(entry.timeMs)}
            </span>
          )}
        </>
      ) : (
        <>
          <span
            className="hidden aspect-square shrink-0 rounded-full sm:block"
            style={{
              height: "clamp(1.125rem,min(4.2vh,5.5vw),2.8125rem)",
              border: `2px dashed ${CARD_LINE}`,
            }}
          />
          <span
            className={`${T.rowEmpty} min-w-0 flex-1 truncate font-semibold`}
            style={{ color: INK_FAINT }}
          >
            Play to claim this spot
          </span>
          <span
            className={`${T.rowTime} shrink-0 font-extrabold tabular-nums`}
            style={{ color: EMPTY_TIME }}
          >
            -:-.-
          </span>
        </>
      )}
    </motion.li>
  );
}

/* ------------------------------ Scan card ------------------------------- */

function ScanCard() {
  const pct = Math.round(REPORT_RATE * 100);
  return (
    <div className="flex h-full flex-col justify-center rounded-2xl bg-surface-container p-3 sm:p-5">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[1.4vh] rounded-xl bg-white p-4 shadow-card sm:gap-[2.2vh] sm:p-5">
        {/* The QR absorbs whatever height is left so it stays as large as the
            card allows without ever pushing the copy below out of view. */}
        <div className="flex min-h-[11rem] w-full min-w-0 flex-1 items-center justify-center lg:min-h-0">
          <div className="flex aspect-square h-full max-h-[19rem] max-w-full items-center justify-center rounded-[1.6rem] border-[5px] border-outline-variant bg-white p-[0.4rem] sm:p-[0.9rem]">
            <QRCodeSVG
              value={PLAY_URL}
              className="h-full w-full"
              level="M"
              fgColor="#331200"
              bgColor="#ffffff"
            />
          </div>
        </div>

        <div className="flex w-full min-w-0 shrink-0 flex-col gap-[1.2vh] sm:gap-[1.9vh]">
          <p
            className={`${T.scanTitle} font-extrabold leading-[1.1] tracking-tight text-charcoal`}
          >
            Scan to test your speed
          </p>
          <ol
            className={`${T.scanList} list-decimal space-y-[0.2em] ps-[1.4em] leading-[1.39] text-charcoal`}
          >
            {HOW_TO.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          {/* Stat tile: completion rate, plus the live time to beat when set. */}
          <div
            className="relative overflow-hidden rounded-xl shadow-card"
            style={{ background: STAT_SURFACE }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 120% at 25% 50%, rgba(245,158,10,0.25), rgba(255,235,87,0.06) 100%)",
              }}
            />
            <p
              className={`${T.statBody} relative px-[1em] pb-[1.3em] pt-[0.8em] text-center leading-[1.39] text-charcoal`}
            >
              <span className={`${T.statBig} font-bold`}>{pct}%</span>{" "}
              <span className="font-normal">folks got their </span>
              <span className="font-bold">brain health report</span>{" "}
              <span aria-hidden>🧠</span>
            </p>
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[0.6vh] min-h-[6px] bg-[#d9d9d9]"
            >
              <div
                className="h-full"
                style={{ width: `${pct}%`, background: PROGRESS_GRADIENT }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Prize card ------------------------------ */

function PrizeCard() {
  return (
    <div
      className="flex h-full flex-col rounded-2xl px-4 pb-4 sm:px-5 sm:pb-5"
      style={{ background: PRIZE_GRADIENT }}
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[2vh] px-2 pb-1 pt-4 text-center sm:gap-[3.2vh] sm:px-5 sm:pt-6">
        <div className="flex shrink-0 flex-col items-center gap-[1.8vh]">
          <p
            className={`${T.prizeChip} rounded-full bg-white px-[1.05em] py-[0.5em] font-extrabold uppercase tracking-[0.18em]`}
            style={{ color: ORANGE_DEEP }}
          >
            Today&apos;s prize
          </p>
          <div className="flex flex-col items-center gap-[1.2vh]">
            <p
              className={`${T.prizeTitle} font-extrabold leading-none tracking-tight text-white`}
            >
              Win a Google
              <br />
              Fitbit Air
            </p>
            <p className={`${T.prizeWorth} font-bold leading-[1.1] text-cream`}>
              Worth $189 · Fastest mind gets it!
            </p>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/fitbit-air.webp"
          alt="Google Fitbit Air fitness band"
          className="animate-symbol-drift min-h-0 w-auto max-w-full flex-1 object-contain drop-shadow-[0_18px_28px_rgba(74,26,0,0.45)] max-h-[40vh] lg:max-h-none"
          style={{
            ["--drift-y" as string]: "-12px",
            ["--drift-x" as string]: "0px",
            ["--drift-tilt" as string]: "0deg",
            ["--drift-tilt-to" as string]: "0deg",
            ["--drift-duration" as string]: "5s",
          }}
        />
      </div>
    </div>
  );
}

/* --------------------------------- Board -------------------------------- */

export default function LeaderboardV3Board() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [total, setTotal] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  const [celebration, setCelebration] = useState<Entry | null>(null);
  const prevTopRef = useRef<Set<string>>(new Set());
  const firstLoadRef = useRef(true);
  const queueRef = useRef<Entry[]>([]);
  const busyRef = useRef(false);

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
        const res = await fetch(
          `/api/leaderboard?limit=${TOP_N}&source=${encodeURIComponent(EVENT3_SOURCE)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (!active || !Array.isArray(data.entries)) return;
        const next: Entry[] = data.entries;
        setEntries(next);
        setTotal(data.total ?? next.length);

        // New podium entrants (skip the very first load: nothing is "new").
        const podium = next.slice(0, 3);
        if (!firstLoadRef.current && !EVENT3_PAUSED) {
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
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-sans text-charcoal lg:h-screen lg:overflow-hidden"
      style={{ background: CANVAS }}
    >
      {/* Soft capsule shapes from the funnel's splash art, tilted off-canvas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -left-[16vw] -top-[14vh] h-[14vh] w-[42vw] rotate-[-38deg] rounded-full"
          style={{
            background: "linear-gradient(90deg, #ffe382, #ffd75e)",
            opacity: 0.62,
          }}
        />
        <div
          className="absolute -right-[10vw] top-[2vh] h-[13vh] w-[36vw] rotate-[32deg] rounded-full"
          style={{
            background: "linear-gradient(90deg, #ffd75e, #ffe9a8)",
            opacity: 0.5,
          }}
        />
        <div
          className="absolute -bottom-[16vh] -left-[12vw] h-[14vh] w-[38vw] rotate-[38deg] rounded-full"
          style={{
            background: "linear-gradient(90deg, #ffe382, #ffd75e)",
            opacity: 0.55,
          }}
        />
      </div>

      {/* Masthead */}
      <header
        className="relative z-10 shrink-0 px-[4vw] pb-3 pt-4 sm:pb-3.5 sm:pt-5 lg:px-[3vw]"
        style={{ borderBottom: `1px solid ${CARD_LINE}` }}
      >
        <Masthead live={!EVENT3_PAUSED} />
      </header>

      {/* Body: scan | standings | prize. Reflows to 1 col, then 2, then 3. */}
      <div className="relative z-10 grid min-h-0 flex-1 gap-4 px-[4vw] py-4 md:grid-cols-2 lg:grid-cols-[450fr_697fr_544fr] lg:gap-[1.6vw] lg:px-[3vw] lg:py-[2vh]">
        <div className="order-2 md:order-2 lg:order-1 lg:min-h-0">
          {EVENT3_PAUSED ? (
            <div
              className="flex h-full flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-card"
              style={{ border: `1px solid ${CARD_LINE}` }}
            >
              <p
                className={`${T.eyebrow} font-bold uppercase tracking-[0.3em] text-primary`}
              >
                That&apos;s a wrap
              </p>
              <p className={`${T.scanTitle} mt-3 font-extrabold leading-tight`}>
                The challenge has ended
              </p>
              <p
                className={`${T.rowEmpty} mt-3 font-semibold text-secondary`}
              >
                {total > 0
                  ? `${total} minds tested today`
                  : "Thanks for playing"}
              </p>
            </div>
          ) : (
            <ScanCard />
          )}
        </div>

        <ol className="order-1 flex min-h-0 flex-col gap-2 md:order-1 md:col-span-2 lg:order-2 lg:col-span-1 lg:gap-[1.2vh]">
          {rows.map((e, i) => (
            <StandingRow
              key={e ? keyOf(e) : `empty-${i}`}
              rank={i + 1}
              entry={e}
              leader={i === 0 && !!e}
            />
          ))}
        </ol>

        <div className="order-3 md:order-3 lg:min-h-0">
          <PrizeCard />
        </div>
      </div>

      {/* Brain-facts strip */}
      <div
        className="relative z-10 flex shrink-0 items-center justify-center overflow-hidden px-[4vw] py-3 lg:h-[7vh] lg:px-[3vw] lg:py-0"
        style={{ borderTop: `1px solid ${CARD_LINE}`, background: "#ffffffb8" }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={factIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            className={`${T.fact} text-center`}
          >
            {showHowTo ? (
              <span className="font-bold">
                {HOW_TO.map((t, i) => (
                  <span key={t}>
                    <span className="text-primary">{i + 1}</span> {t}
                    {i < HOW_TO.length - 1 && (
                      <span style={{ color: INK_FAINT }}> &nbsp;→&nbsp; </span>
                    )}
                  </span>
                ))}
              </span>
            ) : (
              <>
                <span className="font-bold uppercase tracking-[0.2em] text-primary">
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
        className={`${T.footer} relative z-10 shrink-0 px-[4vw] py-2.5 text-center lg:px-[3vw]`}
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
            className="absolute inset-0 z-50 flex items-center justify-center px-6"
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
                      background: i % 3 === 0 ? "#f7b731" : "#f77528",
                      ["--burst-x" as string]: `${Math.round(Math.sin(i * 1.7) * 180)}px`,
                      ["--burst-y" as string]: `${-80 - Math.round(Math.abs(Math.cos(i * 2.3)) * 160)}px`,
                      ["--burst-delay" as string]: `${(i % 6) * 0.06}s`,
                      ["--burst-duration" as string]: "0.9s",
                    }}
                  />
                ))}
              </span>
              <p
                className={`${T.eyebrow} font-bold uppercase tracking-[0.34em] text-primary`}
              >
                New top 3
              </p>
              <p
                className={`${T.h1} mt-[1.5vh] font-extrabold leading-none tracking-tight`}
              >
                {celebration.name}
              </p>
              <p
                className={`${T.leaderTime} mt-[1.5vh] font-extrabold tabular-nums leading-none text-primary`}
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
