"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { COPY } from "@/config/copy";
import { ArenaShell } from "@/components/ui/ArenaShell";
import { formatTime } from "@/lib/format";
import { generateResultCard, shareBlob } from "@/lib/shareCard";
import { springs, stagger } from "@/lib/motion";
import { PickACardTip } from "./PickACardTip";

interface Event2GameResultProps {
  name?: string;
  email?: string;
  timeMs?: number;
  /** Continue into the brain-health quiz (after the dawn wipe). */
  onContinue: () => void;
  /** Caring exit: jump to the closing screen instead of backing into the game. */
  onDecline: () => void;
}

interface Standing {
  top: { name: string; timeMs: number } | null;
  rank: number | null;
  total: number | null;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

/** One-shot ember burst behind the hero time (top-3 celebration). */
function EmberBurst() {
  const bursts = [
    { x: -70, y: -80, delay: 0 }, { x: 60, y: -95, delay: 0.05 },
    { x: -30, y: -110, delay: 0.1 }, { x: 90, y: -60, delay: 0.12 },
    { x: -95, y: -50, delay: 0.16 }, { x: 30, y: -120, delay: 0.2 },
    { x: -55, y: -95, delay: 0.24 }, { x: 75, y: -85, delay: 0.28 },
    { x: 10, y: -105, delay: 0.32 }, { x: -85, y: -70, delay: 0.36 },
    { x: 45, y: -100, delay: 0.4 }, { x: -15, y: -90, delay: 0.44 },
  ];
  return (
    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 flex justify-center">
      {bursts.map((b, i) => (
        <span
          key={i}
          className="animate-ember-burst absolute h-2 w-2 rounded-full bg-ember-bright"
          style={{
            ["--burst-x" as string]: `${b.x}px`,
            ["--burst-y" as string]: `${b.y}px`,
            ["--burst-delay" as string]: `${b.delay}s`,
          }}
        />
      ))}
    </span>
  );
}

/**
 * The redesigned post-game screen (FigJam v2 spec): one hero fact at a time.
 * The time counts up, the standings chips settle in, then share, the
 * pick-a-card tip, and a single decision.
 */
export function Event2GameResult({
  name,
  email,
  timeMs,
  onContinue,
  onDecline,
}: Event2GameResultProps) {
  const c = COPY.screens.event2.gameResult;
  const reduced = useReducedMotion();
  const [standing, setStanding] = useState<Standing>({
    top: null,
    rank: null,
    total: null,
  });
  const [display, setDisplay] = useState(reduced ? (timeMs ?? 0) : 0);
  const [countDone, setCountDone] = useState(!!reduced);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [dawn, setDawn] = useState(false);
  const qrHostRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<Blob | null>(null);

  const playUrl = useMemo(
    () =>
      typeof window !== "undefined"
        ? `${window.location.origin}/event-v2`
        : "https://brainhealthcheck.vercel.app/event-v2",
    [],
  );

  // Live standings: the night's fastest, your rank, and the field size.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/leaderboard?limit=1${email ? `&email=${encodeURIComponent(email)}` : ""}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (cancelled) return;
        setStanding({
          top:
            Array.isArray(data.entries) && data.entries[0]
              ? { name: data.entries[0].name, timeMs: data.entries[0].timeMs }
              : null,
          rank: data.you?.rank ?? null,
          total: typeof data.total === "number" ? data.total : null,
        });
      } catch {
        /* the recap still shows the player's own time */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [email]);

