import type { CopyConfig } from "@/types/copy";

/**
 * ALL user-facing copy lives here. British English. Working titles per build
 * brief §12 (Audrey owns final names/labels) - kept in one place so they're a
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
  menopauseSymptoms: "Hormonal changes",
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
        "Take a medically-backed quiz built on 14 modifiable risk factors to see how healthy your brain is.",
      credibility: {
        heading: "Built on science",
        points: [
          "Developed and validated at NTU's Lee Kong Chian School of Medicine, Dementia Research Centre.",
          "Grounded in the 2024 Lancet Commission Risk Report and the CAIDE (Cardiovascular Risk Factors, Aging, and Incidence of Dementia) Dementia Risk Score.",
        ],
        logo: "/gms-ntu-logo.png",
      },
      asSeenOnLabel: "As seen on",
      asSeenOn: [
        { alt: "The Straits Times", src: "/press-st.png" },
        { alt: "CNA", src: "/press-cna.png" },
        { alt: "Alzheimer's Association", src: "/press-alzheimers.svg" },
      ],
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
      emailPlaceholder: "Your email",
      emailNote: "Your email logs your result on the live leaderboard. Fastest processing speed of the night claims a $50 Grab voucher.",
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
      reviewerStrap: "Based on the 2024 L.C. report & CAIDE Risk Model",
      eventClosingHeading: "Want to understand what this means?",
      eventClosingBody:
        "Your Brain Health Score and recommendations are on their way to your inbox. Our team can walk you through your profile and the science behind it.",
      eventClosingCta: "Speak to our team",
      eyebrow: "Here's your score",
      scoreSuffix: "/100",
      drivingHeading: "What's driving this",
      gaugeLowLabel: "Higher risk",
      gaugeHighLabel: "Lower risk",
      gaugeBandCaption: "of modifiable factors affecting your brain health",
      unlockCta: "Unlock Now →",
      unlockTeasers: [
        "Your full risk breakdown",
        "What's driving your score",
        "Personalised next steps",
      ],
      // {factors} is replaced with the user's reported risk factors.
      paywallPreviewHeading: "What your {factors} could mean for you",
      paywallPreviewHeadingFallback: "What your results could mean for you",
      unlockOverlay: "Get your in-depth brain health analysis.",
      gameInviteHeading: "Reaction Time Challenge",
      gameInviteBody:
        "You've baselined your brain. Now benchmark your processing speed: the fastest score of the day claims a $50 Grab voucher.",
      gameInviteCta: "Benchmark your speed →",
    },
    paywall: {
      eyebrow: "The full picture",
      heading: "Take the complete brain health assessment",
      offerName: "ReCOGnAIze brain health assessment",
      offerNote:
        "Developed at NTU's Dementia Research Centre · Registered with Singapore's HSA",
      paperNote: "Validated in peer-reviewed research",
      paperUrl: "https://pubmed.ncbi.nlm.nih.gov/41685533/",
      includes: [
        "Clinically-validated neuroscientific games to detect specific brain functions",
        "1:1 consultation with medical professional",
        "Review & recommendations with a full in-depth report",
      ],
      doctor: {
        eyebrow: "Your teleconsult clinic",
        name: "Dr Odelia Koh",
        credentials: "MBBS (SG), MMED (Internal Medicine), MRCP (UK), GDFM (SG)",
        role: "Medical Director",
        org: "Prologue",
        initials: "OK",
        image: "/landing/dr-odelia-koh.jpg",
        bio: "Dr Odelia Koh is an accredited Family Physician who earned her MBBS from NUS in 2014 and a Master's in Internal Medicine in 2017. Her experience spans hospitals, A&E, the National Skin Centre, and polyclinics. She advocates early detection, disease prevention, and personalised care through Lifestyle Medicine and health screening.",
      },
      lineItem: "Brain health assessment",
      price: "S$99",
      priceOriginal: "S$199",
      priceTag: "Launch exclusive",
      priceNote: "One-off. Includes a clinician teleconsult.",
      promoPlaceholder: "Enter promo code",
      promoCta: "Apply",
      cta: "Book now",
      whatsappNumber: "6596747608",
      whatsappMessage:
        "Hi Prologue! I'd like to book a teleconsult with Dr Odelia Koh for the ReCOGnAIze Brain Health Consult. Here are my details:\n\nName:\nEmail:\nBrain Health Score:\nPreferred date/time:",
      faqs: [
        {
          q: "What is ReCOGnAIze?",
          a: "A digital brain health assessment developed at NTU's Dementia Research Centre and registered with Singapore's HSA, reviewed in a clinician teleconsult.",
        },
        {
          q: "How is the quiz different from ReCOGnAIze?",
          a: "This quiz is a free, educational estimate based on your modifiable risk factors. ReCOGnAIze is the full assessment, validated in peer-reviewed research and reviewed by a medical professional, that shows how your brain is actually performing.",
        },
        {
          q: "Is this assessment legit?",
          a: "Yes. ReCOGnAIze was developed and validated at NTU's Lee Kong Chian School of Medicine, Dementia Research Centre, is registered with Singapore's HSA, and every result is reviewed by a medical professional.",
        },
        {
          q: "Who is it for?",
          a: "Anyone staying ahead of their brain health: whether you want to maintain peak cognitive performance, you're navigating hormonal changes, or you're supporting a loved one living with dementia.",
        },
        {
          q: "What should I expect next?",
          a: "After you submit your booking details, our team will get back to you to confirm your appointment and share the next steps, so you know exactly what to expect before the assessment.",
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
      body: "Match the symbols against the clock. Fastest processing speed of the day claims a $50 Grab voucher.",
      placeholder:
        "Game placeholder: your symbol-matching game will drop in here.",
      cta: "Continue to the leaderboard",
      disclaimer: "Reaction-time games are fun, but not a cognitive assessment.",
    },
    leaderboard: {
      eyebrow: "Event leaderboard",
      heading: "Fastest minds",
      prize: "Fastest processing speed of the event claims a $50 Grab voucher.",
      youNote: "Live standings across the whole event.",
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
      topLabel: "Fastest so far",
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
    consult: {
      eyebrow: "Let's talk",
      heading: "Come and speak to our team",
      body: "We'd love to walk you through what your Brain Health Score means and the science behind it. Find us here at the booth, your full results are also on their way to your inbox.",
      closing: "Built with NTU's Dementia Research Centre.",
    },
    // Event v2 ("Ember Arena", /event-v2). The arena arc's copy; the quiz arc
    // reuses the shared screens above. Wording follows the FigJam v2 notes.
    event2: {
      splash: {
        eyebrow: "Reaction Time Challenge",
        heading: "How fast does your brain process?",
        body: "A quick symbol-matching test, backed by NTU's Dementia Research Centre. See your score, then explore your full brain health profile.",
        namePlaceholder: "Your name",
        emailPlaceholder: "Your email",
        emailNote:
          "One email is all we need. It puts you on the live leaderboard and is where your results go. Fastest time of the night wins a $50 Grab voucher.",
        cta: "Start the challenge",
      },
      instructions: {
        eyebrow: "How to play",
        heading: "Three rules. Twenty matches.",
        steps: [
          "A symbol appears at the top of your screen",
          "Tap its matching number in the grid below",
          "Get 20 correct as fast as you can. Wrong taps cost time",
        ],
        durationNote: "Most people finish in under a minute.",
        demoCta: "Show me once",
        skipCta: "Skip, I've got it",
      },
      gameResult: {
        eyebrow: "Your result",
        heading: "You just tested your processing speed",
        youLabel: "Your time",
        fastestLabel: "Fastest so far",
        rankLabel: "Your rank",
        playersLabel: "Players",
        topPercent: "Top {pct}% tonight",
        explainer:
          "Processing speed is how fast your brain takes in what it sees and responds.",
        shareCta: "Share my time",
        screenshotPrompt:
          "Screenshot your rank and dare a colleague to beat it.",
        tipHeading: "I want to…",
        tipPickAnother: "Pick a different card",
        tipSaveCta: "Save this card",
        bridgeHeading:
          "Fast reflexes. But how do you score on your overall brain health?",
        bridgeBody:
          "Speed is one of four domains. Memory, attention and executive function each tell their own story, and a 3-minute check shows the factors shaping all of them.",
        cta: "Check my brain health",
        ctaNote: "Free. About 3 minutes. Entirely optional.",
        decline: "No thanks, just the game",
        disclaimer:
          "Reaction-time games are fun, but not a cognitive assessment.",
      },
      closing: {
        eyebrow: "Your next step",
        heading: "Ready for the full picture?",
        body: "Your Brain Health Score and recommendations are on their way to your inbox. Tonight's quiz estimates your risk profile; the ReCOGnAIze assessment shows how your brain is actually performing.",
        reassurance:
          "Whatever your score tonight, most of the factors behind it can change. That is the point of checking early.",
        offerName: "ReCOGnAIze brain health assessment",
        offerPoints: [
          "Developed at NTU's Dementia Research Centre",
          "Registered with Singapore's HSA",
          "Results reviewed with a medical professional",
        ],
        cta: "Speak to our team at the booth",
        shareReminder: "Before you go: share your time and see who beats it.",
        credibility:
          "Built with NTU's Dementia Research Centre · 2024 Lancet Commission",
      },
      share: {
        text: "I clocked {time} on the Brain Health Check reaction challenge. Fast reflexes. But how do you score on your overall brain health?",
      },
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
