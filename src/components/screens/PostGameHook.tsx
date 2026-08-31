"use client";

import { useEffect, useState } from "react";
import { COPY } from "@/config/copy";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { formatTime } from "@/lib/format";

interface PostGameHookProps {
  name?: string;
  email?: string;
  timeMs?: number;
  onStart: () => void;
  onDecline: () => void;
}

/** Small padlock glyph for the locked cognitive domains. */
function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      className={className}
      aria-hidden
    >
      <rect x="3.5" y="11" width="17" height="10" rx="2" />
      <path d="M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11" />
    </svg>
  );
}

/**
 * Post-game opt-in hook (event only). Recaps the player's processing-speed
 * result against the day's best, then teases the locked cognitive domains and
 * invites them into the optional brain-health check.
 *
 * Adapted from the recognaizelite hook report's "brain areas unlock" grid -
 * honest framing: the game only tested processing speed; the other domains are
 * the full ReCOGnAIze assessment, and this quiz is the next step.
 */
export function PostGameHook({
  name,
  email,
  timeMs,
  onStart,
  onDecline,
}: PostGameHookProps) {
  const c = COPY.screens.eventHook;
  const [rank, setRank] = useState<number | null>(null);
  const [top, setTop] = useState<{ name: string; timeMs: number } | null>(null);

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
        if (Array.isArray(data.entries) && data.entries[0]) {
          setTop({ name: data.entries[0].name, timeMs: data.entries[0].timeMs });
        }
        if (data.you?.rank) setRank(data.you.rank);
      } catch {
        /* recap still shows the player's own time */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [email]);

  return (
    <ScreenShell>
      <div className="flex min-h-[80vh] flex-col justify-center animate-fade-up">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-primary">
          {c.eyebrow}
        </p>
        <h1 className="mt-2 text-center font-display text-2xl font-extrabold leading-tight text-charcoal">
          {c.rankHeading}
        </h1>

        {/* Compact recap: your time + rank vs the day's fastest. */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-[#ec5e3b] px-4 py-4 text-center text-primary-on shadow-[0_12px_30px_-12px_rgba(247,117,40,0.6)]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary-on/80">
              {c.youLabel}
            </p>
            <p className="font-display text-3xl font-extrabold tabular-nums">
              {timeMs != null ? formatTime(timeMs) : "-"}
            </p>
            <p className="mt-0.5 text-xs font-semibold">
              {rank ? `Ranked #${rank}` : "20 correct"}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container px-4 py-4 text-center shadow-card">
            <p className="text-[11px] font-bold uppercase tracking-widest text-outline">
              {c.topLabel}
            </p>
            <p className="font-display text-3xl font-extrabold tabular-nums text-charcoal">
              {top ? formatTime(top.timeMs) : "-"}
            </p>
            <p className="mt-0.5 truncate text-xs font-semibold text-secondary">
              {top ? top.name : "Be the first"}
            </p>
          </div>
        </div>

        {/* What is processing speed? */}
        <div className="mt-4 rounded-2xl bg-surface-low px-5 py-4">
          <p className="text-sm font-bold uppercase tracking-wide text-charcoal">
            {c.whatHeading}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-secondary">
            {c.whatBody}
          </p>
        </div>

        {/* Locked-domains grid (only processing speed is tested by the game). */}
        <div className="mt-6">
          <p className="font-display text-lg font-extrabold text-charcoal">
            {c.domainsHeading}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-secondary">
            {c.domainsBody}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Tested: processing speed */}
            <div className="rounded-xl border-2 border-primary bg-primary-container/40 px-4 py-4 text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                ✓ {c.testedLabel}
              </p>
              <p className="mt-1 text-sm font-bold text-charcoal">
                {c.testedDomain}
              </p>
            </div>
            {/* Locked domains */}
            {c.lockedDomains.map((d) => (
              <div
                key={d}
                className="rounded-xl border-2 border-outline-variant bg-surface-container px-4 py-4 text-center"
              >
                <LockIcon className="mx-auto h-4 w-4 text-outline" />
                <p className="mt-1 text-sm font-bold text-outline">{d}</p>
                <p className="text-[11px] font-semibold text-outline">
                  {c.lockedLabel}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Understand it better → opt in to the brain-health check. */}
        <div className="mt-6 rounded-2xl bg-surface-container px-5 py-5 text-center shadow-card">
          <p className="font-display text-xl font-extrabold leading-snug text-charcoal">
            {c.understandHeading}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            {c.understandBody}
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-primary to-[#ff9a4d] px-6 py-4 text-lg font-bold text-primary-on shadow-[0_12px_34px_-8px_rgba(247,117,40,0.65)] transition hover:brightness-105"
          >
            {c.cta}
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="mt-3 text-sm font-semibold text-outline underline-offset-4 hover:underline"
          >
            {c.decline}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-outline">{c.credibility}</p>
      </div>
    </ScreenShell>
  );
}
