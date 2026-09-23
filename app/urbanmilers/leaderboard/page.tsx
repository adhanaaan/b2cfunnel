"use client";

/**
 * The attract screen for /urbanmilers (Figma 1080:8131, "Leaderboard -
 * /urbanmilers/leaderboard" in the LITE ReCOGnAIze file), designed against a
 * 1920x1080 panel read from 2-5m away.
 *
 * A copy of the #MambaCares board rather than a shared component, as every
 * event's board in this repo is: the two runs go up on different screens on
 * different days and each one's frame - its prizes, its artwork - moves
 * without the other's.
 *
 * Three columns under the masthead. On the left, the way in: "Scan to play
 * < 60 s" and a 480px code that opens this run's funnel. In the middle, the
 * reason to: the ember prize card - the fastest mind's shoes as the headline,
 * the 2nd and 3rd prizes at its foot. On the right, the standings: the leader
 * on a wide ember hero row with the time to beat, then ranks 2-15 in two
 * columns of seven, 2nd and 3rd in ember too. Underneath, the fact strip and
 * the band of event photography.
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
 * Self-contained: polls /api/leaderboard every 8s, scoped to the `urbanmilers`
 * bucket, and keeps the last good standings on error. That bucket is why the
 * board opens empty - fifteen unclaimed rows - rather than on #MambaCares'
 * standings.
 */

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { displayName, formatTime } from "@/lib/format";
import { URBANMILERS_PAUSED, URBANMILERS_SOURCE } from "@/config/event";
import { playUrlFor } from "@/config/eventLinks";
import { BRAIN_FACTS } from "@/config/tips";
import { springs } from "@/lib/motion";
import { OptionalImage } from "@/components/screens/phkl/OptionalImage";

/**
 * Fifteen rows, as the design lays out: the leader (1080:7654), then two
 * columns of seven (1080:7646, 1080:7655).
 */
const TOP_N = 15;
/** Rows per standings column - the two columns are the remainder, split. */
const COLUMN_N = (TOP_N - 1) / 2;

/**
 * How deep a new entry has to land to take the board over for four seconds.
 * Three - the places the prizes go to - rather than the whole board on
 * purpose: at a booth with a queue, a top-15 takeover would fire on nearly
 * every early play and then never again, which is noise rather than news.
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
/** The deep brown the design sets the scan heading in. */
const SCAN_INK = "#772211";
/** Text/Inverse - the ink on the ember standings rows. */
const INVERSE = "#fafafa";
/** The warm cream of the leader's "time to beat" label. */
const PRIZE_WARM = "#ffe4cf";
const CHARCOAL = "#2d2d2d";
/** Cream/Base - the ink the design puts on the ember prize card. */
const CREAM = "#fff4ec";

const CANVAS =
  "linear-gradient(151deg, #fff8f6 15%, #fdeee4 46%, #fbe3d3 85%)";
const PRIZE_CARD_GRADIENT =
  "linear-gradient(90deg, #f77528 0%, #ff9a4d 100%)";
const SCAN_PANEL_GRADIENT =
  "linear-gradient(270deg, #fcf5ed 0%, #f7e3d4 100%)";
const STRIP_BG = "rgba(255, 255, 255, 0.72)";

/**
 * What the code on the board opens: this run's funnel, on production, however
 * the board itself is being served (see playUrlFor). Generated from the route
 * rather than uploaded, so the code cannot point anywhere but /urbanmilers.
 */
const PLAY_URL = playUrlFor("urbanmilers");

/**
 * Artwork that is dropped in as files under public/images/urbanmilers/board/
 * (see the README there). Every one is optional: the board reads before any of
 * them land, and each appears the moment its file is committed - which is why
 * this route can go up before any of this run's own exports exist.
 */
const BOARD_ART = "/images/urbanmilers/board";

/**
 * The three prizes on the ember card (1080:8428), as the design words them.
 * The words are data and the pictures are files, so the prizes can change
 * between now and the run without editing a component.
 */
