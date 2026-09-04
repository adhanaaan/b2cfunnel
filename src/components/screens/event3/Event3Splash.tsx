"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { springs, stagger } from "@/lib/motion";
import { Event3Shell } from "./Event3Shell";
import { BrainHero } from "./BrainHero";
import { ConsentText, GradientWords, StrongWords, ctaPrimaryClass } from "./ui";

interface Event3SplashProps {
  /**
   * `tipsConsent` is the marketing checkbox: it rides along with the capture so
   * the score and lead rows record what the player chose, ticked or not.
   * `partnerConsent` is the partner's tick, on the landings that carry one
   * (the regatta); it is left undefined by every other design, so a landing
   * that never asked is stored as "never asked" rather than as a decline.
   */
  onSubmit: (
    name: string,
    email: string,
    tipsConsent: boolean,
    partnerConsent?: boolean,
  ) => void;
  /** Preview variants walk the screen without recording the opt-in anywhere. */
  preview?: boolean;
  /**
   * Which event's landing this is. The screen is the same for all of them; the
   * designs differ in the consent rows - "v3" (shared with the /event-v6
   * preview) keeps the parenthetical "(Required)" and the ember privacy link,
   * while the others lead with a bold "Required." and keep the link in body
   * colour. "ihhsearegatta" also carries the partner's consent as a third row
   * (Figma 638:7729), which is what makes it taller than a screen and lets it
   * scroll. Each one reads its own copy block and tags its own newsletter
   * opt-ins, so their wording can move independently.
   */
  design?: "v3" | "rotary" | "ntuhomecoming" | "ihhsearegatta";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

/**
 * Consent row: a real checkbox (kept for keyboard and screen-reader use, and
 * visually hidden) with the daylight-system box drawn over it.
 */
function ConsentCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={[
          "mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-ember-core/40 peer-focus-visible:ring-offset-1",
          checked
            ? "border-transparent bg-gradient-to-br from-ember-core to-ember-bright"
            : "border-[#e0c9ba] bg-white",
        ].join(" ")}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 6.4 4.8 8.7 9.5 3.7" />
          </svg>
        )}
      </span>
      <span className="text-[11.5px] leading-[1.4] text-secondary">
        {children}
      </span>
    </label>
  );
}

/**
 * Event3 landing (Figma "01 Landing"): daylight cream backdrop with the
 * animated yellow pill lines, gradient hero words, the brain hero, name
 * + email capture, and the ember CTA. Vertical rhythm is expressed in dvh so
 * it holds the designed proportions on any phone - a height breakpoint would
 * miss real mobile viewports (~700px once the browser chrome is showing).
 *
 * The regatta design adds the partner's consent under the landing's own two
 * rows, which makes the page longer than a phone screen: that one runs in the
 * shell's scrolling mode, so the hero keeps its size and the CTA is reached
 * by scrolling rather than by squeezing everything above it.
 */
