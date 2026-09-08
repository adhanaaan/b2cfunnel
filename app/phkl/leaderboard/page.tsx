"use client";

/**
 * The attract screen for /phkl, built to Figma 693:22421 ("Leaderboard").
 *
 * Designed against a 1920x1080 55" panel read from 2-5m away, but laid out to
 * reflow down to a phone. The design is height-driven, so every size below is
 * the design's pixel value expressed as a share of 1080 (the `vh` term), with
 * a `vw` term that takes over on a narrow screen and a mobile floor under
 * both - the same `min(vh, vw)` device the board has always used, now with
 * the design's numbers in it.
 *
 * Three bands:
 *
 * 1. The brain and "Is your brain at its peak performance?", with the
 *    invitation to play beside it.
 * 2. SCAN TO PLAY and the QR down the left; the standings - five rows, the
 *    leader as a gradient hero - filling the rest.
 * 3. The fact strip: the GMS lockup, then the rotating brain fact, over the
 *    band of event photography along the bottom edge.
 *
 * Self-contained: polls /api/leaderboard every 8s and keeps the last good
 * standings on error.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { formatTime } from "@/lib/format";
import { PHKL_PAUSED, PHKL_SOURCE } from "@/config/event";
import { playUrlFor } from "@/config/eventLinks";
import { BRAIN_FACTS } from "@/config/tips";
import { springs } from "@/lib/motion";
import { BrainHero } from "@/components/screens/event3/BrainHero";
import { OptionalImage } from "@/components/screens/phkl/OptionalImage";

interface Entry {
  name: string;
  timeMs: number;
}

/** Five rows, as the design lays out (693:22446-693:22450). */
const TOP_N = 5;
const POLL_MS = 8000;
const FACT_MS = 8000;

/** Where the QR sends players (absolute - see config/eventLinks.ts). */
const PLAY_URL = playUrlFor("phkl");

/**
 * How often the completion stat is refreshed. Slower than the standings: the
 * rate moves over the course of an event, not shot to shot.
 */
const RATE_POLL_MS = 30000;

const HEADLINE = ["Is your brain at its", "peak performance?"];
const SCAN_LABEL = "SCAN TO PLAY";
const BOARD_LABEL = "SPEED GAME LEADERBOARD";

const HOW_TO = [
  "Play the speed game",
  "1-min quiz on what's slowing you",
  "Get your brain health report",
];

// Board palette (kept local: the board is its own full-bleed canvas).
const ORANGE_DEEP = "#e35d0e";
const CARD_LINE = "#f3ddd2";
const RANK_CHIP_BG = "#f6e8e0";
const INK_FAINT = "#a98d80";
const EMPTY_TIME = "#dcc4b6";
const RANK_SILVER = "#c3cad6";
const RANK_BRONZE = "#d99058";
// Warm cream for the leader row's "time to beat" label.
const LEADER_LABEL = "#ffe4cf";
// The Processing Speed domain's light tone, behind SCAN TO PLAY and the
// standings label, over the domain's dark ink.
const HIGHLIGHT = "#fde68a";
const HIGHLIGHT_INK = "#2a1006";

const CANVAS =
  "linear-gradient(150deg, #fff8f6 15%, #fdeee4 46%, #fbe3d3 85%)";
const LEADER_GRADIENT = "linear-gradient(90deg, #f77528 0%, #ff9a4d 100%)";
/** The standings label sits on a band that fades out to the right (693:22451). */
const LABEL_BAND =
  "linear-gradient(90deg, rgba(253,230,138,0.95) 0%, rgba(253,230,138,0.55) 62%, rgba(253,230,138,0) 100%)";

/**
 * Clamped type sizes: `clamp(mobile floor, min(design vh, vw), design px)`.
 * The `vh` term is the design's size over 1080, so a 1920x1080 panel renders
 * the design's pixels exactly; the `vw` term only binds on a screen narrower
 * than the panel's proportion, which is what keeps a phone readable.
 */