const PRIZES = {
  first: {
    eyebrow: "Fastest mind",
    title: "Win a pair of Novablast 6!",
    image: `${BOARD_ART}/prize-1st.png`,
    alt: "A pair of ASICS Novablast 6 running shoes",
  },
  runnersUp: [
    {
      rank: "2nd",
      label: "$30 Grab voucher",
      image: `${BOARD_ART}/prize-2nd.png`,
      alt: "$30 Grab vouchers",
      // Each tile's box, its cutout's box and where its chip sits, from the
      // frame (1080:8436, 1080:8441; 1080:8445, 1080:8443).
      tile: { left: 28, top: 490, width: 230 },
      // One line, as the design sets it; the 3rd's wraps inside 205px.
      labelWidth: null,
      imageBox: 140.427,
      imageW: 133.819,
      imageH: 132.167,
      gap: 8.26,
      // The chip, from the tile's top-left corner.
      chip: { x: 0, y: 0 },
    },
    {
      rank: "3rd",
      label: "$20 Starbucks Gift Card",
      image: `${BOARD_ART}/prize-3rd.png`,
      alt: "A $20 Starbucks gift card",
      tile: { left: 286, top: 483, width: 241 },
      labelWidth: 205,
      imageBox: 123.442,
      imageW: 114.729,
      imageH: 116.181,
      gap: 7.261,
      chip: { x: -10, y: 7 },
    },
  ],
};

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
 * The brain and the question, side by side (1080:8160). The brain asset
 * carries its own "Frontal Lobe" label and sparkle, exactly as the design
 * places it. One line on the board, as the frame sets it; a smaller size on a
 * phone, where it wraps.
 */
function Masthead() {
  return (
    <div className="flex shrink-0 items-center gap-[calc(var(--u)*20)] px-[calc(var(--u)*24)] pt-[calc(var(--u)*28)] board:h-[calc(var(--u)*150)] board:items-start board:gap-[calc(var(--u)*39)] board:px-0 board:pl-[calc(var(--u)*30)] board:pt-[calc(var(--u)*6)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/event3/brain.webp"
        alt=""
        aria-hidden
        className="w-[calc(var(--u)*110)] shrink-0 select-none board:h-[calc(var(--u)*141.05)] board:w-[calc(var(--u)*195)]"
      />
      <h1 className="min-w-0 text-[length:calc(var(--u)*38)] font-extrabold leading-none tracking-[-0.015em] text-charcoal board:mt-[calc(var(--u)*39)] board:whitespace-nowrap board:text-[length:calc(var(--u)*62.881)]">
        Is your brain at its peak performance?
      </h1>
    </div>
  );
}

/* ------------------------------ Standings ------------------------------- */

/**
 * How a row is drawn. The leader is the 122px ember hero with the time to
 * beat over its time; 2nd and 3rd are the ember variant of the ordinary row;
 * the rest are white rows with a peach rank chip and the time in deep orange.
 */
type Tier = "leader" | "podium" | "rest";

/**
 * One row (the "Event3 Board/Standing row" component, 406:3540). An unclaimed
 * slot is the component's Empty variant: a dashed outline the design does not
 * draw but the board needs, since fifteen rows start the day empty.
 */
