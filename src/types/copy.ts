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

// The reaction game (event only) — kept separate from the brain-health score.
export interface GameCopy {
  eyebrow: string;
  heading: string;
  body: string;
  placeholder: string;
  cta: string;
  disclaimer: string;
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
  disclaimer: string;
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
  disclaimer: string;
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
  initials: string;
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
  priceNote: string;
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
  leaderboard: LeaderboardCopy;
  eventHook: EventHookCopy;
  consult: ConsultCopy;
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
  factorLabels: Record<string, string>;
}
