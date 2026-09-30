"use client";

/**
 * The TEAM board for Round 5 of the One Trick Pony quiz night - eight teams,
 * ranked on what their players did on the individual board.
 *
 * A second screen rather than a panel bolted onto the individual board: that
 * one is the attract screen the room scans from and it is already full, and
 * this one is what the host puts up to score the round. Two URLs the host can
 * flip between beats one screen trying to be both, on a night where the person
 * driving it is holding a microphone.
 *
 * Ranked on each team's FASTEST player (see TEAM_METRIC). Every extra person a
 * team gets to scan is another chance at a quicker time, so it rewards pulling
 * the whole table in; ranking on the average would do the reverse, quietly
 * telling the slower half of the room not to bother. Both figures are printed
 * either way, so flipping the constant changes the order and the emphasis and
 * nothing else.
 *
 * A copy of the other boards rather than a shared component, in line with every
 * board in this app: an event's screen is the one thing that gets redesigned
 * mid-run, and two events must never be able to change each other's TV.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { formatTime } from "@/lib/format";
import { OTP_PAUSED, OTP_SOURCE } from "@/config/event";
import { playUrlFor } from "@/config/eventLinks";
import { springs } from "@/lib/motion";

interface TeamStanding {
  team: string;
  bestMs: number;
  bestPlayer: string;
  averageMs: number;
  players: number;
}

/** Eight teams tonight; the extra rows keep the board honest if a ninth lands. */
const ROWS = 8;
const POLL_MS = 8000;

const PLAY_URL = playUrlFor("otp");

// Board palette, matching the individual board next door.
const ORANGE_DEEP = "#e35d0e";
const CARD_LINE = "#f3ddd2";
const RANK_CHIP_BG = "#f6e8e0";
const INK_FAINT = "#a98d80";
const EMPTY_TIME = "#dcc4b6";
const RANK_SILVER = "#c3cad6";
const RANK_BRONZE = "#d99058";
const LEADER_LABEL = "#ffe4cf";
const SCAN_ACCENT = "#993c1d";
const SCAN_HIGHLIGHT = "#fde68a";

const CANVAS =
  "linear-gradient(150deg, #fff8f6 15%, #fdeee4 46%, #fbe3d3 85%)";
const LEADER_GRADIENT = "linear-gradient(90deg, #f77528 0%, #ff9a4d 100%)";

const T = {
  eyebrow: "text-[clamp(0.625rem,min(1.75vh,2.6vw),1.1875rem)]",
  chip: "text-[clamp(0.625rem,min(2vh,3vw),1.375rem)]",
  h1: "text-[clamp(1.375rem,min(5.4vh,7vw),3.625rem)]",
  micro: "text-[clamp(0.5rem,min(1.4vh,2.2vw),0.9375rem)]",
  rankL: "text-[clamp(0.9375rem,min(3.4vh,4.2vw),2.25rem)]",
  rank: "text-[clamp(0.75rem,min(2.4vh,3.2vw),1.625rem)]",
  teamL: "text-[clamp(1.125rem,min(4.6vh,5.5vw),3.125rem)]",
  team: "text-[clamp(0.9375rem,min(3.4vh,4.4vw),2.25rem)]",
  timeL: "text-[clamp(1.375rem,min(6vh,8vw),4.0625rem)]",
  time: "text-[clamp(1rem,min(3.8vh,4.8vw),2.5rem)]",
  sub: "text-[clamp(0.5625rem,min(1.6vh,2.4vw),1.0625rem)]",
  rowEmpty: "text-[clamp(0.8125rem,min(2.4vh,3.6vw),1.625rem)]",
  scanHead: "text-[clamp(1.375rem,min(3.7vh,4.1vw),2.5rem)]",
  footer: "text-[clamp(0.5625rem,min(1.5vh,2.2vw),1rem)]",
};

const keyOf = (t: TeamStanding) => t.team.trim().toLowerCase();

/* ------------------------------- Masthead ------------------------------- */