function StandingRow({
  rank,
  entry,
  tier = "rest",
}: {
  rank: number;
  entry: Entry | null;
  tier?: Tier;
}) {
  const leader = tier === "leader";
  // An empty podium slot is drawn like any other empty slot: an ember row
  // with nobody in it would read as a claimed place.
  const ember = entry !== null && tier !== "rest";
  return (
    <motion.li
      layout
      transition={springs.shuffle}
      className={`flex shrink-0 items-center ${
        leader ? "h-[calc(var(--u)*122)]" : "h-[calc(var(--u)*73)]"
      }`}
      style={{
        borderRadius: u(leader ? 26.512 : 21.938),
        paddingInline: u(leader ? 25.408 : 21.024),
        gap: u(leader ? 23.198 : 19.196),
        background: ember
          ? PRIZE_CARD_GRADIENT
          : entry
            ? "#ffffff"
            : "rgba(255, 255, 255, 0.55)",
        border: entry ? "none" : `${u(2)} dashed ${CARD_LINE}`,
        boxShadow: !entry
          ? "none"
          : leader
            ? `0 ${u(17.675)} ${u(22.094)} rgba(51, 18, 0, 0.18)`
            : `0 ${u(1.828)} ${u(3.656)} rgba(51, 18, 0, 0.08), 0 ${u(7.313)} ${u(10.969)} rgba(51, 18, 0, 0.12)`,
      }}
    >
      <span
        className="flex shrink-0 items-center justify-center rounded-full font-extrabold leading-none"
        style={{
          width: u(leader ? 71.805 : 45.705),
          height: u(leader ? 71.805 : 45.705),
          fontSize: u(leader ? 35.35 : 21.94),
          background: ember ? "#ffffff" : RANK_CHIP_BG,
          color: ember ? ORANGE_DEEP : entry ? RANK_INK : INK_FAINT,
        }}
      >
        {rank}
      </span>

      {entry ? (
        <>
          <span
            className={`min-w-0 flex-1 truncate font-extrabold ${
              leader
                ? "leading-[1.05] tracking-[-0.01em]"
                : "leading-[1.1] tracking-[-0.005em]"
            }`}
            style={{
              fontSize: u(leader ? 53.02 : 31.99),
              color: ember ? INVERSE : CHARCOAL,
            }}
          >
            {displayName(entry.name)}
          </span>
          {leader ? (
            <span
              className="flex shrink-0 flex-col items-end"
              style={{ gap: u(4.419) }}
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
              style={{
                color: ember ? INVERSE : ORANGE_DEEP,
                fontSize: u(35.65),
              }}
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
              fontSize: u(leader ? 36 : 22),
            }}
          >
            {/* Short enough to fit whole: the columns are 351px now. */}
            {leader ? "Claim this spot" : "Claim it"}
          </span>
          <span
            className="shrink-0 font-extrabold leading-[1.05] tracking-[-0.005em] tabular-nums"
            style={{
              color: EMPTY_TIME,
              fontSize: u(leader ? 71.8 : 35.65),
            }}
          >
            -:-.-
          </span>
        </>
      )}
    </motion.li>
  );
}

/** One of the two 351px columns of seven rows (1080:8133, 1080:8142). */
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
      className="flex min-w-0 flex-col gap-[calc(var(--u)*10.969)] board:w-[calc(var(--u)*351)] board:shrink-0"
    >
      {rows.map((e, i) => {
        const rank = firstRank + i;
        return (
          <StandingRow
            key={e ? keyOf(e) : `empty-${rank}`}
            rank={rank}
            entry={e}
            tier={rank <= CELEBRATE_N ? "podium" : "rest"}
          />
        );
      })}
    </ol>
  );
}

/* ------------------------------ Scan column ----------------------------- */

/**
 * The code (1080:8425), generated from PLAY_URL. Nothing is uploaded for it on
 * purpose: a generated code is always the route it says it is, where an
 * exported one encodes whatever it was made from.
 *
 * Scannability settings measured at a live event (#46): level L needs 29
 * modules against M's 33, making each ~14% larger in the same box, and
 * marginSize={4} puts the spec'd four-module quiet zone inside the SVG, where
 * the design's black frame cannot eat into it. That is also why the design's
 * logo in the middle of the code is left out - it needs a higher error level,
 * and with it smaller modules, to survive being covered. Pure black thresholds
 * better than the brand brown on a washed-out panel.
 */
function ScanCode() {
  return (
    <div
      className="flex aspect-square w-full items-center justify-center overflow-hidden bg-white"
      style={{
        padding: u(8),
        border: `${u(20)} solid #111111`,
        borderRadius: u(40),
      }}
    >
      <QRCodeSVG
        value={PLAY_URL}
        className="h-full w-full"
        level="L"
        marginSize={4}
        fgColor="#000000"
        bgColor="#ffffff"
        title="Scan to play the Reaction Time Challenge"
      />
    </div>
  );
}

/**
 * The left column (1080:8421): the ask, then the 480px code under it. No panel
 * behind either - the code is the biggest thing on the board, so it can be
 * scanned from the back of a queue.
 */
