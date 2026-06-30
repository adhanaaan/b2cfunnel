"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { formatTime } from "@/lib/format";
import { EVENT_PAUSED } from "@/config/event";

interface Entry {
  name: string;
  timeMs: number;
}

const TOP_N = 10;
const PRIZE = "Fitbit Air";
const PRIZE_VALUE = "Worth S$189";
const HOW_TO_WIN = [
  "Scan the code",
  "Match 20 symbols, fast",
  "Top the leaderboard",
];

// Design tokens (Gray Matter Solutions Event Design System v1.1).
const C = {
  primary: "#F77528",
  surface: "#F8F9FF",
  card: "#FFFFFF",
  text: "#1A1C1E",
  textVar: "#44474E",
  border: "#DCD9D9",
};

const RANK_COLOR = ["#F7A12E", "#9AA3B2", "#CD7F32"]; // gold / silver / bronze

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

/** Prize image at /public/fitbit.{webp,png,jpg} if present, else a trophy. */
const PRIZE_SRCS = ["/fitbit.webp", "/fitbit.png", "/fitbit.jpg"];
function PrizeImage() {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const s of PRIZE_SRCS) {
        const ok = await new Promise<boolean>((res) => {
          const img = new Image();
          img.onload = () => res(true);
          img.onerror = () => res(false);
          img.src = s;
        });
        if (cancelled) return;
        if (ok) {
          setSrc(s);
          return;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  if (!src) return <span className="text-[26vh] leading-none">🏆</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={PRIZE}
      className="h-full max-h-[40vh] w-auto rounded-2xl object-contain drop-shadow-2xl"
    />
  );
}

