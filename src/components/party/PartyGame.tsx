"use client";

import { useEffect, useState } from "react";
import { SymbolMatchGame } from "@/components/game/symbol-match/SymbolMatchGame";
import { formatTime } from "@/lib/format";

interface Attempt {
  name: string;
  drinks: number;
  ms: number;
}

const STORE_KEY = "party_reaction_v2";

function load(): Attempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Attempt[]) : [];
  } catch {
    return [];
  }
}

function save(attempts: Attempt[]) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(attempts));
  } catch {
    /* ignore */
  }
}

const MEDAL = ["🥇", "🥈", "🥉"];

export function PartyGame() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [view, setView] = useState<"board" | "setup" | "play">("board");
  const [name, setName] = useState("");
  const [drinks, setDrinks] = useState(0);
  const [pending, setPending] = useState<{ name: string; drinks: number } | null>(
    null,
  );
  const [justPlayed, setJustPlayed] = useState<number | null>(null);

  useEffect(() => setAttempts(load()), []);

  const start = () => {
    const n = name.trim();
    if (!n) return;
    setPending({ name: n, drinks });
    setView("play");
  };

  const finish = (ms: number) => {
    if (!pending) return;
    const attempt: Attempt = { ...pending, ms };
    setAttempts((prev) => {
      const next = [...prev, attempt];
      save(next);
      return next;
    });
    setJustPlayed(ms);
    setPending(null);
    setName("");
    setDrinks(0);
    setView("board");
  };

  const resetAll = () => {
    if (!confirm("Clear the whole leaderboard?")) return;
    setAttempts([]);
    save([]);
    try {
      sessionStorage.removeItem("sm_demo_done");
    } catch {
      /* ignore */
    }
  };

  // ---- PLAY ----
  if (view === "play") return <SymbolMatchGame onComplete={finish} />;

  // ---- SETUP ----
  if (view === "setup") {
    return (
      <Shell>
        <div className="w-full max-w-sm">
          <button
            onClick={() => setView("board")}
            className="mb-6 text-sm font-semibold text-white/60 hover:text-white"
          >
            ← Back to leaderboard
          </button>
          <h1 className="font-display text-3xl font-extrabold">Who's playing?</h1>
          <p className="mt-2 text-white/70">
            Match 20 symbols as fast as you can.
          </p>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
            className="mt-6 w-full rounded-xl border-2 border-white/15 bg-white/5 px-5 py-4 text-lg text-white outline-none transition placeholder:text-white/40 focus:border-white/50"
          />

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-white/50">
            🍺 How many drinks have you had?
          </p>
          <div className="mt-3 flex items-center justify-center gap-5">
            <button
              onClick={() => setDrinks((d) => Math.max(0, d - 1))}
              className="h-14 w-14 rounded-full bg-white/10 text-3xl font-bold transition hover:bg-white/20"
            >
              –
            </button>
            <span className="w-16 text-center font-display text-5xl font-extrabold tabular-nums">
              {drinks}
            </span>
            <button
              onClick={() => setDrinks((d) => d + 1)}
              className="h-14 w-14 rounded-full bg-white/10 text-3xl font-bold transition hover:bg-white/20"
            >
              +
            </button>
          </div>

          <button
            onClick={start}
            disabled={!name.trim()}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-6 py-4 text-lg font-extrabold shadow-lg transition hover:brightness-110 disabled:opacity-30"
          >
            ▶ Play
          </button>
        </div>
      </Shell>
    );
  }

  // ---- LEADERBOARD ----
  const ranked = [...attempts].sort((a, b) => a.ms - b.ms);
  const totalDrinks = attempts.reduce((s, a) => s + a.drinks, 0);

  return (
    <Shell>
      <div className="w-full max-w-xl">
        <div className="text-center">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
            🍻 Reaction Time Party
          </h1>
          <p className="mt-2 text-white/70">
            Fastest reflexes win. How many drinks deep can you stay sharp?
          </p>
          {totalDrinks > 0 && (
            <p className="mt-2 text-sm font-semibold text-amber-300">
              🍺 {totalDrinks} drink{totalDrinks === 1 ? "" : "s"} logged tonight
            </p>
          )}
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-[2.5rem_1fr_4.5rem_5rem] gap-2 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-white/50">
            <span>#</span>
            <span>Name</span>
            <span className="text-right">🍺</span>
            <span className="text-right">Time</span>
          </div>
          {ranked.length === 0 && (
            <p className="px-4 py-10 text-center text-white/50">
              No times yet. Be the first 👇
            </p>
          )}
          {ranked.map((a, i) => {
            const mine = a.ms === justPlayed;
            return (
              <div
                key={i}
                className={`grid grid-cols-[2.5rem_1fr_4.5rem_5rem] items-center gap-2 border-t border-white/10 px-4 py-3 ${
                  mine ? "bg-white/10" : ""
                }`}
              >
                <span className="font-bold text-white/50">
                  {i < 3 ? MEDAL[i] : i + 1}
                </span>
                <span className="truncate font-bold">{a.name}</span>
                <span className="text-right font-mono tabular-nums text-amber-300">
                  {a.drinks}
                </span>
                <span className="text-right font-mono tabular-nums text-emerald-300">
                  {formatTime(a.ms)}
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setView("setup")}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-6 py-4 text-lg font-extrabold shadow-lg transition hover:brightness-110"
        >
          ▶ New attempt
        </button>
        {attempts.length > 0 && (
          <button
            onClick={resetAll}
            className="mt-3 w-full text-sm font-semibold text-white/40 hover:text-white/70"
          >
            Reset leaderboard
          </button>
        )}
        <p className="mt-4 text-center text-xs italic text-white/40">
          For fun only. Please drink responsibly 🙂
        </p>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1a1033] via-[#2a1245] to-[#0d0820] px-4 py-10 text-white">
      {children}
    </main>
  );
}