export function Event3Splash({
  onSubmit,
  preview = false,
  design = "v3",
}: Event3SplashProps) {
  // Only v3 keeps the parenthetical "(Required)" and the ember privacy link;
  // every other design leads with a bold "Required." and a body-colour link,
  // while keeping a copy block of its own.
  const v3 = design === "v3";
  const c = v3 ? COPY.screens.event3.splash : COPY.screens[design].splash;
  // The partner's block, on the landing that carries one.
  const partner =
    design === "ihhsearegatta"
      ? COPY.screens.ihhsearegatta.splash.partnerConsent
      : null;
  const reduced = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactConsent, setContactConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [partnerConsent, setPartnerConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length === 0) {
      setError("Please enter your name.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    // PDPA: consent to be contacted is what lets us email the result and
    // reach the prize winner, so it gates entry rather than being assumed.
    if (!contactConsent) {
      setError(c.consentRequiredError);
      return;
    }
    // The marketing opt-in is separate and never blocks play. Fire-and-forget
    // so a slow write can't hold up the challenge.
    if (marketingConsent && !preview) {
      void fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          variant: v3 ? "event3" : design,
        }),
      }).catch(() => {});
    }
    // The partner's tick never blocks play either: what the player chose is
    // recorded either way, so a decline is stored as a decline. Landings
    // without the block pass nothing, and the state stays "never asked".
    onSubmit(
      name.trim(),
      email.trim(),
      marketingConsent,
      partner ? partnerConsent : undefined,
    );
  };

  const inputClass =
    "h-[clamp(44px,6.8dvh,58px)] w-full rounded-xl bg-white px-5 text-base text-charcoal placeholder:text-cream-faint shadow-[0_2px_12px_-4px_rgba(51,18,0,0.08)] outline-none transition focus:ring-4 focus:ring-ember-core/25";

  return (
    <Event3Shell pills scroll={partner !== null}>
      <motion.div
        className="flex h-full min-h-0 flex-col text-center"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : stagger.items } },
        }}
        initial={reduced ? "show" : "hidden"}
        animate="show"
      >
        <div aria-hidden className="h-[7.5dvh] min-h-0 shrink" />

        <motion.p
          variants={item}
          className="text-xs font-bold uppercase tracking-[0.22em] text-ember-core"
        >
          {c.eyebrow}
        </motion.p>

        <motion.h1
          variants={item}
          className="mx-auto mt-3 max-w-sm text-[clamp(1.8rem,4.4dvh,2.15rem)] font-bold leading-[1.07] text-[#171717]"
        >
          <GradientWords text={c.heading} />
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-[2dvh] flex min-h-[104px] flex-1 items-center justify-center"
        >
          <BrainHero className="h-full max-h-[186px] w-auto" />
        </motion.div>

        <motion.p
          variants={item}
          className="mx-auto mt-[3dvh] max-w-sm text-[clamp(0.9375rem,2.2dvh,1.0625rem)] leading-[1.45] text-[#171717]"
        >
          {c.body}
        </motion.p>

        <motion.form
          variants={item}
          onSubmit={handleSubmit}
          className="mt-[3.5dvh] space-y-2.5 text-left"
        >
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={c.namePlaceholder}
            aria-label="Name"
            className={inputClass}
          />
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={c.emailPlaceholder}
            aria-label="Email"
            className={inputClass}
          />
          <div className="space-y-1.5 pt-0.5">
            <ConsentCheckbox
              checked={contactConsent}
              onChange={(v) => {
                setContactConsent(v);
                if (v) setError(null);
              }}
            >
              <StrongWords text={c.consentRequired} />{" "}
              <a
                href={c.privacyHref}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  v3
                    ? "font-semibold text-ember-core underline underline-offset-2"
                    : "underline underline-offset-2"
                }
              >
                {c.privacyLinkLabel}
              </a>
            </ConsentCheckbox>
            <ConsentCheckbox
              checked={marketingConsent}
              onChange={setMarketingConsent}
            >
              {c.consentMarketing}
            </ConsentCheckbox>
            {partner && (
              // The partner's wording is one all-or-nothing agreement, so it is
              // ONE tick over the whole block - the clauses and the withdrawal
              // right under it - rather than a tick per clause.
              <ConsentCheckbox
                checked={partnerConsent}
                onChange={setPartnerConsent}
              >
                <span className="flex flex-col gap-2 leading-[1.5]">
                  {partner.clauses.map((clause) => (
                    <span key={clause.text.slice(0, 32)}>
                      <ConsentText text={clause.text} link={clause.link} />
                    </span>
                  ))}
                </span>
              </ConsentCheckbox>
            )}
          </div>

          {error && (
            <p className="text-[13px] font-medium text-error" role="alert">
              {error}
            </p>
          )}
          <motion.button
            type="submit"
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={springs.pop}
            className={ctaPrimaryClass}
          >
            {c.cta} →
          </motion.button>
        </motion.form>

        <motion.div
          variants={item}
          className="mt-[3dvh] flex flex-col items-center gap-1.5"
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-ember-core">
            {c.poweredBy}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gms-ntu-logo.png"
            alt="Gray Matter Solutions - a spin-off from Nanyang Technological University, Singapore"
            className="h-[clamp(28px,4.3dvh,36px)] w-auto"
          />
        </motion.div>
      </motion.div>
    </Event3Shell>
  );
}
