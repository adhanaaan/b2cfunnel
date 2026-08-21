/**
 * Sound for the reaction game: a quiet synthesised music bed that tightens as
 * the player gets closer to 20, countdown blips, and the level-complete sting.
 *
 * Synthesised rather than streamed so there is nothing to download on booth
 * wifi and so the tempo can follow the score. Every knob an ear might want to
 * change is a constant at the top of this file. To use a real track instead,
 * point MUSIC_SRC at a file under /public: the bed is skipped and the file
 * loops in its place.
 *
 * Audio is never load-bearing. Every entry point swallows its errors, so a
 * blocked or missing AudioContext leaves the game playing in silence.
 */

/** Set to e.g. "/sounds/game-music.mp3" to loop a real track instead. */
const MUSIC_SRC: string | null = null;

// ---- Tuning ----
const MASTER_GAIN = 0.09; // the whole bed, deliberately under the sound effects
const PAD_GAIN = 0.34;
const ARP_GAIN = 0.5;
const STEP_MS_SLOW = 320; // one arpeggio step at the start of a run
const STEP_MS_FAST = 240; // ...and at 20 out of 20
const FADE_IN_S = 0.8;
const FADE_OUT_S = 0.4;
const HAT_FROM_PROGRESS = 0.5; // the ticking joins in halfway through

/** A minor pentatonic: no interval in it can sound wrong against the pad. */
const SCALE = [220, 261.63, 293.66, 329.63, 392, 440, 523.25];

/** Sparse 16-step figure; null is a rest. Indexes into SCALE. */
const PATTERN: (number | null)[] = [
  0, null, 2, 4, null, 3, 1, null, 0, null, 4, 5, null, 3, 2, null,
];

const PAD_HZ = [55, 82.41]; // A1 and its fifth
const LOOKAHEAD_MS = 100;
const SCHEDULE_AHEAD_S = 0.2;

const MUTE_KEY = "gms_muted";
const FINISH_SRC = "/sounds/level_completed_1.mp3";

// ---- Pure helpers (unit tested) ----

/** 0..1, and never NaN: a bad value here would schedule notes at NaN seconds. */
function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/** Step interval in ms for a 0..1 progress through the run. */
export function stepMsForProgress(progress: number): number {
  const p = clamp01(progress);
  return Math.round(STEP_MS_SLOW + (STEP_MS_FAST - STEP_MS_SLOW) * p);
}

/** The note for a step of the figure, or null on a rest. */
export function noteForStep(step: number): number | null {
  const len = PATTERN.length;
  const slot = PATTERN[((step % len) + len) % len];
  return slot === null ? null : SCALE[slot];
}

export const MUSIC_SCALE = SCALE;

// ---- Mute preference ----

let muted: boolean | null = null;

export function isMuted(): boolean {
  if (muted !== null) return muted;
  if (typeof window === "undefined") return false;
  try {
    muted = window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    muted = false; // Safari private mode
  }
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  try {
    window.localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  } catch {
    /* preference just won't persist */
  }
  if (value) stopMusic();
}

// ---- Engine ----

type Ctx = AudioContext & { __gmsWired?: boolean };

let ctx: Ctx | null = null;
let master: GainNode | null = null;
let arpInput: BiquadFilterNode | null = null;
let analyser: AnalyserNode | null = null;
let padOscs: OscillatorNode[] = [];
let noiseBuffer: AudioBuffer | null = null;
let schedulerId: number | null = null;
let stepIndex = 0;
let nextNoteAt = 0;
let stepMs = STEP_MS_SLOW;
let progress = 0;
let running = false;
let musicEl: HTMLAudioElement | null = null;

function getCtx(): Ctx | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    const c = new Ctor() as Ctx;
    const gain = c.createGain();
    gain.gain.value = 0;
    gain.connect(c.destination);

    const arp = c.createBiquadFilter();
    arp.type = "lowpass";
    arp.frequency.value = 1600;
    const arpGain = c.createGain();
    arpGain.gain.value = ARP_GAIN;
    arp.connect(arpGain).connect(gain);

    ctx = c;
    master = gain;
    // Notes connect into the filter; the gain after it is the arp's own level.
    arpInput = arp;

    if (!c.__gmsWired) {
      c.__gmsWired = true;
      document.addEventListener("visibilitychange", onVisibilityChange);
    }

    if (process.env.NODE_ENV !== "production") {
      analyser = c.createAnalyser();
      analyser.fftSize = 2048;
      gain.connect(analyser);
      (
        window as unknown as { __gameAudio?: unknown }
      ).__gameAudio = {
        state: () => ctx?.state ?? "none",
        rms: () => {
          if (!analyser) return 0;
          const buf = new Float32Array(analyser.fftSize);
          analyser.getFloatTimeDomainData(buf);
          let sum = 0;
          for (const v of buf) sum += v * v;
          return Math.sqrt(sum / buf.length);
        },
      };
    }
    return ctx;
  } catch {
    return null;
  }
}

