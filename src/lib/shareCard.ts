import { formatTime } from "@/lib/format";
import type { TipCategory } from "@/config/tips";

/**
 * Client-side share cards for event2: a 1080x1350 (4:5) result poster and a
 * matching brain-care tip poster, drawn on an offscreen canvas so sharing
 * works offline at the booth with zero new dependencies.
 *
 * Sharing ladder: navigator.share with the image file, else download plus a
 * clipboard caption, else text-only share, else clipboard. Callers should
 * pre-generate the blob before the tap so the iOS user-gesture isn't lost to
 * async work.
 */

const W = 1080;
const H = 1350;

export interface ResultCardOpts {
  name: string;
  timeMs: number;
  rank?: number;
  total?: number;
  url: string;
  /** Rendered QR canvas (e.g. a hidden QRCodeCanvas) to stamp onto the card. */
  qrCanvas?: HTMLCanvasElement | null;
}

/** Resolve a next/font CSS variable to a concrete canvas font family. */
function fontFamily(varName: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return v || fallback;
}

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** The shared ember-night poster backdrop. */
function paintNight(ctx: CanvasRenderingContext2D) {
  const base = ctx.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, "#120c0a");
  base.addColorStop(0.55, "#1a1210");
  base.addColorStop(1, "#2a1006");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  const horizon = ctx.createRadialGradient(W / 2, H * 1.1, 0, W / 2, H * 1.1, H * 0.9);
  horizon.addColorStop(0, "rgba(247,117,40,0.35)");
  horizon.addColorStop(1, "rgba(247,117,40,0)");
  ctx.fillStyle = horizon;
  ctx.fillRect(0, 0, W, H);

  // Baked ember dots.
  const dots: Array<[number, number, number, number]> = [
    [120, 980, 5, 0.5], [260, 640, 4, 0.35], [420, 1120, 6, 0.6],
    [700, 540, 4, 0.4], [860, 900, 5, 0.55], [980, 1180, 4, 0.45],
    [180, 380, 3, 0.3], [920, 320, 3, 0.35],
  ];
  for (const [x, y, r, a] of dots) {
    ctx.fillStyle = `rgba(255,154,77,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLogo(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  invert: boolean,
  y: number,
) {
  if (!logo) return;
  const h = 72;
  const w = (logo.width / logo.height) * h;
  try {
    if (invert) ctx.filter = "brightness(0) invert(1)";
    ctx.globalAlpha = 0.92;
    ctx.drawImage(logo, (W - w) / 2, y, w, h);
  } finally {
    ctx.filter = "none";
    ctx.globalAlpha = 1;
  }
}

function drawQr(
  ctx: CanvasRenderingContext2D,
  qr: HTMLCanvasElement | null | undefined,
  cx: number,
  cy: number,
  size: number,
) {
  if (!qr) return false;
  const pad = 18;
  ctx.fillStyle = "#ffffff";
  const x = cx - size / 2;
  const y = cy - size / 2;
  const r = 20;
  ctx.beginPath();
  ctx.roundRect(x - pad, y - pad, size + pad * 2, size + pad * 2, r);
  ctx.fill();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(qr, x, y, size, size);
  ctx.imageSmoothingEnabled = true;
  return true;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const probe = line ? `${line} ${word}` : word;
    if (ctx.measureText(probe).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = probe;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

/** The night result poster: time, rank, provocation, QR. */
export async function generateResultCard(
  opts: ResultCardOpts,
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
  const cormorant = fontFamily("--font-cormorant", "Georgia, serif");
  const logo = await loadImage("/gms-logo.png");

  paintNight(ctx);
  drawLogo(ctx, logo, true, 88);

  ctx.textAlign = "center";

  // Eyebrow.
  ctx.fillStyle = "#f77528";
  ctx.font = `700 30px ${jakarta}`;
  const eyebrow = "R E A C T I O N   T I M E   C H A L L E N G E";
  ctx.fillText(eyebrow, W / 2, 280);

  // Name line, serif.
  ctx.fillStyle = "#fff4ec";
  ctx.font = `600 64px ${cormorant}`;
  const who = opts.name.trim() ? `${opts.name.trim()} clocked` : "I clocked";
  ctx.fillText(who, W / 2, 380);

  // The time, huge, with a baked glow.
  ctx.save();
  ctx.shadowColor = "rgba(247,117,40,0.55)";
  ctx.shadowBlur = 60;
  ctx.fillStyle = "#ff9a4d";
  ctx.font = `800 216px ${jakarta}`;
  ctx.fillText(formatTime(opts.timeMs), W / 2, 610);
  ctx.restore();

  // Rank pill.
  const rankText =
    opts.rank && opts.total
      ? `RANK #${opts.rank} OF ${opts.total} · 20 SYMBOLS`
      : "20 SYMBOLS, AGAINST THE CLOCK";
  ctx.fillStyle = "#d8b9a6";
  ctx.font = `700 34px ${jakarta}`;
  ctx.fillText(rankText, W / 2, 700);

  // Provocation, serif italic.
  ctx.fillStyle = "#fff4ec";
  ctx.font = `italic 600 56px ${cormorant}`;
  const lines = wrapText(
    ctx,
    "Fast reflexes. But how do you score on your overall brain health?",
    W - 220,
  );
  lines.forEach((line, i) => ctx.fillText(line, W / 2, 850 + i * 68));

  // QR + play link.
  const hasQr = drawQr(ctx, opts.qrCanvas, W / 2, 1120, 190);
  ctx.fillStyle = "#d8b9a6";
  ctx.font = `700 32px ${jakarta}`;
  ctx.fillText(
    opts.url.replace(/^https?:\/\//, ""),
    W / 2,
    hasQr ? 1268 : 1120,
  );
  ctx.fillStyle = "#a8877a";
  ctx.font = `500 24px ${jakarta}`;
  ctx.fillText(
    "Reaction-time games are fun, but not a cognitive assessment.",
    W / 2,
    1312,
  );

  return toBlob(canvas);
}

/** The cream brain-care tip poster revealed by the pick-a-card flip. */
export async function generateTipCard(
  tip: TipCategory,
  url: string,
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
  const cormorant = fontFamily("--font-cormorant", "Georgia, serif");
  const logo = await loadImage("/gms-logo.png");

  // Cream poster with a ruled ember border.
  ctx.fillStyle = "#fff4ec";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#7a2e0c";
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, W - 96, H - 96);

  ctx.textAlign = "center";

  ctx.fillStyle = "#f77528";
  ctx.font = `700 30px ${jakarta}`;
  ctx.fillText(tip.eyebrow.toUpperCase(), W / 2, 190);

  ctx.fillStyle = "#2a1006";
  ctx.font = `600 76px ${cormorant}`;
  const headLines = wrapText(ctx, tip.headline, W - 260);
  headLines.forEach((line, i) => ctx.fillText(line, W / 2, 300 + i * 88));

  // Tips, left-aligned with ember dots.
  ctx.textAlign = "left";
  ctx.fillStyle = "#2d2d2d";
  let y = 340 + headLines.length * 88 + 60;
  for (const t of tip.tips) {
    ctx.fillStyle = "#f77528";
    ctx.beginPath();
    ctx.arc(160, y - 12, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2d2d2d";
    ctx.font = `500 36px ${jakarta}`;
    const lines = wrapText(ctx, t, W - 360);
    lines.forEach((line, i) => ctx.fillText(line, 200, y + i * 48));
    y += lines.length * 48 + 44;
  }

  ctx.textAlign = "center";
  drawLogo(ctx, logo, false, H - 240);
  ctx.fillStyle = "#7a2e0c";
  ctx.font = `700 30px ${jakarta}`;
  ctx.fillText(url.replace(/^https?:\/\//, ""), W / 2, H - 110);

  return toBlob(canvas);
}

export type ShareOutcome = "shared" | "downloaded" | "copied" | "failed";

/**
 * Share an image blob with a caption, degrading gracefully:
 * file share -> download + caption to clipboard -> text share -> clipboard.
 */
export async function shareBlob(
  blob: Blob | null,
  text: string,
  url: string,
  filename: string,
): Promise<ShareOutcome> {
  const caption = `${text}\n${url}`;

  if (blob) {
    const file = new File([blob], filename, { type: "image/png" });
    if (
      typeof navigator !== "undefined" &&
      navigator.canShare?.({ files: [file] })
    ) {
      try {
        await navigator.share({ files: [file], text, url });
        return "shared";
      } catch {
        /* user cancelled or share failed; fall through */
      }
    }
  }

  if (blob) {
    try {
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
      try {
        await navigator.clipboard?.writeText(caption);
      } catch {
        /* download alone is fine */
      }
      return "downloaded";
    } catch {
      /* fall through */
    }
  }

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ text, url });
      return "shared";
    } catch {
      /* fall through */
    }
  }

  try {
    await navigator.clipboard?.writeText(caption);
    return "copied";
  } catch {
    return "failed";
  }
}
