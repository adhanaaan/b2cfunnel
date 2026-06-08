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
        "Take a medically backed 5-minute quiz, built on 14 modifiable risk factors, to find out how well your brain is performing.",
      credibility: {
        heading: "Built on the science",
        points: [
          "Developed with NTU's Lee Kong Chian School of Medicine, Dementia Research Centre Singapore.",
          "Grounded in the 2024 Lancet Commission on dementia prevention.",
          "Methodology from the CAIDE risk model and the SCD framework.",
        ],
        logo: "/LKCMedicine-Dementia-Research-Centre-2.png",
      },
      durationNote: "Takes about 5 minutes. No login needed.",
      cta: "Get started",
      resourcesIntro:
        "Based on the 2024 Lancet Commission on Dementia Prevention, CAIDE, and the SCD framework.",
      // Event opt-in (shown after the game). No hard sell, fully optional.
      eventEyebrow: "Optional · Brain Health",
      eventHeading: "Want to see how healthy your brain is?",
      eventSubheading:
        "Reaction time is just reflexes. If you'd like, take an optional 3-minute brain health check, built on 14 modifiable risk factors. Entirely up to you.",
      eventCta: "Yes, check my brain health →",
      eventDurationNote: "About 3 minutes. Your choice to continue.",
      eventDecline: "No thanks, just the game",
    },
    nameGate: {
      eyebrow: "Reaction Time Challenge",
      heading: "How fast does your brain process?",
      body: "A quick symbol-matching challenge, inspired by the tasks researchers use to study processing speed. See how you do, then explore your full brain health profile, built with NTU's Dementia Research Centre.",
      placeholder: "Your name",
      emailPlaceholder: "Your Accenture email",
      emailNote: "Your Accenture email goes on the leaderboard and into the Fitbit draw.",
      cta: "Start the challenge →",
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
      // Event: personal email at the end, for the personalised score.
      personalEyebrow: "Your results",
      personalHeading: "Where should we send your results?",
      personalBody:
        "Your Brain Health Score is ready. Add a personal email and we'll send your full profile and recommendations. This is separate from the leaderboard, and only used to send your results.",
      personalPlaceholder: "Your personal email",
      personalCta: "Send my Brain Health Score →",
      personalPrivacyNote:
        "We'll only use this to send your results and brain health recommendations. Unsubscribe any time.",
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
        "Grounded in the 2024 Lancet Commission, built with NTU's Dementia Research Centre",
      eyebrow: "Here's your score",
      scoreSuffix: "/100",
      drivingHeading: "What's driving this",
      gaugeLowLabel: "Low",
      gaugeHighLabel: "High",
      unlockCta: "Unlock Now →",
      // {factors} is replaced with the user's reported risk factors.
      paywallPreviewHeading: "What your {factors} could mean for you",
      paywallPreviewHeadingFallback: "What your results could mean for you",
      unlockOverlay: "Get your in-depth brain health analysis.",
      gameInviteHeading: "Reaction Time Challenge",
      gameInviteBody:
        "You've baselined your brain. Now test your reflexes: the fastest scores of the day win a Fitbit.",
      gameInviteCta: "Play now →",
    },
    paywall: {
      eyebrow: "The full picture",
      heading: "Get measured properly with ReCOGnAIze",
      offerName: "ReCOGnAIze cognitive assessment",
      offerNote:
        "Developed at NTU's Dementia Research Centre · Registered with Singapore's HSA",
      bundle:
        "A 10–15 minute digital cognitive assessment plus a teleconsult to review your results.",
      price: "S$199",
      priceNote: "One-off. Includes a clinician teleconsult.",
      cta: "Book my consult",
      faqs: [
        {
          q: "Is this quiz a diagnosis?",
          a: "No. This is an educational tool that estimates your profile of factors. ReCOGnAIze is the proper assessment, developed at NTU's Dementia Research Centre and reviewed in a clinician teleconsult.",
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
    booking: {
      title: "Brain Health Consultation",
      priceOriginal: "S$390",
      priceNow: "S$199",
      bookCta: "Book now",
      bookingUrl: "#",
      includes: [
        "125 biomarkers",
        "Blood draw and urine test",
        "1:1 clinician consultation",
      ],
      panels: [
        {
          title: "Cardiometabolic & weight regulation",
          body: "An early read on cholesterol (including inherited risk), blood sugar, and the metabolic markers most associated with long-term brain health.",
        },
        {
          title: "Thyroid, adrenal & sex hormones (mood and brain fog)",
          body: "Brain fog and mood shifts commonly overlap with thyroid and hormone changes. This group gives a practical first pass across thyroid, adrenal, and sex-hormone balance.",
        },
        {
          title: "Nutrients, anaemia & energy (brain fog support)",
          body: "Key nutrients, iron status, and energy markers that, when low, can quietly affect focus, memory, and day-to-day mental sharpness.",
        },
      ],
      credibilityHeading: "Why this is credible",
      faqHeading: "FAQs",
      trustHeading: "In partnership with",
      trustLogo: "/LKCMedicine-Dementia-Research-Centre-2.png",
    },
    game: {
      eyebrow: "Reaction Time Challenge",
      heading: "Symbol Match",
      body: "Match the symbols against the clock. The fastest scores of the day win a Fitbit.",
      placeholder:
        "Game placeholder: your symbol-matching game will drop in here.",
      cta: "Continue to the leaderboard",
      disclaimer: "Reaction-time games are fun, but not a cognitive assessment.",
    },
    leaderboard: {
      eyebrow: "Today's leaderboard",
      heading: "Fastest minds today",
      prize: "🏆 Top of the day wins a Fitbit.",
      youNote: "Live standings reset daily.",
      shareHeading: "📸 Screenshot your rank",
      shareBody: "Share it and dare a colleague to beat your time.",
      shareCta: "Share",
      bridgeHeading: "Fast reflexes. But what does your speed actually mean?",
      bridgeBody:
        "Your reaction time is one slice of the picture. See what it says about your brain, and what else shapes your brain health.",
      cta: "See what this means →",
      disclaimer: "Reaction-time games are fun, but not a cognitive assessment.",
    },
    eventHook: {
      eyebrow: "Brain Health",
      rankHeading: "You just tested your processing speed",
      topLabel: "Fastest today",
      youLabel: "Your time",
      whatHeading: "What is processing speed?",
      whatBody:
        "It's how quickly your brain takes in information and responds, the engine behind quick thinking. It's also one of the first things to shift as the brain ages.",
      domainsHeading: "Unlock the full picture",
      domainsBody:
        "Processing speed is just one domain. Memory, attention and executive function each tell a different story, and they don't always change together.",
      testedDomain: "Processing Speed",
      testedLabel: "Tested",
      lockedDomains: ["Memory", "Attention", "Executive function"],
      lockedLabel: "Not tested",
      understandHeading: "Understand your brain better",
      understandBody:
        "Your brain health is shaped by factors you can change. Take an optional 3-minute check to see your profile and what protects these areas over time.",
      cta: "Explore your brain health →",
      decline: "No thanks, just the game",
      credibility:
        "Built with NTU's Dementia Research Centre · 2024 Lancet Commission",
      disclaimer:
        "Reaction-time games are fun, but not a cognitive assessment.",
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
        "See the full picture with a proper assessment, grounded in the 2024 Lancet Commission and NTU's Dementia Research Centre.",
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
        "A proper assessment can help tell apart treatable vascular changes from other causes, grounded in NTU's Dementia Research Centre.",
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
        "Understand whether what you're feeling is hormonal or worth a closer look, with an assessment built on the latest dementia-prevention science.",
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
        "Get an objective cognitive baseline and see where you stand, with a method grounded in the 2024 Lancet Commission.",
    },
  },

  // Result-screen blurb per band. {factors} is replaced with the user's
  // reported modifiable risk factors.
  resultBlurbs: {
    low: "Your brain health is in a strong shape with few risk factors and no major flags. The smartest move at this stage is to baseline now, while everything looks good. Measuring early gives you something to track against in years to come.",
    moderate:
      "A handful of modifiable factors are affecting your brain health performance. {factors} are the most movable levers, and that's where most of your risk is coming from. A clinically grounded check in now keeps every option open and tells you exactly what's worth focusing on first.",
    elevated:
      "Several factors in your profile are adding up, and they deserve attention. The good news is that most of them are modifiable, and many cognitive changes are reversible when caught at this stage. A proper brain health assessment now is the best next move, both to set a baseline and to flag anything that needs medical follow up.",
    high: "Your profile carries enough risk factors that we'd encourage you to act now, not later. The earlier cognitive change is identified, the more can be done about it, and many of the underlying factors in your score respond well to treatment when caught early. Book a cognitive assessment with a certified medical professional as your next step.",
  },

  bandLabels: {
    low: "Low risk",
    moderate: "Moderate risk",
    elevated: "Elevated risk",
    high: "High risk",
  },

  factorLabels: FACTOR_LABELS,
};