function onVisibilityChange() {
  if (!ctx) return;
  try {
    if (document.hidden) void ctx.suspend();
    else if (running) void ctx.resume();
  } catch {
    /* ignore */
  }
}

/** Open the audio context from a real tap. iOS will not start one otherwise. */
export function unlockAudio(): void {
  if (isMuted()) return;
  try {
    const c = getCtx();
    if (c && c.state === "suspended") void c.resume();
  } catch {
    /* ignore */
  }
}

function getNoise(c: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const frames = Math.floor(c.sampleRate * 0.2);
  const buf = c.createBuffer(1, frames, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buf;
  return buf;
}

function scheduleNote(at: number, step: number) {
  if (!ctx || !arpInput || !master) return;
  const note = noteForStep(step);
  if (note != null) {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = note;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.linearRampToValueAtTime(1, at + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, at + 0.28);
    osc.connect(env).connect(arpInput);
    osc.start(at);
    osc.stop(at + 0.34);
  }
  // A soft tick joins the second half of the run: urgency without a key change.
  if (progress >= HAT_FROM_PROGRESS && step % 4 === 0) {
    const src = ctx.createBufferSource();
    src.buffer = getNoise(ctx);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 4000;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.linearRampToValueAtTime(0.06, at + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
    src.connect(hp).connect(env).connect(master);
    src.start(at);
    src.stop(at + 0.08);
  }
}

function runScheduler() {
  if (!ctx) return;
  while (nextNoteAt < ctx.currentTime + SCHEDULE_AHEAD_S) {
    scheduleNote(nextNoteAt, stepIndex);
    nextNoteAt += stepMs / 1000;
    stepIndex++;
  }
}

function startPad(c: AudioContext, out: GainNode) {
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 400;
  const padGain = c.createGain();
  padGain.gain.value = PAD_GAIN * 0.6;
  filter.connect(padGain).connect(out);

  // Slow breath on the pad so a held drone doesn't go dead.
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoDepth = c.createGain();
  lfoDepth.gain.value = PAD_GAIN * 0.4;
  lfo.connect(lfoDepth).connect(padGain.gain);
  lfo.start();
  padOscs.push(lfo);

  for (const hz of PAD_HZ) {
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = hz;
    osc.connect(filter);
    osc.start();
    padOscs.push(osc);
  }
}

export function startMusic(): void {
  if (isMuted() || running) return;

  if (MUSIC_SRC) {
    try {
      if (!musicEl) {
        musicEl = new Audio(MUSIC_SRC);
        musicEl.loop = true;
        musicEl.volume = 0.33;
      }
      musicEl.currentTime = 0;
      void musicEl.play().catch(() => {});
      running = true;
    } catch {
      /* ignore */
    }
    return;
  }

  const c = getCtx();
  if (!c || !master) return;
  try {
    if (c.state === "suspended") void c.resume();
    running = true;
    stepIndex = 0;
    stepMs = stepMsForProgress(0);
    progress = 0;
    nextNoteAt = c.currentTime + 0.08;
    startPad(c, master);
    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.setValueAtTime(0.0001, c.currentTime);
    master.gain.linearRampToValueAtTime(MASTER_GAIN, c.currentTime + FADE_IN_S);
    schedulerId = window.setInterval(runScheduler, LOOKAHEAD_MS);
    runScheduler();
  } catch {
    running = false;
  }
}

export function stopMusic(): void {
  running = false;
  if (musicEl) {
    try {
      musicEl.pause();
    } catch {
      /* ignore */
    }
  }
  if (schedulerId != null) {
    window.clearInterval(schedulerId);
    schedulerId = null;
  }
  if (!ctx || !master) return;
  try {
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0.0001, now + FADE_OUT_S);
    const oscs = padOscs;
    padOscs = [];
    for (const osc of oscs) {
      try {
        osc.stop(now + FADE_OUT_S + 0.05);
      } catch {
        /* already stopped */
      }
    }
  } catch {
    /* ignore */
  }
}

/** 0..1 through the run; tightens the figure and brings in the tick. */
export function setIntensity(next: number): void {
  progress = clamp01(next);
  stepMs = stepMsForProgress(progress);
}

/** Countdown blip. `final` is the brighter one on "GO!". */
export function tick(final = false): void {
  if (isMuted()) return;
  const c = getCtx();
  if (!c || !master) return;
  try {
    if (c.state === "suspended") void c.resume();
    const at = c.currentTime;
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = final ? 1320 : 880;
    const env = c.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.linearRampToValueAtTime(final ? 0.16 : 0.11, at + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, at + (final ? 0.22 : 0.07));
    osc.connect(env).connect(c.destination);
    osc.start(at);
    osc.stop(at + 0.3);
  } catch {
    /* ignore */
  }
}

/** The level-complete sting, over the top of the bed fading out. */
export function finish(): void {
  stopMusic();
  if (isMuted() || typeof window === "undefined") return;
  try {
    const sting = new Audio(FINISH_SRC);
    sting.volume = 0.6;
    void sting.play().catch(() => {});
  } catch {
    /* ignore */
  }
}
