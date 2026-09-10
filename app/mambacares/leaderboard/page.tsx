"use client";

/**
 * The attract screen for /mambacares, built to Figma 813:19115 ("Leaderboard —
 * /phkl/leaderboard", the #MambaCares board drawn over the PHKL frame),
 * designed against a 1920x1080 panel read from 2-5m away.
 *
 * The run's board differs from every other event's in what it asks for. The
 * left column is the campaign - the prizes the fastest 15 minds are playing
 * for, and an ember card whose QR goes to the donation, not to the game - and
 * the right column is the standings: the leader on a wide white hero row with
 * the time to beat, then ranks 2-15 in two columns of seven. Underneath, the
 * fact strip and the band of event photography both boards share.
 *
 * The Figma frame is absolutely positioned at 1920x1080, so the board draws in
 * its pixels. One design unit, `--u` (set on <main>), is the frame scaled to
 * fit the viewport - min(100vw / 1920, 100vh / 1080) - and every size below is
 * the design's px times it, via `u()`. On a 16:9 screen of any resolution the
 * result is the Figma frame exactly; on a 16:10 laptop or a 4:3 projector the
 * composition holds and only the gap under the standings gives. Below 1024px,
 * or in portrait, the unit comes from the width instead (100vw / 640, capped
 * at 1px) and everything stacks - there is no phone frame in the design, so
 * the stacked sizes are chosen to read on one.
 *
 * Self-contained: polls /api/leaderboard every 8s, scoped to the `mambacares`
 * bucket, and keeps the last good standings on error.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { displayName, formatTime } from "@/lib/format";
import { MAMBACARES_PAUSED, MAMBACARES_SOURCE } from "@/config/event";
import { MAMBACARES_DONATION_URL } from "@/config/mambacares";
import { BRAIN_FACTS } from "@/config/tips";
import { springs } from "@/lib/motion";
import { OptionalImage } from "@/components/screens/phkl/OptionalImage";

/**
 * Fifteen rows, as the design lays out: the leader (813:19125), then two
 * columns of seven (813:19117, 813:19126). The prize copy is written from this
 * number, so a board of a different depth cannot end up promising the wrong
 * one.
 */
const TOP_N = 15;
/** Rows per standings column - the two columns are the remainder, split. */
const COLUMN_N = (TOP_N - 1) / 2;

/**
 * How deep a new entry has to land to take the board over for four seconds.
 * Three rather than the fifteen the prizes go to on purpose: at a booth with
 * a queue, a top-15 takeover would fire on nearly every early play and then
 * never again, which is noise rather than news.
 */
const CELEBRATE_N = 3;

const POLL_MS = 8000;
const FACT_MS = 8000;

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
 * board and the stacked phone layout are Tailwind classes on the `board:`
 * breakpoint, spelled out in full so the compiler sees them.
 */
const u = (n: number) => `calc(var(--u) * ${n})`;

// Board palette (kept local: the board is its own full-bleed canvas).
const ORANGE_DEEP = "#e35d0e";
const CARD_LINE = "#f3ddd2";
const RANK_CHIP_BG = "#f6e8e0";
const RANK_INK = "#7d5747";
const INK_FAINT = "#a98d80";
const EMPTY_TIME = "#dcc4b6";
/** Text/Inverse - the ink the design puts on the ember card. */
const INVERSE = "#fafafa";

const CANVAS =
  "linear-gradient(151deg, #fff8f6 15%, #fdeee4 46%, #fbe3d3 85%)";
const DONATE_GRADIENT = "linear-gradient(90deg, #f77528 0%, #ff9a4d 100%)";
const PRIZE_GRADIENT = "linear-gradient(270deg, #fcf5ed 0%, #f7e3d4 100%)";
const STRIP_BG = "rgba(255, 255, 255, 0.72)";

/**
 * Artwork that is dropped in as files under public/images/mambacares/board/
 * (see the README there). Every one is optional: the board reads before any of
 * them land, and each appears the moment its file is committed.
 */
