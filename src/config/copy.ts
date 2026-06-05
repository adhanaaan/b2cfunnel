import type { CopyConfig } from "@/types/copy";

/**
 * ALL user-facing copy lives here. British English. Working titles per build
 * brief §12 (Audrey owns final names/labels) — kept in one place so they're a
 * single edit. Language stays on the wellness/educational side of the HSA line
 * (see compliance.ts); avoid "diagnose", "detect dementia", "clinically
 * validated", etc. Prefer "estimate", "suggests", "associated with",
 * "your profile of factors".
 */

// Driving-factor pill labels, keyed by question id. Used by the engine and the
// result screen so labels stay consistent.
export const FACTOR_LABELS: Record<string, string> = {
  age: "Age",
  hotFlushes: "Hormonal changes",
  familyHistory: "Family history",
  highBp: "Blood pressure",
  highCholesterol: "Cholesterol",
  diabetes: "Blood sugar",
  hearingLoss: "Hearing",
  visionLoss: "Vision",
  smoking: "Smoking",
  sleep: "Sleep",
  exercise: "Exercise",
  diet: "Diet",
  alcohol: "Alcohol",
};

export const COPY: CopyConfig = {
  screens: {
    hook: {
      eyebrow: "Gray Matter Solutions",
      heading: "Is your brain at its peak performance?",
      subheading:
        "A medically backed 5-minute quiz, built on 14 modifiable risk factors, to find out how well your brain is performing.",
      doctor: {
        avatarInitials: "Dr",
        name: "Dr. [Name]",
        credentials: "[Credentials, e.g. MD, Neurologist]",
        affiliation: "[Affiliation / role]",
      },
      durationNote: "Takes about 5 minutes. No login needed.",
      cta: "Get started",
      resourcesIntro:
        "A medically backed quiz based on the 2024 Lancet Commission on Dementia Prevention, CAIDE, and the SCD framework.",
    },
    emailGate: {
      eyebrow: "Almost there",
      heading: "Where should we send your score?",
      body: "Your Brain Health Score is ready. Tell us your name and email, and we'll send you a copy.",
      nameLabel: "First name",
      namePlaceholder: "Your first name",
      placeholder: "you@example.com",
      cta: "Reveal my score",
      privacyNote:
        "We'll only use your details to share your results and brain health recommendations. Unsubscribe any time.",
    },
    analysing: {
      heading: "{name}, we are building your profile",
      headingFallback: "We are building your profile",
      crumbs: [
        "Reviewing your profile of factors…",
        "Comparing with an age-matched cohort…",
        "Weighing lifestyle and biomedical factors…",
        "Cross-referencing the 2024 Lancet Commission framework…",
        "Preparing your Brain Health Score…",
      ],
    },
    resultBase: {
      reviewerStrap:
        "Reviewed by A/Prof Kandiah, Senior Consultant Neurologist",
      reviewerInitials: "NK",
      eyebrow: "Here's your score",
      scoreSuffix: "/100",
      drivingHeading: "What's driving this",
      gaugeLowLabel: "Low",
      gaugeHighLabel: "High",
      unlockCta: "Unlock now →",
      // {factors} is replaced with the user's reported risk factors.
      paywallPreviewHeading: "What your {factors} could mean for you",
      paywallPreviewHeadingFallback: "What your results could mean for you",
      unlockOverlay:
        "Get a more in-depth brain health analysis and consult a certified medical professional.",
    },
    paywall: {
      eyebrow: "The full picture",
      heading: "Get measured properly with ReCOGnAIze",
      doctorName: "A/Prof Nagaendran Kandiah",
      doctorTitle: "Senior Consultant Neurologist",
      bundle:
        "A 10–15 minute digital cognitive assessment plus a teleconsult to review your results.",
      price: "S$199",
      priceNote: "One-off. Includes your neurologist review.",
      cta: "Book my consult",
      faqs: [
        {
          q: "Is this quiz a diagnosis?",
          a: "No. This is an educational tool that estimates your profile of factors. ReCOGnAIze is the proper assessment, reviewed by a neurologist.",
        },
        {
          q: "What is ReCOGnAIze?",
          a: "A digital cognitive assessment developed at NTU's Dementia Research Centre and registered with Singapore's HSA, reviewed in a teleconsult.",
        },
        {
          q: "How long does it take?",
          a: "The assessment is about 10–15 minutes, followed by a teleconsult to talk through what it suggests for you.",
        },
        {
          q: "Who is it for?",
          a: "Anyone who wants a clearer baseline, whether you're noticing changes, supporting a loved one, or simply staying ahead of things.",
        },
      ],
    },
  },

  personas: {
    neutral: {
      headline: "Your brain health profile",
      blurb: {
        low: "Your lifestyle and biomedical answers point to a strong profile. A proper baseline is still worth having.",
        moderate:
          "A few lifestyle and biomedical factors are adding up. Most are modifiable, and a check-in is worthwhile.",
        elevated:
          "Several lifestyle and biomedical factors are stacking up in your profile. The good news: most are modifiable when measured properly.",
        high: "A number of lifestyle and biomedical factors are stacking up. Many are treatable when caught early, so it's worth measuring properly.",
      },
      leadBlurSection: "cognitiveInterpretation",
      paywallAngle:
        "See the full picture with a proper assessment and a neurologist review.",
    },
    caregiver: {
      headline: "Is this normal ageing, or something worth checking?",
      blurb: {
        low: "The lifestyle and biomedical factors here point to a reassuring profile. A baseline gives you something to compare against over time.",
        moderate:
          "A few lifestyle and biomedical factors are worth keeping an eye on. Knowing your baseline makes future changes easier to spot.",
        elevated:
          "Several lifestyle and biomedical factors are adding up. Many, including vascular ones, are modifiable and respond well to early action.",
        high: "A number of lifestyle and biomedical factors are stacking up. Vascular factors in particular are often treatable when caught early.",
      },
      leadBlurSection: "vascular",
      paywallAngle:
        "A proper assessment can help tell apart treatable vascular changes from other causes, reviewed by a neurologist.",
    },
    perimenopausal: {
      headline: "Is what you're feeling hormonal, or something else?",
      blurb: {
        low: "Your lifestyle and biomedical answers point to a strong profile. A baseline helps you track how you feel through hormonal changes.",
        moderate:
          "A few lifestyle and biomedical factors are adding up alongside the changes you're noticing. Most are modifiable.",
        elevated:
          "Several lifestyle and biomedical factors are stacking up. A proper baseline helps separate what's hormonal from what's worth a closer look.",
        high: "A number of lifestyle and biomedical factors are stacking up. Measuring properly helps make sense of what you've been feeling.",
      },
      leadBlurSection: "cognitiveInterpretation",
      paywallAngle:
        "Understand whether what you're feeling is hormonal or worth a closer look, with a neurologist review.",
    },
    highPerformer: {
      headline: "You track everything else. Baseline the organ that runs it all.",
      blurb: {
        low: "Your lifestyle and biomedical answers point to a strong profile. A baseline is the one metric you're probably missing.",
        moderate:
          "A few lifestyle and biomedical factors are nudging your profile. Small, modifiable changes keep you ahead.",
        elevated:
          "Several lifestyle and biomedical factors are stacking up. They're modifiable, and worth getting an objective baseline on.",
        high: "A number of lifestyle and biomedical factors are stacking up. The earlier you baseline, the more you can act on.",
      },
      leadBlurSection: "percentile",
      paywallAngle:
        "Get an objective cognitive baseline and see where you stand, reviewed by a neurologist.",
    },
  },

  bandLabels: {
    low: "Low risk",
    moderate: "Moderate risk",
    elevated: "Elevated risk",
    high: "High risk",
  },

  factorLabels: FACTOR_LABELS,
};
