/**
 * The question bank in Bahasa Indonesia, for the Siloam Neuroscience Summit.
 *
 * WORDS ONLY. This file carries no ids, no axes, no `showIf` and - above all -
 * no scores: `questionsFor()` reads the English bank in config/questions.ts and
 * replaces the prompts and labels it finds a translation for, leaving every
 * number and every branch exactly as written there. That is what keeps an
 * Indonesian score on the same /100 scale as every score already recorded, and
 * it is pinned by tests/config/siloamLanguage.test.ts.
 *
 * Anything missing here falls back to the English wording rather than to a
 * blank, so a question added to the bank is readable on the summit's phones
 * the day it ships, and translating it later changes nothing else.
 *
 * Only the questions the summit's arc actually asks are translated (the /phkl
 * question set: age, sex, the three health-history questions, the five
 * lifestyle ones, tracks, and the four symptom ones). The rest belong to
 * funnels that are never served in Indonesian.
 */

/** A question's words: its prompt, its help text, and a label per option id. */
export interface QuestionText {
  prompt?: string;
  helpText?: string;
  /** Option label by option id. Ids are the English bank's, untranslated. */
  options?: Record<string, string>;
}

/** The shared frequency scale behind concentrating / judgement / forgetfulness. */
const FREQUENCY: Record<string, string> = {
  almostDaily: "Hampir setiap hari",
  severalWeek: "Beberapa kali seminggu",
  rarely: "Jarang",
  notNotice: "Tidak saya rasakan",
};

/** Yes / no / not sure, as three of the health-history questions ask it. */
const YES_NO_UNSURE: Record<string, string> = {
  yes: "Ya",
  no: "Tidak",
  unsure: "Tidak yakin",
};

export const QUESTIONS_ID: Record<string, QuestionText> = {
  age: {
    prompt: "Berapa usia Anda?",
    options: {
      "18-29": "18 hingga 29",
      "30-39": "30 hingga 39",
      "40-49": "40 hingga 49",
      "50-59": "50 hingga 59",
      "60+": "60 tahun ke atas",
    },
  },
  sex: {
    prompt: "Apa jenis kelamin Anda saat lahir?",
    options: { female: "Perempuan", male: "Laki-laki" },
  },
  hotFlushes: {
    prompt:
      "Apakah Anda merasakan hot flush, keringat malam, atau perubahan siklus haid?",
    options: { yes: "Ya", no: "Tidak" },
  },
  menopauseSymptoms: {
    prompt:
      "Apakah perubahan hormon memengaruhi tidur, suasana hati, atau kabut otak Anda?",
    options: {
      often: "Sering",
      sometimes: "Kadang-kadang",
      notReally: "Tidak juga",
      notSure: "Tidak yakin",
    },
  },
  familyHistory: {
    prompt: "Apakah ada riwayat demensia atau Alzheimer dalam keluarga Anda?",
    options: {
      immediate: "Ya, keluarga inti (orang tua atau saudara kandung)",
      extended: "Ya, keluarga besar (kakek-nenek, paman, dan bibi)",
      none: "Tidak",
      unsure: "Saya tidak yakin",
    },
  },
  highBp: { prompt: "Tekanan darah tinggi?", options: YES_NO_UNSURE },
  highCholesterol: { prompt: "Kolesterol tinggi?", options: YES_NO_UNSURE },
  diabetes: { prompt: "Diabetes atau pradiabetes?", options: YES_NO_UNSURE },
  hearingLoss: {
    prompt: "Gangguan pendengaran yang tidak ditangani?",
    helpText: "Tanpa alat bantu dengar atau bantuan lainnya.",
    options: YES_NO_UNSURE,
  },
  visionLoss: {
    prompt: "Gangguan penglihatan yang tidak ditangani?",
    helpText: "Tidak dikoreksi dengan kacamata, lensa, atau operasi.",
    options: YES_NO_UNSURE,
  },
  smoking: {
    prompt:
      "Apakah Anda perokok aktif, atau merokok dalam 10 tahun terakhir?",
    options: {
      current: "Saya merokok saat ini",
      past: "Saya merokok dalam 10 tahun terakhir",
      never: "Tidak pernah, atau lebih dari 10 tahun lalu",
    },
  },
  sleep: {
    prompt: "Rata-rata, berapa lama Anda tidur di malam hari?",
    options: {
      lt6: "Kurang dari 6 jam",
      "6to7": "6 hingga 7 jam",
      "7to9": "7 hingga 9 jam",
      gt9: "Lebih dari 9 jam",
    },
  },
  exercise: {
    prompt: "Berapa banyak olahraga kardio yang Anda lakukan per minggu?",
    options: {
      lt75: "Kurang dari 75 menit",
      "75to149": "75 hingga 149 menit",
      "150to300": "150 hingga 300 menit",
      gt300: "Lebih dari 300 menit",
    },
  },
  diet: {
    prompt: "Bagaimana Anda menggambarkan pola makan Anda?",
    options: {
      poor: "Sebagian besar olahan atau tinggi gula",
      moderate: "Campuran makanan segar dan olahan",
      healthy: "Sebagian besar segar dan seimbang",
    },
  },
  alcohol: {
    prompt: "Berapa gelas minuman beralkohol yang Anda minum per minggu?",
    helpText:
      "1 gelas kira-kira setara 1 gelas kecil anggur, setengah pint bir, atau 1 sloki minuman keras.",
    options: {
      none: "Tidak ada",
      "1to7": "1 hingga 7",
      "8to14": "8 hingga 14",
      "15to21": "15 hingga 21",
      gt21: "Lebih dari 21",
    },
  },
  tracks: {
    prompt: "Apa yang saat ini Anda pantau?",
    helpText: "Pilih semua yang sesuai.",
    options: {
      performance: "Produktivitas, fokus, atau performa kerja",
      biometrics: "Tidur, HRV, kekuatan, atau suplemen",
      hormones: "Hormon, siklus haid, atau gejala menopause",
      family: "Kesehatan anggota keluarga (saya merawat seseorang)",
      nothing: "Tidak ada yang khusus",
    },
  },
  concentrating: {
    prompt:
      "Seberapa sering Anda sulit berkonsentrasi saat rapat atau mengerjakan tugas yang panjang?",
    options: FREQUENCY,
  },
  judgement: {
    prompt:
      "Dibandingkan beberapa tahun lalu, seberapa sering Anda mengalami kesulitan dalam menilai situasi atau mengambil keputusan?",
    options: FREQUENCY,
  },
  forgetfulness: {
    prompt:
      "Seberapa sering Anda lupa, misalnya di mana Anda menaruh sesuatu atau apa yang hendak Anda lakukan?",
    options: FREQUENCY,
  },
  persistence: {
    prompt: "Apakah lupa ini terus berlanjut, bukan sekadar sesekali?",
    options: {
      yes: "Ya, terus berlanjut",
      no: "Tidak, datang dan pergi",
    },
  },
  someoneElseNoticed: {
    prompt:
      "Apakah orang lain memperhatikan perubahan pada perilaku atau kebiasaan Anda?",
    options: { yes: "Ya", no: "Tidak" },
  },
};