  // The hero count-up: 0 -> the real time over 900ms, tap-skippable.
  useEffect(() => {
    if (timeMs == null || reduced) {
      setDisplay(timeMs ?? 0);
      setCountDone(true);
      return;
    }
    const controls = animate(0, timeMs, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: setDisplay,
      onComplete: () => setCountDone(true),
    });
    return () => controls.stop();
  }, [timeMs, reduced]);

  const skipCountUp = () => {
    if (!countDone && timeMs != null) {
      setDisplay(timeMs);
      setCountDone(true);
    }
  };

  // Pre-generate the share card so the tap keeps its user gesture on iOS.
  useEffect(() => {
    if (timeMs == null) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      const qrCanvas = qrHostRef.current?.querySelector("canvas") ?? null;
      const blob = await generateResultCard({
        name: name ?? "",
        timeMs,
        rank: standing.rank ?? undefined,
        total: standing.total ?? undefined,
        url: playUrl,
        qrCanvas,
      });
      if (!cancelled) cardRef.current = blob;
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [name, timeMs, standing.rank, standing.total, playUrl]);

  const share = async () => {
    if (sharing || timeMs == null) return;
    setSharing(true);
    try {
      const text = COPY.screens.event2.share.text.replace(
        "{time}",
        formatTime(timeMs),
      );
      const outcome = await shareBlob(
        cardRef.current,
        text,
        playUrl,
        "brain-speed.png",
      );
      setShareNote(
        outcome === "shared"
          ? "Shared."
          : outcome === "downloaded"
            ? "Card saved. The caption is on your clipboard."
            : outcome === "copied"
              ? "Copied to your clipboard."
              : "Sharing is not available here.",
      );
    } finally {
      setSharing(false);
    }
  };

  const continueWithDawn = () => {
    if (reduced) {
      onContinue();
      return;
    }
    setDawn(true);
    setTimeout(onContinue, 620);
  };

  const topPct =
    standing.rank && standing.total
      ? Math.max(1, Math.ceil((standing.rank / standing.total) * 100))
      : null;
  const podium = standing.rank != null && standing.rank <= 3;

  return (
    <ArenaShell>
      {/* The game hands back from its light stage; ease the return to night. */}
      <div
        aria-hidden
        className="animate-wash-out pointer-events-none fixed inset-0 z-[55] bg-night-ink"
      />

      {/* Hidden QR used by the canvas share card. */}
      <div ref={qrHostRef} className="hidden" aria-hidden>
        <QRCodeCanvas value={playUrl} size={190} marginSize={0} />
      </div>

      <motion.div
        className="flex min-h-[85dvh] flex-col justify-center py-6"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : stagger.items } },
        }}
        initial={reduced ? "show" : "hidden"}
        animate="show"
      >
        <motion.p
          variants={item}
          className="text-center text-xs font-bold uppercase tracking-[0.22em] text-ember-core"
        >
          {c.eyebrow}
        </motion.p>
        <motion.h1
          variants={item}
          className="mx-auto mt-2 max-w-sm text-center font-serif text-3xl font-semibold leading-tight text-cream"
        >
          {c.heading}
        </motion.h1>

        {/* Hero time. Tap skips the count-up. */}
        <motion.button
          variants={item}
          type="button"
          onClick={skipCountUp}
          className="relative mx-auto mt-5 cursor-default text-center"
          aria-label={`${c.youLabel}: ${timeMs != null ? formatTime(timeMs) : "unavailable"}`}
        >
          {podium && countDone && !reduced && <EmberBurst />}
          <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-cream-dim">
            {c.youLabel}
          </span>
          <span className="block font-display text-7xl font-extrabold tabular-nums text-cream [text-shadow:0_0_50px_rgba(247,117,40,0.35)]">
            {timeMs != null ? formatTime(display) : "-"}
          </span>
          <span
            className={[
              "mx-auto mt-1 block h-1 rounded-full bg-gradient-to-r from-ember-core to-ember-hot transition-all duration-500",
              countDone ? "w-24 opacity-100" : "w-4 opacity-0",
            ].join(" ")}
          />
        </motion.button>

        {/* Standings chips: rank / fastest / players. */}
        <motion.div variants={item} className="mt-6 grid grid-cols-3 gap-2.5">
          <div className={[
            "rounded-xl border px-2 py-3 text-center",
            podium ? "border-gold/60 bg-gold/10" : "border-night-stroke bg-night-raised/80",
          ].join(" ")}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cream-dim">
              {c.rankLabel}
            </p>
            <p className={[
              "font-display text-2xl font-extrabold tabular-nums",
              podium ? "text-gold" : "text-cream",
            ].join(" ")}>
              {standing.rank ? `#${standing.rank}` : "-"}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-ember-bright">
              {topPct ? c.topPercent.replace("{pct}", String(topPct)) : " "}
            </p>
          </div>
          <div className="rounded-xl border border-night-stroke bg-night-raised/80 px-2 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-cream-dim">
              {c.fastestLabel}
            </p>
            <p className="font-display text-2xl font-extrabold tabular-nums text-cream">
              {standing.top ? formatTime(standing.top.timeMs) : "-"}
            </p>
            <p className="mt-0.5 truncate text-[11px] font-semibold text-cream-dim">
              {standing.top ? standing.top.name : "Be the first"}
            </p>
          </div>
          <div className="rounded-xl border border-night-stroke bg-night-raised/80 px-2 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-cream-dim">
              {c.playersLabel}
            </p>
            <p className="font-display text-2xl font-extrabold tabular-nums text-cream">
              {standing.total ?? "-"}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-cream-dim">tonight</p>
          </div>
        </motion.div>

        <motion.p
          variants={item}
          className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-cream-dim"
        >
          {c.explainer}
        </motion.p>

        {/* Share. */}
        <motion.div variants={item} className="mt-5">
          <button
            type="button"
            onClick={share}
            disabled={sharing || timeMs == null}
            className="w-full rounded-xl border border-ember-core/60 bg-night-raised px-6 py-3.5 text-base font-bold text-ember-bright transition hover:border-ember-core hover:text-ember-hot disabled:opacity-60"
          >
            {sharing ? "Preparing…" : `${c.shareCta} ↗`}
          </button>
          <p className="mt-2 text-center text-xs text-cream-faint" role="status">
            {shareNote ?? c.screenshotPrompt}
          </p>
        </motion.div>

        {/* Pick-a-card brain care tip. */}
        <motion.div variants={item}>
          <PickACardTip playUrl={playUrl} />
        </motion.div>

        {/* The bridge into the quiz. */}
        <motion.div
          variants={item}
          className="mt-10 rounded-2xl border border-night-stroke bg-night-raised/80 px-5 py-6 text-center shadow-ember"
        >
          <p className="font-serif text-2xl font-semibold leading-snug text-cream">
            {c.bridgeHeading}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-cream-dim">
            {c.bridgeBody}
          </p>
          <motion.button
            type="button"
            onClick={continueWithDawn}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={springs.pop}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-ember-core to-ember-bright px-6 py-4 text-lg font-extrabold text-[#2a1006] shadow-[0_12px_40px_-8px_rgba(247,117,40,0.55)] transition hover:brightness-105"
          >
            {c.cta} →
          </motion.button>
          <p className="mt-2 text-xs text-cream-faint">{c.ctaNote}</p>
          <button
            type="button"
            onClick={onDecline}
            className="mt-3 text-sm font-semibold text-cream-dim underline-offset-4 hover:underline"
          >
            {c.decline}
          </button>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-4 text-center text-xs italic text-cream-faint"
        >
          {c.disclaimer}
        </motion.p>
      </motion.div>

      {/* Dawn wipe: night hands over to the light quiz arc. */}
      {dawn && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[60] origin-bottom"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 100%, #fff4ee 0%, #fff8f6 55%, #fbe7de 100%)",
          }}
          initial={{ scale: 0, opacity: 0.4, borderRadius: "100%" }}
          animate={{ scale: 3, opacity: 1, borderRadius: "0%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </ArenaShell>
  );
}
