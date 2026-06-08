"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { formatTime } from "@/lib/format";

interface Entry {
  name: string;
  timeMs: number;
}

const TOP_N = 8;
const PRIZE = "Fitbit Air";

/** Shows /public/fitbit.png if it exists, otherwise a trophy (no broken-icon flash). */
function PrizeImage() {
  const [hasImg, setHasImg] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setHasImg(true);
    img.src = "/fitbit.png";
  }, []);
  if (!hasImg) return <span className="text-[9vh] leading-none">🏆</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/fitbit.png"
      alt={PRIZE}
      className="h-[12vh] w-auto object-contain drop-shadow-xl"
    />
  );
}

/**
 * Standalone leaderboard for a 65" landscape TV at the booth's main spot.
 * Built to pull a crowd: the prize leads, the board always looks full
 * (open spots invite people in), and a big QR gets them playing.
 */
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

  // Always render TOP_N rows so the board looks full and invites play.
  const rows = Array.from({ length: TOP_N }, (_, i) => entries[i] ?? null);

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-gradient-to-br from-[#fff4ee] via-surface to-[#f7d2c1] px-[3vw] py-[2.5vh]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[40vw] w-[40vw] rounded-full bg-primary/20 blur-3xl"
      />

      {/* Header */}
      <header className="relative shrink-0 text-center">
        <p className="font-bold uppercase tracking-[0.4em] text-primary text-[1.5vh]">
          Gray Matter Solutions · Reaction Time Challenge
        </p>
        <h1 className="font-display font-extrabold leading-none text-charcoal text-[5.2vh]">
          Today&apos;s Fastest Minds
        </h1>
      </header>

      {/* Prize hero — the pull */}
      <div className="relative mt-[1.5vh] flex shrink-0 items-center justify-center gap-[2vw] rounded-3xl bg-gradient-to-r from-primary to-[#ec5e3b] px-[3vw] py-[2vh] text-primary-on shadow-[0_16px_50px_-12px_rgba(247,117,40,0.6)]">
        <PrizeImage />
        <div className="text-left">
          <p className="font-bold uppercase tracking-[0.25em] text-primary-on/80 text-[1.7vh]">
            Today&apos;s prize
          </p>
          <p className="font-display font-extrabold leading-none text-[5.5vh]">
            Win a {PRIZE}
          </p>
          <p className="font-semibold text-primary-on/90 text-[2.2vh]">
            Fastest time today takes it home.
          </p>
        </div>
      </div>

      {/* Body: leaderboard | QR */}
      <div className="relative mt-[2vh] flex min-h-0 flex-1 gap-[2.5vw]">
        {/* Leaderboard */}
        <ol className="flex min-h-0 flex-[1.7] flex-col gap-[1vh]">
          {rows.map((e, i) => (
            <li
              key={i}
              className={[
                "flex flex-1 items-center gap-[1.5vw] rounded-2xl px-[2vw]",
                e
                  ? i === 0
                    ? "bg-gradient-to-r from-primary to-[#ff9a4d] text-primary-on shadow-card"
                    : "bg-surface-lowest text-charcoal shadow-card"
                  : "border-2 border-dashed border-primary/30 bg-surface-lowest/40",
              ].join(" ")}
            >
              <span
                className={[
                  "flex aspect-square h-[5vh] flex-shrink-0 items-center justify-center rounded-full font-extrabold text-[2.4vh]",
                  e
                    ? i === 0
                      ? "bg-white/25 text-primary-on"
                      : "bg-primary-container text-primary-onContainer"
                    : "bg-primary/10 text-primary/50",
                ].join(" ")}
              >
                {i + 1}
              </span>
              {e ? (
                <>
                  <span className="flex-1 truncate font-bold text-[3.2vh]">
                    {e.name}
                  </span>
                  <span className="font-display font-extrabold tabular-nums text-[3.2vh]">
                    {formatTime(e.timeMs)}
                  </span>
                </>
              ) : (
                <span className="flex-1 font-semibold text-primary/45 text-[2.4vh]">
                  Open spot — scan to claim it
                </span>
              )}
            </li>
          ))}
        </ol>

        {/* QR / scan to play */}
        <div className="flex flex-1 flex-col items-center justify-center rounded-3xl bg-charcoal px-[2vw] py-[2vh] text-center text-white">
          <p className="font-bold uppercase tracking-[0.3em] text-primary text-[2vh]">
            Play now
          </p>
          <p className="mt-[0.8vh] font-display font-extrabold leading-tight text-[3.4vh]">
            Scan to beat the board
          </p>
          <div className="mt-[2vh] rounded-2xl bg-white p-[1.4vh]">
            {playUrl && (
              <QRCodeSVG value={playUrl} className="h-[27vh] w-[27vh]" level="M" />
            )}
          </div>
          <p className="mt-[1.8vh] font-semibold text-white/85 text-[2.1vh]">
            {total > 0
              ? `${total} ${total === 1 ? "player" : "players"} today · be #1`
              : "Be the first to play!"}
          </p>
        </div>
      </div>

      <footer className="relative shrink-0 pt-[1vh] text-center">
        <p className="text-[1.4vh] text-outline">
          Resets daily (SGT) · Updates live · Reaction-time games are fun, but not
          a cognitive assessment.
        </p>
      </footer>
    </main>
  );
}
