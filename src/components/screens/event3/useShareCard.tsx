"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { COPY } from "@/config/copy";
import { formatTime } from "@/lib/format";
import { generateResultCard, shareBlob } from "@/lib/shareCard";
import type { Standing } from "./useStanding";

interface UseShareCardOptions {
  name?: string;
  timeMs?: number;
  standing: Standing;
  /** The absolute play link the card and its QR carry. */
  playUrl: string;
}

/**
 * The daylight share card: pre-generated as soon as the time and standing are
 * known (so the share tap keeps its user gesture on iOS), then handed to the
 * share ladder - file share, download + caption, text share, clipboard.
 *
 * Render `qrHost` somewhere in the tree: it is the hidden QR canvas the card
 * is drawn from. Shared by the post-game card and the PHKL report.
 */
export function useShareCard({
  name,
  timeMs,
  standing,
  playUrl,
}: UseShareCardOptions) {
  const qrHostRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<Blob | null>(null);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

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
      const outcome = await shareBlob(
        cardRef.current,
        lines.join("\n"),
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

  const qrHost = (
    <div ref={qrHostRef} className="hidden" aria-hidden>
      <QRCodeCanvas value={playUrl} size={190} marginSize={0} />
    </div>
  );

  return { share, sharing, shareNote, qrHost };
}