export default function LeaderboardBoard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [total, setTotal] = useState(0);
  const [playUrl, setPlayUrl] = useState("");

  useEffect(() => {
    setPlayUrl(`${window.location.origin}/event`);
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/leaderboard?limit=${TOP_N}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (active && Array.isArray(data.entries)) {
          setEntries(data.entries);
          setTotal(data.total ?? data.entries.length);
        }
      } catch {
        /* keep last good standings */
      }
    };
    load();
    const id = setInterval(load, 8000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const rows = Array.from({ length: TOP_N }, (_, i) => entries[i] ?? null);

  return (
    <main
      className="flex h-screen w-screen flex-col overflow-hidden font-sans"
      style={{ background: C.surface, color: C.text }}
    >
      {/* Header */}
      <header
        className="flex shrink-0 items-center justify-between px-[3vw] py-[2.2vh]"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-[1vw]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/gms-logo.png" alt="" className="h-[5vh] w-auto" />
          <div>
            <p
              className="font-bold uppercase tracking-[0.3em] text-[1.5vh]"
              style={{ color: C.primary }}
            >
              Reaction Time Challenge
            </p>
            <h1 className="font-extrabold leading-none text-[4.4vh]">
              Fastest Minds of the Event
            </h1>
          </div>
        </div>
        <p
          className="rounded-lg px-[1.5vw] py-[1vh] text-[1.6vh] font-bold"
          style={{ background: C.card, border: `1px solid ${C.border}`, color: C.textVar }}
        >
          {EVENT_PAUSED ? "Final standings" : "● Live standings"}
        </p>
      </header>

      {/* Body: Prize | Standings | QR */}
      <div className="flex min-h-0 flex-1 gap-[1.5vw] p-[2.5vh_3vw]">
        {/* Prize - the hero: the main reason to scan. */}
        <section
          className="flex flex-[1.55] flex-col items-center justify-between rounded-lg p-[3.5vh_2.5vw] text-center"
          style={{
            background: `linear-gradient(160deg, #FFFFFF 0%, #FFF3EB 55%, #FFE6D5 100%)`,
            border: `2px solid ${C.primary}`,
            boxShadow: `0 0 0 1px ${C.primary}22, 0 1.6vh 4vh -1.6vh ${C.primary}66`,
          }}
        >
          <p
            className="rounded-full px-[1.4vw] py-[0.8vh] font-extrabold uppercase tracking-[0.25em] text-[1.8vh] text-white"
            style={{ background: C.primary }}
          >
            The Prize
          </p>

          <div className="flex flex-1 items-center justify-center py-[1vh]">
            <PrizeImage />
          </div>

          <div>
            <h2 className="font-extrabold uppercase leading-[0.95] tracking-tight">
              <span className="block text-[3vh]" style={{ color: C.textVar }}>
                Win a
              </span>
              <span className="block text-[7.5vh]" style={{ color: C.text }}>
                {PRIZE}
              </span>
            </h2>
            <p
              className="mt-[1.8vh] inline-block rounded-full px-[2vw] py-[1.1vh] font-extrabold text-[2.8vh] text-white"
              style={{ background: C.primary }}
            >
              {PRIZE_VALUE}
            </p>
            <p
              className="mt-[1.8vh] font-semibold text-[2.4vh]"
              style={{ color: C.textVar }}
            >
              The single fastest time of the event takes it home.
            </p>
          </div>

          {/* How to win - so the board explains itself, no host needed. */}
          {!EVENT_PAUSED && (
          <div className="mt-[2.4vh] flex w-full items-stretch justify-center gap-[0.8vw]">
            {HOW_TO_WIN.map((t, i) => (
              <div
                key={t}
                className="flex flex-1 flex-col items-center gap-[1vh] rounded-lg px-[0.7vw] py-[1.6vh]"
                style={{ background: "#FFFFFFB3" }}
              >
                <span
                  className="flex aspect-square h-[3.8vh] items-center justify-center rounded-full font-extrabold text-[2vh]"
                  style={{ background: C.primary, color: "#fff" }}
                >
                  {i + 1}
                </span>
                <span
                  className="font-bold leading-tight text-[1.7vh]"
                  style={{ color: C.text }}
                >
                  {t}
                </span>
              </div>
            ))}
          </div>
          )}
        </section>

        {/* Standings */}
        <section
          className="flex min-h-0 flex-[1.1] flex-col rounded-lg p-[2vh_1.8vw]"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
        >
          <p
            className="shrink-0 font-bold uppercase tracking-[0.25em] text-[1.6vh]"
            style={{ color: C.textVar }}
          >
            Live Standings
          </p>
          <ol className="mt-[1vh] flex min-h-0 flex-1 flex-col justify-between">
            {rows.map((e, i) => {
              const podium = i < 3;
              const badge = podium ? RANK_COLOR[i] : "#EDEFF5";
              return (
                <li
                  key={i}
                  className="flex flex-1 items-center gap-[1.2vw] px-[1vw] transition-all"
                  style={{
                    borderBottom:
                      i < TOP_N - 1 ? `1px solid ${C.border}` : "none",
                    background:
                      i === 0 && e ? `${C.primary}12` : "transparent",
                    borderRadius: i === 0 && e ? "0.6vw" : 0,
                  }}
                >
                  {/* Rank badge */}
                  <span
                    className="flex aspect-square h-[4.6vh] shrink-0 items-center justify-center rounded-full font-extrabold text-[2.2vh]"
                    style={{
                      background: badge,
                      color: podium ? "#fff" : C.textVar,
                    }}
                  >
                    {i + 1}
                  </span>

                  {e ? (
                    <>
                      {/* Initials avatar */}
                      <span
                        className="flex aspect-square h-[4.6vh] shrink-0 items-center justify-center rounded-full font-bold text-[1.9vh]"
                        style={{
                          background: podium ? `${C.primary}1A` : "#EDEFF5",
                          color: podium ? C.primary : C.textVar,
                        }}
                      >
                        {initials(e.name)}
                      </span>
                      <span className="flex-1 truncate font-bold text-[2.5vh]">
                        {e.name}
                      </span>
                      {i === 0 ? (
                        <span className="flex flex-col items-end leading-none">
                          <span
                            className="text-[1.2vh] font-bold uppercase tracking-[0.2em]"
                            style={{ color: C.textVar }}
                          >
                            Time to beat
                          </span>
                          <span
                            className="mt-[0.4vh] font-extrabold tabular-nums text-[3.8vh]"
                            style={{ color: C.primary }}
                          >
                            {formatTime(e.timeMs)}
                          </span>
                        </span>
                      ) : (
                        <span
                          className="font-extrabold tabular-nums text-[2.6vh]"
                          style={{ color: C.primary }}
                        >
                          {formatTime(e.timeMs)}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span
                        className="flex aspect-square h-[4.6vh] shrink-0 rounded-full"
                        style={{ border: `2px dashed ${C.border}` }}
                      />
                      <span
                        className="flex-1 truncate font-medium text-[2.1vh]"
                        style={{ color: "#9AA0AC" }}
                      >
                        Open spot - scan to claim it
                      </span>
                      <span
                        className="font-bold tabular-nums text-[2.2vh]"
                        style={{ color: "#C2C6CF" }}
                      >
                        -:-.-
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        {/* QR interaction zone - the door, or a thank-you once the event ends. */}
        <section
          className="flex flex-[0.8] flex-col items-center justify-center rounded-lg p-[3vh] text-center"
          style={{ background: C.primary, color: "#fff" }}
        >
          {EVENT_PAUSED ? (
            <>
              <p className="font-bold uppercase tracking-[0.3em] text-[1.7vh] text-white/85">
                That&apos;s a wrap
              </p>
              <p className="mt-[2vh] font-extrabold leading-tight text-[4.2vh]">
                The challenge has ended
              </p>
              <p className="mt-[2.4vh] font-semibold text-[2.4vh] text-white/90">
                Thanks for playing
              </p>
              <p className="mt-[1.2vh] text-[2vh] text-white/85">
                {total > 0
                  ? `${total} ${total === 1 ? "player" : "players"} took part`
                  : ""}
              </p>
            </>
          ) : (
            <>
              <p className="font-bold uppercase tracking-[0.3em] text-[1.7vh] text-white/85">
                ⚡ Play now
              </p>
              <p className="mt-[1vh] font-extrabold leading-tight text-[3.6vh]">
                Scan to take the challenge
              </p>
              <div className="mt-[3vh] rounded-lg bg-white p-[1.6vh]">
                {playUrl && (
                  <QRCodeSVG value={playUrl} className="h-[30vh] w-[30vh]" level="M" />
                )}
              </div>
              <p className="mt-[2.4vh] font-semibold text-[2.1vh] text-white/90">
                {total > 0
                  ? `${total} ${total === 1 ? "player" : "players"} so far · be #1`
                  : "Be the first to play!"}
              </p>
            </>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer
        className="shrink-0 px-[3vw] py-[1.4vh] text-center text-[1.4vh]"
        style={{ color: "#9AA0AC", borderTop: `1px solid ${C.border}` }}
      >
        Games are for entertainment. Reaction-time games are fun, but not a
        cognitive assessment. © Gray Matter Solutions.
      </footer>
    </main>
  );
}
