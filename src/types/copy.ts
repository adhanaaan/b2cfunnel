import type { BandName, Persona } from "@/types/engine";

/** Shape of the editable copy config. British English throughout. */

// Doctor card on the hook.
export interface DoctorCardCopy {
  avatarInitials: string; // fallback shown until the photo loads
  image?: string; // path under /public, e.g. "/dr-kandiah.jpg"
  name: string;
  credentials: string;
  affiliation: string;
}

export interface HookCopy {
  eyebrow: string;
  heading: string;
  subheading: string;
  doctor: DoctorCardCopy;
  durationNote: string;
  cta: string;
  resourcesIntro: string;
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
}

export interface AnalysingCopy {
  // Use {name} as a placeholder for the captured first name.
  heading: string;
  headingFallback: string;
  crumbs: string[]; // credibility crumbs cycled during the suspense screen
}

export interface ResultBaseCopy {
  reviewerStrap: string;
  reviewerInitials: string;
  eyebrow: string;
  scoreSuffix: string; // '/25'
  drivingHeading: string;
  gaugeLowLabel: string;
  gaugeHighLabel: string;
  unlockCta: string;
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

export interface FaqItem {
  q: string;
  a: string;
}

export interface PaywallCopy {
  eyebrow: string;
  heading: string;
  doctorName: string;
  doctorTitle: string;
  bundle: string;
  price: string;
  priceNote: string;
  cta: string;
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
  doctorHeading: string;
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
  paywallAngle: string;
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
