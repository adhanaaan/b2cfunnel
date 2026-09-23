import type { CopyConfig } from "@/types/copy";
import type { DeepPartial } from "@/lib/deepMerge";

/**
 * Bahasa Indonesia, for the Siloam Neuroscience Summit
 * (/siloamneurosciencesummit).
 *
 * An OVERLAY, not a second copy config: `copyFor()` applies it over the English
 * `COPY` with `deepMerge`, so anything left out here renders in English rather
 * than as a blank. That is the failure mode to design for - a screen nobody
 * translated should still be readable on a phone at an event.
 *
 * What is covered is exactly what this event's arc puts on screen: the landing,
 * the two primers, the age question, the instructions and the game, the
 * questionnaire (config/questions.id.ts), the analysing beat, and the report
 * end to end. Screens no Indonesian player reaches - the paywall, the booking
 * page, the /event-v3 consent page, the community-run report - are deliberately
 * not translated, because an untranslated string is honest and a
 * machine-translated legal or pricing one is not.
 *
 * TWO THINGS ARE NOT TRANSLATED HERE, ON PURPOSE:
 *
 * - The privacy policy at /siloamneurosciencesummit/privacy-policy. It is a
 *   legal document, and it is being rewritten against Indonesia's Personal Data
 *   Protection Law (UU No. 27/2022) before this event runs. It is translated
 *   with that rewrite, by whoever signs it off, not here.
 * - The consent rows on the landing say what the policy says. They are worded
 *   in both languages below, and both are the partner's to confirm alongside
 *   that policy.
 *
 * Arrays replace whole (see deepMerge): a list is translated in full or left
 * in English, never half and half.
 */
