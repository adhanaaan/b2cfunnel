"use client";

/**
 * The attract screen for Round 5 of the One Trick Pony quiz night (designed
 * against a 1920x1080 55" panel, read from 2-5m away across a full bar, but
 * laid out to reflow down to a phone).
 *
 * Three columns on a wide screen, as /urbanmilers has them: the scan rail, the
 * ember prize card, and the live standings. The prize card is the reason the
 * room scans - the custom Stanley as the headline with the two runner-up
 * prizes at its foot - so it gets the middle of the board rather than a corner.
 * Collapses to standings, then prizes, then scan on tablet and mobile. Type is
 * clamped between a mobile floor and the panel size so the same markup serves
 * both. Self-contained: polls /api/leaderboard every 8s and keeps the last
 * good standings on error.
 *
 * Standings rows read "Player · Team", because that is how submitScore writes
 * the name for this route - the team is folded into the name so it survives a
 * database with no `team` column. The board needs no knowledge of that: it
 * prints the name it is given.
 *
 * A copy of the other boards rather than a shared component, on purpose and in
 * line with every other board in this app: an event's screen is the one thing
 * that gets redesigned mid-run, and two events must never be able to change
 * each other's TV. The only thing the boards share is the bucket they DO NOT
 * share - OTP_SOURCE is what keeps every other event's standings off this
 * screen.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { OptionalImage } from "@/components/screens/phkl/OptionalImage";
import { formatTime } from "@/lib/format";
import { OTP_PAUSED, OTP_SOURCE } from "@/config/event";
import { playUrlFor } from "@/config/eventLinks";
import { BRAIN_FACTS } from "@/config/tips";
import { springs } from "@/lib/motion";

interface Entry {
  name: string;
  timeMs: number;
}

const TOP_N = 8;
const POLL_MS = 8000;
const FACT_MS = 8000;

/** Where the QR sends players (absolute - see config/eventLinks.ts). */
const PLAY_URL = playUrlFor("otp");

/**
 * How often the completion stat is refreshed. Slower than the standings: the
 * rate moves over the course of an event, not shot to shot.
 */
const RATE_POLL_MS = 30000;

const HOW_TO = [
  "Scan and enter your team",
  "Play the 60-second speed game",
  "Your time goes on the board",
];

/**
 * Artwork that is dropped in as files under public/images/onetrickpony/board/
 * (see the README there). Every one is optional: the board reads before any of
 * them land, and each appears the moment its file is committed - which is why
 * this route could go up on the day with no Stanley cutout in hand.
 */
const BOARD_ART = "/images/onetrickpony/board";

/**
 * The three prizes on the ember card. The words are data and the pictures are
 * files, so the prizes can change between now and the round without editing a
 * component.
 */
const PRIZES = {
  first: {
    eyebrow: "Tonight's top prize",
    title: "Win a custom Stanley",
    image: `${BOARD_ART}/prize-1st.png`,
    alt: "A custom Stanley tumbler",
  },
  runnersUp: [
    {
      rank: "2nd",
      label: "$30 Grab voucher",
      image: `${BOARD_ART}/prize-2nd.png`,
      alt: "A $30 Grab voucher",
    },
    {
      rank: "3rd",
      label: "$20 Starbucks card",
      image: `${BOARD_ART}/prize-3rd.png`,
      alt: "A $20 Starbucks gift card",
    },
  ],
};

// Board palette (kept local: the board is its own full-bleed canvas).
const ORANGE_DEEP = "#e35d0e";
const CARD_LINE = "#f3ddd2";
const RANK_CHIP_BG = "#f6e8e0";
const INITIALS_BG = "#ffe9dc";
const INK_FAINT = "#a98d80";
const EMPTY_TIME = "#dcc4b6";
const RANK_SILVER = "#c3cad6";
const RANK_BRONZE = "#d99058";
// Warm cream for the leader row's "time to beat" label.
const LEADER_LABEL = "#ffe4cf";
// Scan-rail headline: deep ember for the emphasised words, and the highlighter
// yellow behind "< 60 SECONDS" (the Processing Speed domain's light tone).
const SCAN_ACCENT = "#993c1d";
const SCAN_HIGHLIGHT = "#fde68a";