const BOARD_ART = "/images/mambacares/board";
const PRIZE_HOODIE = `${BOARD_ART}/prize-hoodie.png`;
const PRIZE_VEST = `${BOARD_ART}/prize-vest.png`;
const PRIZE_SALT = `${BOARD_ART}/prize-salt.png`;
const DONATE_GIFT = `${BOARD_ART}/donate-gift.png`;
const QR_IMAGE = `${BOARD_ART}/donate-qr.png`;

/**
 * The band of event photography along the bottom edge (813:19137, 813:19135,
 * 813:19136). The design's three frames overlap; these are the widths of each
 * that is actually visible, which is why they are not the phkl board's
 * ratios over the same three photos.
 *
 * The photos are the regatta board's, as /phkl's are: one event's crowd
 * standing in for the next, already committed at the repo root. Each is still
 * optional, so the band thins out (and finally disappears) rather than
 * breaking if one is ever removed.
 */
const BAND = [
  { src: "/regatta-band-1.jpg", grow: 408 },
  { src: "/regatta-band-2.png", grow: 764 },
  { src: "/regatta-band-3.jpg", grow: 748 },
];

interface Entry {
  name: string;
  timeMs: number;
}

const keyOf = (e: Entry) => `${e.name}·${Math.round(e.timeMs)}`;

/* ------------------------------- Masthead ------------------------------- */

/**
 * The brain and the question, side by side (813:19144). The brain asset
 * carries its own "Frontal Lobe" label and sparkle, exactly as the design
 * places it. One line on the board, as the frame sets it; a smaller size on a
 * phone, where it wraps.
 */
function Masthead() {
  return (
    <div className="flex shrink-0 items-center gap-[calc(var(--u)*20)] px-[calc(var(--u)*24)] pt-[calc(var(--u)*28)] board:h-[calc(var(--u)*150)] board:gap-[calc(var(--u)*39)] board:px-0 board:pl-[calc(var(--u)*30)] board:pt-[calc(var(--u)*25)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/event3/brain.webp"
        alt=""
        aria-hidden
        className="w-[calc(var(--u)*110)] shrink-0 select-none board:h-[calc(var(--u)*125)] board:w-[calc(var(--u)*172.811)]"
      />
      <h1 className="min-w-0 text-[length:calc(var(--u)*38)] font-extrabold leading-none tracking-[-0.015em] text-charcoal board:whitespace-nowrap board:text-[length:calc(var(--u)*62.881)]">
        Is your brain at its peak performance?
      </h1>
    </div>
  );
}

/* ------------------------------ Standings ------------------------------- */

/**
 * One row (the "Event3 Board/Standing row" component, 406:3540). The leader is
 * the 119px hero spanning both standings columns, with the time to beat over
 * its time; the rest are the 73.6px white rows, peach rank chip, time in the
 * deep orange. An unclaimed slot is the component's Empty variant: a dashed
 * outline the design does not draw but the board needs, since fifteen rows
 * start the day empty.
 */
