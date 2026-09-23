import type { CopyConfig, PhklCopy } from "@/types/copy";
import type { DeepPartial } from "@/lib/deepMerge";

/**
 * Simplified Chinese (中文), for /phkl-2 - the Pantai Hospital KL activation.
 *
 * An OVERLAY, not a second copy config: `copyFor()` applies it over the English
 * `COPY` with `deepMerge`, so anything left out here renders in English rather
 * than as a blank - the same rule as the Bahasa Indonesia overlay in
 * config/copy.id.ts.
 *
 * What is covered is exactly what /phkl-2's arc puts on screen: the landing
 * (with the partner's consent), the two primers, the age question, the
 * instructions and the game, the questionnaire (config/questions.zh.ts), the
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

const PHKL_ZH: DeepPartial<PhklCopy> = {
  rail: {
    gameLabel: "游戏",
    quizLabel: "大脑健康测验",
    resultsLabel: "结果",
  },
  speedIntro: {
    eyebrow: "您即将测量",
    heading: "处理速度",
    body: "您的大脑*多快*接收*所见*的信息并*做出反应*。",
    cta: "明白了",
  },
  ageSelect: {
    heading: "选择您的年龄",
    body: "看看您与同龄人相比如何。",
  },
  greatJob: {
    heading: "做得好，您的速度已测量完成！",
    skipHint: "点击继续",
  },
  quizIntro: {
    heading: "{name}，您的大脑速度并非一成不变",
    headingAnonymous: "您的大脑速度并非一成不变",
    body: "它受睡眠、运动、饮食及其他生活方式因素影响。",
    factors: ["睡眠", "运动", "饮食"],
    lead: "接下来，回答几个关于您生活习惯的简短问题。",
    citation: {
      heading: "以科学为基础",
      body: "依据 2024 年《柳叶刀》委员会风险报告及 CAIDE（心血管风险因素、衰老与痴呆发生率）痴呆风险评分。",
    },
    cta: "继续",
  },
  analysing: {
    heading: "{name}，我们正在准备您的报告",
    headingAnonymous: "正在准备您的报告…",
    steps: [
      "关联您的反应时间挑战结果",
      "计算您的处理速度得分",
      "查看您的健康与生活方式回答",
      "与您的年龄组进行比较",
      "生成您的大脑健康评分",
    ],
  },
  splash: {
    eyebrow: "反应时间挑战",
    heading: "您的*大脑*处理信息有多*快*？",
    body: "做个简短的符号配对测试，了解您大脑的处理速度。",
    namePlaceholder: "姓名",
    emailPlaceholder: "您的电邮",
    consentRequired: "*必填。* 我同意就我的结果和奖品与我联系。",
    consentRequiredError: "请同意我们与您联系，以便向您发送结果。",
    nameError: "请输入您的姓名。",
    emailError: "请输入有效的电邮地址。",
    consentMarketing: "偶尔向我发送大脑健康小贴士和最新资讯。",
    privacyLinkLabel: "隐私政策",
    cta: "开始挑战",
    poweredBy: "技术支持：",
    partnerConsent: {
      clauses: [
        {
          text: "提供本表格所列信息，即表示我同意 IHH Healthcare Malaysia 及其代表和/或代理人收集、使用和披露我的个人资料，以便为我提供医疗服务及用于其他合理相关的目的。相关目的载于{link}，或可应要求提供。",
          link: {
            label: "IHH Healthcare Malaysia 资料保护声明",
            href: "https://www.ihhhealthcare.com/my/data-protection-notice",
          },
        },
        {
          text: "我亦同意 IHH Healthcare Malaysia、其代表、代理人和/或业务伙伴出于营销和推广目的收集、使用和披露我的个人资料。",
        },
        {
          text: "我同意通过短信、电话及其他基于马来西亚电话号码的通讯方式接收营销信息，无论我是否已登记“拒绝来电”（Do-Not-Call）名单。",
        },
        {
          text: "我明白我可随时通过取消订阅功能、向我们的职员索取的表格，或发送电邮至 IHH Healthcare Malaysia 资料保护官 {link} 撤回此同意。",
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
      eyebrow: "反应时间挑战",
      // {ordinal} is rendered by `ordinalFor` in lib/format.ts, which gives
      // "第1次" here; the highlight completes the line: "…的第1次 / 处理速度记录".
      heading: "{name}的{ordinal}",
      headingAnonymous: "您的{ordinal}",
      headingHighlight: "处理速度记录",
      timeLabel: "时间",
      rankLabel: "排名",
      fastestLabel: "目前最快",
      fastestEmpty: "成为第一名",
      shareLabel: "分享",
      retryLabel: "重试",
    },
    risk: {
      eyebrow: "我们还测量了",
      heading: "速度并不是我们唯一关注的。",
      body: "我们也查看了您的风险因素。高血压、睡眠不足或运动太少等健康与生活习惯，会随着时间推移减慢您的大脑。",
      riskLevelLabel: "您的风险水平：",
      factorsLead: "{name}，影响您风险水平的一些因素：",
      factorsLeadAnonymous: "影响您风险水平的一些因素：",
      noFactors: "您的回答中没有特别突出的生活方式或生物医学因素。",
      goodNews: "好消息是",
      sourceLabel: "来源：",
    },
    speed: {
      headingParts: [
        "处理速度，就是大脑",
        "多快",
        "地",
        "接收",
        "眼前的信息并",
        "做出反应",
        "。",
      ],
      intro: "处理速度快，您就能：",
    },
    baseline: {
      eyebrow: "目前的基线",
      heading: "您只完成了",
      headingHighlight: "5 项中的 2 项",
      cardLabel: "您的基线",
      cardProgress: "已完成 2/5",
      axes: ["速度", "记忆", "注意力", "执行功能", "风险"],
      paragraphs: [
        "速度游戏和测验回答为我们提供了两个维度：速度和风险。",
        "但您的大脑并不只在两个维度上运作。记忆、注意力和执行功能各有各的表现，您可能在某一方面表现出色，却在另一方面有所欠缺。",
        "完整测试会补齐其余部分，让建议更贴合您大脑的真实表现。",
      ],
    },
    wrapUp: {
      quoteParts: [
        "明天的会议很棘手，如果注意力跟不上，我就无法好好发挥。多亏检测了大脑，我现在知道该如何优化它。很高兴发现了 ",
        "ReCOGnAIze",
        "！",
      ],
      attributionAgeBand: "30-39",
      attribution: "Chelsea，30 至 39 岁",
      attributionPeer: "Chelsea，和您一样 30 至 39 岁",
      thinkingHeading: "还需要时间考虑？",
      thinkingBody: [
        "您的得分已发送到您的邮箱，还附上了一套提升得分的简短策略。",
        "当您准备好测试其余三个大脑领域时，您知道在哪里找到我们。",
      ],
      credit:
        "基于南洋理工大学李光前医学院新加坡痴呆症研究中心的临床研究。",
    },
    sticky: {
      book: "预约记忆筛查",
    },
    offer: {
      eyebrow: "现在该做什么？",
      heading: "预约您的记忆筛查配套",
      body: "大脑伴随您走过人生的每个阶段。了解它今天的状况，以及您能为未来的岁月做些什么来保护它。",
      poster: {
        hospital: "Pantai Hospital Kuala Lumpur",
        hospitalNote: "IHH Healthcare 旗下",
        title: ["记忆", "筛查", "配套"],
        price: "RM460",
        includesHeading: "配套包括",
        includes: ["专科医生咨询", "数字认知评估", "化验检查"],
        whoHeading: "哪些人应考虑筛查？",
        who: [
          "情绪或行为出现变化",
          "有阿尔茨海默病家族史",
          "对时间或地点感到混乱",
          "难以集中注意力",
          "40 岁及以上",
          "经常健忘",
        ],
      },
      proofParts: [
        "经 MRI 扫描验证，基于南洋理工大学一项涵盖 1,500 人、为期五年的研究，并发表于 ",
        "Alzheimer's & Dementia",
        "。",
      ],
      includesEyebrow: "筛查内容",
      assessmentHeading: ["数字认知评估", "10 分钟大脑健康游戏"],
      assessmentBody: "一项在线评估，通过游戏测量速度、注意力、决策能力和记忆力。",
      reportHeading: "获取完整报告",
      reportBody: "查看您的大脑表现，以及切实可行的改善方法。",
      cta: "预约我的筛查",
      quote:
        "这些游戏中的每一个，都以我在诊所评估时相同的方式测量一项特定的大脑功能。我们测试的不是您会不会玩，而是您大脑的每个部分每天为您完成工作的表现如何。",
      quoteName: "Nagaendran Kandiah 副教授",
      quoteRole: [
        "Gray Matter Solutions 联合创始人",
        "MBBS, FAMS (Neurology), FRCP (Edin)",
      ],
    },
  },
};

export const COPY_ZH: DeepPartial<CopyConfig> = {
  screens: {
    // ---------------------------------------------------------------- game --
    symbolMatch: {
      getReady: "准备",
      challengeName: "反应时间挑战",
      readyLine: "尽快配对 {count} 个符号。准备…",
      go: "开始！",
      timeLabel: "时间",
      soundOn: "打开声音",
      soundOff: "关闭声音",
      symbolAlt: "配对这个符号",
      tour: {
        focusSymbol: "留意屏幕顶部的符号。",
        findMatch: "找到相同的符号及其数字。这里是 {number}。",
        tapNumber: "在下方数字键盘上点击“{number}”。",
        orderChanges: "注意，每一轮后符号的顺序都可能改变。",
        tryYourself: "接下来几轮请自己试试！",
        startPractice: "开始练习",
        practiceLabel: "练习",
        demoLabel: "示范",
        completeHeading: "很好！\n现在开始挑战吧。",
        completeStart: "开始",
        completeRetry: "再试一次",
      },
    },

    // --------------------------------------------- the daylight arc screens --
    event3: {
      instructions: {
        heading: "反应时间挑战",
        subheading: "尽快将 {count} 个符号与对应的数字配对。",
        demoBadge: "示范 · 自动播放",
        helper: "每一轮后符号都会换位置，所以每次都要看清对照表。",
        demoCta: "示范一轮",
        playCta: "开始",
      },
      // The share sheet. The play link is appended after the last line, so it
      // still has to end on a colon.
      share: {
        text: "我在大脑健康反应挑战中取得了 {time} 的成绩",
        rankLine: "排名 {rank}/{total}",
        cta: "你能打破我的纪录吗？在这里亲自试试:",
        shared: "已分享。",
        downloaded: "卡片已保存。文字已复制到剪贴板。",
        copied: "已复制到剪贴板。",
        unavailable: "此处无法分享。",
      },
      // The three perks the report reuses from the "?" popup.
      speedPopup: {
        eyebrow: "这到底意味着什么",
        headingParts: [
          "处理速度，就是大脑",
          "多快",
          "地",
          "接收",
          "眼前的信息并",
          "做出反应",
          "。",
        ],
        intro: "处理速度快，您就能：",
        points: [
          "跟上节奏快的对话",
          "迅速适应不断变化的环境",
          "在收银员扫描完之前算好账单",
        ],
        closeLabel: "明白了",
      },
    },

    event2: {
      report: {
        chart: {
          heading: "管理风险因素，就能改变曲线",
          managedLabel: "风险因素已管理",
          unmanagedLabel: "风险因素未管理",
          fasterLabel: "更快",
          slowerLabel: "更慢",
          ageLabel: "年龄",
          footnote:
            "示意趋势，参考 Jaarsma 等人 2024 年及 Yaffe 等人 2020 年（CARDIA）研究。并非临床预测。",
          ariaLabel:
            "两条示意曲线，显示 30 岁至 75 岁之间的思维速度。两条曲线都呈下降趋势。风险因素未管理的曲线比已管理的曲线下降得更早、更多。",
        },
        actionablesHeading: "以下是您现在就能做的 3 件事",
      },
    },

    // ----------------------------------------------------- Pantai Hospital --
    phkl: PHKL_ZH,
    // /phkl-2's landing reads its own block; only the words move, so its
    // privacy link stays the English block's.
    phkl2: { splash: PHKL_ZH.splash },
  },

  bandLabels: {
    low: "低风险",
    moderate: "中等风险",
    elevated: "较高风险",
    high: "高风险",
  },

  bandShortLabels: {
    low: "低",
    moderate: "中等",
    elevated: "较高",
    high: "高",
  },

  // Keyed by question id, exactly as the English table is, so the engine's
  // own output is untouched and only the label the report prints changes.
  factorLabels: {
    age: "年龄",
    hotFlushes: "荷尔蒙变化",
    menopauseSymptoms: "荷尔蒙变化",
    familyHistory: "家族史",
    highBp: "血压",
    highCholesterol: "胆固醇",
    diabetes: "血糖",
    hearingLoss: "听力",
    visionLoss: "视力",
    smoking: "吸烟",
    sleep: "睡眠",
    exercise: "运动",
    diet: "饮食",
    alcohol: "酒精",
  },

  quiz: {
    progress: "第 {current} 题，共 {total} 题",
    back: "← 返回",
    continue: "继续",
    groupTitles: {
      "A bit of health history": "一些健康史",
      "Your lifestyle": "您的生活方式",
    },
  },

  reportStat: {
    stat: "约 45%",
    body: "的全球痴呆症病例，可通过在人生各阶段应对可改变的风险因素而得到预防或延缓。",
    source: "2024 年《柳叶刀》痴呆症预防委员会",
  },
};