const CANVAS =
  "linear-gradient(150deg, #fff8f6 15%, #fdeee4 46%, #fbe3d3 85%)";
const LEADER_GRADIENT = "linear-gradient(90deg, #f77528 0%, #ff9a4d 100%)";
/** Cream/Base - the ink on the ember prize card, as /urbanmilers sets it. */
const CREAM = "#fff4ec";
/** The warm cream the prize card uses for its secondary line. */
const PRIZE_WARM = "#ffe4cf";
const PRIZE_CARD_GRADIENT = "linear-gradient(160deg, #f77528 0%, #ff9a4d 100%)";

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
  scanTitle: "text-[clamp(1rem,min(3vh,4.4vw),2rem)]",
  // The scan headline is the loudest type on the board, with the emphasised
  // words stepped up in em from its base. Sized smaller here than on the
  // two-column boards: the prize card takes a third of the width, and at the
  // 48.6px base of the design "in < 60 SECONDS" no longer holds one line in
  // what is left - it wrapped and pushed the QR off the bottom of the panel.
  scanHead: "text-[clamp(1.375rem,min(3.7vh,4.1vw),2.5rem)]",
  fact: "text-[clamp(0.75rem,min(2.5vh,3.4vw),1.6875rem)]",
  footer: "text-[clamp(0.5625rem,min(1.5vh,2.2vw),1rem)]",
  // Prize card. The 1st-prize title is the second-loudest thing on the board
  // after the leader's time - it is what the room is playing for.
  prizeTitle: "text-[clamp(1.25rem,min(4.4vh,5.2vw),2.75rem)]",
  prizeLabel: "text-[clamp(0.6875rem,min(1.9vh,2.6vw),1.25rem)]",
  prizeChip: "text-[clamp(0.5rem,min(1.3vh,2vw),0.875rem)]",
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
            Round 5 · Brain Speed Bonus
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
          Fastest <span className="text-primary">brain</span> in the bar
        </h1>
        <p
          className={`${T.micro} mt-2 font-bold uppercase tracking-[0.25em]`}
          style={{ color: INK_FAINT }}
        >
          One Trick Pony · Quiz Night · 98 Club Street
        </p>
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
                style={{ color: LEADER_LABEL }}
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
            Open spot - your team could take it
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

/* ------------------------------ Scan rail ------------------------------- */

/**
 * The left rail: the call to action, then the QR as large as the column allows.
 * Deliberately card-less - the headline sits straight on the canvas so it reads
 * from across a room, with the game's own lightning symbol tucked beside the
 * code the way the design has it.
 */
