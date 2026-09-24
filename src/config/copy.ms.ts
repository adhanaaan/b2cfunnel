import type { CopyConfig, PhklCopy } from "@/types/copy";
import type { DeepPartial } from "@/lib/deepMerge";

/**
 * Bahasa Melayu, for /phkl-2 and /phkl-3 - the Pantai Hospital KL activations.
 *
 * An OVERLAY, not a second copy config: `copyFor()` applies it over the English
 * `COPY` with `deepMerge`, so anything left out here renders in English rather
 * than as a blank - the same rule as the other overlays (config/copy.zh.ts,
 * config/copy.id.ts).
 *
 * What is covered is exactly what /phkl-2's arc puts on screen: the landing
 * (with the partner's consent), the two primers, the age question, the
 * instructions and the game, the questionnaire (config/questions.ms.ts), the
 * analysing beat, and the report end to end with the Memory Screening
 * Package. Screens no /phkl-2 player reaches are deliberately not translated.
 *
 * NOT TRANSLATED HERE, ON PURPOSE: the privacy policy at
 * /phkl-2/privacy-policy. It is a legal document, and is translated by whoever
 * signs it off, not here.
 *
 * NOTE FOR REVIEW: the partner block on the landing is a rendering of IHH
 * Healthcare Malaysia's consent wording, not wording they supplied. It is for
 * the partner to confirm before it is what a player agrees to.
 *
 * Arrays replace whole (see deepMerge): a list is translated in full or left
 * in English, never half and half.
 */

/** "Processing speed is how fast your brain takes in what it sees and responds." */
const SPEED_HEADING_PARTS = [
  "Kelajuan pemprosesan ialah ",
  "betapa pantas",
  " otak anda ",
  "menerima",
  " apa yang dilihat dan ",
  "bertindak balas",
  ".",
];