const T = {
  h1: "text-[clamp(1.5rem,min(7.07vh,3.96vw),4.77rem)]",
  lede: "text-[clamp(0.9375rem,min(3.65vh,3.6vw),2.466rem)]",
  scanLabel: "text-[clamp(0.75rem,min(2.6vh,2.8vw),1.754rem)]",
  boardLabel: "text-[clamp(0.875rem,min(2.9vh,3vw),1.96rem)]",
  leaderName: "text-[clamp(1.125rem,min(4.04vh,5vw),2.724rem)]",
  leaderTime: "text-[clamp(1.375rem,min(5.47vh,6.4vw),3.69rem)]",
  timeToBeat: "text-[clamp(0.5rem,min(1.26vh,1.9vw),0.851rem)]",
  rowName: "text-[clamp(0.9375rem,min(2.94vh,4vw),1.987rem)]",
  rowTime: "text-[clamp(1rem,min(3.28vh,4.4vw),2.214rem)]",
  rowEmpty: "text-[clamp(0.8125rem,min(2.4vh,3.4vw),1.55rem)]",
  fact: "text-[clamp(0.75rem,min(2.5vh,3.2vw),1.6875rem)]",
  eyebrow: "text-[clamp(0.625rem,min(1.75vh,2.6vw),1.1875rem)]",
};

/**
 * The band of event photography along the bottom edge (693:22430-22432), in
 * the widths the design shows of each frame - its frames overlap, so these are
 * the visible parts, 491:681:748. The photos are the regatta board's: the same
 * three frames, the same band, one event's crowd standing in for the next.
 * Each is optional, so the band thins out (and finally disappears) rather than
 * breaking if a file is ever missing.
 */
const BAND = [
  { src: "/regatta-band-1.jpg", grow: 491 },
  { src: "/regatta-band-2.png", grow: 681 },
  { src: "/regatta-band-3.jpg", grow: 748 },
];

function PhotoBand() {
  return (
    <div
      aria-hidden
      // The design tucks the band 12px under the fact strip and shows 53px of
      // its 84px height; below `lg` it is a plain 2.5rem strip.
      className="relative z-10 flex h-10 w-full shrink-0 overflow-hidden empty:hidden lg:-mt-[1.11vh] lg:h-[4.9vh]"
    >
      {BAND.map((frame) => (
        <OptionalImage
          key={frame.src}
          src={frame.src}
          alt=""
          className="h-full min-w-0 object-cover"
          style={{ flex: `${frame.grow} 1 0` }}
        />
      ))}
    </div>
  );
}

/** The design's 21.8px corner, held down to a phone-sized row. */
const ROW_RADIUS = "clamp(0.875rem,min(2vh,3vw),1.363rem)";

const keyOf = (e: Entry) => `${e.name}·${Math.round(e.timeMs)}`;

/* -------------------------------- Header -------------------------------- */

/**
 * The brain, the headline, and the invitation beside them (693:22424-22429).
 * Below `lg` the invitation drops under the headline rather than sharing the
 * row, so neither has to shrink to fit a phone.
 */