function ScanRail() {
  return (
    <div className="flex h-full min-h-0 flex-col justify-center gap-[2vh] lg:gap-[3vh]">
      <p
        className={`${T.scanHead} shrink-0 font-extrabold leading-[1.28] tracking-tight text-charcoal`}
      >
        SCAN TO{" "}
        <span className="text-[1.27em]" style={{ color: SCAN_ACCENT }}>
          PLAY
        </span>
        <br />
        FOR YOUR{" "}
        <span className="text-[1.29em]" style={{ color: SCAN_ACCENT }}>
          TEAM
        </span>
        <br />
        <span className="text-[1.18em]">
          in{" "}
          {/* The vw term in T.scanHead is tuned so this phrase fits one line
              at every width; box-decoration-clone keeps the highlight whole if
              a future string ever does wrap. */}
          <span
            className="box-decoration-clone px-[0.14em] py-[0.02em] text-[1.11em]"
            style={{ background: SCAN_HIGHLIGHT }}
          >
            &lt; 60 SECONDS
          </span>
        </span>
      </p>

      {/* QR + bolt. The code is sized explicitly rather than by aspect-ratio
          against a percentage height: Safari (which runs the board at events)
          resolves `aspect-square h-full` inside nested flex differently from
          Chromium and collapsed the code to a fraction of its intended size on
          a 13" laptop. min(vw, vh) keeps it as large as the column and the
          leftover height allow, in every engine. */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center lg:justify-start">
        <div className="relative flex max-w-full items-center">
          {/* Scannability settings measured at a live event (#46), kept
              through the redesign: no size cap, so the code grows until the
              column or the leftover height stops it; level L needs 29 modules
              against M's 33, making each ~14% larger in the same box; and
              marginSize={4} puts the spec'd four-module quiet zone inside the
              SVG, where the design's black frame cannot eat into it. Pure
              black thresholds better than the brand brown on a washed-out
              projector and is indistinguishable across a room. */}
          <div
            className="flex size-[min(70vw,40vh)] max-w-full items-center justify-center rounded-[1.4rem] bg-white p-[0.25rem] lg:size-[min(24vw,40vh)]"
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/task-2/flash.png"
            alt=""
            aria-hidden
            className="animate-symbol-drift pointer-events-none absolute -bottom-[3%] -right-[9%] w-[clamp(3.5rem,min(18vh,14vw),11rem)] rotate-[17deg] drop-shadow-[0_18px_32px_rgba(0,0,0,0.25)]"
            style={{
              ["--drift-y" as string]: "-10px",
              ["--drift-x" as string]: "0px",
              ["--drift-tilt" as string]: "17deg",
              ["--drift-tilt-to" as string]: "22deg",
              ["--drift-duration" as string]: "6s",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Prize card ------------------------------ */

/** The circled place number that sits over a prize's artwork. */
function PlaceChip({ children }: { children: string }) {
  return (
    <span
      className={`${T.prizeChip} flex aspect-square items-center justify-center rounded-full font-extrabold uppercase leading-none tracking-wide`}
      style={{
        height: "clamp(1.375rem,min(3.4vh,4.6vw),2.25rem)",
        background: "#ffffff",
        color: ORANGE_DEEP,
        boxShadow: "0 4px 12px -4px rgba(51,18,0,0.35)",
      }}
    >
      {children}
    </span>
  );
}

/**
 * The ember card in the middle column: the Stanley as the headline, the two
 * runner-up prizes side by side at its foot, each with its place chip over the
 * artwork. Every image is optional - with none of them present the card is
 * still the three prizes in words, which is what went on screen on the night.
 */
function PrizeCard() {
  // There is no cutout of the Stanley in hand. Rather than leave a third of the
  // card empty (or framed in a dashed box, which reads as a broken asset from
  // across a bar), the slot falls back to words - and the 1ST chip comes off
  // with the picture, since with no artwork under it there is nothing for it to
  // sit on and the eyebrow already says whose prize this is.
  const [hasHeroArt, setHasHeroArt] = useState(true);
  const onHeroMissing = useCallback(() => setHasHeroArt(false), []);

  return (
    <div
      className="flex h-full min-h-0 w-full flex-col justify-between gap-[2vh] rounded-2xl p-[clamp(1rem,2.6vh,2rem)]"
      style={{
        background: PRIZE_CARD_GRADIENT,
        color: CREAM,
        boxShadow: "0 18px 44px -16px rgba(51,18,0,0.32)",
      }}
    >
      <div className="shrink-0">
        <p
          className={`${T.eyebrow} font-bold uppercase leading-[1.1] tracking-[0.23em]`}
        >
          {PRIZES.first.eyebrow}
        </p>
        <p
          className={`${T.prizeTitle} mt-[0.4em] font-extrabold leading-[1.04] tracking-tight`}
        >
          {PRIZES.first.title}
        </p>
      </div>

      {/* The Stanley. There is no cutout of it in hand, so the slot falls back
          to a typographic panel rather than standing empty - a third of the
          card's height of nothing reads as a bug from across a bar. Drop
          prize-1st.png in and the picture takes the same space. */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <OptionalImage
          src={PRIZES.first.image}
          alt={PRIZES.first.alt}
          className="max-h-full w-auto max-w-[78%] object-contain drop-shadow-[0_14px_28px_rgba(51,18,0,0.35)]"
          onMissing={onHeroMissing}
          fallback={
            <p
              className={`${T.prizeTitle} px-[0.4em] text-center font-extrabold leading-[1.15] tracking-tight`}
              style={{ color: PRIZE_WARM }}
            >
              Fastest brain
              <br />
              of the night
              <br />
              takes it home
            </p>
          }
        />
        {hasHeroArt && (
          <span className="absolute left-[4%] top-0">
            <PlaceChip>1st</PlaceChip>
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-start gap-[1.2em]">
        {PRIZES.runnersUp.map((prize) => (
          <div
            key={prize.rank}
            className="relative flex min-w-0 flex-1 flex-col items-center gap-[0.5em]"
          >
            <OptionalImage
              src={prize.image}
              alt={prize.alt}
              className="h-[clamp(2.5rem,min(9vh,11vw),6rem)] w-auto max-w-full object-contain"
            />
            <p
              className={`${T.prizeLabel} text-center font-bold leading-[1.25]`}
            >
              {prize.label}
            </p>
            <span className="absolute -left-[0.2em] -top-[0.4em]">
              <PlaceChip>{prize.rank}</PlaceChip>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- Board -------------------------------- */

export default function OneTrickPonyLeaderboardBoard() {
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
          `/api/leaderboard?limit=${TOP_N}&source=${encodeURIComponent(OTP_SOURCE)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (!active || !Array.isArray(data.entries)) return;
        const next: Entry[] = data.entries;
        setEntries(next);
        setTotal(data.total ?? next.length);

        // New podium entrants (skip the very first load: nothing is "new").
        const podium = next.slice(0, 3);
        if (!firstLoadRef.current && !OTP_PAUSED) {
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
          `/api/report-rate?source=${encodeURIComponent(OTP_SOURCE)}`,
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
  const leader = entries[0] ?? null;
  // Guarded modulo: the slot count shrinks again if the rate goes away.
  const slot = factIdx % slots;
  const showHowTo = slot === BRAIN_FACTS.length;
  const showRate = reportPct !== null && slot === BRAIN_FACTS.length + 1;

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
        <Masthead live={!OTP_PAUSED} />
      </header>

      {/* Body: scan | prizes | standings, as /urbanmilers has them. Reflows to
          a single column below lg, in the order the phone wants it: standings
          first (the thing being refreshed), then the prizes, then the scan. */}
      <div className="relative z-10 grid min-h-0 flex-1 gap-4 px-[4vw] py-4 lg:grid-cols-[560fr_460fr_900fr] lg:gap-[1.6vw] lg:px-[3vw] lg:py-[2vh]">
        <div className="order-3 lg:order-1 lg:min-h-0">
          {OTP_PAUSED ? (
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
                Round 5 is done
              </p>
              <p
                className={`${T.rowEmpty} mt-3 font-semibold text-secondary`}
              >
                {total > 0
                  ? `${total} brains tested tonight`
                  : "Thanks for playing"}
              </p>
            </div>
          ) : (
            <ScanRail />
          )}
        </div>

        {/* The prizes stay up after the round closes: the room still wants to
            see what the winner just took. */}
        <div className="order-2 min-h-0 lg:order-2">
          <PrizeCard />
        </div>

        <ol className="order-1 flex min-h-0 flex-col gap-2 lg:order-3 lg:gap-[1.2vh]">
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

      {/* Footer */}
      <footer
        className={`${T.footer} relative z-10 shrink-0 px-[4vw] py-2.5 text-center lg:px-[3vw]`}
        style={{ color: INK_FAINT, borderTop: `1px solid ${CARD_LINE}` }}
      >
        Gray Matter Solutions · A Spin-off from Nanyang Technological
        University, Singapore
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