const PHKL_MS: DeepPartial<PhklCopy> = {
  rail: {
    gameLabel: "Permainan",
    quizLabel: "Kuiz kesihatan otak",
    resultsLabel: "Keputusan",
  },
  speedIntro: {
    eyebrow: "Anda akan mengukur",
    heading: "Kelajuan pemprosesan",
    body: "Betapa *pantas* otak anda menerima apa yang *dilihat* dan *bertindak balas*.",
    cta: "Faham",
  },
  ageSelect: {
    heading: "Pilih umur anda",
    body: "Lihat perbandingan anda dengan rakan sebaya.",
  },
  greatJob: {
    heading: "Syabas, kelajuan anda telah diukur!",
    skipHint: "Ketik untuk teruskan",
  },
  quizIntro: {
    heading: "{name}, kelajuan otak anda boleh berubah",
    headingAnonymous: "Kelajuan otak anda boleh berubah",
    body: "Ia dipengaruhi oleh tidur, senaman, pemakanan dan faktor gaya hidup lain.",
    factors: ["Tidur", "Senaman", "Pemakanan"],
    lead: "Seterusnya, beberapa soalan ringkas tentang gaya hidup anda.",
    citation: {
      heading: "Berasaskan sains",
      body: "Berdasarkan Laporan Risiko Suruhanjaya Lancet 2024 dan Skor Risiko Demensia CAIDE (Cardiovascular Risk Factors, Aging, and Incidence of Dementia).",
    },
    cta: "Teruskan",
  },
  analysing: {
    heading: "{name}, kami sedang menyediakan laporan anda",
    headingAnonymous: "Menyediakan laporan anda…",
    steps: [
      "Memautkan keputusan Cabaran Masa Tindak Balas anda",
      "Mengira skor kelajuan pemprosesan anda",
      "Menyemak jawapan kesihatan dan gaya hidup anda",
      "Membandingkan anda dengan kumpulan umur anda",
      "Menyediakan Skor Kesihatan Otak anda",
    ],
  },
  splash: {
    eyebrow: "Cabaran Masa Tindak Balas",
    heading: "Betapa *pantas* *otak* anda memproses maklumat?",
    body: "Ambil ujian padanan simbol yang ringkas untuk mengetahui kelajuan pemprosesan otak anda.",
    namePlaceholder: "Nama",
    emailPlaceholder: "E-mel anda",
    consentRequired:
      "*Wajib.* Saya bersetuju untuk dihubungi tentang keputusan dan hadiah saya.",
    consentRequiredError:
      "Sila bersetuju untuk dihubungi supaya kami boleh menghantar keputusan anda.",
    nameError: "Sila masukkan nama anda.",
    emailError: "Sila masukkan alamat e-mel yang sah.",
    consentMarketing:
      "Hantarkan saya tip dan maklumat terkini tentang kesihatan otak dari semasa ke semasa.",
    privacyLinkLabel: "Dasar Privasi",
    cta: "Mulakan cabaran",
    poweredBy: "Dikuasakan oleh:",
    partnerConsent: {
      clauses: [
        {
          text: "Dengan memberikan maklumat yang dinyatakan dalam borang ini, saya bersetuju untuk IHH Healthcare Malaysia serta wakil dan/atau ejennya mengumpul, menggunakan dan mendedahkan data peribadi saya bagi menyediakan rawatan perubatan kepada saya dan untuk tujuan lain yang berkaitan secara munasabah. Tujuan tersebut dinyatakan dalam {link}, atau boleh didapati atas permintaan.",
          link: {
            label: "Notis Perlindungan Data IHH Healthcare Malaysia",
            href: "https://www.ihhhealthcare.com/my/data-protection-notice",
          },
        },
        {
          text: "Saya juga bersetuju untuk IHH Healthcare Malaysia, wakil, ejen dan/atau rakan niaganya mengumpul, menggunakan dan mendedahkan data peribadi saya untuk tujuan pemasaran dan promosi.",
        },
        {
          text: "Saya bersetuju untuk menerima mesej pemasaran melalui SMS, panggilan telefon dan perkhidmatan pesanan lain berasaskan nombor telefon Malaysia, tanpa mengira pendaftaran saya dalam daftar Do-Not-Call.",
        },
        {
          text: "Saya faham bahawa saya boleh menarik balik persetujuan ini pada bila-bila masa melalui kemudahan berhenti langganan ATAU borang yang boleh didapati daripada kakitangan kami ATAU melalui e-mel kepada DPO IHH Healthcare Malaysia di {link}.",
          link: {
            label: "my.ihh.dpo@ihhhealthcare.com",
            href: "mailto:my.ihh.dpo@ihhhealthcare.com",
          },
        },
      ],
    },
  },
  report: {
    header: {
      eyebrow: "Cabaran Masa Tindak Balas",
      // {ordinal} is rendered by `ordinalFor` in lib/format.ts, which gives
      // "ke-1" here and "1st" in English.
      heading: "Rekod {ordinal} {name} dalam",
      headingAnonymous: "Rekod {ordinal} anda dalam",
      headingHighlight: "kelajuan pemprosesan",
      timeLabel: "Masa",
      rankLabel: "Kedudukan",
      fastestLabel: "Terpantas setakat ini",
      fastestEmpty: "Jadilah yang pertama",
      shareLabel: "Kongsi",
      retryLabel: "Cuba lagi",
    },
    risk: {
      eyebrow: "Turut diukur",
      heading: "Kelajuan bukan satu-satunya perkara yang kami lihat.",
      body: "Kami juga melihat faktor risiko anda. Tabiat kesihatan dan gaya hidup seperti tekanan darah tinggi, tidur yang tidak mencukupi atau kurang bersenam boleh memperlahankan otak anda dari semasa ke semasa.",
      riskLevelLabel: "Tahap risiko anda:",
      factorsLead: "Beberapa faktor yang mempengaruhi tahap risiko anda, {name}:",
      factorsLeadAnonymous: "Beberapa faktor yang mempengaruhi tahap risiko anda:",
      noFactors:
        "Tiada faktor gaya hidup atau bioperubatan yang ketara dalam jawapan anda.",
      goodNews: "Berita baiknya,",
      sourceLabel: "Sumber:",
    },
    speed: {
      headingParts: SPEED_HEADING_PARTS,
      intro: "Dengan kelajuan pemprosesan yang tinggi, anda boleh:",
    },
    baseline: {
      eyebrow: "Garis dasar anda setakat ini",
      heading: "Anda baru melengkapkan",
      headingHighlight: "2 daripada 5",
      cardLabel: "Garis dasar anda",
      cardProgress: "2 daripada 5 selesai",
      axes: ["Kelajuan", "Memori", "Perhatian", "Eksekutif", "Risiko"],
      paragraphs: [
        "Permainan kelajuan dan jawapan kuiz anda memberi kami dua paksi: kelajuan dan risiko.",
        "Tetapi otak anda tidak berfungsi dalam dua dimensi sahaja. Memori, perhatian dan fungsi eksekutif masing-masing menceritakan kisah yang berbeza, dan anda mungkin cemerlang dalam satu tetapi bergelut dalam yang lain.",
        "Ujian penuh melengkapkan selebihnya, supaya cadangan anda sepadan dengan prestasi sebenar otak anda.",
      ],
    },
    wrapUp: {
      quoteParts: [
        "Mesyuarat esok sukar, dan jika perhatian saya tidak terjaga, saya tidak dapat memberikan prestasi terbaik. Berkat pemeriksaan otak, kini saya tahu cara mengoptimumkannya. Gembira saya menemui ",
        "ReCOGnAIze",
        "!",
      ],
      attributionAgeBand: "30-39",
      attribution: "Chelsea, berumur 30 hingga 39",
      attributionPeer: "Chelsea, berumur 30 hingga 39 seperti anda",
      thinkingHeading: "Masih perlukan masa untuk berfikir?",
      thinkingBody: [
        "Skor anda sudah ada dalam peti masuk anda, bersama beberapa strategi ringkas untuk meningkatkannya.",
        "Apabila anda bersedia untuk menguji tiga domain otak yang selebihnya, anda tahu di mana untuk mencari kami.",
      ],
      credit:
        "Dibina berdasarkan penyelidikan klinikal oleh Nanyang Technological University, LKC Medicine, Dementia Research Centre Singapore.",
    },
    sticky: {
      book: "Tempah saringan memori",
    },
    offer: {
      eyebrow: "Apa yang perlu dilakukan sekarang?",
      heading: "Tempah Pakej Saringan Memori Anda",
      body: "Otak anda membawa anda melalui setiap bahagian kehidupan. Fahami keadaannya hari ini, dan apa yang boleh anda lakukan untuk melindunginya pada tahun-tahun akan datang.",
      poster: {
        hospital: "Pantai Hospital Kuala Lumpur",
        hospitalNote: "Oleh IHH Healthcare",
        title: ["Pakej", "Saringan", "Memori"],
        price: "RM460",
        includesHeading: "Pakej termasuk",
        includes: [
          "Konsultasi Pakar",
          "Penilaian Kognitif Digital",
          "Ujian Makmal",
        ],
        whoHeading: "Siapa yang patut mempertimbangkan saringan?",
        who: [
          "Perubahan emosi atau tingkah laku",
          "Sejarah keluarga Alzheimer",
          "Keliru tentang masa atau tempat",
          "Sukar menumpukan perhatian",
          "Berumur 40 tahun ke atas",
          "Kerap lupa",
        ],
      },
      proofParts: [
        "Disahkan dengan imbasan MRI, dibina atas kajian NTU selama lima tahun terhadap 1,500 orang dan diterbitkan dalam ",
        "Alzheimer's & Dementia",
        ".",
      ],
      includesEyebrow: "Apa yang termasuk dalam saringan anda",
      assessmentHeading: [
        "Penilaian Kognitif Digital",
        "Permainan kesihatan otak 10 minit",
      ],
      assessmentBody:
        "Penilaian dalam talian dengan permainan yang mengukur kelajuan, perhatian, membuat keputusan dan memori.",
      reportHeading: "Dapatkan laporan penuh anda",
      reportBody:
        "Semak prestasi otak anda bersama cara praktikal untuk memperbaikinya.",
      cta: "Tempah saringan saya",
      quote:
        "Setiap permainan ini mengukur fungsi otak tertentu dengan cara yang sama saya menilainya di klinik. Kami bukan menguji sama ada anda pandai bermain, tetapi sejauh mana setiap bahagian otak anda melakukan tugasnya untuk anda setiap hari.",
      quoteName: "Prof. Madya Nagaendran Kandiah",
      quoteRole: [
        "Pengasas bersama, Gray Matter Solutions",
        "MBBS, FAMS (Neurology), FRCP (Edin)",
      ],
    },
  },
};

