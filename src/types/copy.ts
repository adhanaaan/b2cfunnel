import type { BandName, Persona } from "@/types/engine";

/** Shape of the editable copy config. British English throughout. */

// Institutional / evidence credibility block (replaces the named clinician).
export interface CredibilityCopy {
  heading: string;
  points: string[];
  logo?: string; // path under /public to the partner logo
}

export interface HookCopy {
  eyebrow: string;
  heading: string;
  subheading: string;
  credibility: CredibilityCopy;
  asSeenOnLabel: string;
  asSeenOn: { alt: string; src: string }[]; // press / endorsement logos
  durationNote: string;
  cta: string;
  resourcesIntro: string;
  // Event variant: this screen is an explicit opt-in after the game, not a
  // cold open or a sell. Accenture requires players to opt in to continue.
  eventEyebrow: string;
  eventHeading: string;
  eventSubheading: string;
  eventCta: string;
  eventDurationNote: string;
  eventDecline: string; // copy on the "no thanks" path
}

export interface NameGateCopy {
  eyebrow: string;
  heading: string;
  body: string;
  placeholder: string;
  emailPlaceholder: string;
  emailNote: string;
  cta: string;
}

export interface EmailGateCopy {
  eyebrow: string;
  heading: string;
  body: string;
  nameLabel: string;
  namePlaceholder: string;
  placeholder: string;
  cta: string;
  privacyNote: string;
  // Event variant: collected at the end for the personalised score, kept
  // separate from the Accenture/leaderboard email captured up front.
  personalEyebrow: string;
  personalHeading: string;
  personalBody: string;
  personalPlaceholder: string;
  personalCta: string;
  personalPrivacyNote: string;
}

export interface AnalysingCopy {
  // Use {name} as a placeholder for the captured first name.
  heading: string;
  headingFallback: string;
  crumbs: string[]; // credibility crumbs cycled during the suspense screen
}

// Event closing (no sell): the result screen ends with a "speak to our team"
// prompt instead of the paywall, and a final ConsultScreen.
export interface ConsultCopy {
  eyebrow: string;
  heading: string;
  body: string;
  closing: string;
}

export interface ResultBaseCopy {
  reviewerStrap: string;
  // Event-only closing prompt shown in place of the paywall preview.
  eventClosingHeading: string;
  eventClosingBody: string;
  eventClosingCta: string;
  eyebrow: string;
  scoreSuffix: string; // '/25'
  drivingHeading: string;
  gaugeLowLabel: string;
  gaugeHighLabel: string;
  gaugeBandCaption: string;
  unlockCta: string;
  unlockTeasers: string[]; // locked items teased on the result preview
  paywallPreviewHeading: string; // template containing {factors}
  paywallPreviewHeadingFallback: string;
  unlockOverlay: string;
  // Event variant: the score screen invites the player into the reaction game.
  gameInviteHeading: string;
  gameInviteBody: string;
  gameInviteCta: string;
}

// The reaction game (event only) - kept separate from the brain-health score.
export interface GameCopy {
  eyebrow: string;
  heading: string;
  body: string;
  placeholder: string;
  cta: string;
}

/**
 * The Reaction Time Challenge itself: the countdown, the HUD and the guided
 * tour that runs before the timed round.
 *
 * These were literals inside the game components until the Siloam summit
 * needed the whole arc in Bahasa Indonesia. They are here so the game can be
 * translated with everything else; nothing about how it is scored or timed
 * reads from this block.
 */