function StandingRow({
  rank,
  entry,
  leader = false,
}: {
  rank: number;
  entry: Entry | null;
  leader?: boolean;
}) {
  return (
    <motion.li
      layout
      transition={springs.shuffle}
      className={`flex shrink-0 items-center ${
        leader ? "h-[calc(var(--u)*119)]" : "h-[calc(var(--u)*73.645)]"
      }`}
      style={{
        borderRadius: u(21.938),
        paddingInline: u(21.024),
        gap: u(19.196),
        background: entry ? "#ffffff" : "rgba(255, 255, 255, 0.55)",
        border: entry ? "none" : `${u(2)} dashed ${CARD_LINE}`,
        boxShadow: leader
          ? `0 ${u(14.626)} ${u(18.282)} rgba(51, 18, 0, 0.18)`
          : entry
            ? `0 ${u(1.828)} ${u(3.656)} rgba(51, 18, 0, 0.08), 0 ${u(7.313)} ${u(10.969)} rgba(51, 18, 0, 0.12)`
            : "none",
      }}
    >
      <span
        className="flex shrink-0 items-center justify-center rounded-full font-extrabold leading-none"
        style={{
          width: u(leader ? 59.417 : 45.705),
          height: u(leader ? 59.417 : 45.705),
          fontSize: u(leader ? 29.25 : 21.94),
          background: RANK_CHIP_BG,
          color: entry ? RANK_INK : INK_FAINT,
        }}
      >
        {rank}
      </span>

      {entry ? (
        <>
          <span
            className={`min-w-0 flex-1 truncate font-extrabold text-charcoal ${
              leader
                ? "leading-[1.05] tracking-[-0.01em]"
                : "leading-[1.1] tracking-[-0.005em]"
            }`}
            style={{ fontSize: u(leader ? 43.88 : 31.99) }}
          >
            {displayName(entry.name)}
          </span>
          {leader ? (
            <span
              className="flex shrink-0 flex-col items-end"
              style={{ gap: u(3.656) }}
            >
              <span
                className="font-bold uppercase leading-[1.3] tracking-[0.25em]"
                style={{ color: ORANGE_DEEP, fontSize: u(13.71) }}
              >
                Time to beat
              </span>
              <span
                className="font-extrabold leading-none tracking-[-0.01em] text-charcoal tabular-nums"
                style={{ fontSize: u(59.417) }}
              >
                {formatTime(entry.timeMs)}
              </span>
            </span>
          ) : (
            <span
              className="shrink-0 font-extrabold leading-[1.05] tracking-[-0.005em] tabular-nums"
              style={{ color: ORANGE_DEEP, fontSize: u(35.65) }}
            >
              {formatTime(entry.timeMs)}
            </span>
          )}
        </>
      ) : (
        <>
          <span
            className="min-w-0 flex-1 truncate font-semibold leading-[1.3]"
            style={{
              color: INK_FAINT,
              fontSize: u(leader ? 31.99 : 24.7),
            }}
          >
            Play to claim this spot
          </span>
          <span
            className="shrink-0 font-extrabold leading-[1.05] tracking-[-0.005em] tabular-nums"
            style={{
              color: EMPTY_TIME,
              fontSize: u(leader ? 59.417 : 35.65),
            }}
          >
            -:-.-
          </span>
        </>
      )}
    </motion.li>
  );
}

/** One of the two 518px columns of seven rows (813:19117, 813:19126). */
function StandingsColumn({
  rows,
  firstRank,
}: {
  rows: (Entry | null)[];
  firstRank: number;
}) {
  return (
    <ol
      start={firstRank}
      className="flex min-w-0 flex-col gap-[calc(var(--u)*10.969)] board:w-[calc(var(--u)*518)] board:shrink-0"
    >
      {rows.map((e, i) => (
        <StandingRow
          key={e ? keyOf(e) : `empty-${firstRank + i}`}
          rank={firstRank + i}
          entry={e}
        />
      ))}
    </ol>
  );
}

/* ------------------------------ Prize panel ----------------------------- */

/**
 * The prizes (813:19148): a pale peach panel with the offer at 47px in, and
 * the three product cutouts breaking out of its top and its right edge the way
 * the design has them - which is why the panel does not clip. The hoodie hangs
 * below the panel; the donate card paints after it, so a file with anything
 * in its lower edge is covered rather than sitting over the ember.
 *
 * Sponsor names are the design's own line. They are copy, not the sponsor
 * logos on the report (those live in `src/config/mambacares.ts`).
 */
