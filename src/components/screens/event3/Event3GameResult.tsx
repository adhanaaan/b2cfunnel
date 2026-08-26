"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { COPY } from "@/config/copy";
import { formatTime } from "@/lib/format";
import { generateResultCard, shareBlob } from "@/lib/shareCard";
import { springs, stagger } from "@/lib/motion";
import { Event3Shell } from "./Event3Shell";
import { BrainHero } from "./BrainHero";
import { ProcessingSpeedPopup } from "./ProcessingSpeedPopup";
import { QuestionCircleIcon, RetryIcon, ShareIcon } from "./icons";
import { ctaInverseClass, emberLabelGradient, emberTextGradient } from "./ui";

interface Event3GameResultProps {
  name?: string;
  email?: string;
  timeMs?: number;
  /** Continue into the brain-health quiz. */
  onContinue: () => void;
  /** Play the reaction game again for a fresh time. */
  onRetake: () => void;
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

/**
 * Event3 post-game result (Figma "05 Result page"): everything above the
 * fold. Share and retry live in the top corners, the hero time counts up
 * under the "processing speed" headline (whose "?" opens the explainer
 * popup), the rank/fastest chips settle in, and the ember bridge card with
 * the brain peeking over it carries the one CTA into the quiz.
 */
export function Event3GameResult({
  name,
  email,
  timeMs,
  onContinue,
  onRetake,
}: Event3GameResultProps) {
  const c = COPY.screens.event3.gameResult;
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
  const [popupOpen, setPopupOpen] = useState(false);
  const qrHostRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<Blob | null>(null);

  const playUrl = useMemo(
    () =>
      typeof window !== "undefined"
        ? `${window.location.origin}/event-v3`
        : "https://brainhealthcheck.vercel.app/event-v3",
    [],
  );

  // Live standings: the fastest so far and your rank.
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
        /* the result still shows the player's own time */
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
        theme: "daylight",
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
      // "I scored 0:41.8 ... / Rank 63/181 / Can you beat my score? ..." -
      // the share ladder appends the play URL under the closing colon.
      const sc = COPY.screens.event3.share;
      const lines = [sc.text.replace("{time}", formatTime(timeMs))];
      if (standing.rank && standing.total) {
        lines.push(
          sc.rankLine
            .replace("{rank}", String(standing.rank))
            .replace("{total}", String(standing.total)),
        );
      }
      lines.push(sc.cta);
      const text = lines.join("\n");
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

  const cornerButton =
    "flex items-center gap-1.5 rounded-lg px-1 py-1 text-[12px] font-bold uppercase tracking-[0.22em] transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-core";

  return (
    <Event3Shell pills sparkles>
      {/* Hidden QR used by the canvas share card. */}
      <div ref={qrHostRef} className="hidden" aria-hidden>
        <QRCodeCanvas value={playUrl} size={190} marginSize={0} />
      </div>

      <motion.div
        className="flex h-full min-h-0 flex-col"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : stagger.items } },
        }}
        initial={reduced ? "show" : "hidden"}
        animate="show"
      >
        {/* Top corners: share / retry */}
        <motion.div variants={item} className="relative flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={share}
            disabled={sharing || timeMs == null}
            className={`${cornerButton} -ml-1 text-[#ee743f] disabled:opacity-50`}
          >
            <ShareIcon className="h-[22px] w-[22px]" />
            <span className={emberLabelGradient}>
              {sharing ? "…" : c.shareLabel}
            </span>
          </button>
          <button
            type="button"
            onClick={onRetake}
            className={`${cornerButton} -mr-1 text-[#ee743f]`}
          >
            <RetryIcon className="h-[20px] w-[20px]" />
            <span className={emberLabelGradient}>{c.retryLabel}</span>
          </button>
          {shareNote && (
            <p
              role="status"
              className="absolute left-0 right-0 top-full mt-1 text-center text-[11px] text-outline"
            >
              {shareNote}
            </p>
          )}
        </motion.div>

        <div className="flex flex-1 flex-col justify-center">
        {/* Headline with the "?" popup trigger */}
        <motion.h1
          variants={item}
          className="mx-auto max-w-[320px] text-center font-bold leading-[1.15] text-[#171717]"
        >
          <span className="text-[19px]">{c.headingPrefix}</span>{" "}
          <span className="relative inline-block">
            <span className={`${emberTextGradient} text-[2rem]`}>
              {c.headingHighlight}
            </span>
            <button
              type="button"
              onClick={() => setPopupOpen(true)}
              aria-label="What does processing speed mean?"
              className="absolute -right-5 top-1 text-ember-core transition hover:opacity-75"
            >
              <QuestionCircleIcon className="h-4 w-4" />
            </button>
          </span>
        </motion.h1>

        {/* Hero time. Tap skips the count-up. */}
        <motion.button
          variants={item}
          type="button"
          onClick={skipCountUp}
          className="mx-auto mt-5 cursor-default text-center tall:mt-7"
          aria-label={`${c.youLabel}: ${timeMs != null ? formatTime(timeMs) : "unavailable"}`}
        >
          <span className="block text-xs font-bold uppercase tracking-[0.22em] text-ember-core">
            {c.youLabel}
          </span>
          <span className="block text-[clamp(52px,8.5dvh,70px)] font-extrabold leading-[1.05] tabular-nums tracking-[-1.4px] text-[#171717] [text-shadow:0_0_50px_rgba(247,117,40,0.35)]">
            {timeMs != null ? formatTime(display) : "-"}
          </span>
          <span
            className={[
              "mx-auto mt-1 block h-1 rounded-full bg-gradient-to-r from-ember-core to-ember-hot transition-all duration-500",
              countDone ? "w-24 opacity-100" : "w-4 opacity-0",
            ].join(" ")}
          />
        </motion.button>

        {/* Standing chips: your rank / fastest so far */}
        <motion.div variants={item} className="mt-5 flex justify-between gap-3 tall:mt-7">
          <div className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl bg-white/45 px-2 py-2.5 text-center backdrop-blur-[2px] tall:py-3">
            <p className={`w-full text-[10px] font-bold uppercase tracking-[0.1em] ${emberLabelGradient}`}>
              {c.rankLabel}
            </p>
            <p className="w-full text-2xl font-extrabold leading-8 tabular-nums tracking-[-0.24px] text-[#171717]">
              {standing.rank ? `#${standing.rank}` : "-"}
            </p>
            <p className="w-full truncate text-[11px] font-semibold leading-[14px] text-[#171717]">
              {name ?? " "}
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl bg-white/45 px-2 py-2.5 text-center backdrop-blur-[2px] tall:py-3">
            <p className={`w-full text-[10px] font-bold uppercase tracking-[0.1em] ${emberLabelGradient}`}>
              {c.fastestLabel}
            </p>
            <p className="w-full text-2xl font-extrabold leading-8 tabular-nums tracking-[-0.24px] text-[#171717]">
              {standing.top ? formatTime(standing.top.timeMs) : "-"}
            </p>
            <p className="w-full truncate text-[11px] font-semibold leading-[14px] text-[#171717]">
              {standing.top ? standing.top.name : "Be the first"}
            </p>
          </div>
        </motion.div>
        </div>

        {/* Bridge into the quiz, with the brain sitting in front of the
            card's top edge. The asset carries its own label and sparkle. */}
        <motion.div variants={item} className="relative mt-3 pt-20 tall:pt-24">
          <div className="pointer-events-none absolute -right-1 bottom-[calc(100%-8.25rem)] z-20 h-[135px] w-[220px] tall:bottom-[calc(100%-9.5rem)] tall:h-[150px] tall:w-[240px]">
            <BrainHero className="h-full w-full" />
          </div>

          <div className="relative z-10 overflow-hidden rounded-2xl bg-gradient-to-b from-[#e8782e] via-[#f09452] to-[#ffbb88] px-5 pb-5 pt-6 shadow-[0_20px_50px_-20px_rgba(232,120,46,0.55)]">
            <p className="text-[14px] font-semibold leading-[1.5] text-cream">
              {c.bridgeIntro}
            </p>
            <p className="mt-0.5 font-semibold leading-[1.2] text-cream">
              <span className="text-[16px]">{c.bridgeQuestion}</span>
              <br />
              <span className="text-[28px]">{c.bridgeHighlight}</span>
            </p>
            <motion.button
              type="button"
              onClick={onContinue}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={springs.pop}
              className={`${ctaInverseClass} relative mt-6 overflow-hidden`}
            >
              <span className={`relative z-10 ${emberLabelGradient}`}>
                {c.cta} →
              </span>
              {/* Shimmer sweep: a warm glint gliding across every ~2.6s. */}
              <span
                aria-hidden
                className="animate-cta-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[rgba(247,117,40,0.22)] to-transparent"
              />
            </motion.button>
          </div>

          <p className="mt-3 text-center text-xs italic leading-5 text-cream-faint">
            {c.disclaimer}
          </p>
        </motion.div>
      </motion.div>

      <ProcessingSpeedPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </Event3Shell>
  );
}
