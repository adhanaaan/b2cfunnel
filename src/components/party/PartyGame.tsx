"use client";

import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { SymbolMatchGame } from "@/components/game/symbol-match/SymbolMatchGame";
import { formatTime } from "@/lib/format";

interface Attempt {
  name: string;
  drinks: number;
  timeMs: number;
}

interface Player {
  name: string;
  sober?: number;
  drunk?: number;
  drunkDrinks?: number;
}

/** Aggregate raw attempts into one row per player (best sober + best after-drinks). */
function aggregate(attempts: Attempt[]): Player[] {
  const byName = new Map<string, Player>();
  for (const a of attempts) {
    const key = a.name.toLowerCase();
    const p = byName.get(key) ?? { name: a.name };
    if (a.drinks === 0) {
      if (p.sober == null || a.timeMs < p.sober) p.sober = a.timeMs;
    } else if (p.drunk == null || a.timeMs < p.drunk) {
      p.drunk = a.timeMs;
      p.drunkDrinks = a.drinks;
    }
    byName.set(key, p);
  }
  return [...byName.values()];
}

export function PartyGame() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [view, setView] = useState<"board" | "setup" | "play">("board");
  const [name, setName] = useState("");
  const [drinks, setDrinks] = useState(0);
  const [pending, setPending] = useState<{ name: string; drinks: number } | null>(
    null,
  );
  const [justPlayed, setJustPlayed] = useState<string | null>(null);
  const [joinUrl, setJoinUrl] = useState("");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/party", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data.attempts)) setAttempts(data.attempts);
    } catch {
      /* keep last good board */
    }
  }, []);

  useEffect(() => {
    setJoinUrl(`${window.location.origin}/party`);
    refresh();
  }, [refresh]);

  // Live board: poll while showing the leaderboard so every phone stays in sync.
  useEffect(() => {
    if (view !== "board") return;
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [view, refresh]);

  const start = () => {
    const n = name.trim();
    if (!n) return;
    setPending({ name: n, drinks });
    setView("play");
  };

  const finish = async (ms: number) => {
    if (!pending) return;
    const attempt = { name: pending.name, drinks: pending.drinks, timeMs: ms };
    setJustPlayed(pending.name);
    setPending(null);
    setName("");
    setDrinks(0);
    setView("board");
    // optimistic, then persist + refetch the shared board
    setAttempts((prev) => [...prev, attempt]);
    try {
      await fetch("/api/party", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attempt),
      });
    } catch {
      /* optimistic row already shown */
    }
    refresh();
  };

  const resetAll = async () => {
    if (!confirm("Clear the whole leaderboard for everyone?")) return;
    setAttempts([]);
    try {
      sessionStorage.removeItem("sm_demo_done");
    } catch {
      /* ignore */
    }
    await fetch("/api/party", { method: "DELETE" }).catch(() => {});
    refresh();
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
          <p className="mt-3 text-center text-sm text-white/50">
            {drinks === 0 ? "🧠 Sober run" : "🍺 After-drinks run"}
          </p>

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
  const players = aggregate(attempts);
  const soberRows = players
    .filter((p) => p.sober != null)
    .sort((a, b) => a.sober! - b.sober!)
    .map((p) => ({ name: p.name, ms: p.sober! }));
  const drunkRows = players
    .filter((p) => p.drunk != null)
    .sort((a, b) => a.drunk! - b.drunk!)
    .map((p) => ({ name: p.name, ms: p.drunk!, drinks: p.drunkDrinks }));

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
      <div className="w-full max-w-xl">
        <div className="text-center">
          <h1 className="font-display text-5xl font-black tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
              Reaction Time
            </span>{" "}
            🍻
          </h1>
          <p className="mx-auto mt-3 max-w-md text-white/60">
            Sober vs after-drinks. Fastest sharp mind wins, biggest drop buys
            the next round.
          </p>
        </div>

        {/* Join QR — guests scan to play on their own phones. */}
        {joinUrl && (
          <div className="mt-7 flex items-center gap-5 rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10">
            <div className="rounded-2xl bg-white p-3 shadow-lg">
              <QRCodeSVG value={joinUrl} className="h-24 w-24" level="M" />
            </div>
            <div>
              <p className="text-lg font-extrabold">📱 Scan to join</p>
              <p className="mt-1 text-sm text-white/60">
                Play on your phone — this board updates live.
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-bold text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            </div>
          </div>
        )}

        {withBoth.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Award emoji="😎" label="Holds their liquor" who={ironLiver} d={ironLiver ? delta(ironLiver) : null} />
            <Award emoji="🍺" label="Most wrecked" who={mostWrecked} d={mostWrecked ? delta(mostWrecked) : null} />
          </div>
        )}

        {/* Two columns: sober ranking | after-drinks ranking. */}
        {players.length === 0 ? (
          <p className="mt-6 rounded-3xl bg-white/[0.06] px-4 py-8 text-center text-base font-semibold text-white/50 ring-1 ring-white/10">
            No times yet — scan the QR or hit play to kick it off 👇
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <LeaderColumn
              title="Sober"
              emoji="🧠"
              accent="text-emerald-300"
              rows={soberRows}
              justPlayed={justPlayed}
            />
            <LeaderColumn
              title="After drinks"
              emoji="🍺"
              accent="text-amber-300"
              rows={drunkRows}
              justPlayed={justPlayed}
            />
          </div>
        )}

        <button
          onClick={() => setView("setup")}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-violet-600 px-6 py-5 text-lg font-extrabold shadow-[0_18px_50px_-12px_rgba(217,70,239,0.6)] transition hover:brightness-110"
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