function ScanColumn() {
  return (
    <div className="flex w-full flex-col items-center gap-[calc(var(--u)*24)] board:ml-[calc(var(--u)*57)] board:mt-[calc(var(--u)*6)] board:w-[calc(var(--u)*480)] board:shrink-0 board:gap-[calc(var(--u)*45)]">
      <div className="flex w-full flex-col gap-[calc(var(--u)*12)] board:gap-[calc(var(--u)*20)]">
        <p
          className="text-[length:calc(var(--u)*34)] font-extrabold leading-[1.04] tracking-[-0.015em] board:text-[length:calc(var(--u)*46.768)]"
          style={{ color: SCAN_INK }}
        >
          Scan to play &lt; 60 s
        </p>
        <p className="text-[length:calc(var(--u)*22)] font-medium leading-[1.28] tracking-[-0.01em] text-charcoal board:text-[length:calc(var(--u)*32.36)]">
          Play the <strong className="font-bold">speed</strong> game to see
          your <strong className="font-bold">rank</strong> and get free{" "}
          <strong className="font-bold">personalised</strong> insights.
        </p>
      </div>
      <div className="w-[70%] board:w-full">
        <ScanCode />
      </div>
    </div>
  );
}

/* ------------------------------ Prize card ------------------------------ */

/** The white pill naming a place (the design's "Rank chip"). */
function PlaceChip({
  children,
  size,
}: {
  children: string;
  /** The chip's font size in design px; its padding scales with it. */
  size: number;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-white font-extrabold uppercase leading-normal tracking-[0.08em]"
      style={{
        color: ORANGE_DEEP,
        fontSize: u(size),
        paddingInline: u(size * 0.632),
        paddingBlock: u(size * 0.21),
      }}
    >
      {children}
    </span>
  );
}

/**
 * The ember card (1080:8428), 538x716 in the middle column: the fastest
 * mind's prize as the headline with its shoe under it, and the 2nd and 3rd
 * prizes side by side at the foot, each with its place chip over its top-left
 * corner. Laid out at the frame's own offsets on the board; stacked on a
 * phone.
 */
