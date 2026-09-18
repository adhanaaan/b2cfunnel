import { PRIVACY } from "@/config/privacy";
import type { Language } from "@/config/language";
import type { PolicySection } from "@/config/privacyPolicy";

/**
 * The Siloam Neuroscience Summit's privacy policy
 * (/siloamneurosciencesummit/privacy-policy), written against INDONESIA'S law
 * rather than Singapore's: Undang-Undang No. 27 Tahun 2022 tentang
 * Pelindungan Data Pribadi (the "UU PDP").
 *
 * Its own module, and its own text, because it is not the general policy with
 * a country swapped. The UU PDP differs from the PDPA 2012 in ways that reach
 * this funnel directly, and each one is why a section below reads as it does:
 *
 * - **Health data is "specific" personal data** (art. 4(2)), and the Brain
 *   Health Check collects exactly that - blood pressure, cholesterol, blood
 *   sugar, and self-reported memory and concentration changes - plus a score
 *   derived from it. Specific data carries a higher bar, so section 2 names it
 *   as such rather than listing it as one row among five.
 * - **Processing needs a stated lawful basis** (art. 20(2)), so section 3
 *   pairs every purpose with the basis it rests on instead of resting the
 *   whole policy on consent.
 * - **The rights are broader** (arts. 5 to 13): erasure, restriction,
 *   portability, objection to automated processing and a right to
 *   compensation all exist here and have no PDPA equivalent. Section 7 lists
 *   them, and section 10 answers the automated-processing one directly,
 *   because a Brain Health Score IS automated processing.
 * - **A breach is notified within 3 x 24 hours** (art. 46), not "as soon as
 *   practicable". Section 9 commits to that.
 * - **The data leaves Indonesia the moment it is collected**: GMS is a
 *   Singapore organisation, so art. 56 governs every record this event takes.
 *   Section 6 exists only because of that, and has no counterpart in the
 *   general policy.
 * - **The UU PDP reaches GMS at all** because of art. 2: it applies to
 *   processing outside Indonesia that has legal consequences for data
 *   subjects in Indonesia. Section 1 says so, rather than leaving a Singapore
 *   entity looking like it is out of scope.
 *
 * NOT YET REVIEWED BY COUNSEL. This is written to be accurate about what the
 * funnel actually does (see /api/lead, /api/score, /api/newsletter and
 * /api/response) and to be honest about the law it names, but it is a legal
 * document and an Indonesian practitioner has to sign it off before the event.
 * The two things to put in front of them first are the retention periods in
 * config/privacy.ts and the consent wording on the landing
 * (ONE_TICK_CONSENT_FORM in config/copy.ts), because those are what a request
 * or a complaint would be measured against.
 *
 * It is written in BOTH languages, and that is not a nicety: art. 22 requires
 * a request for consent to be put in Indonesian and to be plainly
 * understandable. A landing that asks in Indonesian and links a policy only in
 * English is the gap this closes.
 */

const LAW_EN = "Law No. 27 of 2022 on Personal Data Protection";
const LAW_ID = "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi";

/** The strap under the policy's title, naming the law it is written against. */
export const INDONESIA_POLICY_LAW: Record<Language, string> = {
  en: `Indonesia ${LAW_EN} (UU PDP)`,
  id: `${LAW_ID} (UU PDP)`,
};

// ---------------------------------------------------------------------------
// English
// ---------------------------------------------------------------------------