export const COPY_MS: DeepPartial<CopyConfig> = {
  screens: {
    // ---------------------------------------------------------------- game --
    symbolMatch: {
      getReady: "Bersedia",
      challengeName: "Cabaran Masa Tindak Balas",
      readyLine: "Padankan {count} simbol secepat mungkin. Sedia…",
      go: "MULA!",
      timeLabel: "Masa",
      soundOn: "Hidupkan bunyi",
      soundOff: "Matikan bunyi",
      symbolAlt: "Padankan simbol ini",
      tour: {
        focusSymbol: "Fokus pada simbol di bahagian atas skrin.",
        findMatch:
          "Cari simbol yang sepadan dan nombornya. Di sini, nombornya {number}.",
        tapNumber: 'Ketik "{number}" pada pad nombor di bawah.',
        orderChanges:
          "Berhati-hati, susunan simbol boleh berubah selepas setiap giliran.",
        tryYourself: "Sekarang cuba beberapa pusingan seterusnya sendiri!",
        startPractice: "Mulakan latihan",
        practiceLabel: "Latihan",
        demoLabel: "Demo",
        completeHeading: "Bagus!\nKini tiba masanya untuk menyahut cabaran.",
        completeStart: "Mula",
        completeRetry: "Cuba lagi",
      },
    },

    // --------------------------------------------- the daylight arc screens --
    event3: {
      instructions: {
        heading: "Cabaran Masa Tindak Balas",
        subheading: "Padankan {count} simbol dengan nombornya secepat mungkin.",
        demoBadge: "DEMO · MAIN SENDIRI",
        helper:
          "Simbol bertukar tempat selepas setiap giliran, jadi semak kuncinya setiap kali.",
        demoCta: "Pusingan demo",
        playCta: "Main",
      },
      // The share sheet. The play link is appended after the last line, so it
      // still has to end on a colon.
      share: {
        text: "Saya mencatat {time} dalam Cabaran Tindak Balas Kesihatan Otak",
        rankLine: "Kedudukan {rank}/{total}",
        cta: "Bolehkah anda mengatasi skor saya? Cuba sendiri di sini:",
        shared: "Telah dikongsi.",
        downloaded: "Kad disimpan. Kapsyen ada dalam papan keratan anda.",
        copied: "Disalin ke papan keratan anda.",
        unavailable: "Perkongsian tidak tersedia di sini.",
      },
      // The three perks the report reuses from the "?" popup.
      speedPopup: {
        eyebrow: "Apa maksudnya sebenarnya",
        headingParts: SPEED_HEADING_PARTS,
        intro: "Dengan kelajuan pemprosesan yang tinggi, anda boleh:",
        points: [
          "Mengikuti perbualan yang pantas",
          "Menyesuaikan diri dengan cepat kepada persekitaran yang berubah",
          "Mengira jumlah bil sebelum juruwang selesai mengimbas",
        ],
        closeLabel: "Faham",
      },
    },

    event2: {
      report: {
        chart: {
          heading: "Mengurus faktor risiko anda mengubah lengkungnya",
          managedLabel: "Faktor risiko diurus",
          unmanagedLabel: "Faktor risiko tidak diurus",
          fasterLabel: "Lebih pantas",
          slowerLabel: "Lebih perlahan",
          ageLabel: "Umur",
          footnote:
            "Trend ilustrasi, berdasarkan Jaarsma et al. 2024 dan Yaffe et al. 2020 (CARDIA). Bukan ramalan klinikal.",
          ariaLabel:
            "Dua lengkung ilustrasi kelajuan berfikir antara umur 30 dan umur 75. Kedua-duanya menurun. Lengkung bagi faktor risiko yang tidak diurus jatuh lebih awal dan lebih jauh berbanding lengkung bagi faktor risiko yang diurus.",
        },
        actionablesHeading: "Berikut 3 langkah yang boleh anda ambil sekarang",
      },
    },

    // ----------------------------------------------------- Pantai Hospital --
    phkl: PHKL_MS,
    // /phkl-2's landing reads its own block; only the words move, so its
    // privacy link stays the English block's.
    phkl2: { splash: PHKL_MS.splash },
    phkl3: { splash: PHKL_MS.splash },
  },

  bandLabels: {
    low: "Risiko rendah",
    moderate: "Risiko sederhana",
    elevated: "Risiko meningkat",
    high: "Risiko tinggi",
  },

  bandShortLabels: {
    low: "Rendah",
    moderate: "Sederhana",
    elevated: "Meningkat",
    high: "Tinggi",
  },

  // Keyed by question id, exactly as the English table is, so the engine's
  // own output is untouched and only the label the report prints changes.
  factorLabels: {
    age: "Umur",
    hotFlushes: "Perubahan hormon",
    menopauseSymptoms: "Perubahan hormon",
    familyHistory: "Sejarah keluarga",
    highBp: "Tekanan darah",
    highCholesterol: "Kolesterol",
    diabetes: "Gula darah",
    hearingLoss: "Pendengaran",
    visionLoss: "Penglihatan",
    smoking: "Merokok",
    sleep: "Tidur",
    exercise: "Senaman",
    diet: "Pemakanan",
    alcohol: "Alkohol",
  },

  quiz: {
    progress: "Soalan {current} daripada {total}",
    back: "← Kembali",
    continue: "Teruskan",
    groupTitles: {
      "A bit of health history": "Sedikit sejarah kesihatan",
      "Your lifestyle": "Gaya hidup anda",
    },
  },

  reportStat: {
    stat: "Kira-kira 45%",
    body: "kes demensia di seluruh dunia boleh dicegah atau dilambatkan dengan menangani faktor risiko yang boleh diubah sepanjang hayat seseorang.",
    source: "Suruhanjaya Lancet 2024 mengenai Pencegahan Demensia",
  },
};
