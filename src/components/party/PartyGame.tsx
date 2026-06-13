"use client";

import { useEffect, useState } from "react";
import { SymbolMatchGame } from "@/components/game/symbol-match/SymbolMatchGame";
import { formatTime } from "@/lib/format";

type Mode = "sober" | "drunk";

interface Player {
  name: string;
  sober?: number;
  drunk?: number;
  drunkDrinks?: number; // drinks reported on their best after-drinks run
}

const STORE_KEY = "party_reaction_v3";

function load(): Player[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Player[]) : [];
  } catch {
    return [];
  }
}

function save(players: Player[]) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(players));
  } catch {
    /* ignore */
  }
}

const MODE = {
  sober: { label: "Sober", emoji: "🧠", grad: "from-emerald-400 to-teal-500" },
  drunk: {
    label: "After drinks",
    emoji: "🍺",
    grad: "from-amber-400 to-orange-500",
  },
} as const;

export function PartyGame() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [view, setView] = useState<"board" | "setup" | "play">("board");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode | null>(null);
  const [drinks, setDrinks] = useState(1);
  const [pending, setPending] = useState<{
    name: string;
    mode: Mode;
    drinks: number;
  } | null>(null);
  const [justPlayed, setJustPlayed] = useState<string | null>(null);

  useEffect(() => setPlayers(load()), []);

  const start = () => {
    const n = name.trim();
    if (!n || !mode) return;
    setPending({ name: n, mode, drinks: mode === "drunk" ? drinks : 0 });
    setView("play");
  };

  const finish = (ms: number) => {
    if (!pending) return;
    setPlayers((prev) => {
      const i = prev.findIndex(
        (p) => p.name.toLowerCase() === pending.name.toLowerCase(),
      );
      const next = [...prev];
      const existing = i >= 0 ? next[i] : { name: pending.name };
      const updated: Player = { ...existing };
      if (pending.mode === "sober") {
        updated.sober =
          updated.sober != null ? Math.min(updated.sober, ms) : ms;
      } else {
        // keep the best after-drinks time, and the drinks count that goes with it
        if (updated.drunk == null || ms < updated.drunk) {
          updated.drunk = ms;
          updated.drunkDrinks = pending.drinks;
        }
      }
      if (i >= 0) next[i] = updated;
      else next.push(updated);
      save(next);
      return next;
    });
    setJustPlayed(pending.name);
    setPending(null);
    setName("");
    setMode(null);
    setDrinks(1);
    setView("board");
  };

  const resetAll = () => {
    if (!confirm("Clear the whole leaderboard?")) return;
    setPlayers([]);
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
            Match 20 symbols as fast as you can. Same name lines up your sober
            and after-drinks times.
          </p>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
            className="mt-6 w-full rounded-xl border-2 border-white/15 bg-white/5 px-5 py-4 text-lg text-white outline-none transition placeholder:text-white/40 focus:border-white/50"
          />

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-white/50">
            Pick your round
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(["sober", "drunk"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-br ${MODE[m].grad} px-4 py-6 text-lg font-extrabold text-black shadow-lg transition hover:brightness-110 ${
                  mode === m ? "ring-4 ring-white" : "opacity-80"
                }`}
              >
                <span className="text-4xl">{MODE[m].emoji}</span>
                {MODE[m].label}
              </button>
            ))}
          </div>

          {/* Drinks count — only for the after-drinks round. */}
          {mode === "drunk" && (
            <>
              <p className="mt-6 text-sm font-bold uppercase tracking-widest text-white/50">
                🍺 How many drinks have you had?
              </p>
              <div className="mt-3 flex items-center justify-center gap-5">
                <button
                  onClick={() => setDrinks((d) => Math.max(1, d - 1))}
                  className="h-12 w-12 rounded-full bg-white/10 text-3xl font-bold transition hover:bg-white/20"
                >
                  –
                </button>
                <span className="w-14 text-center font-display text-5xl font-extrabold tabular-nums">
                  {drinks}
                </span>
                <button
                  onClick={() => setDrinks((d) => d + 1)}
                  className="h-12 w-12 rounded-full bg-white/10 text-3xl font-bold transition hover:bg-white/20"
                >
                  +
                </button>
              </div>
            </>
          )}

          <button
            onClick={start}
            disabled={!name.trim() || !mode}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-6 py-4 text-lg font-extrabold shadow-lg transition hover:brightness-110 disabled:opacity-30"
          >
            ▶ Play
          </button>
        </div>
      </Shell>
    );
  }

  // ---- LEADERBOARD ----
  const ranked = [...players].sort((a, b) => {
    const as = a.sober ?? Infinity;
    const bs = b.sober ?? Infinity;
    if (as !== bs) return as - bs;
    return (a.drunk ?? Infinity) - (b.drunk ?? Infinity);
  });

  const delta = (p: Player) =>
    p.sober != null && p.drunk != null ? p.drunk - p.sober : null;

  const withBoth = players.filter((p) => delta(p) != null);
  const mostWrecked = withBoth.reduce<Player | null>(
    (w, p) => (w == null || delta(p)! > delta(w)! ? p : w),
    null,
  );
  const ironLiver = withBoth.reduce<Player | null>(
    (w, p) => (w == null || delta(p)! < delta(w)! ? p : w),
    null,
  );

  return (
    <Shell>
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
            🍻 Reaction Time Party
          </h1>
          <p className="mt-2 text-white/70">
            Sober vs after-drinks. Fastest sharp mind wins, biggest drop buys
            the next round.
          </p>
        </div>

        {withBoth.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <Award emoji="😎" label="Holds their liquor" who={ironLiver} d={ironLiver ? delta(ironLiver) : null} />
            <Award emoji="🍺" label="Most wrecked" who={mostWrecked} d={mostWrecked ? delta(mostWrecked) : null} />
          </div>
        )}

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-[2rem_1fr_5rem_6.5rem_4.5rem] gap-2 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-white/50">
            <span>#</span>
            <span>Name</span>
            <span className="text-right">🧠 Sober</span>
            <span className="text-right">🍺 After drinks</span>
            <span className="text-right">Δ</span>
          </div>
          {ranked.length === 0 && (
            <p className="px-4 py-10 text-center text-white/50">
              No times yet. Be the first 👇
            </p>
          )}
          {ranked.map((p, i) => {
            const d = delta(p);
            const mine = p.name === justPlayed;
            return (
              <div
                key={p.name}
                className={`grid grid-cols-[2rem_1fr_5rem_6.5rem_4.5rem] items-center gap-2 border-t border-white/10 px-4 py-3 ${
                  mine ? "bg-white/10" : ""
                }`}
              >
                <span className="font-bold text-white/50">
                  {i === 0 ? "🥇" : i + 1}
                </span>
                <span className="truncate font-bold">{p.name}</span>
                <span className="text-right font-mono tabular-nums text-emerald-300">
                  {p.sober != null ? formatTime(p.sober) : "—"}
                </span>
                <span className="text-right font-mono tabular-nums text-amber-300">
                  {p.drunk != null ? (
                    <>
                      {formatTime(p.drunk)}
                      {p.drunkDrinks != null && (
                        <span className="ml-1 text-xs text-amber-300/70">
                          🍺{p.drunkDrinks}
                        </span>
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </span>
                <span
                  className={`text-right font-mono tabular-nums ${
                    d == null ? "text-white/30" : d > 0 ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {d == null
                    ? "—"
                    : `${d > 0 ? "+" : ""}${(d / 1000).toFixed(1)}s`}
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
        {players.length > 0 && (
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

function Award({
  emoji,
  label,
  who,
  d,
}: {
  emoji: string;
  label: string;
  who: Player | null;
  d: number | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
      <p className="text-2xl">{emoji}</p>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white/50">
        {label}
      </p>
      <p className="mt-0.5 truncate font-bold">{who ? who.name : "—"}</p>
      {d != null && (
        <p className="text-xs text-white/60">
          {d > 0 ? "+" : ""}
          {(d / 1000).toFixed(1)}s slower
        </p>
      )}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1a1033] via-[#2a1245] to-[#0d0820] px-4 py-10 text-white">
      {children}
    </main>
  );
}
