/**
 * The three "do this now" actions on the event2 report.
 *
 * A rules table, not a generator: each modifiable risk factor the engine
 * surfaced maps to one concrete action, so the card reads as though it was
 * written for the person in front of it. Wording stays on the
 * wellness/educational side of the HSA line (see compliance.ts) and is swept by
 * tests/config/compliance.test.ts.
 */

import type { BandName } from "@/types/engine";
import type { Language } from "@/config/language";

/** One action per modifiable factor. Non-modifiable ids are absent by design:
 *  age and family history have no action, so they fall through to the defaults. */
export const ACTIONS_BY_FACTOR: Record<string, string> = {
  sleep:
    "Aim for 7 to 9 hours of sleep. Memory consolidates overnight, and short nights show up first as poor focus.",
  exercise:
    "Build up to 150 minutes of brisk movement a week. Regular aerobic exercise is one of the best supported habits for brain health.",
  diet: "Add one Mediterranean style meal a day: vegetables, fish, olive oil, wholegrains.",
  alcohol: "Keep alcohol light, and give yourself a few dry days each week.",
  smoking:
    "Stopping smoking is the biggest single change available to you here. Ask us about support at the booth.",
  highBp:
    "Get your blood pressure checked and treated. Blood pressure in midlife shapes brain health decades later.",
  highCholesterol:
    "Ask your doctor about your cholesterol numbers and which target suits you.",
  diabetes:
    "Keep your blood sugar in range with your doctor. Steady glucose protects the small blood vessels in your brain.",
  hearingLoss:
    "Book a hearing test. Untreated hearing loss is one of the largest changeable risk factors in the 2024 Lancet report.",
  visionLoss: "Get your eyes checked, and keep your prescription current.",
};

/** Reaction-time lines, keyed off how the rest of the profile looks. */
export const SPEED_ACTIONS = {
  strong:
    "Keep doing what you are doing. Your reaction speed is strong, so protect it with consistent sleep and regular exercise.",
  build:
    "Your reaction speed is a snapshot, not a verdict. Sleep and regular movement are what shift it over time.",
} as const;

/** Filler for anyone whose answers surfaced fewer than three factors. */
export const DEFAULT_ACTIONS: string[] = [
  "Challenge your brain daily. Take a new route to work, learn a new skill, or switch up your routine.",
  "Stay social. Regular conversation is one of the strongest habits linked with staying sharp.",
  "Book a health screening if it has been more than a year. Knowing your numbers is the start of changing them.",
];

/**
 * The same three tables in Bahasa Indonesia, for the Siloam Neuroscience
 * Summit. Keyed by the SAME factor ids, so which action a player is given is
 * decided by `pickActions` exactly as it is in English - only the words
 * change. A factor missing here falls back to the English line rather than to
 * a blank row on the report.
 */
const ACTIONS_BY_FACTOR_ID: Record<string, string> = {
  sleep:
    "Usahakan tidur 7 hingga 9 jam. Memori dikonsolidasikan saat tidur, dan kurang tidur paling cepat terlihat sebagai fokus yang buruk.",
  exercise:
    "Tingkatkan hingga 150 menit gerak cepat per minggu. Olahraga aerobik teratur adalah salah satu kebiasaan dengan bukti terkuat untuk kesehatan otak.",
  diet: "Tambahkan satu hidangan bergaya Mediterania setiap hari: sayuran, ikan, minyak zaitun, biji-bijian utuh.",
  alcohol:
    "Batasi alkohol, dan beri diri Anda beberapa hari bebas alkohol setiap minggu.",
  smoking:
    "Berhenti merokok adalah perubahan tunggal terbesar yang tersedia bagi Anda di sini. Tanyakan kepada kami di booth soal dukungannya.",
  highBp:
    "Periksakan dan tangani tekanan darah Anda. Tekanan darah pada usia paruh baya membentuk kesehatan otak puluhan tahun kemudian.",
  highCholesterol:
    "Tanyakan kepada dokter Anda tentang angka kolesterol Anda dan target mana yang sesuai.",
  diabetes:
    "Jaga gula darah Anda tetap dalam rentang bersama dokter. Glukosa yang stabil melindungi pembuluh darah kecil di otak Anda.",
  hearingLoss:
    "Lakukan tes pendengaran. Gangguan pendengaran yang tidak ditangani adalah salah satu faktor risiko terbesar yang dapat diubah dalam laporan Lancet 2024.",
  visionLoss:
    "Periksakan mata Anda, dan pastikan resep kacamata Anda selalu terbaru.",
};

const SPEED_ACTIONS_ID = {
  strong:
    "Pertahankan apa yang Anda lakukan sekarang. Kecepatan reaksi Anda baik, jadi jagalah dengan tidur yang konsisten dan olahraga teratur.",
  build:
    "Kecepatan reaksi Anda adalah potret sesaat, bukan vonis. Tidur dan gerak teratur yang mengubahnya seiring waktu.",
} as const;

const DEFAULT_ACTIONS_ID: string[] = [
  "Tantang otak Anda setiap hari. Ambil rute baru ke tempat kerja, pelajari keterampilan baru, atau ubah rutinitas Anda.",
  "Tetap bersosialisasi. Percakapan rutin adalah salah satu kebiasaan dengan kaitan terkuat dengan ketajaman berpikir.",
  "Lakukan pemeriksaan kesehatan jika sudah lebih dari setahun. Mengetahui angka Anda adalah awal dari mengubahnya.",
];

/** Every language's tables, picked by `pickActions`. */
const ACTION_TABLES: Record<
  Language,
  {
    byFactor: Record<string, string>;
    speed: { strong: string; build: string };
    defaults: string[];
  }
> = {
  en: {
    byFactor: ACTIONS_BY_FACTOR,
    speed: SPEED_ACTIONS,
    defaults: DEFAULT_ACTIONS,
  },
  id: {
    byFactor: ACTIONS_BY_FACTOR_ID,
    speed: SPEED_ACTIONS_ID,
    defaults: DEFAULT_ACTIONS_ID,
  },
};

export interface PickActionsInput {
  /** Impact-sorted, straight from the engine. */
  drivingFactors: { id: string }[];
  band: BandName;
  /** Reaction game result, when they played one. */
  gameTimeMs?: number;
  /** Which language's wording to hand back. Defaults to English. */
  language?: Language;
}

/**
 * Exactly three actions: the reaction-time line first when they played, then
 * their heaviest modifiable factors in the engine's order, then defaults.
 *
 * `language` only changes the words. The factors, their order and the number
 * picked are the same in every language, so two players with the same answers
 * are told the same three things.
 */
export function pickActions({
  drivingFactors,
  band,
  gameTimeMs,
  language = "en",
}: PickActionsInput): string[] {
  const table = ACTION_TABLES[language] ?? ACTION_TABLES.en;
  const picked: string[] = [];
  const add = (text: string | undefined) => {
    if (!text || picked.length >= 3 || picked.includes(text)) return;
    picked.push(text);
  };

  if (gameTimeMs != null) {
    add(band === "low" ? table.speed.strong : table.speed.build);
  }
  for (const factor of drivingFactors) {
    add(table.byFactor[factor.id] ?? ACTIONS_BY_FACTOR[factor.id]);
  }
  for (const [i, fallback] of table.defaults.entries()) {
    add(fallback ?? DEFAULT_ACTIONS[i]);
  }

  return picked;
}
