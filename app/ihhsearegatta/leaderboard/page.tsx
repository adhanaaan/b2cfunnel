"use client";

/**
 * The attract screen for /ihhsearegatta (Figma node 629:4815, designed against
 * a 1920x1080 55" panel read from 2-5m away, but laid out to reflow down to a
 * phone).
 *
 * The design puts the pitch on the left - the brain, the headline, the scan
 * block and the prize panel - and the live standings on the right, over a
 * rotating fact strip and a band of event photography.
 *
 * The Figma frame is absolutely positioned at 1920x1080; here it is a fluid
 * two-column grid whose type is clamped between a mobile floor and the panel
 * size, so the same markup serves the panel, a laptop and a phone. Every size
 * in T below is the design's px at its ceiling.
 *
 * Self-contained: polls /api/leaderboard every 8s, scoped to the
 * `ihhsearegatta` bucket, and keeps the last good standings on error.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { displayName, formatTime } from "@/lib/format";
import { IHHSEA_PAUSED, IHHSEA_SOURCE } from "@/config/event";
import { playUrlFor } from "@/config/eventLinks";
import { BRAIN_FACTS } from "@/config/tips";
import { springs } from "@/lib/motion";

interface Entry {
  name: string;
  timeMs: number;
}

/** Six rows, as the design lays out. */
const TOP_N = 6;
const POLL_MS = 8000;
const FACT_MS = 8000;

/** Where the QR sends players (absolute - see config/eventLinks.ts). */
const PLAY_URL = playUrlFor("ihhsearegatta");

/**
 * How often the completion stat is refreshed. Slower than the standings: the
 * rate moves over the course of an event, not shot to shot.
 */
const RATE_POLL_MS = 30000;

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
const PRIZE_WARM = "#ffe4cf";
/** The Processing Speed domain's light tone, behind the scan label. */
const SCAN_HIGHLIGHT = "#fde68a";
/** Ember-on-core: the ink the design puts on that yellow. */
const ON_EMBER = "#2a1006";

const CANVAS =
  "linear-gradient(150deg, #fff8f6 15%, #fdeee4 46%, #fbe3d3 85%)";
const LEADER_GRADIENT = "linear-gradient(90deg, #f77528 0%, #ff9a4d 100%)";
const PRIZE_GRADIENT = "linear-gradient(90deg, #f77528 0%, #ff9a4d 100%)";

/**
 * Clamped type sizes, ceilings straight off the design. The middle term is
 * `min(vh, vw)` on purpose: the board is sized off viewport height for the 55"
 * panel, but on a tall narrow phone a height-only clamp produces TV-sized text
 * that overflows the width.
 */