function Masthead({ live, teams }: { live: boolean; teams: number }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 sm:flex-1">
        <div className="flex items-center gap-4">
          <p
            className={`${T.eyebrow} font-bold uppercase tracking-[0.3em] text-primary`}
          >
            Round 5 · Team Standings
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
          Fastest <span className="text-primary">team</span> in the bar
        </h1>
        <p
          className={`${T.micro} mt-2 font-bold uppercase tracking-[0.25em]`}
          style={{ color: INK_FAINT }}
        >
          Ranked on each team&apos;s quickest brain
          {teams > 0 ? ` · ${teams} ${teams === 1 ? "team" : "teams"} in` : ""}
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

/* -------------------------------- A row --------------------------------- */

function TeamRow({
  rank,
  team,
  leader,
}: {
  rank: number;
  team: TeamStanding | null;
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
      : team
        ? "#7d5747"
        : INK_FAINT;

  return (
    <motion.li
      layout
      transition={springs.shuffle}
      className="flex min-h-0 items-center gap-[0.9em] rounded-2xl px-[0.7em] py-[0.4em] sm:px-[1.1em] lg:py-0"
      style={{
        flex: leader ? 1.5 : 1,
        background: leader
          ? LEADER_GRADIENT
          : team
            ? "#ffffff"
            : "rgba(255,255,255,0.55)",
        border: team ? "none" : `2px dashed ${CARD_LINE}`,
        boxShadow: leader
          ? "0 16px 40px -12px rgba(51,18,0,0.18)"
          : team
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

      {team ? (
        <>
          <span className="flex min-w-0 flex-1 flex-col justify-center">
            <span
              className={`${leader ? T.teamL : T.team} truncate font-extrabold leading-tight ${leader ? "text-white" : "text-charcoal"}`}
            >
              {team.team}
            </span>
            {/* Who set the time, and how many of the table turned up - the two
                things a host reads out when the round is scored. */}
            <span
              className={`${T.sub} truncate font-semibold`}
              style={{ color: leader ? LEADER_LABEL : INK_FAINT }}
            >
              {team.bestPlayer} · {team.players}{" "}
              {team.players === 1 ? "player" : "players"} · avg{" "}
              {formatTime(team.averageMs)}
            </span>
          </span>
          <span className="flex shrink-0 flex-col items-end leading-none">
            {leader && (
              <span
                className={`${T.micro} font-bold uppercase tracking-[0.25em]`}
                style={{ color: LEADER_LABEL }}
              >
                Team to beat
              </span>
            )}
            <span
              className={`${leader ? T.timeL : T.time} mt-[0.15em] font-extrabold tabular-nums ${leader ? "text-white" : ""}`}
              style={leader ? undefined : { color: ORANGE_DEEP }}
            >
              {formatTime(team.bestMs)}
            </span>
          </span>
        </>
      ) : (
        <>
          <span
            className={`${T.rowEmpty} min-w-0 flex-1 truncate font-semibold`}
            style={{ color: INK_FAINT }}
          >
            Open spot - no times yet
          </span>
          <span
            className={`${T.time} shrink-0 font-extrabold tabular-nums`}
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
          <span
            className="box-decoration-clone px-[0.14em] py-[0.02em] text-[1.11em]"
            style={{ background: SCAN_HIGHLIGHT }}
          >
            &lt; 60 SECONDS
          </span>
        </span>
      </p>

      <div className="relative flex min-h-0 flex-1 items-center justify-center lg:justify-start">
        <div className="relative flex max-w-full items-center">
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

      {/* One line on the prize, so this screen explains itself if it is the one
          left up. The individual board carries the picture. */}
      <p
        className={`${T.sub} shrink-0 text-center font-bold lg:text-left`}
        style={{ color: INK_FAINT }}
      >
        Quickest brain of the night takes the custom Stanley.
      </p>
    </div>
  );
}

/* --------------------------------- Board -------------------------------- */

export default function OneTrickPonyTeamBoard() {
  const [teams, setTeams] = useState<TeamStanding[]>([]);
  const [players, setPlayers] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(
          `/api/team-leaderboard?limit=${ROWS}&source=${encodeURIComponent(OTP_SOURCE)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (!active || !Array.isArray(data.teams)) return;
        setTeams(data.teams);
        setPlayers(data.totalPlayers ?? 0);
      } catch {
        /* keep the last good standings */
      }
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const rows = Array.from({ length: ROWS }, (_, i) => teams[i] ?? null);

  return (
    <main
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-sans text-charcoal lg:h-screen lg:overflow-hidden"
      style={{ background: CANVAS }}
    >
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

      <header
        className="relative z-10 shrink-0 px-[4vw] pb-3 pt-4 sm:pb-3.5 sm:pt-5 lg:px-[3vw]"
        style={{ borderBottom: `1px solid ${CARD_LINE}` }}
      >
        <Masthead live={!OTP_PAUSED} teams={teams.length} />
      </header>

      {/* The table takes the width here: eight team names, each with the player
          who set its time under it, is more to read than eight player names. */}
      <div className="relative z-10 grid min-h-0 flex-1 gap-4 px-[4vw] py-4 lg:grid-cols-[480fr_1400fr] lg:gap-[1.6vw] lg:px-[3vw] lg:py-[2vh]">
        <div className="order-2 lg:order-1 lg:min-h-0">
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
              <p className={`${T.team} mt-3 font-extrabold leading-tight`}>
                Round 5 is done
              </p>
              <p className={`${T.rowEmpty} mt-3 font-semibold text-secondary`}>
                {players > 0
                  ? `${players} brains tested tonight`
                  : "Thanks for playing"}
              </p>
            </div>
          ) : (
            <ScanRail />
          )}
        </div>

        <ol className="order-1 flex min-h-0 flex-col gap-2 lg:order-2 lg:gap-[1.2vh]">
          <AnimatePresence initial={false}>
            {rows.map((t, i) => (
              <TeamRow
                key={t ? keyOf(t) : `empty-${i}`}
                rank={i + 1}
                team={t}
                leader={i === 0 && !!t}
              />
            ))}
          </AnimatePresence>
        </ol>
      </div>

      <footer
        className={`${T.footer} relative z-10 shrink-0 px-[4vw] py-2.5 text-center lg:px-[3vw]`}
        style={{ color: INK_FAINT, borderTop: `1px solid ${CARD_LINE}` }}
      >
        Gray Matter Solutions · A Spin-off from Nanyang Technological
        University, Singapore
      </footer>
    </main>
  );
}