function PrizeCard() {
  return (
    <div
      className="relative flex w-full flex-col gap-[calc(var(--u)*16)] p-[calc(var(--u)*24)] board:ml-[calc(var(--u)*33)] board:mt-[calc(var(--u)*6)] board:block board:h-[calc(var(--u)*716)] board:w-[calc(var(--u)*538)] board:shrink-0 board:p-0"
      style={{
        background: PRIZE_CARD_GRADIENT,
        borderRadius: u(20),
        color: CREAM,
      }}
    >
      <div className="flex flex-col gap-[calc(var(--u)*10)] board:absolute board:left-[calc(var(--u)*38)] board:top-[calc(var(--u)*50)] board:w-[calc(var(--u)*444)]">
        <p
          className="font-bold uppercase leading-[1.1] tracking-[0.23em]"
          style={{ fontSize: u(20.379) }}
        >
          {PRIZES.first.eyebrow}
        </p>
        <p className="text-[length:calc(var(--u)*44)] font-extrabold leading-[1.04] tracking-[-0.015em] board:w-[calc(var(--u)*425.796)] board:text-[length:calc(var(--u)*60.768)]">
          {PRIZES.first.title}
        </p>
      </div>

      {/* The shoe (1080:8433) and its 1ST chip (1080:8434). */}
      <div className="relative mx-auto w-[80%] board:absolute board:left-[calc(var(--u)*56.48)] board:top-[calc(var(--u)*218)] board:mx-0 board:h-[calc(var(--u)*255.479)] board:w-[calc(var(--u)*425.462)]">
        <OptionalImage
          src={PRIZES.first.image}
          alt={PRIZES.first.alt}
          className="aspect-[425/255] w-full object-contain board:h-full"
        />
        <span className="absolute left-[74%] top-[17%]">
          <PlaceChip size={21.478}>1st</PlaceChip>
        </span>
      </div>

      {/* The runners-up (1080:8436, 1080:8445), each a column of cutout and
          words, with its place chip over the tile's top-left corner. Their
          boxes are the frame's, passed in as variables so one class list
          places both. */}
      <div className="flex gap-[calc(var(--u)*16)] board:contents">
        {PRIZES.runnersUp.map((prize) => (
          <div
            key={prize.rank}
            className="relative flex min-w-0 flex-1 flex-col items-center pt-[calc(var(--u)*16)] board:absolute board:left-[var(--tile-left)] board:top-[var(--tile-top)] board:w-[var(--tile-w)] board:pt-0"
            style={
              {
                "--tile-left": u(prize.tile.left),
                "--tile-top": u(prize.tile.top),
                "--tile-w": u(prize.tile.width),
                gap: u(prize.gap),
              } as CSSProperties
            }
          >
            <div
              className="flex w-full items-center justify-center"
              style={{ height: u(prize.imageBox) }}
            >
              <OptionalImage
                src={prize.image}
                alt={prize.alt}
                className="max-w-full object-contain"
                style={{ width: u(prize.imageW), height: u(prize.imageH) }}
              />
            </div>
            <p
              className={`text-center font-bold leading-[1.25] ${
                prize.labelWidth === null ? "board:whitespace-nowrap" : ""
              }`}
              style={{
                fontSize: u(26.433),
                maxWidth: prize.labelWidth ? u(prize.labelWidth) : undefined,
              }}
            >
              {prize.label}
            </p>
            <span
              className="absolute"
              style={{ left: u(prize.chip.x), top: u(prize.chip.y) }}
            >
              <PlaceChip size={15.695}>{prize.rank}</PlaceChip>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * What stands in the code's and the prizes' place once URBANMILERS_PAUSED is
 * on. The
 * route itself shows the "event ended" page then, so the code comes down with
 * the prizes rather than inviting a scan into a closed challenge.
 */
function WrapPanel({ total }: { total: number }) {
  return (
    <div
      className="flex w-full flex-col justify-center px-[calc(var(--u)*24)] py-[calc(var(--u)*28)] board:ml-[calc(var(--u)*57)] board:mt-[calc(var(--u)*6)] board:h-[calc(var(--u)*716)] board:w-[calc(var(--u)*1051)] board:shrink-0 board:px-[calc(var(--u)*47)] board:py-0"
      style={{ background: SCAN_PANEL_GRADIENT, borderRadius: u(20) }}
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

export default function UrbanMilersLeaderboardBoard() {
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
          `/api/leaderboard?limit=${TOP_N}&source=${encodeURIComponent(URBANMILERS_SOURCE)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (!active || !Array.isArray(data.entries)) return;
        const next: Entry[] = data.entries;
        setEntries(next);
        setTotal(data.total ?? next.length);

        // New podium entrants (skip the very first load: nothing is "new").
        const podium = next.slice(0, CELEBRATE_N);
        if (!firstLoadRef.current && !URBANMILERS_PAUSED) {
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
          `/api/report-rate?source=${encodeURIComponent(URBANMILERS_SOURCE)}`,
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

        {/* Three columns, at the frame's offsets: the code, the prizes, the
            standings. Any height a taller-than-16:9 screen adds falls under
            them, into the gap above the fact strip. */}
        <div className="flex min-w-0 flex-1 flex-col gap-[calc(var(--u)*28)] px-[calc(var(--u)*24)] pt-[calc(var(--u)*28)] board:min-h-0 board:flex-row board:items-start board:gap-0 board:px-0 board:pt-0">
          {URBANMILERS_PAUSED ? (
            <WrapPanel total={total} />
          ) : (
            <>
              <ScanColumn />
              <PrizeCard />
            </>
          )}

          <section
            aria-label="Speed game leaderboard"
            className="flex min-w-0 flex-col board:ml-[calc(var(--u)*34)] board:w-[calc(var(--u)*735)] board:shrink-0"
          >
            <ol className="flex min-w-0 flex-col">
              <StandingRow rank={1} entry={rows[0]} tier="leader" />
            </ol>
            <div className="mt-[calc(var(--u)*10.969)] flex min-w-0 flex-col gap-[calc(var(--u)*10.969)] board:mt-[calc(var(--u)*22)] board:flex-row board:gap-[calc(var(--u)*28)]">
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