const T = {
  // Masthead: "Is your brain at its peak performance?" (82.9px) and the line
  // under it (39.4px, its emphasised words stepped up in em).
  h1: "text-[clamp(1.5rem,min(7.7vh,4.32vw),5.18rem)]",
  sub: "text-[clamp(0.875rem,min(3.65vh,2.05vw),2.4625rem)]",
  // Scan block (28.4px) and the standings label (31.4px).
  scanLabel: "text-[clamp(0.75rem,min(2.63vh,1.48vw),1.775rem)]",
  boardLabel: "text-[clamp(0.75rem,min(2.9vh,1.63vw),1.9625rem)]",
  // Prize panel: eyebrow 20.4px, title 60.8px, the two lines under it 33.1px.
  prizeEyebrow: "text-[clamp(0.625rem,min(1.89vh,1.06vw),1.275rem)]",
  prizeTitle: "text-[clamp(1.25rem,min(5.63vh,3.17vw),3.8rem)]",
  prizeSub: "text-[clamp(0.8125rem,min(3.06vh,1.72vw),2.0625rem)]",
  // Standings: leader 53/71.8px over rows at 38.7/43.1px, badges 35.4/26.5px.
  //
  // The leader name is the one size held BELOW the design. At the design's own
  // 53px even "Jamie Tan" truncates in a 626px column - the Figma render shows
  // it as "Jamie T..." - so the mock is over-scaled for real data. This is
  // sized so the longest name displayName can hand back ("Michelle W.") still
  // fits whole, since a cut name is the thing a player notices.
  leaderName: "text-[clamp(1.125rem,min(4vh,2vw),3.3125rem)]",
  leaderTime: "text-[clamp(1.375rem,min(6.2vh,3.5vw),4.4875rem)]",
  micro: "text-[clamp(0.5rem,min(1.54vh,0.86vw),1.0375rem)]",
  rowName: "text-[clamp(0.9375rem,min(3.58vh,2.01vw),2.4125rem)]",
  rowTime: "text-[clamp(1rem,min(3.99vh,2.24vw),2.6875rem)]",
  rowEmpty: "text-[clamp(0.8125rem,min(2.6vh,1.7vw),1.625rem)]",
  rankL: "text-[clamp(0.9375rem,min(3.28vh,1.84vw),2.2125rem)]",
  rank: "text-[clamp(0.75rem,min(2.45vh,1.38vw),1.65rem)]",
  // Fact strip (27px).
  fact: "text-[clamp(0.75rem,min(2.5vh,1.4vw),1.6875rem)]",
};

const keyOf = (e: Entry) => `${e.name}·${Math.round(e.timeMs)}`;

/* ------------------------------- Masthead ------------------------------- */

/**
 * The brain and the question, side by side. The brain asset carries its own
 * "Frontal Lobe" label and sparkle, exactly as the design places it.
 */
function Masthead() {
  return (
    <div className="flex items-center gap-[2.3vw]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/event3/brain.webp"
        alt=""
        aria-hidden
        className="hidden w-[clamp(6rem,18vw,21.7rem)] shrink-0 select-none sm:block"
      />
      <h1
        className={`${T.h1} min-w-0 font-extrabold leading-none tracking-tight text-charcoal`}
      >
        Is your brain at its
        <br />
        peak performance?
      </h1>
    </div>
  );
}

/* ------------------------------ Standings ------------------------------- */

