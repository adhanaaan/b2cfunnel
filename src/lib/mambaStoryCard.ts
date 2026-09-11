import {
  CARD_W,
  drawLogo,
  drawQr,
  fitFont,
  fontFamily,
  loadImage,
  toBlob,
  wrapText,
} from "@/lib/shareCard";
import { formatTime } from "@/lib/format";
import {
  MAMBACARES_CAMPAIGN,
  MAMBACARES_DONATION_LABEL,
  campaignAmount,
} from "@/config/mambacares";

/**
 * The #MambaCares story card: 1080x1920 for an Instagram story, where the
 * report's other card is 1080x1350 for a feed post.
 *
 * Two differences beyond the shape, both deliberate. It carries the campaign
 * as well as the time - a card from a fundraiser that only flexes a score does
 * nothing for the fundraiser - and it keeps every word inside the story safe
 * area, because Instagram lays its own UI over the top and bottom of the frame
 * and anything under that is simply not read.
 */

const W = CARD_W;
const H = 1920;

/**
 * Instagram covers roughly the top and bottom 250px of a 1920-tall story with
 * its own chrome. Nothing that has to be read goes outside these.
 */
const SAFE_TOP = 260;
const SAFE_BOTTOM = H - 260;

const INK = "#2d2d2d";
const INK_SOFT = "#7d5747";
const EMBER = "#e35d0e";

/** The daylight backdrop, spread for the taller story frame. */
function paintStory(ctx: CanvasRenderingContext2D) {
  const base = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.3, H);
  base.addColorStop(0, "#fae0c7");
  base.addColorStop(0.55, "#fcf0e5");
  base.addColorStop(1, "#fff7f2");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // The rotated pill lines, at the corners of the taller frame.
  const pills: Array<[number, number, number, number, boolean]> = [
    [W - 120, -40, 420, 78, true],
    [W - 95, 70, 380, 56, false],
    [-230, H - 520, 420, 78, true],
    [-205, H - 410, 380, 56, false],
  ];
  for (const [x, y, w, h, solid] of pills) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((24 * Math.PI) / 180);
    if (solid) {
      ctx.fillStyle = "#fde68a";
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "rgba(255,255,112,0.30)");
      g.addColorStop(1, "rgba(245,158,10,0.10)");
      ctx.fillStyle = g;
    }
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, h / 2);
    ctx.fill();
    ctx.restore();
  }
}

/** The campaign thermometer, drawn as a rounded track with a filled bar. */
function drawProgress(ctx: CanvasRenderingContext2D, y: number) {
  const { raised, goal } = MAMBACARES_CAMPAIGN;
  const pct = goal > 0 ? Math.max(0, Math.min(1, raised / goal)) : 0;
  const x = 140;
  const w = W - x * 2;
  const h = 26;

  ctx.fillStyle = "#f3ddd2";
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  ctx.fill();

  if (pct > 0) {
    const g = ctx.createLinearGradient(x, 0, x + w, 0);
    g.addColorStop(0, "#f77528");
    g.addColorStop(1, "#ff9a4d");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(x, y, Math.max(h, w * pct), h, h / 2);
    ctx.fill();
  }
  return pct;
}

export interface MambaStoryCardOpts {
  name?: string;
  timeMs: number;
  rank?: number;
  total?: number;
  /**
   * Rendered QR canvas (a hidden QRCodeCanvas) stamped onto the card. It must
   * encode the donation link: the card is printed with MAMBACARES_DONATION_LABEL
   * underneath it, and a QR that went anywhere else would contradict the words.
   */
  qrCanvas?: HTMLCanvasElement | null;
}

export async function generateMambaStoryCard(
  opts: MambaStoryCardOpts,
): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  try {
    await document.fonts.ready;
  } catch {
    /* draw with whatever is loaded */
  }

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const jakarta = fontFamily("--font-jakarta", "system-ui, sans-serif");
  const logo = await loadImage("/gms-logo.png");

  paintStory(ctx);
  ctx.textAlign = "center";

  // --- Brand, inside the safe area ---
  drawLogo(ctx, logo, false, SAFE_TOP);

  let y = SAFE_TOP + 150;
  ctx.fillStyle = EMBER;
  ctx.font = `800 34px ${jakarta}`;
  ctx.fillText("GMS x #MAMBACARES", W / 2, y);

  // --- The result ---
  y += 110;
  ctx.fillStyle = INK;
  ctx.font = `700 56px ${jakarta}`;
  ctx.fillText("My brain processing speed", W / 2, y);

  y += 200;
  const time = formatTime(opts.timeMs);
  fitFont(ctx, time, 800, 240, jakarta, W - 200);
  const g = ctx.createLinearGradient(W * 0.2, y - 160, W * 0.8, y);
  g.addColorStop(0, "#f77528");
  g.addColorStop(1, "#ff9a4d");
  ctx.fillStyle = g;
  ctx.fillText(time, W / 2, y);

  if (opts.rank && opts.total) {
    y += 90;
    ctx.fillStyle = INK_SOFT;
    ctx.font = `700 44px ${jakarta}`;
    ctx.fillText(`Rank ${opts.rank} of ${opts.total}`, W / 2, y);
  }

  // --- The campaign: the reason the card exists ---
  y += 170;
  ctx.fillStyle = INK;
  ctx.font = `700 46px ${jakarta}`;
  for (const line of wrapText(
    ctx,
    "Tested at the World Alzheimer's Month run, in aid of Dementia Singapore.",
    W - 220,
  )) {
    ctx.fillText(line, W / 2, y);
    y += 62;
  }

  y += 40;
  const pct = drawProgress(ctx, y);
  y += 90;
  ctx.fillStyle = INK_SOFT;
  ctx.font = `800 42px ${jakarta}`;
  ctx.fillText(
    `${campaignAmount(MAMBACARES_CAMPAIGN.raised)} of ${campaignAmount(
      MAMBACARES_CAMPAIGN.goal,
    )} raised`,
    W / 2,
    y,
  );
  void pct;

  // --- The ask, anchored above the bottom safe line ---
  const qrSize = 240;
  const qrCy = SAFE_BOTTOM - qrSize / 2 - 110;
  const hasQr = drawQr(ctx, opts.qrCanvas, W / 2, qrCy, qrSize);

  ctx.fillStyle = EMBER;
  ctx.font = `800 46px ${jakarta}`;
  ctx.fillText(
    hasQr ? MAMBACARES_DONATION_LABEL : `Donate: ${MAMBACARES_DONATION_LABEL}`,
    W / 2,
    SAFE_BOTTOM - 30,
  );

  return toBlob(canvas);
}