function PrizePanel() {
  return (
    <div
      className="relative w-full px-[calc(var(--u)*24)] py-[calc(var(--u)*28)] board:ml-[calc(var(--u)*39)] board:h-[calc(var(--u)*288)] board:w-[calc(var(--u)*755)] board:px-0 board:py-0"
      style={{ background: PRIZE_GRADIENT, borderRadius: u(20) }}
    >
      <div className="relative z-10 flex min-w-0 flex-col gap-[calc(var(--u)*20)] pr-[38%] text-charcoal board:absolute board:left-[calc(var(--u)*47)] board:top-[calc(var(--u)*42)] board:w-[calc(var(--u)*495.726)] board:gap-[calc(var(--u)*26)] board:pr-0">
        <p
          className="font-bold uppercase leading-[1.1] tracking-[0.23em]"
          style={{ fontSize: u(20.726) }}
        >
          Top {TOP_N} fastest minds
        </p>
        <div className="flex flex-col gap-[calc(var(--u)*12)]">
          <p className="text-[length:calc(var(--u)*38)] font-extrabold leading-[1.19] tracking-[-0.015em] board:w-[calc(var(--u)*448)] board:text-[length:calc(var(--u)*57.554)]">
            Win prizes
          </p>
          <p className="text-[length:calc(var(--u)*22)] font-semibold leading-[1.34] tracking-[-0.015em] board:w-[calc(var(--u)*330)] board:text-[length:calc(var(--u)*26)]">
            From PMAM, SALTIFY, PRFM, LKSD, ZODA, 2050
          </p>
        </div>
      </div>

      {/* The vest sits furthest back, then the hoodie over it, then the box on
          top - the design's own order (813:19280, 813:19283, 813:19274). Each
          box is the frame's, and the artwork is fitted inside it, so a file
          exported to the sizes in the README lands exactly where it is drawn.
          On a phone only the hoodie shows, at the panel's right edge. */}
      <OptionalImage
        src={PRIZE_VEST}
        alt=""
        className="pointer-events-none absolute hidden object-contain board:block board:left-[calc(var(--u)*450.67)] board:top-[calc(var(--u)*-37)] board:size-[calc(var(--u)*344.469)]"
      />
      <OptionalImage
        src={PRIZE_HOODIE}
        alt="This year's #MambaCares prize drop"
        className="pointer-events-none absolute right-[-2%] top-[-8%] h-[116%] w-auto object-contain board:left-[calc(var(--u)*324)] board:right-auto board:top-[calc(var(--u)*10)] board:h-[calc(var(--u)*368.578)] board:w-[calc(var(--u)*346.698)]"
      />
      <OptionalImage
        src={PRIZE_SALT}
        alt=""
        className="pointer-events-none absolute hidden object-contain board:block board:left-[calc(var(--u)*565.5)] board:top-[calc(var(--u)*140.75)] board:h-[calc(var(--u)*192.25)] board:w-[calc(var(--u)*174.747)]"
      />
    </div>
  );
}

/**
 * What stands in the prize panel's place once MAMBACARES_PAUSED is on. The
 * prizes are what closes with the challenge, so only this panel changes: the
 * donate card below it, and the campaign behind it, run to their own deadline.
 */
function WrapPanel({ total }: { total: number }) {
  return (
    <div
      className="flex w-full flex-col justify-center px-[calc(var(--u)*24)] py-[calc(var(--u)*28)] board:ml-[calc(var(--u)*39)] board:h-[calc(var(--u)*288)] board:w-[calc(var(--u)*755)] board:px-[calc(var(--u)*47)] board:py-0"
      style={{ background: PRIZE_GRADIENT, borderRadius: u(20) }}
    >
      <p
        className="font-bold uppercase leading-[1.1] tracking-[0.23em] text-primary"
        style={{ fontSize: u(20.726) }}
      >
        That&apos;s a wrap
      </p>
      <p
        className="font-extrabold leading-[1.19] tracking-[-0.015em]"
        style={{ fontSize: u(48), marginTop: u(20) }}
      >
        The challenge has ended
      </p>
      <p
        className="font-semibold leading-[1.34] text-secondary"
        style={{ fontSize: u(26), marginTop: u(14) }}
      >
        {total > 0 ? `${total} minds tested` : "Thanks for playing"}
      </p>
    </div>
  );
}

