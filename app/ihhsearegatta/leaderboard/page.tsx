"use client";

/**
 * The attract screen for /ihhsearegatta (Figma node 638:5063, designed
 * against a 1920x1080 55" panel read from 2-5m away).
 *
 * The design puts the pitch on the left - the brain, the headline, the scan
 * block and the prize panel - and the live standings on the right, over a
 * fact strip and a band of event photography.
 *
 * The Figma frame is absolutely positioned at 1920x1080, so the board draws in
 * its pixels. One design unit, `--u` (set on <main>), is the frame scaled to
 * fit the viewport - min(100vw / 1920, 100vh / 1080) - and every size below is
 * the design's px times it, via `u()`. On a 16:9 screen of any resolution the
 * result is the Figma frame exactly; on a 16:10 laptop or a 4:3 projector the
 * composition holds and only the vertical gaps give. Below 1024px, or in
 * portrait, the unit comes from the width instead (100vw / 640, capped at 1px)
 * and the two columns stack - there is no phone frame in the design, so the
 * stacked sizes are chosen to read on one.
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

/**
 * `n` design pixels, in the board's unit. Sizes that are the same in both
 * layouts go through this as inline styles; the ones that differ between the
 * two-column board and the stacked phone layout are Tailwind classes on the
 * `board:` breakpoint, spelled out in full so the compiler sees them.
 */
const u = (n: number) => `calc(var(--u) * ${n})`;

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
const STRIP_BG = "rgba(255, 255, 255, 0.72)";

const keyOf = (e: Entry) => `${e.name}·${Math.round(e.timeMs)}`;

/* ------------------------------- Masthead ------------------------------- */

/**
 * The brain and the question, side by side. The brain asset carries its own
 * "Frontal Lobe" label and sparkle, exactly as the design places it. The row
 * is the design's 251px tall so the line under it lands where the frame puts
 * it; the brain (347px wide, and shorter than that box) centres in it.
 */
function Masthead() {
  return (
    <div className="flex items-center gap-[calc(var(--u)*20)] board:min-h-[calc(var(--u)*251)] board:gap-[calc(var(--u)*45)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/event3/brain.webp"
        alt=""
        aria-hidden
        className="w-[calc(var(--u)*120)] shrink-0 select-none board:w-[calc(var(--u)*347)]"
      />
      <h1 className="min-w-0 text-[length:calc(var(--u)*44)] font-extrabold leading-none tracking-[-0.015em] text-charcoal board:text-[length:calc(var(--u)*82.88)]">
        Is your brain at its
        <br />
        peak performance?
      </h1>
    </div>
  );
}

/* ------------------------------ Standings ------------------------------- */

/**
 * The standings label, centred on its column over the soft glow the design
 * lays behind it: a 722.5x86.5 rectangle (running off the right edge of the
 * frame) filled with the Processing Speed domain's warm radial gradient,
 * centred left of the text. Stacked, the label simply heads the list.
 */
