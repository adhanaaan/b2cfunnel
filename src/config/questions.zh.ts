import type { QuestionText } from "@/config/questions.id";

/**
 * The question bank in Simplified Chinese (中文), for /phkl-2 and /phkl-3.
 *
 * WORDS ONLY, like config/questions.id.ts: no ids, no axes, no `showIf` and no
 * scores. `questionsFor()` reads the English bank and replaces only the prompts
 * and labels it finds here, so a Chinese score sits on the same /100 scale as
 * every other. Anything missing falls back to English.
 *
 * Only the questions /phkl-2's arc asks are translated (the /phkl set).
 */

/** The shared frequency scale behind concentrating / judgement / forgetfulness. */
const FREQUENCY: Record<string, string> = {
  almostDaily: "几乎每天",
  severalWeek: "每周几次",
  rarely: "很少",
  notNotice: "没有察觉",
};

/** Yes / no / not sure, as the health-history questions ask it. */
const YES_NO_UNSURE: Record<string, string> = {
  yes: "是",
  no: "否",
  unsure: "不确定",
};

export const QUESTIONS_ZH: Record<string, QuestionText> = {
  age: {
    prompt: "您的年龄是？",
    options: {
      "18-29": "18 至 29 岁",
      "30-39": "30 至 39 岁",
      "40-49": "40 至 49 岁",
      "50-59": "50 至 59 岁",
      "60+": "60 岁及以上",
    },
  },
  sex: {
    prompt: "您出生时的生理性别是？",
    options: { female: "女", male: "男" },
  },
  hotFlushes: {
    prompt: "您是否出现潮热、盗汗或月经周期变化？",
    options: { yes: "是", no: "否" },
  },
  menopauseSymptoms: {
    prompt: "荷尔蒙变化是否影响您的睡眠、情绪，或让您脑雾？",
    options: {
      often: "经常",
      sometimes: "有时",
      notReally: "不太会",
      notSure: "不确定",
    },
  },
  familyHistory: {
    prompt: "您的家族中是否有人患有痴呆症或阿尔茨海默病？",
    options: {
      immediate: "有，直系亲属（父母或兄弟姐妹）",
      extended: "有，其他亲属（祖父母、叔伯姑姨等）",
      none: "没有",
      unsure: "我不确定",
    },
  },
  highBp: { prompt: "高血压？", options: YES_NO_UNSURE },
  highCholesterol: { prompt: "高胆固醇？", options: YES_NO_UNSURE },
  diabetes: { prompt: "糖尿病或糖尿病前期？", options: YES_NO_UNSURE },
  hearingLoss: {
    prompt: "未经治疗的听力损失？",
    helpText: "没有使用助听器或其他辅助。",
    options: YES_NO_UNSURE,
  },
  visionLoss: {
    prompt: "未经矫正的视力下降？",
    helpText: "没有通过眼镜、隐形眼镜或手术矫正。",
    options: YES_NO_UNSURE,
  },
  smoking: {
    prompt: "您目前吸烟，或在过去 10 年内吸过烟吗？",
    options: {
      current: "我目前吸烟",
      past: "我在过去 10 年内吸过烟",
      never: "从不吸烟，或已戒烟超过 10 年",
    },
  },
  sleep: {
    prompt: "您平均每晚睡多久？",
    options: {
      lt6: "少于 6 小时",
      "6to7": "6 至 7 小时",
      "7to9": "7 至 9 小时",
      gt9: "超过 9 小时",
    },
  },
  exercise: {
    prompt: "您每周做多少有氧运动？",
    options: {
      lt75: "少于 75 分钟",
      "75to149": "75 至 149 分钟",
      "150to300": "150 至 300 分钟",
      gt300: "超过 300 分钟",
    },
  },
  diet: {
    prompt: "您会如何描述自己的饮食？",
    options: {
      poor: "大多是加工食品或高糖食物",
      moderate: "新鲜与加工食品参半",
      healthy: "大多是新鲜、均衡的餐食",
    },
  },
  alcohol: {
    prompt: "您每周喝多少杯含酒精饮料？",
    helpText: "1 杯约等于 1 小杯葡萄酒、半品脱啤酒或 1 小杯烈酒。",
    options: {
      none: "不喝",
      "1to7": "1 至 7 杯",
      "8to14": "8 至 14 杯",
      "15to21": "15 至 21 杯",
      gt21: "超过 21 杯",
    },
  },
  tracks: {
    prompt: "您目前在追踪哪些方面？",
    helpText: "可多选。",
    options: {
      performance: "工作效率、专注力或工作表现",
      biometrics: "睡眠、HRV、体能或营养补充品",
      hormones: "荷尔蒙、月经周期或更年期症状",
      family: "家人的健康（我在照顾某人）",
      nothing: "没有特别追踪",
    },
  },
  concentrating: {
    prompt: "您在开会或进行需要持续专注的任务时，多常难以集中注意力？",
    options: FREQUENCY,
  },
  judgement: {
    prompt: "与几年前相比，您多常在判断或做决定时遇到困难？",
    options: FREQUENCY,
  },
  forgetfulness: {
    prompt: "您多常忘事，例如把东西放在哪里，或本来打算做什么？",
    options: FREQUENCY,
  },
  persistence: {
    prompt: "这种健忘是持续存在，而不只是偶尔一次？",
    options: {
      yes: "是，一直持续",
      no: "不是，时有时无",
    },
  },
  someoneElseNoticed: {
    prompt: "是否有其他人注意到您的行为或习惯有这些变化？",
    options: { yes: "是", no: "否" },
  },
};