/* ----------------------------- Donate panel ----------------------------- */

/**
 * The code (813:19150).
 *
 * The generated code is the default here, the opposite way round from /phkl's
 * board: it always encodes MAMBACARES_DONATION_URL, the same short link every
 * Donate button on the report opens, so the board and the funnel can never
 * point at two different campaigns. Uploaded artwork wins when it is there -
 * a code with the campaign's own branding in it - and whatever that file
 * encodes is what people get: nothing here can check it, so a code for the
 * wrong campaign is a wrong code.
 *
 * Scannability settings measured at a live event (#46): level L needs 29
 * modules against M's 33, making each ~14% larger in the same box, and
 * marginSize={4} puts the spec'd four-module quiet zone inside the SVG. Pure
 * black thresholds better than the brand brown on a washed-out panel.
 */
function ScanCode() {
  const [artwork, setArtwork] = useState(false);

  useEffect(() => {
    // The file is probed rather than rendered-and-caught: the board is
    // prerendered, so an <img> at a name nobody has uploaded yet can 404
    // before React hydrates, and its error event then fires into nothing -
    // leaving a broken image where the code should be, on a 55" panel, with
    // no way for anyone to scan around it. Probing means the generated code
    // is what draws until a real file has actually loaded.
    let cancelled = false;
    const probe = new Image();
    const show = () => {
      if (!cancelled) setArtwork(true);
    };
    probe.onload = show;
    probe.src = QR_IMAGE;
    if (probe.complete && probe.naturalWidth > 0) show();
    return () => {
      cancelled = true;
      probe.onload = null;
    };
  }, []);

  if (artwork) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={QR_IMAGE}
        alt="Scan to donate to Dementia Singapore"
        onError={() => setArtwork(false)}
        className="aspect-square w-full object-contain"
        style={{ borderRadius: u(14.014) }}
      />
    );
  }

  return (
    <div
      className="flex aspect-square w-full items-center justify-center bg-white"
      style={{ padding: u(12), borderRadius: u(14.014) }}
    >
      <QRCodeSVG
        value={MAMBACARES_DONATION_URL}
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
 * The ember card (813:19292): the code, the ask, and the line under it, laid
 * out at the frame's own offsets. The donation box breaks out of the card's
 * bottom-right corner, so the card does not clip either.
 */
function DonatePanel() {
  return (
    <div
      className="relative flex w-full flex-col items-start gap-[calc(var(--u)*20)] p-[calc(var(--u)*24)] board:ml-[calc(var(--u)*36)] board:mt-[calc(var(--u)*55)] board:block board:h-[calc(var(--u)*330)] board:w-[calc(var(--u)*758)] board:p-0"
      style={{ background: DONATE_GRADIENT, borderRadius: u(20) }}
    >
      <div className="w-[calc(var(--u)*254)] max-w-full shrink-0 board:absolute board:left-[calc(var(--u)*32)] board:top-[calc(var(--u)*34)]">
        <ScanCode />
      </div>

      <div
        className="flex min-w-0 flex-col gap-[calc(var(--u)*9.561)] board:absolute board:left-[calc(var(--u)*310)] board:top-[calc(var(--u)*33)] board:w-[calc(var(--u)*471.377)]"
        style={{ color: INVERSE }}
      >
        <p
          className="uppercase leading-none tracking-[0.1em]"
          style={{ fontSize: u(19.965) }}
        >
          Scan to
        </p>
        <p className="font-extrabold tracking-[-0.016em]">
          <span className="block text-[length:calc(var(--u)*32)] leading-[1.17] board:text-[length:calc(var(--u)*44.825)]">
            Donate to
          </span>
          <span className="block text-[length:calc(var(--u)*30)] leading-[1.17] board:text-[length:calc(var(--u)*42.913)]">
            Dementia Singapore
          </span>
        </p>
      </div>

      {/* Broken where the design breaks it (813:19291) rather than left to
          wrap: the donation box sits over the end of this block, and the
          design's break is what keeps a whole word from going under it. */}
      <p
        className="font-bold board:absolute board:left-[calc(var(--u)*313)] board:top-[calc(var(--u)*184)] board:w-[calc(var(--u)*421)]"
        style={{ color: INVERSE, fontSize: u(22.601), lineHeight: 1.6 }}
      >
        Every dollar supports people living with dementia and the families
        <br />
        who care for them.
      </p>

      {/* 190px box at 608px in, 208px down - hanging past the card's right and
          bottom edges (813:19294). Board only: on a phone the card is narrower
          than the offset it needs. */}
      <OptionalImage
        src={DONATE_GIFT}
        alt=""
        className="pointer-events-none absolute hidden object-contain board:block board:left-[calc(var(--u)*608)] board:top-[calc(var(--u)*208)] board:size-[calc(var(--u)*190)]"
      />
    </div>
  );
}

/* ------------------------------ Photo band ------------------------------ */

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

export default function MambacaresLeaderboardBoard() {
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
          `/api/leaderboard?limit=${TOP_N}&source=${encodeURIComponent(MAMBACARES_SOURCE)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (!active || !Array.isArray(data.entries)) return;
        const next: Entry[] = data.entries;
        setEntries(next);
        setTotal(data.total ?? next.length);

        // New podium entrants (skip the very first load: nothing is "new").
        const podium = next.slice(0, CELEBRATE_N);
        if (!firstLoadRef.current && !MAMBACARES_PAUSED) {
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
          `/api/report-rate?source=${encodeURIComponent(MAMBACARES_SOURCE)}`,
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

      <div className="relative z-10 mx-auto flex w-full flex-1 flex-col board:min-h-0 board:max-w-[calc(var(--u)*1920)]">
        <Masthead />

        {/* The campaign on the left, the standings on the right - the frame's
            825:1056 split. Any height a taller-than-16:9 screen adds falls
            into the gap under the standings, as it does in the frame. */}
        <div className="flex min-w-0 flex-1 flex-col board:min-h-0 board:flex-row board:items-start">
          <div className="flex min-w-0 flex-col gap-[calc(var(--u)*28)] px-[calc(var(--u)*24)] pt-[calc(var(--u)*28)] board:w-[calc(var(--u)*825)] board:shrink-0 board:gap-0 board:px-0 board:pt-[calc(var(--u)*14)]">
            {MAMBACARES_PAUSED ? <WrapPanel total={total} /> : <PrizePanel />}
            <DonatePanel />
          </div>

          <section
            aria-label="Speed game leaderboard"
            className="mt-[calc(var(--u)*28)] flex min-w-0 flex-col px-[calc(var(--u)*24)] board:mt-0 board:w-[calc(var(--u)*1056)] board:shrink-0 board:px-0"
          >
            <ol className="flex min-w-0 flex-col">
              <StandingRow rank={1} entry={rows[0]} leader />
            </ol>
            <div className="mt-[calc(var(--u)*10.969)] flex min-w-0 flex-col gap-[calc(var(--u)*10.969)] board:mt-[calc(var(--u)*18)] board:flex-row board:gap-[calc(var(--u)*20)]">
              <StandingsColumn rows={rows.slice(1, 1 + COLUMN_N)} firstRank={2} />
              <StandingsColumn
                rows={rows.slice(1 + COLUMN_N)}
                firstRank={2 + COLUMN_N}
              />
            </div>
          </section>
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
        <div className="flex h-[calc(var(--u)*56)] w-auto shrink-0 items-center overflow-hidden board:h-[calc(var(--u)*86.281)] board:w-[calc(var(--u)*436.479)]">
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
                New top {CELEBRATE_N}
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
