/**
 * Pick-a-card brain care tips (event2 post-game screen) and the rotating
 * facts strip on the /event-v2/leaderboard TV board. Wording stays on the
 * wellness/educational side of the HSA line (see compliance.ts) and is swept
 * by tests/config/compliance.test.ts. Aligned with the 2024 Lancet Commission
 * modifiable-factor framing used across the quiz.
 */

export interface TipCategory {
  id: string;
  /** Card label under the face-down card ("I want to…"). */
  label: string;
  /** Serif headline on the revealed poster card. */
  headline: string;
  /** Card number shown as an eyebrow, e.g. "Brain care no. 1". */
  eyebrow: string;
  tips: string[];
}

export const TIPS: TipCategory[] = [
  {
    id: "memoryFocus",
    label: "Improve memory and focus",
    headline: "A sharper day starts the night before",
    eyebrow: "Brain care no. 1",
    tips: [
      "Sleep 7 to 9 hours. Memory consolidates while you sleep, and focus is the first thing short nights take.",
      "Move for 150 minutes a week. Aerobic exercise is associated with better attention and a healthier memory hub.",
      "Do one thing at a time. Switching between tasks taxes working memory more than the tasks themselves.",
    ],
  },
  {
    id: "staySharp",
    label: "Stay sharp as I age",
    headline: "Your brain keeps building, if you keep asking",
    eyebrow: "Brain care no. 2",
    tips: [
      "Keep learning new skills. Novelty builds cognitive reserve at any age.",
      "Stay social. Regular conversation is one of the strongest habits linked with staying sharp.",
      "Check your hearing. Untreated hearing loss is one of the largest changeable risk factors in the 2024 Lancet report.",
    ],
  },
  {
    id: "prevention",
    label: "Prevent cognitive decline",
    headline: "What protects your heart protects your brain",
    eyebrow: "Brain care no. 3",
    tips: [
      "Know your numbers. Blood pressure and cholesterol in midlife shape brain health decades later.",
      "Eat Mediterranean-style. Vegetables, fish and olive oil are associated with slower cognitive ageing.",
      "Skip the cigarettes and keep alcohol light. Both show up in nearly every prevention study.",
    ],
  },
];

export const TIPS_BY_ID: Record<string, TipCategory> = Object.fromEntries(
  TIPS.map((t) => [t.id, t]),
);

/** Rotating facts on the TV board. Short enough to read from across a room. */
export const BRAIN_FACTS: string[] = [
  "Your brain processes an image in as little as 13 milliseconds.",
  "The 2024 Lancet Commission links about 45% of dementia risk to 14 factors you can change.",
  "Processing speed peaks in your 20s. Vocabulary keeps growing into your 60s.",
  "Your brain runs on about 20 watts, roughly a dim light bulb.",
  "Regular aerobic exercise is associated with a larger hippocampus, the brain's memory hub.",
  "Deep sleep is when your brain clears out its metabolic waste.",
  "Learning a new skill builds cognitive reserve at any age.",
  "Your brain has around 86 billion neurons and trillions of connections.",
  "Scientists have studied reaction time since the 1860s.",
  "Treating hearing loss is one of the best-supported ways to look after your thinking skills.",
];
