"use client";

/**
 * The attract screen for /siloamneurosciencesummit: the /phkl board
 * (Figma 739:10645), pointed at this event's bucket and offering this event's
 * prize. Designed against a 1920x1080 55" panel read from 2-5m away.
 *
 * The design puts the pitch on the left - the brain, the headline, the scan
 * block and the prize panel - and the live standings on the right, over a
 * fact strip and a band of event photography. Its podium is three rows deep:
 * the leader as the tall gradient hero, ranks 2 and 3 on the same gradient a
 * row height down, ranks 4-6 on white.
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
 * Self-contained: polls /api/leaderboard every 8s, scoped to the `siloam`
 * bucket, and keeps the last good standings on error. That bucket is the whole
 * reason this board is a route of its own rather than /phkl's with a different
 * prize on it: the two events run the same arc, and only the tag on each row
 * keeps Kuala Lumpur's standings off a screen in Jakarta.
 *
 * THE BOARD IS IN ENGLISH, copy and facts alike, while the funnel behind its
 * QR code can be read in English or Bahasa Indonesia. That is the brief
 * ("leaderboard is the same as /phkl"), not an oversight: the board shows
 * names and times, and the language choice belongs to the player holding the
 * phone rather than to the room. `BRAIN_FACTS` is the one block of prose on
 * it, and is the first thing to translate if that changes.
 *
 * V2 - this route (/siloamneurosciencesummit/leaderboard/v2) is
 * /siloamneurosciencesummit/leaderboard with ONE addition: a band of two live
 * stats directly above the Gray Matter fact strip - how long is left before
 * the challenge closes at 17:00 Jakarta time, and the fastest run on the board
 * so far. Everything else is the board as it ships, standings and all, off the
 * same `siloam` bucket of /api/leaderboard - the two routes show the same
 * event, and this one only says more about it.
 *
 * The band costs the frame 76 design px, and the 1920x1080 frame has none
 * spare, so the two columns' own vertical padding is trimmed by exactly that
 * much (left 46/54 -> 12/12, right 46/76 -> 22/22). Their content is unmoved
 * and still centred; what gives is the empty space the frame left around it.
 */

