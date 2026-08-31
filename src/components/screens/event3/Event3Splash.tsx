"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { springs, stagger } from "@/lib/motion";
import { Event3Shell } from "./Event3Shell";
import { BrainHero } from "./BrainHero";
import { GradientWords, ctaPrimaryClass } from "./ui";

interface Event3SplashProps {
  /**
   * `tipsConsent` is the marketing checkbox: it rides along with the capture so
   * the score and lead rows record what the player chose, ticked or not.
   */
  onSubmit: (name: string, email: string, tipsConsent: boolean) => void;
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
 */
export function Event3Splash({ onSubmit }: Event3SplashProps) {
  const c = COPY.screens.event3.splash;
  const reduced = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactConsent, setContactConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
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
    if (marketingConsent) {
      void fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          variant: "event3",
        }),
      }).catch(() => {});
    }
    onSubmit(name.trim(), email.trim(), marketingConsent);
  };

  const inputClass =
    "h-[clamp(44px,6.8dvh,58px)] w-full rounded-xl bg-white px-5 text-base text-charcoal placeholder:text-cream-faint shadow-[0_2px_12px_-4px_rgba(51,18,0,0.08)] outline-none transition focus:ring-4 focus:ring-ember-core/25";

  return (
    <Event3Shell pills>
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
              {c.consentRequired}{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ember-core underline underline-offset-2"
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
