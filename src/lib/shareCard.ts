import { formatTime } from "@/lib/format";
import type { TipCategory } from "@/config/tips";

/**
 * Client-side share cards for the event arcs: a 1080x1350 (4:5) result poster
 * and a matching brain-care tip poster, drawn on an offscreen canvas so
 * sharing works offline at the booth with zero new dependencies. The result
 * poster has two skins - the original ember night (event2) and the cream
 * daylight one matching the event3 screens.
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
  /**
   * Poster skin. "night" is the original ember-night card (event2); "daylight"
   * matches the event3 arc's cream "Daylight Ember" screens.
   */
  theme?: "night" | "daylight";
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

/** The event3 daylight backdrop: cream radial wash, yellow pills, sparkles. */
function paintDaylight(ctx: CanvasRenderingContext2D) {
  const base = ctx.createRadialGradient(0, 0, 0, 0, 0, W * 1.5);
  base.addColorStop(0, "#fae0c7");
  base.addColorStop(0.6, "#fcf0e5");
  base.addColorStop(1, "#fff7f2");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // The rotated pill lines, baked at the corners they occupy on screen.
  const pills: Array<[number, number, number, number, boolean]> = [
    [W - 120, -40, 420, 78, true],
    [W - 95, 70, 380, 56, false],
    [-230, 900, 420, 78, true],
    [-205, 1010, 380, 56, false],
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

  // Four-point sparkles, the flat cousins of the on-screen twinklers.
  const sparkles: Array<[number, number, number, number]> = [
    [70, 470, 30, 0.6],
    [1010, 300, 22, 0.5],
    [105, 1105, 26, 0.45],
    [975, 1180, 20, 0.5],
  ];
  for (const [x, y, s, a] of sparkles) {
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = "#f6c76d";
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(s * 0.18, -s * 0.18, s, 0);
    ctx.quadraticCurveTo(s * 0.18, s * 0.18, 0, s);
    ctx.quadraticCurveTo(-s * 0.18, s * 0.18, -s, 0);
    ctx.quadraticCurveTo(-s * 0.18, -s * 0.18, 0, -s);
    ctx.fill();
    ctx.restore();
  }
}

/** Logo mark plus the wordmark, centred as one row. */
function drawBrandRow(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  font: string,
  y: number,
) {
  const label = "GRAY MATTER SOLUTIONS";
  ctx.font = `700 24px ${font}`;
  ctx.letterSpacing = "4px";
  const textWidth = ctx.measureText(label).width;
  const h = 56;
  const w = logo ? (logo.width / logo.height) * h : 0;
  const gap = logo ? 18 : 0;
  const startX = (W - (w + gap + textWidth)) / 2;
  if (logo) {
    ctx.globalAlpha = 0.95;
    ctx.drawImage(logo, startX, y, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.textAlign = "left";
  ctx.fillStyle = "#7d5747";
  ctx.fillText(label, startX + w + gap, y + h / 2 + 9);
  ctx.letterSpacing = "0px";
  ctx.textAlign = "center";
}

/** Fit text to a max width by stepping the font size down. */
function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  weight: number,
  size: number,
  font: string,
  maxWidth: number,
) {
  let px = size;
  ctx.font = `${weight} ${px}px ${font}`;
  while (ctx.measureText(text).width > maxWidth && px > 24) {
    px -= 2;
    ctx.font = `${weight} ${px}px ${font}`;
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

  if (opts.theme === "daylight") {
    drawDaylightCard(ctx, opts, jakarta, logo);
    return toBlob(canvas);
  }

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

/**
 * The event3 daylight poster: same information as the night card, drawn in
 * the "Daylight Ember" vocabulary of the event3 screens (cream wash, yellow
 * pills, gradient hero number, white stat card, ember bridge block).
 */
function drawDaylightCard(
  ctx: CanvasRenderingContext2D,
  opts: ResultCardOpts,
  jakarta: string,
  logo: HTMLImageElement | null,
) {
  paintDaylight(ctx);
  ctx.textAlign = "center";

  drawBrandRow(ctx, logo, jakarta, 86);

  // Eyebrow.
  ctx.fillStyle = "#f16d39";
  ctx.font = `700 28px ${jakarta}`;
  ctx.letterSpacing = "7px";
  ctx.fillText("REACTION TIME CHALLENGE", W / 2, 262);
  ctx.letterSpacing = "0px";

  // Who scored, shrunk to fit a long nickname.
  const who = opts.name.trim() ? `${opts.name.trim()} scored` : "I scored";
  ctx.fillStyle = "#171717";
  fitFont(ctx, who, 700, 46, jakarta, W - 160);
  ctx.fillText(who, W / 2, 352);

  // The time, huge, in the ember gradient with a soft warm bloom.
  const time = ctx.createLinearGradient(0, 380, 0, 600);
  time.addColorStop(0, "#e8782e");
  time.addColorStop(0.55, "#f09452");
  time.addColorStop(1, "#ffbb88");
  ctx.save();
  ctx.shadowColor = "rgba(247,117,40,0.35)";
  ctx.shadowBlur = 70;
  ctx.fillStyle = time;
  ctx.font = `800 190px ${jakarta}`;
  ctx.fillText(formatTime(opts.timeMs), W / 2, 560);
  ctx.restore();

  // The underline bar from the on-screen result.
  const bar = ctx.createLinearGradient(W / 2 - 110, 0, W / 2 + 110, 0);
  bar.addColorStop(0, "#f77528");
  bar.addColorStop(1, "#ffc29e");
  ctx.fillStyle = bar;
  ctx.beginPath();
  ctx.roundRect(W / 2 - 110, 596, 220, 10, 5);
  ctx.fill();

  // Stat card: the player's rank.
  const cw = 520;
  const ch = 150;
  const cx = (W - cw) / 2;
  const cy = 660;
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.roundRect(cx, cy, cw, ch, 28);
  ctx.save();
  ctx.shadowColor = "rgba(51,18,0,0.10)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = "rgba(247,117,40,0.18)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#f16d39";
  ctx.font = `700 22px ${jakarta}`;
  ctx.letterSpacing = "3px";
  ctx.fillText("YOUR RANK", W / 2, cy + 56);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = "#171717";
  ctx.font = `800 52px ${jakarta}`;
  ctx.fillText(
    opts.rank && opts.total ? `#${opts.rank} / ${opts.total}` : "-",
    W / 2,
    cy + 114,
  );

  // Ember bridge block: the dare, the QR and the link.
  const bw = 880;
  const bx = (W - bw) / 2;
  const by = 850;
  const bh = 400;
  const ember = ctx.createLinearGradient(0, by, 0, by + bh);
  ember.addColorStop(0, "#e8782e");
  ember.addColorStop(0.5, "#f09452");
  ember.addColorStop(1, "#ffbb88");
  ctx.fillStyle = ember;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 36);
  ctx.save();
  ctx.shadowColor = "rgba(232,120,46,0.45)";
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 20;
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#fff4ec";
  ctx.font = `800 52px ${jakarta}`;
  ctx.fillText("Can you beat my score?", W / 2, by + 78);
  ctx.fillStyle = "rgba(255,244,236,0.92)";
  ctx.font = `600 30px ${jakarta}`;
  ctx.fillText("Try it for yourself here:", W / 2, by + 124);

  // Drawn at the QR canvas's own 190px so the modules stay pixel-crisp.
  drawQr(ctx, opts.qrCanvas, W / 2, by + 248, 190);

  ctx.fillStyle = "#a98d80";
  ctx.font = `500 24px ${jakarta}`;
  ctx.fillText(
    "Reaction-time games are fun, but not a cognitive assessment.",
    W / 2,
    1312,
  );
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