export interface SymbolMatchCopy {
  /** The countdown's eyebrow, on the warm (event2/daylight) theme. */
  getReady: string;
  /** The cold theme's eyebrow. */
  challengeName: string;
  /** "Match {count} symbols as fast as you can. Ready…" */
  readyLine: string;
  /** The last beat of the countdown, in place of a number. */
  go: string;
  /** The HUD's label over the running clock. */
  timeLabel: string;
  soundOn: string; // aria-label when sound is off
  soundOff: string; // aria-label when sound is on
  symbolAlt: string; // alt text on the symbol to be matched
  /** The guided tour, step by step. */
  tour: {
    focusSymbol: string;
    /** Contains {number} - the answer the tour walks through. */
    findMatch: string;
    /** Contains {number}. */
    tapNumber: string;
    orderChanges: string;
    tryYourself: string;
    startPractice: string;
    /** The two chips over the practice board during the tour. */
    practiceLabel: string;
    demoLabel: string;
    /** The final card, before the timed round. */
    completeHeading: string;
    completeStart: string;
    completeRetry: string;
  };
}

export interface LeaderboardCopy {
  eyebrow: string;
  heading: string;
  prize: string;
  youNote: string;
  shareHeading: string;
  shareBody: string;
  shareCta: string;
  bridgeHeading: string;
  bridgeBody: string;
  cta: string;
}

// Post-game opt-in hook (event only). Recaps the player's processing-speed
// result, then teases the locked cognitive domains and invites them into the
// optional brain-health check. Inspired by the recognaizelite hook report.
export interface EventHookCopy {
  eyebrow: string;
  rankHeading: string;
  topLabel: string;
  youLabel: string;
  whatHeading: string;
  whatBody: string;
  domainsHeading: string;
  domainsBody: string;
  testedDomain: string;
  testedLabel: string;
  lockedDomains: string[];
  lockedLabel: string;
  understandHeading: string;
  understandBody: string;
  cta: string;
  decline: string;
  credibility: string;
}

// Event v2 ("Ember Arena", /event-v2). One block per screen in the arena arc;
// the quiz arc reuses the shared screens and their copy.
export interface Event2Copy {
  splash: {
    eyebrow: string;
    heading: string;
    body: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    emailNote: string;
    cta: string;
  };
  instructions: {
    eyebrow: string;
    heading: string;
    steps: string[]; // one line per rule, rendered full page
    durationNote: string;
    demoCta: string; // runs the guided tour
    skipCta: string; // straight to the countdown
  };
  gameResult: {
    eyebrow: string;
    heading: string;
    youLabel: string;
    fastestLabel: string;
    rankLabel: string;
    playersLabel: string;
    topPercent: string; // template containing {pct}
    explainer: string;
    shareCta: string;
    screenshotPrompt: string;
    retakeCta: string;
    tipHeading: string; // the pick-a-card prompt
    tipPickAnother: string;
    tipSaveCta: string;
    bridgeHeading: string;
    bridgeBody: string;
    cta: string;
    ctaNote: string;
    decline: string;
  };
  closing: {
    eyebrow: string;
    heading: string;
    body: string;
    bodyNoQuiz: string; // decline path: no score is on its way
    reassurance: string; // caring line, matters most to low scorers
    offerName: string;
    offerPoints: string[];
    cta: string;
    shareReminder: string;
    credibility: string;
  };
  share: {
    text: string; // share-sheet caption, template containing {time}
  };
  // The long-scrolling report: the score card is shared with the other
  // variants, these are the sections below it.
  report: {
    chart: {
      heading: string;
      managedLabel: string;
      unmanagedLabel: string;
      fasterLabel: string;
      slowerLabel: string;
      ageLabel: string; // prefixes the first age tick, e.g. "Age 30"
      footnote: string; // illustrative framing plus the citation
      ariaLabel: string; // the trend stated in words, for screen readers
    };
    actionablesHeading: string;
    nextStepsHeading: string;
    optInLabel: string;
    optInConfirmed: string;
  };
}

/**
 * One clause of a partner's consent wording. {link} in `text` marks where the
 * inline link sits; a clause with no link renders its text as-is.
 */
export interface ConsentClause {
  text: string;
  link?: { label: string; href: string };
}