function BoardLabel({ live }: { live: boolean }) {
  return (
    <div className="relative flex shrink-0 items-center board:h-[calc(var(--u)*86.5)] board:justify-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 hidden board:block"
        style={{
          left: u(-69),
          width: u(722.5),
          background: `radial-gradient(${u(451.6)} ${u(54.1)} at ${u(180.6)} ${u(21.6)}, rgba(245, 158, 10, 0.25) 0%, rgba(255, 235, 87, 0.06) 100%)`,
        }}
      />
      <p
        className="relative whitespace-nowrap font-bold uppercase leading-[1.04] tracking-[0.09em]"
        style={{ color: ON_EMBER, fontSize: u(31.37) }}
      >
        {live ? "Speed game leaderboard" : "Final standings"}
      </p>
    </div>
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
    : !entry
      ? INK_FAINT
      : rank === 2 || rank === 3
        ? "#2d2d2d"
        : "#7d5747";

  return (
    <motion.li
      layout
      transition={springs.shuffle}
      className={`flex shrink-0 items-center ${
        leader ? "h-[calc(var(--u)*144)]" : "h-[calc(var(--u)*88)]"
      }`}
      style={{
        borderRadius: u(26.5),
        paddingInline: u(25.4),
        gap: u(23.2),
        background: leader
          ? LEADER_GRADIENT
          : entry
            ? "#ffffff"
            : "rgba(255, 255, 255, 0.55)",
        border: entry ? "none" : `${u(2)} dashed ${CARD_LINE}`,
        boxShadow: leader
          ? `0 ${u(17.7)} ${u(22.1)} rgba(51, 18, 0, 0.18)`
          : entry
            ? `0 ${u(2.2)} ${u(4.4)} rgba(51, 18, 0, 0.08), 0 ${u(8.8)} ${u(13.3)} rgba(51, 18, 0, 0.12)`
            : "none",
      }}
    >
      <span
        className="flex shrink-0 items-center justify-center rounded-full font-extrabold leading-none"
        style={{
          width: u(leader ? 71.8 : 55.2),
          height: u(leader ? 71.8 : 55.2),
          fontSize: u(leader ? 35.35 : 26.51),
          background: badgeBg,
          color: badgeColor,
        }}
      >
        {rank}
      </span>

      {entry ? (
        <>
          {/* The leader name is the one size held below the design's 53px:
              at that size even "Jamie Tan" truncates beside the time (the
              Figma render shows "Jamie T..."), so this is sized for the
              longest name displayName can hand back to fit whole. */}
          <span
            className={`min-w-0 flex-1 truncate font-extrabold ${
              leader
                ? "leading-[1.05] tracking-[-0.01em] text-white"
                : "leading-[1.1] tracking-[-0.005em] text-charcoal"
            }`}
            style={{ fontSize: u(leader ? 40 : 38.66) }}
          >
            {displayName(entry.name)}
          </span>
          {leader ? (
            <span
              className="flex shrink-0 flex-col items-end"
              style={{ gap: u(4.4) }}
            >
              <span
                className="font-bold uppercase leading-[1.3] tracking-[0.25em]"
                style={{ color: PRIZE_WARM, fontSize: u(16.57) }}
              >
                Time to beat
              </span>
              <span
                className="font-extrabold leading-none tracking-[-0.01em] text-white tabular-nums"
                style={{ fontSize: u(71.8) }}
              >
                {formatTime(entry.timeMs)}
              </span>
            </span>
          ) : (
            <span
              className="shrink-0 font-extrabold leading-[1.05] tracking-[-0.005em] tabular-nums"
              style={{ color: ORANGE_DEEP, fontSize: u(43.08) }}
            >
              {formatTime(entry.timeMs)}
            </span>
          )}
        </>
      ) : (
        <>
          <span
            className="min-w-0 flex-1 truncate font-semibold leading-[1.3]"
            style={{ color: INK_FAINT, fontSize: u(28.7) }}
          >
            Scan to claim this spot
          </span>
          <span
            className="shrink-0 font-extrabold leading-[1.05] tracking-[-0.005em] tabular-nums"
            style={{ color: EMPTY_TIME, fontSize: u(43.08) }}
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
    // No frame around the artwork: the uploaded code carries its own, and the
    // board's would sit as a second border around it.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={ref}
        src={QR_IMAGE}
        alt="Scan to play the Reaction Time Challenge"
        onError={() => setArtwork(false)}
        className="aspect-square w-full object-contain"
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
    <div
      className="flex aspect-square w-full items-center justify-center bg-white"
      style={{ padding: u(4), border: `${u(10)} solid #111111` }}
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
  );
}

/**
 * The yellow "scan to play" label sitting directly on top of the code, as one
 * block - the design aligns their left and right edges. The design's 388px
 * square, capped at the column when a phone is narrower than that.
 */
function ScanBlock() {
  return (
    <div
      className="flex w-full max-w-full shrink-0 flex-col"
      style={{ width: u(388) }}
    >
      <p
        className="flex w-full items-center justify-center whitespace-nowrap font-extrabold tracking-[0.12em]"
        style={{
          height: u(66),
          fontSize: u(28.37),
          background: SCAN_HIGHLIGHT,
          color: ON_EMBER,
        }}
      >
        SCAN TO PLAY &lt; 60s
      </p>

      <ScanCode />
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
 * right edge, its top and its bottom the way the design has it (which is why
 * the panel does not clip). The offer runs from 41px in to where the watch
 * starts (408px), so the title breaks "Win a Garmin / Forerunner / 165" as
 * drawn. The panel sits 5px above the code's bottom edge, as in the frame.
 */
function PrizePanel() {
  return (
    <div
      className="relative flex w-full items-center py-[calc(var(--u)*28)] pl-[calc(var(--u)*28)] pr-[40%] board:mb-[calc(var(--u)*5)] board:h-[calc(var(--u)*422)] board:w-[calc(var(--u)*775)] board:shrink-0 board:self-end board:py-0 board:pl-[calc(var(--u)*41)] board:pr-0"
      style={{ background: PRIZE_GRADIENT, borderRadius: u(20) }}
    >
      <div className="relative z-10 flex min-w-0 flex-col gap-[calc(var(--u)*10)] text-cream board:w-[calc(var(--u)*408)] board:gap-[calc(var(--u)*15.9)]">
        <div className="flex flex-col gap-[calc(var(--u)*6)] board:gap-[calc(var(--u)*10.6)]">
          <p className="text-[length:calc(var(--u)*16)] font-bold uppercase leading-[1.1] tracking-[0.23em] board:text-[length:calc(var(--u)*20.38)]">
            Fastest mind
          </p>
          <p className="text-[length:calc(var(--u)*38)] font-extrabold leading-[1.04] tracking-[-0.015em] board:text-[length:calc(var(--u)*60.77)]">
            Win a Garmin Forerunner 165
          </p>
        </div>
        {/* The design sets these two lines in Roboto; in the board's own face
            they run a touch wider, so they are held a size down to stay on
            one line each beside the watch. */}
        <div className="flex flex-col gap-[calc(var(--u)*4)] text-[length:calc(var(--u)*22)] font-bold leading-[1.1] board:gap-[calc(var(--u)*8.5)] board:whitespace-nowrap board:text-[length:calc(var(--u)*31)]">
          <p>GPS Running Smartwatch</p>
          <p>Worth $379</p>
        </div>
      </div>

      {/* The render sits over the panel's right edge, taller than the panel
          itself - hence the offsets rather than a flow child. In the frame it
          is 373x478 at 449px in from the panel's left, 16px above its top. */}
      <OptionalImage
        src="/garmin-forerunner-165-white.png"
        alt="Garmin Forerunner 165 GPS running smartwatch"
        className="animate-symbol-drift pointer-events-none absolute right-[-3%] top-[-6%] h-[112%] w-auto object-contain drop-shadow-[0_18px_28px_rgba(74,26,0,0.45)] board:left-[calc(var(--u)*449)] board:right-auto board:top-[calc(var(--u)*-16)] board:h-[calc(var(--u)*478)]"
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
 * The band of event photography along the bottom edge. Three frames, in the
 * widths the design shows of each (its frames overlap; these are the visible
 * parts, 482:681:757); each is optional, so the band simply thins out (and
 * finally disappears) until the photos are dropped in. In the frame the band
 * starts 12px under the strip's bottom edge, which is why the strip stacks
 * above it.
 */
const BAND = [
  { src: "/regatta-band-1.jpg", grow: 482 },
  { src: "/regatta-band-2.png", grow: 681 },
  { src: "/regatta-band-3.jpg", grow: 757 },
];

function PhotoBand() {
  return (
    <div
      aria-hidden
      className="relative z-10 flex h-[calc(var(--u)*60)] w-full shrink-0 overflow-hidden empty:hidden board:-mt-[calc(var(--u)*12)] board:h-[calc(var(--u)*53)]"
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
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-sans text-charcoal [--u:min(100vw/640,1px)] board:h-screen board:overflow-hidden board:[--u:min(100vw/1920,100vh/1080)]"
      style={{ background: CANVAS }}
    >
      {/* The soft yellow capsule from the funnel's splash art, tilted off the
          top-right corner (a 650x150 pill centred at 2091,-61 in the frame). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute right-[-38%] top-[-5%] h-[calc(var(--u)*110)] w-[calc(var(--u)*420)] rotate-[-32deg] rounded-full opacity-50 board:right-[calc(var(--u)*-496)] board:top-[calc(var(--u)*-136)] board:h-[calc(var(--u)*150)] board:w-[calc(var(--u)*650)]"
          style={{ background: "linear-gradient(90deg, #ffd75e, #ffe9a8)" }}
        />
      </div>

      {/* Pitch on the left, standings on the right - the frame's 1274:646
          split, centred should the screen be wider than 16:9. Each column is
          padded to the frame's own offsets and centres its content, so any
          height a taller screen adds is shared above and below. */}
      <div className="relative z-10 mx-auto flex w-full flex-1 flex-col board:min-h-0 board:max-w-[calc(var(--u)*1920)] board:flex-row">
        {/* Left: the pitch. */}
        <div className="flex min-w-0 flex-col px-[calc(var(--u)*24)] pt-[calc(var(--u)*36)] board:w-[calc(var(--u)*1274)] board:shrink-0 board:justify-center board:pb-[calc(var(--u)*54)] board:pl-[calc(var(--u)*26)] board:pr-0 board:pt-[calc(var(--u)*46)]">
          <Masthead />
          <p className="mt-[calc(var(--u)*16)] text-[length:calc(var(--u)*24)] font-medium leading-[1.28] tracking-[-0.01em] text-charcoal board:mt-0 board:text-[length:calc(var(--u)*33.36)]">
            Play the <strong className="font-bold">speed</strong> game to see
            your <strong className="font-bold">rank</strong> and get free{" "}
            <strong className="font-bold">personalised</strong> insights.
          </p>

          {IHHSEA_PAUSED ? (
            <div
              className="mt-[calc(var(--u)*28)] flex flex-col items-center justify-center bg-white text-center shadow-card board:mt-[calc(var(--u)*52)] board:h-[calc(var(--u)*454)] board:w-[calc(var(--u)*1201)]"
              style={{
                border: `1px solid ${CARD_LINE}`,
                borderRadius: u(26.5),
                padding: u(40),
              }}
            >
              <p
                className="font-bold uppercase tracking-[0.3em] text-primary"
                style={{ fontSize: u(28.37) }}
              >
                That&apos;s a wrap
              </p>
              <p
                className="font-extrabold leading-tight"
                style={{ fontSize: u(60.77), marginTop: u(16) }}
              >
                The challenge has ended
              </p>
              <p
                className="font-semibold text-secondary"
                style={{ fontSize: u(33.09), marginTop: u(16) }}
              >
                {total > 0 ? `${total} minds tested today` : "Thanks for playing"}
              </p>
            </div>
          ) : (
            <div className="mt-[calc(var(--u)*28)] flex flex-col gap-[calc(var(--u)*24)] board:mt-[calc(var(--u)*52)] board:flex-row board:items-start board:gap-[calc(var(--u)*38)]">
              <ScanBlock />
              <PrizePanel />
            </div>
          )}
        </div>

        {/* Right: the live standings. */}
        <div className="flex min-w-0 flex-col px-[calc(var(--u)*24)] pt-[calc(var(--u)*40)] board:w-[calc(var(--u)*646)] board:shrink-0 board:justify-center board:pb-[calc(var(--u)*76)] board:pl-0 board:pr-[calc(var(--u)*20)] board:pt-[calc(var(--u)*46)]">
          <BoardLabel live={!IHHSEA_PAUSED} />
          <ol
            className="mt-[calc(var(--u)*16)] flex min-w-0 flex-col board:mt-[calc(var(--u)*41.5)]"
            style={{ gap: u(13.26) }}
          >
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

      {/* Fact strip: the institutional lockup at the left, then the fact,
          running left to right inside the strip's 48px side margins so a long
          one has the whole width to the right edge before it wraps. */}
      <div
        className="relative z-20 mt-[calc(var(--u)*36)] flex shrink-0 flex-col items-center gap-[calc(var(--u)*12)] overflow-hidden px-[calc(var(--u)*24)] py-[calc(var(--u)*16)] board:mt-0 board:h-[calc(var(--u)*139)] board:flex-row board:justify-start board:gap-[calc(var(--u)*80)] board:px-[calc(var(--u)*48)] board:py-0"
        style={{ background: STRIP_BG }}
      >
        {/* The frame shows the lockup in a 436.5x86.3 box; the artwork is a
            touch wider than that box and the frame crops the excess, which is
            the empty right margin of the file. */}
        <div
          className="flex h-[calc(var(--u)*56)] w-auto shrink-0 items-center overflow-hidden board:h-[calc(var(--u)*86.3)] board:w-[calc(var(--u)*436.5)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gms-ntu-logo.png"
            alt="Gray Matter Solutions, a spin-off from Nanyang Technological University, Singapore"
            className="h-full w-auto max-w-none"
          />
        </div>
        <div className="flex min-w-0 items-center justify-center board:justify-start">
          <AnimatePresence mode="wait">
            <motion.p
              key={factIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
              className="text-center text-[length:calc(var(--u)*22)] leading-[1.3] board:text-left board:text-[length:calc(var(--u)*27)]"
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
                    Brain fact
                  </span>
                  <span
                    aria-hidden
                    className="inline-block"
                    style={{ width: u(16) }}
                  />
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
              className="relative text-center"
              style={{ padding: `${u(64)} ${u(76)}` }}
            >
              {/* One-shot confetti burst. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-1/2 flex justify-center"
              >
                {Array.from({ length: 18 }, (_, i) => (
                  <span
                    key={i}
                    className="animate-ember-burst absolute rounded-full"
                    style={{
                      width: u(13),
                      height: u(13),
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
                className="font-bold uppercase tracking-[0.34em] text-primary"
                style={{ fontSize: u(20.38) }}
              >
                New top 3
              </p>
              <p
                className="font-extrabold leading-none tracking-[-0.015em]"
                style={{ fontSize: u(82.88), marginTop: u(16) }}
              >
                {displayName(celebration.name)}
              </p>
              <p
                className="font-extrabold leading-none text-primary tabular-nums"
                style={{ fontSize: u(71.8), marginTop: u(16) }}
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
