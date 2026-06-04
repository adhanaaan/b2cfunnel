import type { BandName, Persona } from "@/types/engine";

/** Shape of the editable copy config. British English throughout. */

export interface HookCopy {
  eyebrow: string;
  heading: string;
  subheading: string;
  credibility: string;
  durationNote: string;
  cta: string;
  resourcesHeading: string;
  resourcesIntro: string;
  resources: string[];
}

export interface EmailGateCopy {
  eyebrow: string;
  heading: string;
  body: string;
  placeholder: string;
  cta: string;
  privacyNote: string;
}

export interface AnalysingCopy {
  heading: string;
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
  paywallPreviewHeading: string;
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

export interface ScreenCopy {
  hook: HookCopy;
  emailGate: EmailGateCopy;
  analysing: AnalysingCopy;
  resultBase: ResultBaseCopy;
  paywall: PaywallCopy;
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
  bandLabels: Record<BandName, string>;
  factorLabels: Record<string, string>;
}