// Event v3 ("Daylight Ember", /event-v3). Redesigned arena screens only;
// the game, quiz arc, report and closing reuse the event2 copy.
export interface Event3Copy {
  splash: {
    eyebrow: string;
    // Hero words wrapped in *asterisks* render with the warm ember gradient.
    heading: string;
    body: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    // PDPA consent. The first is required to play (we email results and need
    // to reach the prize winner); the second is a separate marketing opt-in.
    consentRequired: string;
    consentRequiredError: string;
    /** Shown when the two fields above the consents are empty or malformed. */
    nameError: string;
    emailError: string;
    consentMarketing: string;
    privacyLinkLabel: string;
    // Where the privacy link goes. Each event links the policy written for it:
    // the regatta has its own, because its policy names the partner it shares
    // data with, and the no-partner events must not carry that wording.
    privacyHref: string;
    cta: string;
    poweredBy: string;
  };
  // Partner consent page, between the landing and the instructions. IHH's
  // wording is one all-or-nothing agreement, so it is one tick over the whole
  // block rather than a tick per clause.
  consent: {
    heading: string;
    body: string;
    eyebrow: string;
    // The clauses the single tick covers, in the partner's own words.
    clauses: ConsentClause[];
    // Sits below the tick, unticked: a statement of the withdrawal right, not
    // something to agree to.
    withdrawal: ConsentClause;
    cta: string;
  };
  // Terminal screen while a challenge is closed (EVENT3_CHALLENGE_CLOSED on
  // v3, IHHSEA_CHALLENGE_CLOSED on the regatta).
  wrap: {
    heading: string;
    body: string;
    // The one way onward: a link out to the GMS site.
    linkIntro: string;
    linkLabel: string;
    linkHref: string;
  };
  instructions: {
    heading: string;
    // Rendered with the {count} bolded inline.
    subheading: string;
    demoBadge: string;
    helper: string;
    demoCta: string; // runs the guided in-game tour
    playCta: string; // straight to the countdown
  };
  gameResult: {
    shareLabel: string;
    retryLabel: string;
    headingPrefix: string;
    headingHighlight: string; // gradient words, carries the "?" popup trigger
    youLabel: string;
    rankLabel: string;
    fastestLabel: string;
    bridgeIntro: string;
    bridgeQuestion: string;
    bridgeHighlight: string;
    cta: string;
  };
  // Share-sheet caption, assembled from these lines. The play URL is appended
  // by the share ladder, so the last line ends on a colon.
  share: {
    text: string; // contains {time}
    rankLine: string; // contains {rank} and {total}; dropped if rank is unknown
    cta: string;
    /** What the share button reports back, one line per rung of the ladder. */
    shared: string;
    downloaded: string;
    copied: string;
    unavailable: string;
  };
  // The "?" popup: what processing speed actually means.
  speedPopup: {
    eyebrow: string;
    // Heading fragments alternate plain/emphasised, starting plain.
    headingParts: string[];
    intro: string;
    points: string[];
    closeLabel: string;
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface PaywallDoctorCopy {
  eyebrow: string;
  name: string;
  credentials: string;
  role: string;
  org: string; // affiliation, emphasised on the card (e.g. "Eternami")
  initials: string;
  image?: string;
  bio: string;
}

export interface PaywallCopy {
  eyebrow: string;
  heading: string;
  offerName: string;
  offerNote: string;
  paperNote: string; // short peer-reviewed reference (replaces the long blurb)
  paperUrl: string; // link to the ReCOGnAIze paper on PubMed
  includes: string[]; // what the offer includes (checklist)
  doctor: PaywallDoctorCopy; // teleconsult clinician card
  lineItem: string; // product name shown in the order summary
  price: string;
  priceOriginal: string; // struck-through original (launch deal)
  priceTag: string; // e.g. "Launch exclusive"
  priceNote: string;
  promoPlaceholder: string;
  promoCta: string;
  cta: string;
  whatsappNumber: string; // digits only, incl. country code, for the wa.me link
  whatsappMessage: string; // prefilled message template the user fills in
  faqs: FaqItem[];
}

// A biomarker group shown on the booking page.
export interface BiomarkerPanel {
  title: string;
  body: string;
}

export interface BookingCopy {
  title: string;
  priceOriginal: string; // struck-through original price
  priceNow: string; // discounted price
  bookCta: string;
  bookingUrl: string; // external booking link (placeholder for now)
  includes: string[]; // top-of-card checklist
  panels: BiomarkerPanel[];
  credibilityHeading: string;
  faqHeading: string;
  trustHeading: string;
  trustLogo: string; // path under /public to the partner logo image
}

export interface ScreenCopy {
  hook: HookCopy;
  nameGate: NameGateCopy;
  emailGate: EmailGateCopy;
  analysing: AnalysingCopy;
  resultBase: ResultBaseCopy;
  paywall: PaywallCopy;
  booking: BookingCopy;
  game: GameCopy;
  // The reaction game's own screens: countdown, HUD and guided tour.
  symbolMatch: SymbolMatchCopy;
  leaderboard: LeaderboardCopy;
  eventHook: EventHookCopy;
  consult: ConsultCopy;
  event2: Event2Copy;
  event3: Event3Copy;
  event6: Event6Copy;
  rotary: NoPartnerSplashCopy;
  ntuhomecoming: NoPartnerSplashCopy;
  ihhsearegatta: IhhseaCopy;
  // /ihh: the regatta block again, with its own privacy-policy link.
  ihh: IhhseaCopy;
  phkl: PhklCopy;
  // GMS x #MambaCares (/mambacares): the PHKL arc with no partner on its
  // landing and a fundraising report at the end.
  mambacares: MambacaresCopy;
  // GMS x Urban Milers (/urbanmilers): the same run's screens on a bucket of
  // its own, so the same shape - a block of its own so either run's wording can
  // be changed without touching the other's.
  urbanmilers: MambacaresCopy;
  // Siloam Neuroscience Summit (/siloamneurosciencesummit): the PHKL arc with
  // the #MambaCares landing and the NTU Homecoming close.
  siloam: SiloamCopy;
}

/**
 * The screens the Pantai Hospital KL arc introduced, and the two parts of its
 * report that every event built on that arc reuses - the header and the risk
 * section.
 *
 * Three events fill this in: /phkl itself, and the two community runs built on
 * the arc (/mambacares, /urbanmilers). The screens they share read whichever
 * event is running
 * (`arcCopyFor` in config/copy.ts) rather than one event's block by name, so
 * either one's wording can be changed without quietly changing the other's.
 */
export interface PhklArcCopy {
  // The GAME / BRAIN HEALTH QUIZ / RESULTS rail on the two primers.
  rail: {
    gameLabel: string;
    quizLabel: string;
    resultsLabel: string;
  };
  // "You're about to measure processing speed", before the age question.
  speedIntro: {
    eyebrow: string;
    heading: string;
    // Words wrapped in *asterisks* are bold.
    body: string;
    cta: string;
  };
  ageSelect: {
    heading: string;
    body: string;
  };
  // The beat after the 20th match; walks itself into the quiz primer.
  greatJob: {
    heading: string;
    skipHint: string;
  };
  // "Your brain speed isn't fixed", before the first question. {name} is the
  // player's first name; the heading falls back to `headingAnonymous`.
  quizIntro: {
    heading: string;
    headingAnonymous: string;
    body: string;
    /** Captions on the three factor photos, in order. */
    factors: [string, string, string];
    lead: string;
    /** The evidence the quiz rests on, in a card above the CTA. */
    citation: { heading: string; body: string };
    cta: string;
  };
  // The loading beat between the last question and the report: a progress ring
  // that counts up while each part of the workup ticks off, one by one.
  analysing: {
    heading: string; // contains {name}
    headingAnonymous: string;
    /** The parts of the workup, in the order they tick off. */
    steps: string[];
  };
  report: {
    header: {
      eyebrow: string;
      // "{name}'s {ordinal} record in" - the highlight follows on its own line.
      heading: string;
      headingAnonymous: string;
      headingHighlight: string;
      timeLabel: string;
      rankLabel: string;
      fastestLabel: string;
      fastestEmpty: string;
      // Share and retry sit in the header's top corners, as on the post-game card.
      shareLabel: string;
      retryLabel: string;
    };
    risk: {
      eyebrow: string;
      heading: string;
      body: string;
      riskLevelLabel: string;
      factorsLead: string; // contains {name}
      factorsLeadAnonymous: string;
      noFactors: string;
      goodNews: string;
      /** Precedes the statistic's citation, e.g. "Source: ...". */
      sourceLabel: string;
    };
  };
}

/**
 * The three parts of the PHKL report that every event on that arc draws with
 * the SAME components - `PhklSpeedExplainer`, `PhklBaselineCard` and
 * `PhklWrapUp`. /phkl and the Siloam Neuroscience Summit both fill this in,
 * and those components read whichever event is running (`phklReportFor` in
 * config/copy.ts) rather than one event's block by name.
 *
 * What sits between the baseline and the wrap-up is NOT here, because that is
 * exactly where the two events part: /phkl ends on the Memory Screening
 * Package, Siloam on the NTU Homecoming call to action, and each has its own
 * component for it.
 */
export interface PhklReportSharedCopy {
  speed: {
    // Fragments alternate plain/serif-italic, starting plain.
    headingParts: string[];
    intro: string;
    // The three perks are the event3 speed popup's.
  };
  baseline: {
    eyebrow: string;
    // The highlight ("2 out of 5") takes the rank gradient.
    heading: string;
    headingHighlight: string;
    cardLabel: string;
    cardProgress: string;
    axes: [string, string, string, string, string];
    paragraphs: string[];
  };
  wrapUp: {
    // Fragments alternate plain/serif-italic, starting plain.
    quoteParts: string[];
    // Chelsea's own age band, as an `age` option id, and the two ways of
    // crediting her: the plain one, and "like you" for a player in that band.
    attributionAgeBand: string;
    attribution: string;
    attributionPeer: string;
    thinkingHeading: string;
    thinkingBody: string[];
    credit: string;
  };
}

// Pantai Hospital KL (/phkl): the regatta arc rebuilt for IHH Malaysia. The
// landing is the regatta's with the partner's Malaysian wording; the screens
// either side of the game are the shared arc's, and the rest of the report -
// what processing speed is, the baseline, the screening offer and the close -
// is this event's own.
export interface PhklCopy extends PhklArcCopy {
  splash: IhhseaCopy["splash"];
  report: PhklArcCopy["report"] &
    PhklReportSharedCopy & {
    // The one button pinned to the bottom of the screen for the whole report.
    sticky: {
      book: string;
    };
    offer: {
      eyebrow: string;
      heading: string;
      body: string;
      /** The poster's content, drawn in HTML until the artwork lands. */
      poster: {
        hospital: string;
        hospitalNote: string;
        title: string[];
        price: string;
        includesHeading: string;
        includes: string[];
        whoHeading: string;
        who: string[];
      };
      // Fragments alternate plain/serif-italic, starting plain.
      proofParts: string[];
      includesEyebrow: string;
      assessmentHeading: string[];
      assessmentBody: string;
      reportHeading: string;
      reportBody: string;
      cta: string;
      quote: string;
      quoteName: string;
      quoteRole: string[];
    };
  };
}

/**
 * Siloam Neuroscience Summit (/siloamneurosciencesummit): the PHKL arc with
 * two deliberate substitutions and one addition.
 *
 * - The landing is #MambaCares': the plain two-row consent at the roomier
 *   size, with no partner block. Its wording is written against Indonesia's
 *   Personal Data Protection Law and is the partner's to confirm.
 * - The report closes on the NTU Homecoming call to action - the ReCOGnAIze
 *   assessment and the team at the booth - rather than on a bookable screening
 *   package, because there is no Indonesian booking link to send anyone to.
 * - The landing offers a language, so its block carries the picker's label.
 *
 * Everything between those - the primers, the header, the risk section, what
 * processing speed is, the baseline and the wrap-up - is the arc's, and reads
 * exactly as /phkl's does.
 */
export interface SiloamCopy extends PhklArcCopy {
  // No partner runs this event, so the landing is the plain daylight one, plus
  // the label above the language picker.
  splash: Event3Copy["splash"] & { languageLabel: string };
  report: PhklArcCopy["report"] &
    PhklReportSharedCopy & {
      // The one button pinned to the bottom of the screen for the whole
      // report. It scrolls to the offer rather than opening a booking form:
      // this event closes at a booth, not at a checkout.
      sticky: {
        talk: string;
      };
      /**
       * The headline statistic in the risk section.
       *
       * /phkl prints the global Lancet card straight from config/statCards.ts.
       * The summit prints THIS one instead, so the figure can be Indonesia's
       * the day that data lands, in one edit per language, without moving a
       * number every other event quotes.
       */
      stat: {
        stat: string;
        body: string;
        source: string;
      };
      /**
       * The close, in NTU Homecoming's words (COPY.screens.event2.closing):
       * the ReCOGnAIze assessment as the next step, and the team at the booth
       * to take it from there. No price, no booking link, nothing to click
       * through to.
       */
      offer: {
        eyebrow: string;
        heading: string;
        body: string;
        reassurance: string;
        offerName: string;
        offerPoints: string[];
        cta: string;
        credibility: string;
      };
    };
}

// A community run on the PHKL arc (/mambacares, /urbanmilers): the same arc
// with no partner on the landing and a fundraising report in place of the
// screening offer. The header and the
// risk section are the shared arc's; everything below is this event's own - the
// cost of losing that speed, the Dementia Singapore campaign, a closing ask and
// the crews and sponsors behind the run.
//
// Every figure in the campaign (what has been raised, the goal, the dates) is
// in config/mambacares.ts, not here: this block holds only the words around it,
// with {raised}, {goal}, {lastUpdated}, {deadline} and {seconds} filled in by
// the report.
export interface MambacaresCopy extends PhklArcCopy {
  // No partner runs this event, so the landing is the plain daylight one - two
  // consent rows, no third block.
  splash: Event3Copy["splash"];
  report: PhklArcCopy["report"] & {
    // "You were fast. Alzheimer's takes that speed away." - the player's own
    // round set against how long the same response takes with dementia.
    problem: {
      heading: string;
      /** Row labels and the comparison's value, above the two tracks. */
      yourRoundLabel: string;
      dementiaLabel: string;
      dementiaValue: string;
      /**
       * How many times longer the dementia track runs than the player's. Only
       * ever drawn as a bar - `dementiaValue` is what is read.
       */
      dementiaFactor: number;
      /** The line under the tracks: this is illustrative, not clinical. */
      note: string;
      paragraphs: string[];
    };
    // The campaign itself, with the thermometer and the two buttons.
    donate: {
      eyebrow: string;
      /** "It took you {seconds} seconds. Donating takes a minute." */
      heading: string;
      /** The same line when there is no time to quote. */
      headingAnonymous: string;
      /** "{raised} raised of {goal}". */
      progressLabel: string;
      /** "Last updated: {lastUpdated}". */
      progressUpdated: string;
      paragraphs: string[];
    };
    // The last ask, under the report.
    closing: {
      heading: string;
      /** Contains {goal} and {deadline}. */
      body: string;
    };
    // Both buttons and the printed link, shown under `donate` and `closing`.
    cta: {
      donate: string;
      share: string;
      /** "Donate at" - the label before the printed link. */
      directLead: string;
      /** What the share sheet offers when the browser can share a link. */
      shareTitle: string;
      shareText: string;
      /** Shown when the link was copied instead of shared. */
      shareCopied: string;
      shareFailed: string;
    };
    // The crews and sponsors at the foot of the report, and the wordmark.
    partners: {
      runningHeading: string;
      sponsorsHeading: string;
      wordmark: string;
      wordmarkNote: string;
    };
    // The bar pinned to the bottom of the screen for the whole report.
    sticky: {
      share: string;
      donate: string;
    };
  };
}

// IHH SEA Regatta (/ihhsearegatta): the v3 arc with every consent on the
// landing (so no partner consent page), a redesigned bridge card on the
// post-game result and a questionnaire invite behind its CTA. Every other
// screen reuses the v3/v2 copy.
export interface IhhseaCopy {
  // The landing carries the partner's consent as a third row under the two
  // the daylight landing already has: one tick over the whole block, in the
  // partner's own words, optional like the marketing opt-in above it.
  splash: Event3Copy["splash"] & {
    partnerConsent: {
      clauses: ConsentClause[];
    };
  };
  // The bridge card opens on the player's wish rather than on their reflexes,
  // so it carries two lines the v3 card has no place for; everything else on
  // the result screen is the v3 copy.
  gameResult: Event3Copy["gameResult"] & {
    /** Italic opening line of the card. */
    bridgeWish: string;
    /** The lighter line under it. */
    bridgeWishNote: string;
  };
  // The page behind "Tell me more": what the questionnaire gives them, over a
  // sample of the report it produces.
  quizInvite: {
    heading: string;
    cta: string; // walks on into the questionnaire
    decline: string; // ends the session on the closing screen
    /** The domain page in the sample report. */
    domainCard: {
      title: string;
      body: string;
      whyLabel: string;
      whyHeading: string;
      whyPoints: string[];
      scienceLabel: string;
      /** One paragraph per entry. */
      science: string[];
    };
    /** The score card in the sample report (its strap, eyebrow, gauge labels
     * and band label are the report's own copy - only the blurb differs). */
    reportCard: {
      blurb: string;
    };
  };
}

// The events with no partner in them (/rotaryklwam, /ntuhomecoming): the
// daylight arc with no consent page. Only the landing's required-consent line
// differs from v3; every other screen reuses the v3/v2 copy. One block per
// event, so either one's wording can be changed on its own.
export interface NoPartnerSplashCopy {
  splash: Event3Copy["splash"];
}

// Event v6 (/event-v6, preview): the daylight arc with a partner consent page
// after the landing. Every other screen reuses the v3/v2 copy.
export interface Event6Copy {
  consent: {
    heading: string;
    body: string;
    eyebrow: string;
    /** One checkbox each. `required` gates the CTA. */
    items: {
      text: string;
      required: boolean;
      /** Optional inline link rendered in place of {link} in `text`. */
      link?: { label: string; href: string };
    }[];
    requiredError: string;
    cta: string;
  };
}

// What changes per persona on the result screen: the score blurb (per band) and
// which blurred paywall section leads.
export type LeadBlurSection =
  | "vascular"
  | "cognitiveInterpretation"
  | "percentile";

export interface PersonaResultCopy {
  headline: string;
  blurb: Record<BandName, string>; // 1–2 sentences, lifestyle/biomedical ONLY
  leadBlurSection: LeadBlurSection;
}

export interface CopyConfig {
  screens: ScreenCopy;
  personas: Record<Persona, PersonaResultCopy>;
  // Result-screen blurb per band. May contain {factors}, replaced with the
  // user's reported modifiable risk factors.
  resultBlurbs: Record<BandName, string>;
  bandLabels: Record<BandName, string>;
  /**
   * The band on its own, for the risk meter's four segments - "Moderate"
   * rather than "Moderate risk".
   *
   * Its own field rather than `bandLabels` with the word "risk" stripped off
   * the end: that only works in a language that puts it there, and Bahasa
   * Indonesia puts it first ("Risiko sedang").
   */
  bandShortLabels: Record<BandName, string>;
  factorLabels: Record<string, string>;
}