export const COPY_ID: DeepPartial<CopyConfig> = {
  screens: {
    // ---------------------------------------------------------------- game --
    symbolMatch: {
      getReady: "Bersiap",
      challengeName: "Tantangan Waktu Reaksi",
      readyLine: "Cocokkan {count} simbol secepat mungkin. Siap…",
      go: "MULAI!",
      timeLabel: "Waktu",
      soundOn: "Nyalakan suara",
      soundOff: "Matikan suara",
      symbolAlt: "Cocokkan simbol ini",
      tour: {
        focusSymbol: "Perhatikan simbol di bagian atas layar.",
        findMatch:
          "Cari simbol yang cocok beserta angkanya. Di sini, angkanya {number}.",
        tapNumber: 'Ketuk "{number}" pada papan angka di bawah.',
        orderChanges:
          "Hati-hati, urutan simbol dapat berubah setiap giliran.",
        tryYourself: "Sekarang coba sendiri beberapa ronde berikutnya!",
        startPractice: "Mulai latihan",
        practiceLabel: "Latihan",
        demoLabel: "Demo",
        completeHeading: "Bagus!\nSaatnya mengikuti tantangan.",
        completeStart: "Mulai",
        completeRetry: "Coba lagi",
      },
    },

    // --------------------------------------------- the daylight arc screens --
    event3: {
      instructions: {
        heading: "Tantangan Waktu Reaksi",
        subheading: "Cocokkan {count} simbol dengan angkanya secepat mungkin.",
        demoBadge: "DEMO · BERJALAN SENDIRI",
        helper:
          "Simbol berpindah tempat setiap giliran, jadi periksa kuncinya setiap kali.",
        demoCta: "Ronde demo",
        playCta: "Main",
      },
      // The share sheet. The play link is appended after the last line, so it
      // still has to end on a colon.
      share: {
        text: "Saya mencatat {time} di Brain Health Reaction Challenge",
        rankLine: "Peringkat {rank}/{total}",
        cta: "Bisakah Anda mengalahkan skor saya? Coba sendiri di sini:",
        shared: "Berhasil dibagikan.",
        downloaded: "Kartu tersimpan. Teksnya sudah ada di papan klip Anda.",
        copied: "Disalin ke papan klip Anda.",
        unavailable: "Berbagi tidak tersedia di sini.",
      },
      // The "?" popup, and the three perks the report reuses from it.
      speedPopup: {
        eyebrow: "Apa artinya itu",
        headingParts: [
          "Kecepatan pemrosesan adalah ",
          "seberapa cepat",
          " otak Anda ",
          "menyerap",
          " apa yang dilihat dan ",
          "merespons",
          ".",
        ],
        intro: "Dengan kecepatan pemrosesan yang tinggi, Anda dapat:",
        points: [
          "Mengikuti percakapan yang berlangsung cepat",
          "Beradaptasi dengan cepat pada lingkungan yang berubah",
          "Menghitung total belanja sebelum kasir selesai memindai",
        ],
        closeLabel: "Mengerti",
      },
    },

    // The report sections the summit shares with the other events' reports.
    event2: {
      report: {
        chart: {
          heading: "Mengelola faktor risiko Anda mengubah kurvanya",
          managedLabel: "Faktor risiko dikelola",
          unmanagedLabel: "Faktor risiko tidak dikelola",
          fasterLabel: "Lebih cepat",
          slowerLabel: "Lebih lambat",
          ageLabel: "Usia",
          footnote:
            "Tren ilustratif, mengacu pada Jaarsma dkk. 2024 dan Yaffe dkk. 2020 (CARDIA). Bukan prediksi klinis.",
          ariaLabel:
            "Dua kurva ilustratif kecepatan berpikir antara usia 30 dan usia 75. Keduanya menurun. Kurva untuk faktor risiko yang tidak dikelola menurun lebih cepat dan lebih dalam daripada kurva untuk faktor risiko yang dikelola.",
        },
        actionablesHeading: "Berikut 3 langkah yang bisa Anda lakukan sekarang",
      },
    },

    // ------------------------------------------------------- the summit --
    siloam: {
      splash: {
        eyebrow: "Tantangan Waktu Reaksi",
        heading: "Seberapa *cepat* *otak* Anda memproses informasi?",
        body: "Ikuti tes mencocokkan simbol yang singkat untuk mengetahui kecepatan pemrosesan otak Anda.",
        namePlaceholder: "Nama",
        emailPlaceholder: "Email Anda",
        // The one-tick consent this landing now shares with /22grams. UU PDP
        // art. 22 requires a consent request to be put in Indonesian and to
        // be plainly understandable, which makes THIS - not the English
        // block it overlays - the wording an Indonesian player actually
        // agrees to. For counsel to confirm alongside the policy it links.
        consentForm: {
          heading:
            "Dengan ini saya menyatakan bahwa saya mengirimkan formulir ini:",
          authorisation:
            "Atas nama saya sendiri; atau atas nama orang lain, dan saya menyatakan bahwa saya berwenang untuk memberikan jawaban dalam formulir ini.",
          registerNote:
            "Dengan mendaftar, saya menyetujui Gray Matter Solutions menghubungi saya melalui email dan buletin.",
        },
        consentRequiredError:
          "Mohon setujui pernyataan di atas agar kami dapat mengirimkan hasil Anda.",
        nameError: "Mohon masukkan nama Anda.",
        emailError: "Mohon masukkan alamat email yang valid.",
        // Kept for the two-row shape. Unused while `consentForm` is set,
        // and left translated so removing that block cannot strand the
        // landing in English.
        consentRequired:
          "*Wajib.* Saya setuju untuk dihubungi mengenai hasil dan hadiah saya.",
        consentMarketing:
          "Kirimi saya tips dan informasi kesehatan otak sesekali.",
        privacyLinkLabel: "Kebijakan Privasi",
        cta: "Mulai tantangan",
        poweredBy: "Dipersembahkan oleh:",
        // Deliberately the same in both languages: it has to read to whoever
        // picks up the phone, before they have chosen anything.
        languageLabel: "Language · Bahasa",
      },
      // The notice behind the landing while the standings are settled. Both
      // halves have to survive the translation: the results are closed, and
      // the game is still open to anyone who wants a go.
      scoresFinal: {
        eyebrow: "Tantangan telah ditutup",
        heading: "Skor akhir sudah keluar",
        body: "Kami telah merekap peringkat akhirnya, dan hasilnya kini *terkunci dan final*.",
        note: "Permainannya sendiri masih bisa dimainkan. Jika Anda tetap ingin mencoba, silakan - kali ini murni untuk seru-seruan.",
        cta: "Tetap mainkan",
      },
      rail: {
        gameLabel: "Permainan",
        quizLabel: "Kuis kesehatan otak",
        resultsLabel: "Hasil",
      },
      speedIntro: {
        eyebrow: "Anda akan mengukur",
        heading: "Kecepatan pemrosesan",
        body: "Seberapa *cepat* otak Anda menyerap apa yang *dilihat* dan *merespons*.",
        cta: "Mengerti",
      },
      ageSelect: {
        heading: "Pilih usia Anda",
        body: "Lihat perbandingan Anda dengan orang seusia Anda.",
      },
      greatJob: {
        heading: "Kerja bagus, kecepatan Anda sudah terukur!",
        skipHint: "Ketuk untuk melanjutkan",
      },
      quizIntro: {
        heading: "{name}, kecepatan otak Anda bisa berubah",
        headingAnonymous: "Kecepatan otak Anda bisa berubah",
        body: "Kecepatan itu dipengaruhi oleh tidur, olahraga, pola makan, dan faktor gaya hidup lainnya.",
        factors: ["Tidur", "Olahraga", "Pola makan"],
        lead: "Berikutnya, beberapa pertanyaan singkat tentang gaya hidup Anda.",
        citation: {
          heading: "Berdasarkan sains",
          body: "Disusun berdasarkan 2024 Lancet Commission Risk Report dan CAIDE (Cardiovascular Risk Factors, Aging, and Incidence of Dementia) Dementia Risk Score.",
        },
        cta: "Lanjutkan",
      },
      analysing: {
        heading: "{name}, kami sedang menyiapkan laporan Anda",
        headingAnonymous: "Menyiapkan laporan Anda…",
        steps: [
          "Menghubungkan hasil Tantangan Waktu Reaksi Anda",
          "Menghitung skor kecepatan pemrosesan Anda",
          "Meninjau jawaban kesehatan dan gaya hidup Anda",
          "Membandingkan Anda dengan kelompok usia Anda",
          "Menyiapkan Skor Kesehatan Otak Anda",
        ],
      },
      report: {
        header: {
          eyebrow: "Tantangan Waktu Reaksi",
          // {ordinal} is rendered by `ordinalFor` in lib/format.ts, which gives
          // "ke-1" here and "1st" in English.
          heading: "Rekor {ordinal} {name} dalam",
          headingAnonymous: "Rekor {ordinal} Anda dalam",
          headingHighlight: "kecepatan pemrosesan",
          timeLabel: "Waktu",
          rankLabel: "Peringkat",
          fastestLabel: "Tercepat sejauh ini",
          fastestEmpty: "Jadilah yang pertama",
          shareLabel: "Bagikan",
          retryLabel: "Ulangi",
        },
        risk: {
          eyebrow: "Yang juga kami ukur",
          heading: "Kecepatan bukan satu-satunya hal yang kami lihat.",
          body: "Kami juga melihat faktor risiko Anda. Kebiasaan kesehatan dan gaya hidup seperti tekanan darah tinggi, tidur yang kurang, atau olahraga yang terlalu sedikit dapat memperlambat kerja otak Anda seiring waktu.",
          riskLevelLabel: "Tingkat risiko Anda:",
          factorsLead:
            "Beberapa faktor yang memengaruhi tingkat risiko Anda, {name}:",
          factorsLeadAnonymous:
            "Beberapa faktor yang memengaruhi tingkat risiko Anda:",
          noFactors:
            "Tidak ada faktor gaya hidup atau biomedis yang menonjol dari jawaban Anda.",
          goodNews: "Kabar baiknya adalah",
          sourceLabel: "Sumber:",
        },
        // AWAITING THE INDONESIAN FIGURE - see the English block in copy.ts.
        // Change both, or the summit quotes one number in English and another
        // in Bahasa Indonesia.
        stat: {
          stat: "Sekitar 45%",
          body: "kasus demensia di dunia dapat dicegah atau ditunda dengan menangani faktor risiko yang dapat diubah sepanjang hidup seseorang.",
          source: "2024 Lancet Commission on Dementia Prevention",
        },
        speed: {
          headingParts: [
            "Kecepatan pemrosesan adalah ",
            "seberapa cepat",
            " otak Anda ",
            "menyerap",
            " apa yang dilihat dan ",
            "merespons",
            ".",
          ],
          intro: "Dengan kecepatan pemrosesan yang tinggi, Anda dapat:",
        },
        baseline: {
          eyebrow: "Yang sudah terukur sejauh ini",
          heading: "Anda baru mencakup",
          headingHighlight: "2 dari 5",
          cardLabel: "Pengukuran Anda",
          cardProgress: "2 dari 5 selesai",
          axes: [
            "Kecepatan",
            "Memori",
            "Atensi",
            "Eksekutif",
            "Faktor Risiko",
          ],
          paragraphs: [
            "Permainan kecepatan dan jawaban kuis Anda memberi kami dua sumbu: kecepatan dan risiko.",
            "Namun otak Anda tidak bekerja dalam dua dimensi saja. Memori, atensi, dan fungsi eksekutif masing-masing bercerita berbeda, dan Anda bisa unggul pada satu hal sambil kesulitan pada hal lain.",
            "Tes lengkap melengkapi sisanya, sehingga rekomendasi Anda sesuai dengan cara kerja otak Anda yang sebenarnya.",
          ],
        },
        offer: {
          eyebrow: "Langkah Anda berikutnya",
          heading: "Siap melihat gambaran lengkapnya?",
          body: "Skor Kesehatan Otak dan rekomendasi Anda sedang menuju kotak masuk Anda. Kuis hari ini memperkirakan profil risiko Anda; asesmen ReCOGnAIze menunjukkan bagaimana otak Anda benar-benar bekerja.",
          reassurance:
            "Berapa pun skor Anda hari ini, sebagian besar faktor di baliknya dapat diubah. Itulah gunanya memeriksa sejak dini.",
          offerName: "Asesmen kesehatan otak ReCOGnAIze",
          offerPoints: [
            "Dikembangkan di Dementia Research Centre NTU",
            "Terdaftar pada HSA Singapura",
            "Hasil ditinjau bersama tenaga medis profesional",
          ],
          cta: "Temui tim kami di booth",
          credibility:
            "Dibangun bersama Dementia Research Centre NTU · 2024 Lancet Commission",
        },
        sticky: {
          talk: "Temui tim kami",
        },
        wrapUp: {
          quoteParts: [
            "Rapat besok berat, dan kalau atensi saya tidak terjaga, saya tidak bisa tampil maksimal. Berkat memeriksa otak saya, sekarang saya tahu cara mengoptimalkannya. Senang sekali menemukan ",
            "ReCOGnAIze",
            "!",
          ],
          attributionAgeBand: "30-39",
          attribution: "Chelsea, usia 30 hingga 39",
          attributionPeer: "Chelsea, usia 30 hingga 39 seperti Anda",
          thinkingHeading: "Masih perlu waktu untuk memutuskan?",
          thinkingBody: [
            "Skor Anda sudah ada di kotak masuk Anda, lengkap dengan sejumlah strategi singkat untuk meningkatkannya.",
            "Saat Anda siap menguji tiga domain otak lainnya, Anda tahu di mana kami berada.",
          ],
          credit:
            "Dibangun atas riset klinis oleh Nanyang Technological University, LKC Medicine, Dementia Research Centre Singapore.",
        },
      },
    },
  },

  quiz: {
    progress: "Pertanyaan {current} dari {total}",
    back: "\u2190 Kembali",
    continue: "Lanjutkan",
    groupTitles: {
      "A bit of health history": "Sedikit riwayat kesehatan",
      "Your lifestyle": "Gaya hidup Anda",
    },
  },

  bandLabels: {
    low: "Risiko rendah",
    moderate: "Risiko sedang",
    elevated: "Risiko meningkat",
    high: "Risiko tinggi",
  },

  bandShortLabels: {
    low: "Rendah",
    moderate: "Sedang",
    elevated: "Meningkat",
    high: "Tinggi",
  },

  // The pills under "some factors that affect your risk level". Keyed by
  // question id, exactly as the English table is, so the engine's own output
  // is untouched and only the label the report prints changes.
  factorLabels: {
    age: "Usia",
    hotFlushes: "Perubahan hormon",
    menopauseSymptoms: "Perubahan hormon",
    familyHistory: "Riwayat keluarga",
    highBp: "Tekanan darah",
    highCholesterol: "Kolesterol",
    diabetes: "Gula darah",
    hearingLoss: "Pendengaran",
    visionLoss: "Penglihatan",
    smoking: "Merokok",
    sleep: "Tidur",
    exercise: "Olahraga",
    diet: "Pola makan",
    alcohol: "Alkohol",
  },
};