const MEDAL = ["🥇", "🥈", "🥉"];

function LeaderColumn({
  title,
  emoji,
  accent,
  rows,
  justPlayed,
}: {
  title: string;
  emoji: string;
  accent: string;
  rows: { name: string; ms: number; drinks?: number }[];
  justPlayed: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white/[0.06] ring-1 ring-white/10">
      <div className="bg-white/5 px-4 py-3 text-sm font-extrabold uppercase tracking-wider">
        <span className={accent}>
          {emoji} {title}
        </span>
      </div>
      {rows.length === 0 && (
        <p className="px-4 py-6 text-center text-sm text-white/40">
          No times yet
        </p>
      )}
      {rows.map((r, i) => (
        <div
          key={r.name}
          className={`flex items-center gap-3 border-t border-white/10 px-4 py-3 ${
            r.name === justPlayed ? "bg-white/10" : ""
          }`}
        >
          <span className="w-6 flex-shrink-0 font-bold text-white/50">
            {i < 3 ? MEDAL[i] : i + 1}
          </span>
          <span className="flex-1 truncate font-bold">{r.name}</span>
          {r.drinks != null && (
            <span className="flex-shrink-0 text-xs text-amber-300/70">
              🍺{r.drinks}
            </span>
          )}
          <span className={`flex-shrink-0 font-mono tabular-nums ${accent}`}>
            {formatTime(r.ms)}
          </span>
        </div>
      ))}
    </div>
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
    <div className="rounded-2xl bg-white/[0.06] px-4 py-3 text-center ring-1 ring-white/10">
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
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10 text-white"
      style={{
        // Baked-in radial glows (no blur filter — cheap to render).
        background:
          "radial-gradient(55rem 38rem at 8% -10%, rgba(217,70,239,0.28), transparent 60%), radial-gradient(55rem 40rem at 108% 28%, rgba(139,92,246,0.26), transparent 60%), radial-gradient(50rem 40rem at 50% 120%, rgba(245,158,11,0.18), transparent 60%), #0c0718",
      }}
    >
      <div className="flex w-full flex-col items-center">{children}</div>
    </main>
  );
}
