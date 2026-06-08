"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { formatTime } from "@/lib/format";

interface Entry {
  name: string;
  timeMs: number;
}

const TOP_N = 10;

/**
 * Standalone leaderboard for a 65" landscape TV at the booth's main spot.
 * Left: today's fastest. Right: a big "scan to play" QR. Auto-refreshes.
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

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-gradient-to-br from-[#fff4ee] via-surface to-[#f7d2c1] px-[3vw] py-[3vh]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[40vw] w-[40vw] rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-[36vw] w-[36vw] rounded-full bg-[#ffb37a]/25 blur-3xl"
      />

      {/* Header */}
      <header className="relative shrink-0 text-center">
        <p className="font-bold uppercase tracking-[0.4em] text-primary text-[1.6vh]">
          Gray Matter Solutions · Reaction Time Challenge
        </p>
        <h1 className="mt-[0.5vh] font-display font-extrabold leading-none text-charcoal text-[6vh]">
          Today&apos;s Fastest Minds
        </h1>
        <p className="mt-[0.6vh] font-semibold text-secondary text-[2.6vh]">
          🏆 Top of the day wins a Fitbit
        </p>
      </header>

      {/* Body: leaderboard | QR */}
      <div className="relative mt-[2.5vh] flex min-h-0 flex-1 gap-[3vw]">
        {/* Leaderboard */}
        <div className="flex min-h-0 flex-[1.5] flex-col">
          {entries.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-3xl bg-surface-lowest/70 text-center text-[3vh] text-outline">
              No scores yet today. Scan to be the first on the board! →
            </div>
          ) : (
            <ol className="flex min-h-0 flex-1 flex-col justify-between gap-[1vh]">
              {entries.map((e, i) => (
                <li
                  key={`${e.name}-${i}`}
                  className={[
                    "flex flex-1 items-center gap-[1.5vw] rounded-2xl px-[2vw] shadow-card",
                    i === 0
                      ? "bg-gradient-to-r from-primary to-[#ff9a4d] text-primary-on"
                      : "bg-surface-lowest",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex aspect-square h-[5vh] flex-shrink-0 items-center justify-center rounded-full font-extrabold text-[2.6vh]",
                      i === 0
                        ? "bg-white/25 text-primary-on"
                        : "bg-primary-container text-primary-onContainer",
                    ].join(" ")}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={[
                      "flex-1 truncate font-bold text-[3.4vh]",
                      i === 0 ? "text-primary-on" : "text-charcoal",
                    ].join(" ")}
                  >
                    {e.name}
                  </span>
                  <span className="font-display font-extrabold tabular-nums text-[3.4vh]">
                    {formatTime(e.timeMs)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* QR / scan to play */}
        <div className="flex flex-1 flex-col items-center justify-center rounded-3xl bg-charcoal px-[2vw] py-[3vh] text-center text-white">
          <p className="font-bold uppercase tracking-[0.3em] text-primary text-[2vh]">
            Play now
          </p>
          <p className="mt-[1vh] font-display font-extrabold leading-tight text-[3.2vh]">
            Scan to take the challenge
          </p>
          <div className="mt-[2.5vh] rounded-2xl bg-white p-[1.5vh]">
            {playUrl && (
              <QRCodeSVG
                value={playUrl}
                className="h-[26vh] w-[26vh]"
                level="M"
              />
            )}
          </div>
          <p className="mt-[2vh] font-semibold text-white/80 text-[2vh]">
            {total > 0
              ? `${total} ${total === 1 ? "person has" : "people have"} played today`
              : "Be the first to play"}
          </p>
        </div>
      </div>

      <footer className="relative shrink-0 pt-[1.5vh] text-center text-white/0">
        <p className="text-[1.5vh] text-outline">
          Resets daily (SGT) · Updates live · Reaction-time games are fun, but not
          a cognitive assessment.
        </p>
      </footer>
    </main>
  );
}
