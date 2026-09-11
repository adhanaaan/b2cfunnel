"use client";

import type { ScoreResult } from "@/types/engine";
import { eventSource } from "@/config/event";
import { playUrlFor } from "@/config/eventLinks";
import { useVariant } from "@/components/VariantContext";
import { Event3Shell } from "@/components/screens/event3/Event3Shell";
import { useStanding } from "@/components/screens/event3/useStanding";
import { useShareCard } from "@/components/screens/event3/useShareCard";
import { PhklResultHeader } from "@/components/screens/phkl/result/PhklResultHeader";
import { PhklRiskSection } from "@/components/screens/phkl/result/PhklRiskSection";
import { MambaScrollCue } from "./MambaScrollCue";
import { MambaProblem } from "./MambaProblem";
import { MambaDonate } from "./MambaDonate";
import { MambaClosing } from "./MambaClosing";
import { MambaPartners } from "./MambaPartners";
import { MambaStickyCta } from "./MambaStickyCta";
import { useShareDonation } from "./useShareDonation";
import { MambaShareMoment } from "./MambaShareMoment";

interface MambaResultScreenProps {
  result: ScoreResult;
  name?: string;
  email?: string;
  gameTimeMs?: number;
  gameAttempts?: number;
  /** Play the reaction game again; the flow brings them straight back here. */
  onRetake: () => void;
}

/**
 * The #MambaCares report (Figma 775:17580, "Full Speed + Donation").
 *
 * The PHKL report's shape with a different argument at the end. Share and
 * retry in the top corners and the player's time and standing on the daylight
 * backdrop are the same screen, unchanged; below the fold it turns: what
 * dementia does to that speed, the Dementia Singapore campaign, the risk
 * report the quiz earned, a closing ask, and the crews and sponsors behind the
 * run. "Donate now" stays pinned to the bottom of the screen the whole way
 * down, where /phkl pins its booking button.
 *
 * There is no screening offer and no baseline card in this arc: the event is a
 * fundraiser, so the one thing asked for at the end is a donation.
 *
 * Two shares, doing different jobs, which is why there are two hooks here: the
 * header's passes on a picture of the player's own time (useShareCard), while
 * the campaign's passes on the fundraiser's link (useShareDonation).
 *
 * On /event-v7 a third appears: MambaShareMoment, which asks at the reveal
 * rather than waiting to be found, with a story-shaped card carrying both the
 * time and the campaign. That route is the experiment; /mambacares is
 * unchanged by it.
 */
export function MambaResultScreen({
  result,
  name,
  email,
  gameTimeMs,
  gameAttempts,
  onRetake,
}: MambaResultScreenProps) {
  const variant = useVariant();
  const source = eventSource(variant);
  const playUrl = playUrlFor(variant);
  const standing = useStanding(source, email, gameTimeMs);
  const { share, sharing, shareNote, qrHost } = useShareCard({
    name,
    timeMs: gameTimeMs,
    standing,
    playUrl,
  });
  const donationShare = useShareDonation();
  // /event-v7 only: the experiment is whether asking at the reveal beats
  // waiting for someone to find the share button.
  const shareMoment = variant === "event7";

  return (
    <Event3Shell scroll pills sparkles>
      {qrHost}

      <PhklResultHeader
        name={name}
        timeMs={gameTimeMs}
        attempts={gameAttempts}
        standing={standing}
        share={{ share, sharing, shareNote }}
        onRetry={onRetake}
      />

      <MambaScrollCue />

      {/* The report proper runs edge to edge on its sheet. */}
      <div className="-mx-4 mt-4 overflow-hidden rounded-t-[28px] shadow-[0_-18px_46px_-30px_rgba(90,40,10,0.35)]">
        <MambaProblem timeMs={gameTimeMs} />
        <MambaDonate timeMs={gameTimeMs} share={donationShare} />
        <PhklRiskSection result={result} name={name} gameTimeMs={gameTimeMs} />
        <MambaClosing share={donationShare} />
        <MambaPartners />
      </div>

      <MambaStickyCta share={donationShare} />

      {shareMoment && (
        <MambaShareMoment
          name={name}
          timeMs={gameTimeMs}
          rank={standing.rank}
          total={standing.total}
        />
      )}
    </Event3Shell>
  );
}