function BoardHeader() {
  return (
    <div className="grid items-center gap-[2vh] lg:grid-cols-[1082fr_754fr] lg:gap-[2vw]">
      <div className="flex items-center gap-[clamp(0.5rem,2.2vw,2.6rem)]">
        <BrainHero className="w-[clamp(4.5rem,16.64vw,19.97rem)] shrink-0" />
        <h1
          className={`${T.h1} min-w-0 whitespace-nowrap font-extrabold leading-none tracking-[-0.015em] text-charcoal`}
        >
          {HEADLINE.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
      </div>
      <p className={`${T.lede} font-medium leading-[1.5] text-charcoal`}>
        Play the <b className="font-bold">speed</b> game to see your{" "}
        <b className="font-bold">rank</b> and get free{" "}
        <b className="font-bold">personalised</b> insights.
      </p>
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
      className="flex min-h-0 items-center gap-[clamp(0.6rem,min(1.77vh,2.4vw),1.192rem)] px-[clamp(0.7rem,min(1.93vh,2.6vw),1.306rem)] py-[0.4em] lg:py-0"
      style={{
        // The design's 118px hero row against 72.5px for the rest.
        height: leader
          ? "clamp(3.25rem,10.93vh,7.375rem)"
          : "clamp(2.75rem,6.71vh,4.531rem)",
        borderRadius: ROW_RADIUS,
        background: leader
          ? LEADER_GRADIENT
          : entry
            ? "#ffffff"
            : "rgba(255,255,255,0.55)",
        border: entry ? "none" : `2px dashed ${CARD_LINE}`,
        boxShadow: leader
          ? "0 14.5px 18px -2px rgba(51,18,0,0.18)"
          : entry
            ? "0 7.3px 10.9px rgba(51,18,0,0.12), 0 1.8px 3.6px rgba(51,18,0,0.08)"
            : "none",
      }}
    >
      <span
        className={`${leader ? T.leaderName : T.rowName} flex aspect-square shrink-0 items-center justify-center rounded-full font-extrabold leading-none`}
        style={{
          height: leader
            ? "clamp(1.625rem,min(5.47vh,7vw),3.69rem)"
            : "clamp(1.25rem,min(4.2vh,5.5vw),2.838rem)",
          background: badgeBg,
          color: badgeColor,
        }}
      >
        {rank}
      </span>

      {entry ? (
        <>
          <span
            className={`${leader ? T.leaderName : T.rowName} min-w-0 flex-1 truncate font-extrabold ${leader ? "leading-[1.05] text-white" : "leading-[1.1] text-charcoal"}`}
          >
            {entry.name}
          </span>
          {leader ? (
            <span className="flex shrink-0 flex-col items-end leading-none">
              <span
                className={`${T.timeToBeat} font-bold uppercase tracking-[0.25em]`}
                style={{ color: LEADER_LABEL }}
              >
                Time to beat
              </span>
              <span
                className={`${T.leaderTime} mt-[0.1em] font-extrabold leading-none tracking-[-0.01em] tabular-nums text-white`}
              >
                {formatTime(entry.timeMs)}
              </span>
            </span>
          ) : (
            <span
              className={`${T.rowTime} shrink-0 font-extrabold leading-[1.05] tabular-nums`}
              style={{ color: ORANGE_DEEP }}
            >
              {formatTime(entry.timeMs)}
            </span>
          )}
        </>
      ) : (
        <>
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

/* ------------------------------- Scan rail ------------------------------ */

/**
 * SCAN TO PLAY over the code (693:22439-22444). The label is a solid
 * highlighter block the width of the column; the QR takes the square the
 * column allows.
 *
 * The code is sized with `min(vw, vh)` rather than by aspect-ratio against a
 * percentage height: Safari (which runs the board at events) resolves
 * `aspect-square h-full` inside nested flex differently from Chromium and
 * collapsed the code to a fraction of its intended size on a 13" laptop.
 */
function ScanRail() {
  return (
    <div className="flex h-full min-h-0 flex-col items-center gap-[clamp(0.75rem,1.85vh,1.25rem)] lg:items-start lg:justify-start">
      <p
        className={`${T.scanLabel} flex h-[clamp(2.25rem,6.04vh,4.08rem)] w-[min(20rem,100%)] shrink-0 items-center justify-center text-center font-extrabold leading-[1.55] tracking-[0.12em] lg:w-[97.7%]`}
        style={{ background: HIGHLIGHT, color: HIGHLIGHT_INK }}
      >
        {SCAN_LABEL}
      </p>

      {/* Scannability settings measured at a live event (#46), kept through
          the redesign: level L needs 29 modules against M's 33, making each
          ~14% larger in the same box, and marginSize={4} puts the spec'd
          four-module quiet zone inside the SVG, where the design's black
          frame cannot eat into it. Pure black thresholds better than the
          brand brown on a washed-out projector. */}
      <div
        className="flex size-[min(70vw,40vh)] max-w-full shrink-0 items-center justify-center bg-white p-[0.25rem] lg:size-[min(20vw,35.5vh)]"
        style={{ border: "0.5rem solid #111111" }}
      >
        <QRCodeSVG
          value={PLAY_URL}
          className="h-full w-full"
          level="L"
          marginSize={4}
          fgColor="#000000"
          bgColor="#ffffff"
        />
      </div>
    </div>
  );
}

/* --------------------------------- Board -------------------------------- */

export default function PhklLeaderboardBoard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [total, setTotal] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  // null until the rate is worth showing (nobody has played, or too few have).
  const [reportPct, setReportPct] = useState<number | null>(null);
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
          `/api/leaderboard?limit=${TOP_N}&source=${encodeURIComponent(PHKL_SOURCE)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (!active || !Array.isArray(data.entries)) return;
        const next: Entry[] = data.entries;
        setEntries(next);
        setTotal(data.total ?? next.length);

        // New podium entrants (skip the very first load: nothing is "new").
        const podium = next.slice(0, 3);
        if (!firstLoadRef.current && !PHKL_PAUSED) {
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

  // Completion rate for this event day: reports over players, from the same
  // source tag the standings use. Keeps the last good value on error.
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(
          `/api/report-rate?source=${encodeURIComponent(PHKL_SOURCE)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (!active || typeof data.pct !== "number") return;
        setReportPct(data.meaningful ? data.pct : null);
      } catch {
        /* keep the last good rate */
      }
    };
    load();
    const id = setInterval(load, RATE_POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  // Strip slots: every brain fact, the how-to, and - once there is one - the
  // live completion rate. The rate lives here rather than in a tile of its own,
  // so the scan rail stays the single call to action the design asks for.
  const slots = BRAIN_FACTS.length + 1 + (reportPct !== null ? 1 : 0);

  useEffect(() => {
    const id = setInterval(() => setFactIdx((i) => (i + 1) % slots), FACT_MS);
    return () => clearInterval(id);
  }, [slots]);

  const rows = Array.from({ length: TOP_N }, (_, i) => entries[i] ?? null);
  // Guarded modulo: the slot count shrinks again if the rate goes away.
  const slot = factIdx % slots;
  const showHowTo = slot === BRAIN_FACTS.length;
  const showRate = reportPct !== null && slot === BRAIN_FACTS.length + 1;

  return (
    <main
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-sans text-charcoal lg:h-screen lg:overflow-hidden"
      style={{ background: CANVAS }}
    >
      {/* The yellow capsule the design tilts off the top-right corner. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -right-[8vw] -top-[9vh] h-[13.9vh] w-[33.9vw] rotate-[-32deg] rounded-full"
          style={{
            background: "linear-gradient(90deg, #ffd75e, #ffe9a8)",
            opacity: 0.5,
          }}
        />
      </div>

      <header className="relative z-10 shrink-0 px-[4vw] pt-[3vh] lg:px-[1.35vw] lg:pt-[4.26vh]">
        <BoardHeader />
      </header>

      {/* Scan | standings. The design gives the standings 1434 of the 1920
          and the scan rail 384; below `lg` they stack, standings first. */}
      <div className="relative z-10 grid min-h-0 flex-1 gap-4 px-[4vw] py-4 lg:grid-cols-[384fr_1434fr] lg:gap-[1.32vw] lg:px-[2.4vw] lg:py-[2.5vh]">
        <div className="order-2 lg:order-1 lg:min-h-0">
          {PHKL_PAUSED ? (
            <div
              className="flex h-full flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-card"
              style={{ border: `1px solid ${CARD_LINE}` }}
            >
              <p
                className={`${T.eyebrow} font-bold uppercase tracking-[0.3em] text-primary`}
              >
                That&apos;s a wrap
              </p>
              <p className={`${T.boardLabel} mt-3 font-extrabold leading-tight`}>
                The challenge has ended
              </p>
              <p className={`${T.rowEmpty} mt-3 font-semibold text-secondary`}>
                {total > 0
                  ? `${total} minds tested today`
                  : "Thanks for playing"}
              </p>
            </div>
          ) : (
            <ScanRail />
          )}
        </div>

        <div className="order-1 flex min-h-0 flex-col lg:order-2">
          {/* The label band: highlighter yellow fading out to the right. */}
          <p
            className={`${T.boardLabel} w-full shrink-0 py-[0.7em] pl-[clamp(1rem,min(4.4vh,6vw),4.44rem)] font-bold italic leading-none tracking-[0.09em] lg:w-[49.6%]`}
            style={{ background: LABEL_BAND, color: HIGHLIGHT_INK }}
          >
            {BOARD_LABEL}
          </p>

          <ol className="mt-[1.01vh] flex min-h-0 flex-col justify-start gap-2 lg:gap-[1.01vh]">
            {rows.map((e, i) => (
              <StandingRow
                key={e ? keyOf(e) : `empty-${i}`}
                rank={i + 1}
                entry={e}
                leader={i === 0 && !!e}
              />
            ))}
          </ol>
        </div>
      </div>

      {/* Fact strip: the lockup, then the rotating fact. */}
      <div
        className="relative z-10 flex shrink-0 flex-col items-center justify-center gap-3 overflow-hidden px-[4vw] py-3 sm:flex-row sm:justify-start sm:gap-[4.17vw] lg:h-[12.87vh] lg:px-[2.5vw] lg:py-0"
        style={{ background: "rgba(255,255,255,0.72)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gms-ntu-logo.png"
          alt="Gray Matter Solutions, a spin-off from Nanyang Technological University, Singapore"
          className="h-[clamp(1.75rem,min(7.99vh,7vw),5.393rem)] w-auto shrink-0"
        />
        <AnimatePresence mode="wait">
          <motion.p
            key={factIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            className={`${T.fact} min-w-0 text-center leading-[1.3] sm:text-left`}
          >
            {showRate ? (
              <>
                <span className="font-extrabold text-primary">
                  {reportPct}%
                </span>{" "}
                <span className="font-semibold">
                  folks got their brain health report
                </span>{" "}
                <span aria-hidden>🧠</span>
              </>
            ) : showHowTo ? (
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
                <span className="font-semibold">{BRAIN_FACTS[slot]}</span>
              </>
            )}
          </motion.p>
        </AnimatePresence>
      </div>

      <PhotoBand />

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