const SECTIONS_EN: PolicySection[] = [
  {
    heading: "1. About this policy",
    blocks: [
      `${PRIVACY.organisation} (${PRIVACY.organisationNote}) runs the Reaction Time Challenge and the Brain Health Check at the Siloam Neuroscience Summit. In this policy, “we” and “us” mean ${PRIVACY.organisation}.`,
      `This policy is written against Indonesia’s ${LAW_EN} (the “UU PDP”). We are a Singapore company, but the UU PDP applies to processing carried out outside Indonesia where it has legal consequences for personal data subjects in Indonesia, and the people who play at this event are in Indonesia. We act as the Personal Data Controller (Pengendali Data Pribadi) for everything described below: we decide what is collected and why.`,
      "It explains what we collect when you play, why, the legal basis for each use, who we share it with, how long we keep it, and the rights you have over it. It applies to this website and to the booth experience it powers at the summit.",
      "The Brain Health Check is an educational tool. It is not a medical diagnosis, and your results are not medical records.",
    ],
  },
  {
    heading: "2. What we collect",
    blocks: [
      "We only collect what the experience needs. Specifically:",
      {
        table: [
          [
            "What you type in",
            "Your name and an email address, plus the consent you give on the first screen.",
          ],
          [
            "How you played",
            "Your reaction-time result, your best time, and your position on the leaderboard. Your name and time are shown on the leaderboard for other people at the summit to see.",
          ],
          [
            "Your quiz answers",
            "Your age band and sex; whether you have been told you have high blood pressure, high cholesterol or high blood sugar; lifestyle answers on smoking, sleep, exercise, diet and alcohol; and self-reported changes in memory, concentration and judgement.",
          ],
          [
            "What we work out from that",
            "Your Brain Health Score, the band it falls in, and the profile of factors behind it.",
          ],
          [
            "Technical data",
            "Your browser’s user-agent string, and a random session identifier stored in your browser so we can measure where people stop, without knowing who they are.",
          ],
        ],
      },
      "Two of those rows are health data, and the UU PDP treats health data as specific personal data (data pribadi yang bersifat spesifik) under article 4(2): your quiz answers, and the Brain Health Score and factor profile we derive from them. We ask for them only after you have agreed on the first screen, we use them only for the purposes in section 3, and we do not share them with anyone outside the processors named in section 5.",
      "We do not collect your NIK or any other national identity number, your address, your phone number, or any payment details through this experience. We do not use third-party advertising trackers, and we do not build advertising profiles.",
    ],
  },
  {
    heading: "3. Why we use it, and on what basis",
    blocks: [
      "Article 20(2) of the UU PDP requires us to have a lawful basis for each use. These are ours, and we have no others:",
      {
        table: [
          [
            "To show you your reaction time and your Brain Health Score, and to email them to you with the recommendations that go with them",
            "Your consent, given on the first screen (art. 20(2)(a)). Your quiz answers are specific personal data, so this use rests on consent and nothing else.",
          ],
          [
            "To place you on the event leaderboard, using your name and your time",
            "Your consent, given on the first screen (art. 20(2)(a)).",
          ],
          [
            "To contact you if you win a prize, and to answer you if you write to us",
            "Your consent (art. 20(2)(a)), and the fulfilment of an obligation to you (art. 20(2)(b)).",
          ],
          [
            "To send you brain health tips and updates",
            "Your consent (art. 20(2)(a)). The first screen states that registering gives it; you can withdraw it at any time, and doing so changes nothing else.",
          ],
          [
            "To understand, in aggregate, who took part and how far people got, so we can improve the experience",
            "Our legitimate interests (art. 20(2)(f)). This analysis does not use your name or your email.",
          ],
          [
            "To keep the experience secure, and to meet our legal and regulatory obligations",
            "Compliance with our legal obligations (art. 20(2)(c)).",
          ],
        ],
      },
      "We do not use your personal data for any purpose other than the one it was collected for without asking you first, as article 16(2) requires.",
    ],
  },
  {
    heading: "4. Your consent, and how to withdraw it",
    blocks: [
      "The first screen asks you to confirm that you are submitting the form on your own behalf, or on behalf of someone who authorised you to. Ticking that box is what lets us collect and use your personal data for the purposes in section 3, and it is required to play, because without it we cannot send you your result or reach you about a prize.",
      "The line under that box states that registering is also your consent to receive emails and newsletters from us. That consent is separate from the rest: withdrawing it stops the emails and changes nothing else about your result or your place on the leaderboard.",
      `You can withdraw any consent at any time by writing to ${PRIVACY.dpoEmail}, or by using the unsubscribe link in any email we send you. We will act on it promptly and tell you what it means in practice: if you withdraw consent to be contacted, we can no longer send you your results or notify you about a prize.`,
      "Withdrawing consent does not make what we did beforehand unlawful, and it does not require us to delete data we are legally required to keep. If you want the data deleted as well, say so and we will treat it as a request under section 7.",
    ],
  },
  {
    heading: "5. Who we share it with",
    blocks: [
      "We do not sell your personal data, and we do not share it for anyone else’s marketing.",
      "We share it with service providers that process it on our behalf, as Personal Data Processors (Prosesor Data Pribadi) under article 51: our website hosting provider, and the managed database that stores results and leaderboard entries. They may process it only as far as they need to in order to provide their service to us, they are bound to protect it, and they act on our instructions.",
      "We remain responsible for what those processors do with your personal data, as article 51(2) provides.",
      "We may also disclose personal data where the law requires it, where it is necessary to investigate a suspected breach or to establish or defend a legal claim, or in any other circumstance the UU PDP permits.",
    ],
  },
  {
    heading: "6. Transfers outside Indonesia",
    blocks: [
      `Your personal data leaves Indonesia. We are a Singapore organisation, and our hosting and database providers store and process data on servers outside Indonesia, so every record this event collects is transferred abroad.`,
      "Article 56 allows that where the receiving country has a level of personal data protection equal to or higher than the UU PDP; failing that, where there are adequate and binding safeguards in place; and failing that, with your consent. We rely on binding contractual safeguards with each provider, which require them to protect your personal data to the standard this policy describes and to act only on our instructions.",
      `If you want to know which providers hold your personal data and where, write to ${PRIVACY.dpoEmail} and we will tell you.`,
    ],
  },
  {
    heading: "7. Your rights",
    blocks: [
      "Articles 5 to 13 of the UU PDP give you the following rights over your personal data. All of them apply to what we hold:",
      {
        list: [
          "To be told clearly what we are collecting, why, and for how long we will keep it, which is what this policy is for.",
          "To get a copy of the personal data we hold about you, and to see how we have used it.",
          "To have anything inaccurate, incomplete or out of date corrected.",
          "To have your personal data erased or destroyed, including your entry on the leaderboard.",
          "To withdraw a consent you gave, at any time (see section 4).",
          "To object to a decision made about you solely by automated processing, including profiling (see section 10).",
          "To restrict or delay processing in line with the purpose it was collected for.",
          "To receive your personal data in a structured, commonly used format, and to ask us to send it to another controller where that is technically possible.",
          "To sue for and receive compensation for a breach of the UU PDP in respect of your personal data.",
        ],
      },
      `To use any of them, write to ${PRIVACY.dpoEmail}. We will acknowledge your request within 3 working days and answer it in full within 14 days; if it is complex and we need longer, we will tell you why and when to expect an answer. We may need to verify who you are first. We do not charge for this.`,
      "We will erase or destroy your personal data when you ask us to, when the retention period in section 8 ends, when the purpose it was collected for has been met, or when you withdraw the consent it rested on, as articles 43 and 44 require.",
    ],
  },
  {
    heading: "8. How long we keep it",
    blocks: [
      {
        table: [
          [
            "Leaderboard entries and game times",
            `Kept for ${PRIVACY.retention.leaderboard}.`,
          ],
          [
            "Your name, email, quiz answers and Brain Health Score",
            `Kept for ${PRIVACY.retention.contact}.`,
          ],
          [
            "Anonymised, aggregate statistics",
            `Kept ${PRIVACY.retention.aggregates}. Once data can no longer identify you it is no longer personal data, and the UU PDP no longer applies to it.`,
          ],
        ],
      },
      "We stop keeping personal data once the purpose it was collected for no longer applies and we have no legal obligation to retain it.",
    ],
  },
  {
    heading: "9. How we protect it, and what happens if something goes wrong",
    blocks: [
      "Data is sent over an encrypted connection and stored in access-controlled systems, with access limited to the people who need it for the purposes described above. We review these arrangements as the experience changes, as article 35 requires.",
      "No system is perfectly secure. If your personal data is disclosed or accessed in a way it should not have been, article 46 requires us to notify you and the supervisory authority in writing within 3 x 24 hours. We will tell you what data was involved, when and how it happened, and what we are doing about it.",
    ],
  },
  {
    heading: "10. Automated processing",
    blocks: [
      "Your Brain Health Score is calculated automatically from the answers you give. No person reviews it before you see it.",
      "That calculation is not a decision that produces a legal effect for you or otherwise significantly affects you: it is an educational estimate, it is not a diagnosis, and nothing follows from it unless you choose to act on it. Even so, article 10 gives you the right to object to a decision based solely on automated processing, and you may exercise it by writing to us. We will explain how the score was worked out and, if you ask, delete it.",
    ],
  },
  {
    heading: "11. Children",
    blocks: [
      "This experience is intended for adults. Under article 25 of the UU PDP, personal data belonging to a child may only be processed with the consent of a parent or guardian. If you are under 18, please play only with that consent.",
      `If you believe a child has given us personal data without it, write to ${PRIVACY.dpoEmail} and we will delete it.`,
    ],
  },
  {
    heading: "12. Cookies and measurement",
    blocks: [
      "We do not use advertising or tracking cookies. We store a randomly generated session identifier in your browser so we can count how many people reach each step and where they stop. It is not linked to your name or email, and it is cleared when you close the tab.",
    ],
  },
  {
    heading: "13. Changes to this policy",
    blocks: [
      `We may update this policy as the experience changes. The date at the top tells you when it was last revised, and the version shown here is always the current one. This policy was last updated on ${PRIVACY.lastUpdated}.`,
    ],
  },
  {
    heading: "14. How to contact us, and how to complain",
    blocks: [
      `For anything about your personal data - access, correction, erasure, withdrawing consent, or any of the other rights in section 7 - write to our Data Protection Officer at ${PRIVACY.dpoEmail}.`,
      "If you are not satisfied with how we have handled your request, you may complain to the personal data protection supervisory authority established under the UU PDP. Until that authority is fully operational, complaints may be directed to the Indonesian ministry responsible for communications and digital affairs, and you retain the right to bring a claim in the Indonesian courts.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Bahasa Indonesia
// ---------------------------------------------------------------------------

const SECTIONS_ID: PolicySection[] = [
  {
    heading: "1. Tentang kebijakan ini",
    blocks: [
      `${PRIVACY.organisation} (${PRIVACY.organisationNote}) menyelenggarakan Tantangan Waktu Reaksi dan Pemeriksaan Kesehatan Otak pada Siloam Neuroscience Summit. Dalam kebijakan ini, “kami” berarti ${PRIVACY.organisation}.`,
      `Kebijakan ini disusun berdasarkan ${LAW_ID} (“UU PDP”). Kami adalah perusahaan yang berkedudukan di Singapura, namun UU PDP berlaku pula terhadap pemrosesan yang dilakukan di luar wilayah Indonesia apabila menimbulkan akibat hukum bagi subjek data pribadi di Indonesia, dan peserta acara ini berada di Indonesia. Kami bertindak sebagai Pengendali Data Pribadi atas seluruh pemrosesan yang diuraikan di bawah ini: kami yang menentukan data apa yang dikumpulkan dan untuk tujuan apa.`,
      "Kebijakan ini menjelaskan data apa yang kami kumpulkan saat Anda bermain, untuk apa, atas dasar hukum apa, dengan siapa kami membaginya, berapa lama kami menyimpannya, dan hak apa saja yang Anda miliki atasnya. Kebijakan ini berlaku untuk situs ini dan untuk pengalaman di booth yang dijalankannya pada summit.",
      "Pemeriksaan Kesehatan Otak adalah alat edukasi. Ini bukan diagnosis medis, dan hasil Anda bukan rekam medis.",
    ],
  },
  {
    heading: "2. Data yang kami kumpulkan",
    blocks: [
      "Kami hanya mengumpulkan apa yang dibutuhkan oleh pengalaman ini, yaitu:",
      {
        table: [
          [
            "Yang Anda isikan",
            "Nama dan alamat email Anda, beserta persetujuan yang Anda berikan pada layar pertama.",
          ],
          [
            "Cara Anda bermain",
            "Hasil waktu reaksi Anda, waktu terbaik Anda, dan posisi Anda pada papan peringkat. Nama dan waktu Anda ditampilkan di papan peringkat agar dapat dilihat peserta lain di summit.",
          ],
          [
            "Jawaban kuis Anda",
            "Kelompok usia dan jenis kelamin Anda; apakah Anda pernah didiagnosis tekanan darah tinggi, kolesterol tinggi, atau gula darah tinggi; jawaban gaya hidup mengenai merokok, tidur, olahraga, pola makan, dan alkohol; serta perubahan daya ingat, konsentrasi, dan penilaian yang Anda laporkan sendiri.",
          ],
          [
            "Hasil olahan kami",
            "Skor Kesehatan Otak Anda, kategori yang menaunginya, dan profil faktor di baliknya.",
          ],
          [
            "Data teknis",
            "Informasi user-agent peramban Anda, dan pengenal sesi acak yang disimpan di peramban Anda agar kami dapat mengukur di titik mana orang berhenti, tanpa mengetahui siapa mereka.",
          ],
        ],
      },
      "Dua di antaranya merupakan data kesehatan, dan UU PDP menggolongkan data kesehatan sebagai data pribadi yang bersifat spesifik berdasarkan Pasal 4 ayat (2): yaitu jawaban kuis Anda, serta Skor Kesehatan Otak dan profil faktor yang kami turunkan darinya. Kami baru menanyakannya setelah Anda menyetujuinya pada layar pertama, kami menggunakannya hanya untuk tujuan pada bagian 3, dan kami tidak membagikannya kepada pihak mana pun di luar prosesor yang disebut pada bagian 5.",
      "Kami tidak mengumpulkan NIK atau nomor identitas kependudukan lainnya, alamat, nomor telepon, maupun data pembayaran Anda melalui pengalaman ini. Kami tidak menggunakan pelacak iklan pihak ketiga, dan kami tidak menyusun profil periklanan.",
    ],
  },
  {
    heading: "3. Tujuan penggunaan dan dasar hukumnya",
    blocks: [
      "Pasal 20 ayat (2) UU PDP mewajibkan adanya dasar pemrosesan untuk setiap penggunaan. Berikut dasar yang kami gunakan, dan tidak ada yang lain:",
      {
        table: [
          [
            "Menampilkan waktu reaksi dan Skor Kesehatan Otak Anda, serta mengirimkannya melalui email beserta rekomendasinya",
            "Persetujuan Anda pada layar pertama (Pasal 20 ayat (2) huruf a). Jawaban kuis Anda merupakan data pribadi yang bersifat spesifik, sehingga penggunaan ini bersandar pada persetujuan dan tidak pada dasar lain.",
          ],
          [
            "Menempatkan Anda pada papan peringkat acara, menggunakan nama dan waktu Anda",
            "Persetujuan Anda pada layar pertama (Pasal 20 ayat (2) huruf a).",
          ],
          [
            "Menghubungi Anda apabila Anda memenangkan hadiah, dan menjawab apabila Anda menghubungi kami",
            "Persetujuan Anda (Pasal 20 ayat (2) huruf a) dan pemenuhan kewajiban kepada Anda (Pasal 20 ayat (2) huruf b).",
          ],
          [
            "Mengirimkan tips dan informasi kesehatan otak",
            "Persetujuan Anda (Pasal 20 ayat (2) huruf a). Layar pertama menyatakan bahwa pendaftaran merupakan pemberian persetujuan tersebut; Anda dapat menariknya kapan saja, dan hal itu tidak mengubah apa pun yang lain.",
          ],
          [
            "Memahami secara agregat siapa yang ikut serta dan sejauh mana mereka menyelesaikannya, guna memperbaiki pengalaman ini",
            "Kepentingan yang sah dari kami (Pasal 20 ayat (2) huruf f). Analisis ini tidak menggunakan nama atau email Anda.",
          ],
          [
            "Menjaga keamanan pengalaman ini dan memenuhi kewajiban hukum kami",
            "Pemenuhan kewajiban hukum (Pasal 20 ayat (2) huruf c).",
          ],
        ],
      },
      "Kami tidak menggunakan data pribadi Anda untuk tujuan di luar tujuan pengumpulannya tanpa terlebih dahulu meminta persetujuan Anda, sebagaimana diwajibkan Pasal 16 ayat (2).",
    ],
  },
  {
    heading: "4. Persetujuan Anda dan cara menariknya",
    blocks: [
      "Layar pertama meminta Anda menyatakan bahwa Anda mengirimkan formulir atas nama Anda sendiri, atau atas nama orang lain yang memberi Anda wewenang untuk itu. Mencentang kotak tersebut adalah yang memungkinkan kami mengumpulkan dan menggunakan data pribadi Anda untuk tujuan pada bagian 3, dan hal itu diperlukan untuk bermain, karena tanpanya kami tidak dapat mengirimkan hasil Anda atau menghubungi Anda terkait hadiah.",
      "Kalimat di bawah kotak tersebut menyatakan bahwa pendaftaran sekaligus merupakan persetujuan Anda untuk menerima email dan buletin dari kami. Persetujuan itu terpisah dari yang lain: menariknya akan menghentikan email dan tidak mengubah apa pun mengenai hasil Anda maupun posisi Anda di papan peringkat.",
      `Anda dapat menarik persetujuan kapan saja dengan menghubungi ${PRIVACY.dpoEmail}, atau melalui tautan berhenti berlangganan pada setiap email yang kami kirimkan. Kami akan menindaklanjutinya segera dan menjelaskan konsekuensinya: apabila Anda menarik persetujuan untuk dihubungi, kami tidak lagi dapat mengirimkan hasil Anda atau memberitahukan hadiah kepada Anda.`,
      "Penarikan persetujuan tidak membuat pemrosesan yang telah kami lakukan sebelumnya menjadi melanggar hukum, dan tidak mewajibkan kami menghapus data yang wajib kami simpan menurut hukum. Apabila Anda juga menghendaki datanya dihapus, sampaikan hal itu dan kami akan memperlakukannya sebagai permohonan berdasarkan bagian 7.",
    ],
  },
  {
    heading: "5. Pihak yang menerima data Anda",
    blocks: [
      "Kami tidak menjual data pribadi Anda, dan kami tidak membagikannya untuk kepentingan pemasaran pihak lain.",
      "Kami membagikannya kepada penyedia layanan yang memrosesnya untuk dan atas nama kami, sebagai Prosesor Data Pribadi berdasarkan Pasal 51: penyedia hosting situs kami, dan basis data terkelola yang menyimpan hasil serta entri papan peringkat. Mereka hanya boleh memroses data sebatas yang diperlukan untuk memberikan layanannya kepada kami, wajib melindunginya, dan bertindak berdasarkan instruksi kami.",
      "Kami tetap bertanggung jawab atas pemrosesan yang dilakukan prosesor tersebut, sebagaimana diatur dalam Pasal 51 ayat (2).",
      "Kami juga dapat mengungkapkan data pribadi apabila diwajibkan oleh hukum, apabila diperlukan untuk menyelidiki dugaan pelanggaran atau untuk menegakkan dan membela suatu tuntutan hukum, atau dalam keadaan lain yang diperbolehkan UU PDP.",
    ],
  },
  {
    heading: "6. Pengiriman data ke luar wilayah Indonesia",
    blocks: [
      "Data pribadi Anda dikirimkan ke luar wilayah Indonesia. Kami berkedudukan di Singapura, dan penyedia hosting serta basis data kami menyimpan dan memroses data pada server di luar Indonesia, sehingga setiap catatan yang dikumpulkan pada acara ini dikirimkan ke luar negeri.",
      "Pasal 56 memperbolehkan hal tersebut apabila negara penerima memiliki tingkat pelindungan data pribadi yang setara atau lebih tinggi daripada UU PDP; apabila tidak, sepanjang terdapat pelindungan yang memadai dan mengikat; dan apabila keduanya tidak terpenuhi, berdasarkan persetujuan Anda. Kami bersandar pada perjanjian yang mengikat dengan setiap penyedia, yang mewajibkan mereka melindungi data pribadi Anda sesuai standar yang diuraikan kebijakan ini dan bertindak hanya atas instruksi kami.",
      `Apabila Anda ingin mengetahui penyedia mana yang menyimpan data pribadi Anda dan di mana, hubungi ${PRIVACY.dpoEmail} dan kami akan memberitahukannya.`,
    ],
  },
  {
    heading: "7. Hak-hak Anda",
    blocks: [
      "Pasal 5 sampai dengan Pasal 13 UU PDP memberikan hak-hak berikut atas data pribadi Anda. Seluruhnya berlaku atas data yang kami simpan:",
      {
        list: [
          "Mendapatkan penjelasan yang jelas mengenai data apa yang kami kumpulkan, untuk apa, dan berapa lama disimpan, yang menjadi tujuan kebijakan ini.",
          "Memperoleh salinan data pribadi Anda yang kami simpan, dan mengetahui bagaimana data itu kami gunakan.",
          "Memperbaiki data yang tidak akurat, tidak lengkap, atau sudah tidak sesuai.",
          "Menghapus atau memusnahkan data pribadi Anda, termasuk entri Anda pada papan peringkat.",
          "Menarik persetujuan yang telah Anda berikan, kapan saja (lihat bagian 4).",
          "Mengajukan keberatan atas keputusan yang didasarkan semata-mata pada pemrosesan otomatis, termasuk pemprofilan (lihat bagian 10).",
          "Menunda atau membatasi pemrosesan sesuai dengan tujuan pengumpulannya.",
          "Menerima data pribadi Anda dalam format yang terstruktur dan lazim digunakan, serta meminta kami mengirimkannya kepada pengendali lain sepanjang secara teknis dimungkinkan.",
          "Menggugat dan menerima ganti rugi atas pelanggaran UU PDP terhadap data pribadi Anda.",
        ],
      },
      `Untuk menggunakan hak-hak tersebut, hubungi ${PRIVACY.dpoEmail}. Kami akan mengonfirmasi permohonan Anda dalam 3 hari kerja dan menjawabnya secara lengkap dalam 14 hari; apabila permohonan bersifat rumit dan kami memerlukan waktu lebih lama, kami akan menyampaikan alasannya dan perkiraan waktunya. Kami mungkin perlu memverifikasi identitas Anda terlebih dahulu. Kami tidak memungut biaya untuk ini.`,
      "Kami akan menghapus atau memusnahkan data pribadi Anda apabila Anda memintanya, apabila jangka waktu penyimpanan pada bagian 8 berakhir, apabila tujuan pengumpulannya telah tercapai, atau apabila Anda menarik persetujuan yang mendasarinya, sebagaimana diwajibkan Pasal 43 dan Pasal 44.",
    ],
  },
  {
    heading: "8. Jangka waktu penyimpanan",
    blocks: [
      {
        table: [
          [
            "Entri papan peringkat dan catatan waktu permainan",
            "Disimpan selama acara berlangsung dan sampai dengan 6 bulan setelahnya.",
          ],
          [
            "Nama, email, jawaban kuis, dan Skor Kesehatan Otak Anda",
            "Disimpan sampai dengan 24 bulan sejak interaksi terakhir Anda dengan kami, kecuali Anda menarik persetujuan lebih awal.",
          ],
          [
            "Statistik agregat yang telah dianonimkan",
            "Disimpan tanpa batas waktu setelah tidak lagi dapat mengidentifikasi Anda. Data yang tidak lagi dapat mengidentifikasi seseorang bukan merupakan data pribadi, sehingga UU PDP tidak lagi berlaku atasnya.",
          ],
        ],
      },
      "Kami berhenti menyimpan data pribadi begitu tujuan pengumpulannya tidak lagi berlaku dan kami tidak memiliki kewajiban hukum untuk menyimpannya.",
    ],
  },
  {
    heading: "9. Pengamanan data dan penanganan insiden",
    blocks: [
      "Data dikirimkan melalui koneksi terenkripsi dan disimpan pada sistem dengan kendali akses, yang aksesnya terbatas pada pihak yang membutuhkannya untuk tujuan di atas. Kami meninjau pengaturan ini seiring perubahan pengalaman, sebagaimana diwajibkan Pasal 35.",
      "Tidak ada sistem yang sepenuhnya aman. Apabila data pribadi Anda terungkap atau diakses secara tidak sah, Pasal 46 mewajibkan kami memberitahukannya secara tertulis kepada Anda dan kepada lembaga pengawas dalam waktu 3 x 24 jam. Kami akan menyampaikan data apa yang terdampak, kapan dan bagaimana hal itu terjadi, serta langkah penanganannya.",
    ],
  },
  {
    heading: "10. Pemrosesan secara otomatis",
    blocks: [
      "Skor Kesehatan Otak Anda dihitung secara otomatis dari jawaban yang Anda berikan. Tidak ada orang yang meninjaunya sebelum Anda melihatnya.",
      "Perhitungan tersebut bukan keputusan yang menimbulkan akibat hukum atau berdampak signifikan bagi Anda: ia merupakan perkiraan edukatif, bukan diagnosis, dan tidak ada konsekuensi yang mengikutinya kecuali Anda memilih untuk menindaklanjutinya. Meskipun demikian, Pasal 10 memberi Anda hak untuk mengajukan keberatan atas keputusan yang didasarkan semata-mata pada pemrosesan otomatis, dan Anda dapat menggunakannya dengan menghubungi kami. Kami akan menjelaskan bagaimana skor tersebut dihitung dan, apabila Anda meminta, menghapusnya.",
    ],
  },
  {
    heading: "11. Anak",
    blocks: [
      "Pengalaman ini ditujukan untuk orang dewasa. Berdasarkan Pasal 25 UU PDP, data pribadi anak hanya dapat diproses dengan persetujuan orang tua atau wali. Apabila Anda berusia di bawah 18 tahun, mohon bermain hanya dengan persetujuan tersebut.",
      `Apabila Anda meyakini seorang anak memberikan data pribadi kepada kami tanpa persetujuan itu, hubungi ${PRIVACY.dpoEmail} dan kami akan menghapusnya.`,
    ],
  },
  {
    heading: "12. Kuki dan pengukuran",
    blocks: [
      "Kami tidak menggunakan kuki iklan atau pelacakan. Kami menyimpan pengenal sesi acak di peramban Anda agar kami dapat menghitung berapa banyak orang yang mencapai setiap tahap dan di mana mereka berhenti. Pengenal itu tidak terhubung dengan nama atau email Anda, dan terhapus saat Anda menutup tab.",
    ],
  },
  {
    heading: "13. Perubahan kebijakan ini",
    blocks: [
      `Kami dapat memperbarui kebijakan ini seiring perubahan pengalaman. Tanggal di bagian atas menunjukkan kapan kebijakan terakhir direvisi, dan versi yang ditampilkan di sini selalu versi terkini. Kebijakan ini terakhir diperbarui pada ${PRIVACY.lastUpdated}.`,
    ],
  },
  {
    heading: "14. Menghubungi kami dan menyampaikan pengaduan",
    blocks: [
      `Untuk hal apa pun mengenai data pribadi Anda - akses, perbaikan, penghapusan, penarikan persetujuan, atau hak lain pada bagian 7 - hubungi Pejabat Pelindungan Data Pribadi kami di ${PRIVACY.dpoEmail}.`,
      "Apabila Anda tidak puas dengan penanganan kami, Anda dapat menyampaikan pengaduan kepada lembaga pengawas pelindungan data pribadi yang dibentuk berdasarkan UU PDP. Selama lembaga tersebut belum sepenuhnya beroperasi, pengaduan dapat disampaikan kepada kementerian yang menyelenggarakan urusan pemerintahan di bidang komunikasi dan digital, dan Anda tetap berhak mengajukan gugatan melalui pengadilan di Indonesia.",
    ],
  },
];

/**
 * The summit's policy in a given language.
 *
 * Both renderings are full documents rather than one being an overlay on the
 * other: legal text has to be readable top to bottom, and a half-translated
 * clause is worse than an untranslated one.
 */
export const SILOAM_PRIVACY_POLICY_SECTIONS: Record<Language, PolicySection[]> =
  {
    en: SECTIONS_EN,
    id: SECTIONS_ID,
  };