function BoardLabel({ live }: { live: boolean }) {
  return (
    <p
      className={`${T.boardLabel} shrink-0 font-bold uppercase tracking-[0.09em]`}
      style={{ color: ON_EMBER }}
    >
      {live ? "Speed game leaderboard" : "Final standings"}
    </p>
  );
}

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
      className="flex min-h-0 items-center gap-[clamp(0.5rem,1.2vw,1.45rem)] rounded-[1.65rem] px-[0.7em] py-[0.4em] sm:px-[1.1em] xl:py-0"
      style={{
        // 144px against 88px in the design.
        flex: leader ? 1.64 : 1,
        background: leader
          ? LEADER_GRADIENT
          : entry
            ? "#ffffff"
            : "rgba(255,255,255,0.55)",
        border: entry ? "none" : `2px dashed ${CARD_LINE}`,
        boxShadow: leader
          ? "0 18px 22px -12px rgba(51,18,0,0.18)"
          : entry
            ? "0 9px 13px -6px rgba(51,18,0,0.12), 0 2px 4px -2px rgba(51,18,0,0.08)"
            : "none",
      }}
    >
      <span
        className={`${leader ? T.rankL : T.rank} flex aspect-square shrink-0 items-center justify-center rounded-full font-extrabold leading-none`}
        style={{
          height: leader
            ? "clamp(1.625rem,min(6.65vh,3.74vw),4.4875rem)"
            : "clamp(1.25rem,min(5.11vh,2.88vw),3.45rem)",
          background: badgeBg,
          color: badgeColor,
        }}
      >
        {rank}
      </span>

      {entry ? (
        <>
          <span
            className={`${leader ? T.leaderName : T.rowName} min-w-0 flex-1 truncate font-extrabold ${leader ? "text-white" : "text-charcoal"}`}
          >
            {displayName(entry.name)}
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
                className={`${T.leaderTime} mt-[0.1em] font-extrabold tabular-nums text-white`}
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

/* ------------------------------ Scan block ------------------------------ */

/** Artwork for the code, if it has been uploaded (see ScanCode). */
const QR_IMAGE = "/regatta-qr.png";

/**
 * The code: the uploaded artwork when there is one, a generated code when
 * there is not.
 *
 * The generated code is the safety net rather than the default - it always
 * encodes PLAY_URL, so a board whose artwork has not landed yet, or whose file
 * is misnamed, still has a way in rather than a blank frame. Artwork wins
 * because it can carry the brand mark the design puts in the middle of the
 * code, which a generated one cannot without raising the error correction and
 * shrinking every module.
 *
 * Whatever the artwork encodes is what players get - nothing here can check
 * that, so a code for the wrong URL is a wrong code.
 */
function ScanCode() {
  const ref = useRef<HTMLImageElement>(null);
  const [artwork, setArtwork] = useState(true);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    let cancelled = false;
    // decode() rather than onError alone: this page is prerendered, so a 404
    // can land before React hydrates and fire its error event into nothing.
    void img.decode().catch(() => {
      if (!cancelled && img.naturalWidth === 0) setArtwork(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (artwork) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={ref}
        src={QR_IMAGE}
        alt={`Scan to play the Reaction Time Challenge at ${PLAY_URL}`}
        onError={() => setArtwork(false)}
        className="h-full w-full object-contain"
      />
    );
  }

  // Scannability settings measured at a live event (#46), kept through the
  // redesign: level L needs 29 modules against M's 33, making each ~14% larger
  // in the same box; and marginSize={4} puts the spec'd four-module quiet zone
  // inside the SVG, where the design's black frame cannot eat into it. Pure
  // black thresholds better than the brand brown on a washed-out projector and
  // is indistinguishable across a room.
  return (
    <QRCodeSVG
      value={PLAY_URL}
      className="h-full w-full"
      level="L"
      marginSize={4}
      fgColor="#000000"
      bgColor="#ffffff"
    />
  );
}

/**
 * The yellow "scan to play" label sitting directly on top of the code, as one
 * block - the design aligns their left and right edges.
 */
function ScanBlock() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start">
      <p
        className={`${T.scanLabel} w-full px-[0.5em] py-[0.35em] text-center font-extrabold tracking-[0.12em]`}
        style={{ background: SCAN_HIGHLIGHT, color: ON_EMBER }}
      >
        SCAN TO PLAY &lt; 60s
      </p>

      <div
        className="flex aspect-square w-full max-w-[min(70vw,40vh)] items-center justify-center bg-white p-[0.25rem] xl:max-w-[min(21vw,37vh)]"
        style={{ border: "0.6rem solid #111111" }}
      >
        <ScanCode />
      </div>
    </div>
  );
}

/* ------------------------------ Prize panel ----------------------------- */

/**
 * An image that is allowed not to exist: the prize render and the photo band
 * are dropped in as files, and the board has to read before they land.
 *
 * `onError` alone is not enough: this page is prerendered, so the browser
 * starts (and often finishes) loading the image from the server HTML before
 * React hydrates and attaches the handler - a 404 that lands in that window
 * fires into nothing and leaves the browser's broken-image icon on the card.
 * `decode()` closes that gap from the other end: it settles on the element's
 * real outcome whether the fetch already finished or is still in flight, so a
 * missing file is simply an absent photo. (`complete` is no use here - it
 * reads `true` in the moment between the src being set and the fetch
 * starting, which would hide a picture that was about to load perfectly.)
 */
function OptionalImage({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    let cancelled = false;
    void img.decode().catch(() => {
      // naturalWidth guards against a decode rejection on an image that did
      // in fact arrive (an aborted decode, a detached element).
      if (!cancelled && img.naturalWidth === 0) setBroken(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (broken) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      className={className}
      style={style}
    />
  );
}

/**
 * The prize: an ember panel with the offer, and the watch breaking out of its
 * right edge the way the design has it (which is why the panel does not clip).
 */
function PrizePanel() {
  return (
    <div
      className="relative flex flex-1 items-center rounded-[20px] px-[1.4em] py-[1.2em] sm:px-[2em] xl:min-h-0"
      style={{ background: PRIZE_GRADIENT }}
    >
      <div className="relative z-10 flex min-w-0 flex-col gap-[1.6vh] text-cream sm:max-w-[58%]">
        <p
          className={`${T.prizeEyebrow} font-bold uppercase tracking-[0.23em]`}
        >
          Fastest mind
        </p>
        <p className={`${T.prizeTitle} font-extrabold leading-[1.04] tracking-tight`}>
          Win a Garmin Forerunner 165
        </p>
        <div className={`${T.prizeSub} flex flex-col gap-[0.25em] font-bold leading-[1.1]`}>
          <p>GPS Running Smartwatch</p>
          <p>Worth $379</p>
        </div>
      </div>

      {/* The render sits over the panel's right edge, taller than the panel
          itself - hence the negative insets rather than a flow child. */}
      <OptionalImage
        src="/garmin-forerunner-165.png"
        alt="Garmin Forerunner 165 GPS running smartwatch"
        className="animate-symbol-drift pointer-events-none absolute -bottom-[9%] -top-[4%] right-[-2%] hidden w-[42%] object-contain drop-shadow-[0_18px_28px_rgba(74,26,0,0.45)] sm:block"
        style={{
          ["--drift-y" as string]: "-12px",
          ["--drift-x" as string]: "0px",
          ["--drift-tilt" as string]: "0deg",
          ["--drift-tilt-to" as string]: "0deg",
          ["--drift-duration" as string]: "5s",
        }}
      />
    </div>
  );
}

/* ------------------------------ Photo band ------------------------------ */

/**
 * The band of event photography along the bottom edge. Three frames in the
 * design's 491:833:833 widths; each is optional, so the band simply thins out
 * (and finally disappears) until the photos are dropped in.
 */
const BAND = [
  { src: "/regatta-band-1.jpg", grow: 491 },
  { src: "/regatta-band-2.jpg", grow: 833 },
  { src: "/regatta-band-3.jpg", grow: 833 },
];

function PhotoBand() {
  return (
    <div
      aria-hidden
      className="relative z-10 flex w-full shrink-0 gap-px overflow-hidden empty:hidden"
    >
      {BAND.map((frame) => (
        <OptionalImage
          key={frame.src}
          src={frame.src}
          alt=""
          className="h-[clamp(1.5rem,4.9vh,3.3125rem)] min-w-0 object-cover"
          style={{ flex: `${frame.grow} 1 0` }}
        />
      ))}
    </div>
  );
}

/* --------------------------------- Board -------------------------------- */

export default function LeaderboardIhhSeaRegattaBoard() {
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
          `/api/leaderboard?limit=${TOP_N}&source=${encodeURIComponent(IHHSEA_SOURCE)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (!active || !Array.isArray(data.entries)) return;
        const next: Entry[] = data.entries;
        setEntries(next);
        setTotal(data.total ?? next.length);

        // New podium entrants (skip the very first load: nothing is "new").
        const podium = next.slice(0, 3);
        if (!firstLoadRef.current && !IHHSEA_PAUSED) {
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

  // Completion rate for this event: reports over players, from the same source
  // tag the standings use. Keeps the last good value on error.
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(
          `/api/report-rate?source=${encodeURIComponent(IHHSEA_SOURCE)}`,
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
  // live completion rate.
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
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-sans text-charcoal xl:h-screen xl:overflow-hidden"
      style={{ background: CANVAS }}
    >
      {/* Soft capsule shapes from the funnel's splash art, tilted off-canvas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -right-[8vw] -top-[18vh] h-[14vh] w-[34vw] rotate-[-32deg] rounded-full"
          style={{
            background: "linear-gradient(90deg, #ffd75e, #ffe9a8)",
            opacity: 0.5,
          }}
        />
        <div
          className="absolute -bottom-[14vh] -left-[12vw] h-[14vh] w-[38vw] rotate-[38deg] rounded-full"
          style={{
            background: "linear-gradient(90deg, #ffe382, #ffd75e)",
            opacity: 0.55,
          }}
        />
      </div>

      {/* Pitch on the left, standings on the right - the design's 1215:626. */}
      <div className="relative z-10 grid flex-1 gap-[3vh] px-[4vw] py-[3vh] xl:min-h-0 xl:grid-cols-[minmax(0,1215fr)_minmax(0,626fr)] xl:gap-[2vw] xl:px-[1.8vw] xl:py-[3.2vh]">
        {/* Left: the pitch. */}
        <div className="flex min-w-0 flex-col gap-[2.5vh] xl:min-h-0">
          <div className="shrink-0">
            <Masthead />
            <p className={`${T.sub} mt-[1.5vh] leading-[1.28] text-charcoal`}>
              Measure your <strong className="font-bold text-[1.14em]">speed</strong> and
              gain free{" "}
              <strong className="font-bold text-[1.14em]">personalised</strong>{" "}
              insights.
            </p>
          </div>

          {IHHSEA_PAUSED ? (
            <div
              className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-card"
              style={{ border: `1px solid ${CARD_LINE}` }}
            >
              <p
                className={`${T.scanLabel} font-bold uppercase tracking-[0.3em] text-primary`}
              >
                That&apos;s a wrap
              </p>
              <p className={`${T.prizeSub} mt-3 font-extrabold leading-tight`}>
                The challenge has ended
              </p>
              <p className={`${T.rowEmpty} mt-3 font-semibold text-secondary`}>
                {total > 0 ? `${total} minds tested today` : "Thanks for playing"}
              </p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-[3vh] sm:flex-row sm:items-stretch sm:gap-[2vw] xl:min-h-0">
              <div className="flex shrink-0 items-stretch xl:min-h-0 sm:w-[clamp(11rem,33%,24.25rem)]">
                <ScanBlock />
              </div>
              <PrizePanel />
            </div>
          )}
        </div>

        {/* Right: the live standings. */}
        <div className="flex min-w-0 flex-col gap-[1.6vh] xl:min-h-0">
          <BoardLabel live={!IHHSEA_PAUSED} />
          <ol className="flex min-w-0 flex-1 flex-col gap-2 xl:min-h-0 xl:gap-[1.2vh]">
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

      {/* Fact strip, with the institutional lockup sitting inside it. */}
      <div
        className="relative z-10 flex shrink-0 flex-col items-center gap-2 overflow-hidden px-[4vw] py-3 sm:flex-row sm:gap-[3vw] xl:h-[9.5vh] xl:px-[1.8vw] xl:py-0"
        style={{ borderTop: `1px solid ${CARD_LINE}`, background: "#ffffffb8" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gms-ntu-logo.png"
          alt="Gray Matter Solutions, a spin-off from Nanyang Technological University, Singapore"
          className="h-[clamp(1.5rem,min(5vh,3.5vw),3.4rem)] w-auto shrink-0"
        />
        <div className="flex min-w-0 flex-1 items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={factIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
              className={`${T.fact} text-center`}
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
                className={`${T.prizeEyebrow} font-bold uppercase tracking-[0.34em] text-primary`}
              >
                New top 3
              </p>
              <p
                className={`${T.h1} mt-[1.5vh] font-extrabold leading-none tracking-tight`}
              >
                {displayName(celebration.name)}
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