import { type ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { displayName, formatTime } from "@/lib/format";
import { SILOAM_PAUSED, SILOAM_SOURCE } from "@/config/event";
import {
  SILOAM_PODIUM_N,
  SILOAM_PRIZE,
  SILOAM_PRIZE_HEADLINE,
} from "@/config/siloam";
import { playUrlFor } from "@/config/eventLinks";
import { BRAIN_FACTS } from "@/config/tips";
import { springs } from "@/lib/motion";
import { OptionalImage } from "@/components/screens/phkl/OptionalImage";

interface Entry {
  name: string;
  timeMs: number;
}

/** Six rows, as the design lays out (739:10648-739:10653). */
const TOP_N = 6;
/**
 * The prize goes three deep, so three rows ride the gradient - read from the
 * prize ladder itself (config/siloam.ts) rather than written again here, so
 * the podium and the prize cannot promise different depths.
 */
const PODIUM_N = SILOAM_PODIUM_N;
const POLL_MS = 8000;
const FACT_MS = 8000;

/**
 * Where the QR sends players (absolute - see config/eventLinks.ts). This is
 * what the generated code encodes; uploaded artwork (QR_IMAGE) encodes
 * whatever it was made from.
 */
const PLAY_URL = playUrlFor("siloam");

/**
 * How often the completion stat is refreshed. Slower than the standings: the
 * rate moves over the course of an event, not shot to shot.
 */
const RATE_POLL_MS = 30000;

/**
 * When the challenge closes, in Jakarta wall-clock hours (17:00 WIB).
 *
 * Jakarta is a fixed UTC+7 with no daylight saving, so the offset is a
 * constant rather than an Intl lookup: the board runs on a panel in the room
 * whose own clock may be set to anything, and the countdown has to mean 17:00
 * *there* regardless.
 */
const CLOSE_HOUR_WIB = 17;
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
/** The countdown ticks once a second - it is read as a clock, not a stat. */
const TICK_MS = 1000;

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

/**
 * Artwork that is dropped in as files under public/images/siloam/ (see the
 * README there). Each is optional: the board reads before it lands, and draws
 * a fallback in its place rather than a broken image.
 */
const QR_IMAGE = "/images/siloam/qr.png";
const PRIZE_IMAGE = "/images/siloam/prize-grab.png";
const VOUCHER_IMAGE = "/images/siloam/prize-voucher.png";

/**
 * The gift render /phkl already ships, used while this event's own export has
 * not landed. It is the same artwork the design places (892:7176), and its
 * 738x882 fills the design's 369x441 box exactly - that box was sized for it.
 * Swap it by dropping a file at PRIZE_IMAGE; nothing else changes.
 */
const PRIZE_IMAGE_FALLBACK = "/images/phkl/prize-grab.png";

const keyOf = (e: Entry) => `${e.name}·${Math.round(e.timeMs)}`;

/**
 * The gift render's box, shared by the uploaded artwork and the /phkl render
 * that stands in for it. One constant rather than two class lists: the
 * fallback has to occupy exactly the same box, or the panel reflows the moment
 * this event's own export lands.
 */
const PRIZE_ART_CLASS =
  "animate-symbol-drift pointer-events-none absolute right-[-3%] top-[-6%] h-[112%] w-auto object-contain board:left-[calc(var(--u)*458)] board:right-auto board:top-[calc(var(--u)*-52)] board:h-[calc(var(--u)*441)] board:w-[calc(var(--u)*369)]";

const PRIZE_ART_DRIFT = {
  ["--drift-y" as string]: "-12px",
  ["--drift-x" as string]: "0px",
  ["--drift-tilt" as string]: "0deg",
  ["--drift-tilt-to" as string]: "0deg",
  ["--drift-duration" as string]: "5s",
};

/* ------------------------------- Masthead ------------------------------- */

/**
 * The brain and the question, side by side (739:10656). The brain asset
 * carries its own "Frontal Lobe" label and sparkle, exactly as the design
 * places it. The row is the design's 251px tall so the line under it lands
 * where the frame puts it; the brain (347px wide, and shorter than that box)
 * centres in it.
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
 * lays behind it (739:10687): a 722.5x86.5 rectangle running off the right
 * edge of the frame, filled with the Processing Speed domain's warm radial
 * gradient, centred left of the text. Stacked, the label simply heads the
 * list.
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

/**
 * One row. The leader is the 144px gradient hero with the time to beat; ranks
 * 2 and 3 share its gradient at the 88px row height, white badge and white
 * type (the prize goes three deep); ranks 4-6 are white rows with the peach
 * rank chip and the time in the deep orange. An unclaimed slot is a dashed
 * outline.
 */
function StandingRow({
  rank,
  entry,
  leader,
}: {
  rank: number;
  entry: Entry | null;
  leader: boolean;
}) {
  const podium = !!entry && rank <= PODIUM_N;
  const badgeBg = podium ? "#ffffff" : RANK_CHIP_BG;
  const badgeColor = podium ? ORANGE_DEEP : entry ? "#7d5747" : INK_FAINT;

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
        background: podium
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
                : podium
                  ? "leading-[1.1] tracking-[-0.005em] text-white"
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
              style={{
                color: podium ? "#ffffff" : ORANGE_DEEP,
                fontSize: u(43.08),
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
            style={{ color: INK_FAINT, fontSize: u(28.7) }}
          >
            Play to claim this spot
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

/**
 * The code: the uploaded artwork when there is one, a generated code when
 * there is not.
 *
 * The generated code is the safety net rather than the default - it always
 * encodes PLAY_URL, so a board whose artwork has not landed yet, or whose file
 * is misnamed, still has a way in rather than a blank frame. Artwork wins
 * because it is the exact code the design was signed off with (739:10675),
 * frame and all.
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
 * block (739:10671) - the design aligns their left and right edges. The
 * design's 388px square, capped at the column when a phone is narrower than
 * that.
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
 * One rung of the prize ladder (896:636): a white rank chip, then the amount.
 *
 * The chips are one fixed width rather than hugging their text, as the design
 * sets them - "1ST" is narrower than "2ND" and "3RD", and letting each hug
 * would stagger the three amounts beside them.
 */
function PrizeRow({ rank, label }: { rank: string; label: string }) {
  return (
    <li className="flex items-center gap-[calc(var(--u)*13)] board:gap-[calc(var(--u)*19.85)]">
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-white text-center font-extrabold leading-none w-[calc(var(--u)*46)] py-[calc(var(--u)*3)] text-[length:calc(var(--u)*13)] tracking-[0.08em] board:w-[calc(var(--u)*67)] board:py-[calc(var(--u)*4)] board:text-[length:calc(var(--u)*19)]"
        style={{ color: ORANGE_DEEP }}
      >
        {rank}
      </span>
      <span className="whitespace-nowrap font-bold leading-[1.1] tracking-[-0.015em] text-cream text-[length:calc(var(--u)*20)] board:text-[length:calc(var(--u)*33.5)]">
        {label}
      </span>
    </li>
  );
}

/**
 * The prize (892:7159): an ember panel carrying the offer, with the Grab
 * artwork breaking out of its top and its right edge the way the design has it
 * (which is why the panel does not clip).
 *
 * The offer runs from 41px in and the panel reserves its right 383px for that
 * artwork, which is what keeps the text clear of the gift box rather than
 * relying on the copy staying short. Inside: the depth, the total, and then
 * the ladder - 1ST / 2ND / 3RD and what each one wins.
 *
 * NOTHING HERE IS A NUMBER. The depth, the three amounts and the total all
 * come from SILOAM_PRIZE (config/siloam.ts), where the total is summed from
 * the ladder rather than typed beside it - so the headline cannot promise a
 * pot the rows underneath it do not add up to, and the eyebrow cannot promise
 * a depth the standings do not rank.
 */
function PrizePanel() {
  return (
    <div
      className="relative flex w-full flex-col justify-center py-[calc(var(--u)*28)] pl-[calc(var(--u)*28)] pr-[40%] board:h-[calc(var(--u)*422)] board:w-[calc(var(--u)*775)] board:shrink-0 board:pb-[calc(var(--u)*59)] board:pl-[calc(var(--u)*41)] board:pr-[calc(var(--u)*383)] board:pt-[calc(var(--u)*43)]"
      style={{ background: PRIZE_GRADIENT, borderRadius: u(20) }}
    >
      <div className="relative z-10 flex min-w-0 flex-col gap-[calc(var(--u)*8)] text-cream board:gap-[calc(var(--u)*12.33)]">
        <p className="text-[length:calc(var(--u)*13)] font-bold uppercase leading-[1.1] tracking-[0.23em] board:text-[length:calc(var(--u)*19.73)]">
          Top {PODIUM_N} fastest minds
        </p>

        {/* The headline is set in the design's own two lines - "Win a total
            of" over the amount - so no font metric can move the break.

            Sized at 37px rather than the design's 41px, and that is the
            adaptation this event needs: the frame was set with "RM 300 Grab
            Vouchers", and "IDR 600k Grab Vouchers" is a longer string, which
            at 41px measures 483px against the design's 448px box and wraps to
            a third line. 37px brings it to 436px, so it holds the designed
            break at a size indistinguishable from it across a room.

            The box is kept and the line is NOT set nowrap on purpose: a longer
            amount later should wrap inside the panel rather than run silently
            under the gift artwork to its right. */}
        <p className="font-extrabold tracking-[-0.015em] board:w-[calc(var(--u)*448)]">
          {SILOAM_PRIZE_HEADLINE.map((line) => (
            <span
              key={line}
              className="block text-[length:calc(var(--u)*24)] leading-[1.1] board:text-[length:calc(var(--u)*37)]"
            >
              {line}
            </span>
          ))}
        </p>

        <ul className="flex flex-col gap-[calc(var(--u)*10)] pt-[calc(var(--u)*8)] board:gap-[calc(var(--u)*14.89)] board:pt-[calc(var(--u)*12.41)]">
          {SILOAM_PRIZE.ladder.map((tier) => (
            <PrizeRow key={tier.rank} rank={tier.rank} label={tier.label} />
          ))}
        </ul>
      </div>

      {/* The gift render sits over the panel's right edge, taller than the
          panel itself - hence the offsets rather than a flow child. In the
          frame it is 369x441 at 458px in from the panel's left and 52px above
          its top (892:7176). */}
      <OptionalImage
        src={PRIZE_IMAGE}
        alt={`Grab gift box and ${SILOAM_PRIZE.total} of vouchers`}
        className={PRIZE_ART_CLASS}
        style={PRIZE_ART_DRIFT}
        fallback={
          <OptionalImage
            src={PRIZE_IMAGE_FALLBACK}
            alt={`Grab gift box and ${SILOAM_PRIZE.total} of vouchers`}
            className={PRIZE_ART_CLASS}
            style={PRIZE_ART_DRIFT}
          />
        }
      />

      {/* The e-voucher stack (892:7220): a 181x179 render tilted 7 degrees,
          at 603px in and 242px down, so it hangs over the panel's bottom edge
          under the gift box. */}
      <OptionalImage
        src={VOUCHER_IMAGE}
        alt=""
        className="pointer-events-none absolute hidden rotate-[-7deg] object-contain board:block board:left-[calc(var(--u)*603)] board:top-[calc(var(--u)*242)] board:h-[calc(var(--u)*178.6)] board:w-[calc(var(--u)*181)]"
      />
    </div>
  );
}

/* ------------------------------- Stat band ------------------------------- */

/**
 * Milliseconds from `now` until today's 17:00 in Jakarta, clamped at zero.
 *
 * Worked in UTC on purpose: shifting `now` forward by the WIB offset puts the
 * Jakarta wall clock in the UTC fields of a Date, so the day that 17:00
 * belongs to is Jakarta's day and not the panel's. Once it has passed it
 * stays at zero rather than rolling to tomorrow - the challenge closes once,
 * and a board that quietly started counting down 23 hours would be a lie.
 */
function msUntilClose(now: number): number {
  const wib = new Date(now + WIB_OFFSET_MS);
  const closeUtc =
    Date.UTC(
      wib.getUTCFullYear(),
      wib.getUTCMonth(),
      wib.getUTCDate(),
      CLOSE_HOUR_WIB,
    ) - WIB_OFFSET_MS;
  return Math.max(0, closeUtc - now);
}

/** Milliseconds as hh:mm:ss, for the countdown. */
function formatCountdown(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

/**
 * A run in seconds to one decimal - "25.0" - which is how the room talks
 * about these times ("twenty-five seconds"), where the standings' own m:ss.s
 * is how they are compared. The unit is drawn beside it rather than baked in,
 * so the number keeps the tabular figures the rest of the board sets times in.
 */
function formatSeconds(ms: number): string {
  return (Math.max(0, ms) / 1000).toFixed(1);
}

/**
 * One stat: a small uppercase label over a large number, in a white card cut
 * to the same corner radius and hairline the standings rows use.
 */
function StatCard({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className="flex min-w-0 flex-1 items-center justify-center gap-[calc(var(--u)*12)] bg-white px-[calc(var(--u)*16)] py-[calc(var(--u)*10)] board:h-[calc(var(--u)*60)] board:justify-start board:gap-[calc(var(--u)*20)] board:px-[calc(var(--u)*26)] board:py-0"
      style={{
        borderRadius: u(18),
        border: `1px solid ${CARD_LINE}`,
        boxShadow: `0 ${u(2.2)} ${u(4.4)} rgba(51, 18, 0, 0.08)`,
      }}
    >
      <span
        className="shrink-0 text-center font-bold uppercase leading-[1.15] tracking-[0.18em] text-[length:calc(var(--u)*11)] board:text-left board:text-[length:calc(var(--u)*16)]"
        style={{ color: INK_FAINT }}
      >
        {label}
      </span>
      <span
        className="min-w-0 truncate font-extrabold leading-none tracking-[-0.01em] tabular-nums text-[length:calc(var(--u)*26)] board:text-[length:calc(var(--u)*38)]"
        style={{ color: ORANGE_DEEP }}
      >
        {children}
      </span>
    </div>
  );
}

/**
 * The band above the fact strip: time left, and the time to beat.
 *
 * The countdown is held back until the component has mounted - the board is
 * prerendered, and a clock rendered on the server is a clock that is already
 * wrong by the time it reaches the panel. Until then, and once the clock has
 * run out, the slot carries words rather than a frozen 00:00:00.
 *
 * The fastest run is read from the standings this board already polls, not
 * from a second request: whatever sits at rank 1 IS the fastest so far, so
 * asking again could only produce a second answer to the same question.
 */
function StatBand({ fastestMs }: { fastestMs: number | null }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(msUntilClose(Date.now()));
    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const closed = remaining === 0;

  return (
    <div
      className="relative z-20 mt-[calc(var(--u)*28)] flex shrink-0 flex-col gap-[calc(var(--u)*10)] px-[calc(var(--u)*24)] pb-[calc(var(--u)*12)] board:mt-0 board:h-[calc(var(--u)*76)] board:flex-row board:items-center board:gap-[calc(var(--u)*20)] board:px-[calc(var(--u)*48)] board:pb-0"
    >
      <StatCard label={closed ? "Challenge" : "Closes in (WIB)"}>
        {remaining === null
          ? "--:--:--"
          : closed
            ? "Closed"
            : formatCountdown(remaining)}
      </StatCard>
      <StatCard label="Fastest so far">
        {fastestMs === null ? (
          <span style={{ color: EMPTY_TIME }}>--</span>
        ) : (
          <>
            {formatSeconds(fastestMs)}
            <span
              className="font-bold text-[length:calc(var(--u)*16)] board:text-[length:calc(var(--u)*22)]"
              style={{ color: INK_FAINT, marginLeft: u(7) }}
            >
              seconds
            </span>
          </>
        )}
      </StatCard>
    </div>
  );
}

/* ------------------------------ Photo band ------------------------------ */

/**
 * The band of event photography along the bottom edge (739:10661-10663).
 * Three frames, in the widths the design shows of each (its frames overlap;
 * these are the visible parts, 491:681:748); each is optional, so the band
 * simply thins out (and finally disappears) until the photos are dropped in.
 * The photos are the regatta board's: the same three frames, one event's
 * crowd standing in for the next. In the frame the band starts 12px under
 * the strip's bottom edge, which is why the strip stacks above it.
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

export default function SiloamLeaderboardBoardV2() {
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
          `/api/leaderboard?limit=${TOP_N}&source=${encodeURIComponent(SILOAM_SOURCE)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (!active || !Array.isArray(data.entries)) return;
        const next: Entry[] = data.entries;
        setEntries(next);
        setTotal(data.total ?? next.length);

        // New podium entrants (skip the very first load: nothing is "new").
        const podium = next.slice(0, PODIUM_N);
        if (!firstLoadRef.current && !SILOAM_PAUSED) {
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
          `/api/report-rate?source=${encodeURIComponent(SILOAM_SOURCE)}`,
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
        <div className="flex min-w-0 flex-col px-[calc(var(--u)*24)] pt-[calc(var(--u)*36)] board:w-[calc(var(--u)*1274)] board:shrink-0 board:justify-center board:pb-[calc(var(--u)*12)] board:pl-[calc(var(--u)*26)] board:pr-0 board:pt-[calc(var(--u)*12)]">
          <Masthead />
          <p className="mt-[calc(var(--u)*16)] text-[length:calc(var(--u)*24)] font-medium leading-[1.28] tracking-[-0.01em] text-charcoal board:mt-0 board:text-[length:calc(var(--u)*33.36)]">
            Play the <strong className="font-bold">speed</strong> game to see
            your <strong className="font-bold">rank</strong> and get free{" "}
            <strong className="font-bold">personalised</strong> insights.
          </p>

          {SILOAM_PAUSED ? (
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
            <div className="mt-[calc(var(--u)*28)] flex flex-col gap-[calc(var(--u)*24)] board:mt-[calc(var(--u)*52)] board:flex-row board:items-center board:gap-[calc(var(--u)*38)]">
              <ScanBlock />
              <PrizePanel />
            </div>
          )}
        </div>

        {/* Right: the live standings. */}
        <div className="flex min-w-0 flex-col px-[calc(var(--u)*24)] pt-[calc(var(--u)*40)] board:w-[calc(var(--u)*646)] board:shrink-0 board:justify-center board:pb-[calc(var(--u)*22)] board:pl-0 board:pr-[calc(var(--u)*20)] board:pt-[calc(var(--u)*22)]">
          <BoardLabel live={!SILOAM_PAUSED} />
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

      {/* The two live stats, directly above the fact strip. */}
      <StatBand fastestMs={entries[0]?.timeMs ?? null} />

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
        <div className="flex h-[calc(var(--u)*56)] w-auto shrink-0 items-center overflow-hidden board:h-[calc(var(--u)*86.3)] board:w-[calc(var(--u)*436.5)]">
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
