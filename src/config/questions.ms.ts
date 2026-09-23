import type { QuestionText } from "@/config/questions.id";

/**
 * The question bank in Bahasa Melayu, for /phkl-2.
 *
 * WORDS ONLY, like config/questions.id.ts: no ids, no axes, no `showIf` and no
 * scores. `questionsFor()` reads the English bank and replaces only the prompts
 * and labels it finds here, so a Malay score sits on the same /100 scale as
 * every other. Anything missing falls back to English.
 *
 * Only the questions /phkl-2's arc asks are translated (the /phkl set).
 */

/** The shared frequency scale behind concentrating / judgement / forgetfulness. */
const FREQUENCY: Record<string, string> = {
  almostDaily: "Hampir setiap hari",
  severalWeek: "Beberapa kali seminggu",
  rarely: "Jarang",
  notNotice: "Tidak saya perasan",
};

/** Yes / no / not sure, as the health-history questions ask it. */
const YES_NO_UNSURE: Record<string, string> = {
  yes: "Ya",
  no: "Tidak",
  unsure: "Tidak pasti",
};

export const QUESTIONS_MS: Record<string, QuestionText> = {
  age: {
    prompt: "Berapakah umur anda?",
    options: {
      "18-29": "18 hingga 29",
      "30-39": "30 hingga 39",
      "40-49": "40 hingga 49",
      "50-59": "50 hingga 59",
      "60+": "60 tahun ke atas",
    },
  },
  sex: {
    prompt: "Apakah jantina anda semasa lahir?",
    options: { female: "Perempuan", male: "Lelaki" },
  },
  hotFlushes: {
    prompt:
      "Adakah anda mengalami rasa panas badan (hot flush), berpeluh pada waktu malam atau perubahan kitaran haid?",
    options: { yes: "Ya", no: "Tidak" },
  },
  menopauseSymptoms: {
    prompt:
      "Adakah perubahan hormon menjejaskan tidur, emosi atau menyebabkan kabut otak?",
    options: {
      often: "Kerap",
      sometimes: "Kadang-kadang",
      notReally: "Tidak sangat",
      notSure: "Tidak pasti",
    },
  },
  familyHistory: {
    prompt: "Adakah terdapat sejarah demensia atau Alzheimer dalam keluarga anda?",
    options: {
      immediate: "Ya, keluarga terdekat (ibu bapa atau adik-beradik)",
      extended: "Ya, saudara-mara (datuk nenek, bapa saudara dan ibu saudara)",
      none: "Tidak",
      unsure: "Saya tidak pasti",
    },
  },
  highBp: { prompt: "Tekanan darah tinggi?", options: YES_NO_UNSURE },
  highCholesterol: { prompt: "Kolesterol tinggi?", options: YES_NO_UNSURE },
  diabetes: { prompt: "Diabetes atau pradiabetes?", options: YES_NO_UNSURE },
  hearingLoss: {
    prompt: "Masalah pendengaran yang tidak dirawat?",
    helpText: "Tanpa alat bantu pendengaran atau sokongan lain.",
    options: YES_NO_UNSURE,
  },
  visionLoss: {
    prompt: "Masalah penglihatan yang tidak dirawat?",
    helpText: "Tidak dibetulkan dengan cermin mata, kanta atau pembedahan.",
    options: YES_NO_UNSURE,
  },
  smoking: {
    prompt:
      "Adakah anda merokok sekarang, atau pernah merokok dalam tempoh 10 tahun lalu?",
    options: {
      current: "Saya merokok sekarang",
      past: "Saya merokok dalam tempoh 10 tahun lalu",
      never: "Tidak pernah, atau lebih 10 tahun lalu",
    },
  },
  sleep: {
    prompt: "Secara purata, berapa lama anda tidur pada waktu malam?",
    options: {
      lt6: "Kurang daripada 6 jam",
      "6to7": "6 hingga 7 jam",
      "7to9": "7 hingga 9 jam",
      gt9: "Lebih daripada 9 jam",
    },
  },
  exercise: {
    prompt: "Berapa banyak senaman kardio yang anda lakukan setiap minggu?",
    options: {
      lt75: "Kurang daripada 75 minit",
      "75to149": "75 hingga 149 minit",
      "150to300": "150 hingga 300 minit",
      gt300: "Lebih daripada 300 minit",
    },
  },
  diet: {
    prompt: "Bagaimanakah anda menggambarkan pemakanan anda?",
    options: {
      poor: "Kebanyakannya makanan diproses atau tinggi gula",
      moderate: "Campuran makanan segar dan diproses",
      healthy: "Kebanyakannya hidangan segar dan seimbang",
    },
  },
  alcohol: {
    prompt: "Berapa banyak minuman beralkohol yang anda minum setiap minggu?",
    helpText:
      "1 minuman lebih kurang 1 gelas kecil wain, setengah pain bir atau 1 sloki minuman keras.",
    options: {
      none: "Tiada",
      "1to7": "1 hingga 7",
      "8to14": "8 hingga 14",
      "15to21": "15 hingga 21",
      gt21: "Lebih daripada 21",
    },
  },
  tracks: {
    prompt: "Apakah yang anda pantau sekarang?",
    helpText: "Pilih semua yang berkenaan.",
    options: {
      performance: "Produktiviti, fokus atau prestasi kerja",
      biometrics: "Tidur, HRV, kekuatan atau suplemen",
      hormones: "Hormon, kitaran haid atau simptom menopaus",
      family: "Kesihatan ahli keluarga (saya membantu menjaga seseorang)",
      nothing: "Tiada yang khusus",
    },
  },
  concentrating: {
    prompt:
      "Berapa kerap anda sukar menumpukan perhatian semasa mesyuarat atau tugasan yang panjang?",
    options: FREQUENCY,
  },
  judgement: {
    prompt:
      "Berbanding beberapa tahun lalu, berapa kerap anda menghadapi kesukaran dalam menilai situasi atau membuat keputusan?",
    options: FREQUENCY,
  },
  forgetfulness: {
    prompt:
      "Berapa kerap anda terlupa, contohnya di mana anda meletakkan barang atau apa yang ingin anda lakukan?",
    options: FREQUENCY,
  },
  persistence: {
    prompt: "Adakah sifat pelupa ini berterusan, bukan sekali-sekala sahaja?",
    options: {
      yes: "Ya, ia berterusan",
      no: "Tidak, ia datang dan pergi",
    },
  },
  someoneElseNoticed: {
    prompt:
      "Adakah orang lain perasan perubahan ini pada tingkah laku atau tabiat anda?",
    options: { yes: "Ya", no: "Tidak" },
  },
};
