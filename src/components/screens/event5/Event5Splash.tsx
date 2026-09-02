"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import {
  IHH_DPO_EMAIL,
  IHH_NOTICE_URL,
  IHH_RECONCILED,
  IHH_VERBATIM,
} from "@/config/ihhConsent";
import { springs, stagger } from "@/lib/motion";
import { Event3Shell } from "@/components/screens/event3/Event3Shell";
import { BrainHero } from "@/components/screens/event3/BrainHero";
import { GradientWords, ctaPrimaryClass } from "@/components/screens/event3/ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

type Mode = "verbatim" | "reconciled";

const linkClass =
  "font-semibold text-ember-core underline underline-offset-2 break-words";

/** Swaps {notice} / {dpo} / {privacy} placeholders for real links. */
function withLinks(text: string) {
  const parts = text.split(/(\{notice\}|\{dpo\}|\{privacy\})/g);
  return parts.map((part, i) => {
    if (part === "{notice}") {
      return (
        <a key={i} href={IHH_NOTICE_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
          IHH Healthcare Singapore Data Protection Notice
        </a>
      );
    }
    if (part === "{dpo}") {
      return (
        <a key={i} href={`mailto:${IHH_DPO_EMAIL}`} className={linkClass}>
          {IHH_DPO_EMAIL}
        </a>
      );
    }
    if (part === "{privacy}") {
      return (
        <a key={i} href="/privacy-policy" target="_blank" rel="noopener noreferrer" className={linkClass}>
          Privacy Policy
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/** Same checkbox treatment as the live event3 landing. */
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
      <span className="text-[11.5px] leading-[1.4] text-secondary">{children}</span>
    </label>
  );
}

/** Preview-only switch between IHH's wording and the reconciled split. */
function ModeBar({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const tab = (m: Mode, label: string) => (
    <button
      key={m}
      type="button"
      onClick={() => onChange(m)}
      className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
        mode === m ? "bg-ember-core text-white" : "bg-white/70 text-secondary"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="mx-auto mb-2 flex w-full max-w-sm flex-col items-center gap-1.5 rounded-xl border border-dashed border-[#e0c9ba] bg-white/60 p-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ember-core">
        Preview only · nothing is saved
      </p>
      <div className="flex gap-1.5">
        {tab("verbatim", "IHH as supplied")}
        {tab("reconciled", "Reconciled split")}
      </div>
    </div>
  );
}

/**
 * /event-v5: the event3 landing with IHH Healthcare Singapore's consent
 * wording, so it can be reviewed before going anywhere near a live event.
 *
 * Deliberately inert - it renders the form and validates it, but submits
 * nothing: no lead, no score, no newsletter opt-in, no event bucket. Playing
 * from here must never reach the leaderboard that is live right now.
 */
export function Event5Splash() {
  const c = COPY.screens.event3.splash;
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<Mode>("verbatim");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreeAll, setAgreeAll] = useState(false);
  const [required, setRequired] = useState(false);
  const [optional, setOptional] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(null);
    if (name.trim().length === 0) return setError("Please enter your name.");
    if (!EMAIL_RE.test(email.trim())) return setError("Please enter a valid email address.");

    if (mode === "verbatim") {
      if (!agreeAll) return setError("Please agree to the terms to continue.");
      setError(null);
      // Everything is bundled into one tick: there is no way to record that
      // someone wanted the results but not the marketing.
      return setSubmitted("Consent captured as: all-or-nothing (marketing included).");
    }

    if (!required) return setError(c.consentRequiredError);
    setError(null);
    const picked = IHH_RECONCILED.optional
      .filter((o) => optional[o.id])
      .map((o) => o.id);
    setSubmitted(
      `Consent captured as: required = yes; optional = ${picked.length ? picked.join(", ") : "none"}.`,
    );
  };

  const inputClass =
    "h-[clamp(44px,6.8dvh,58px)] w-full rounded-xl bg-white px-5 text-base text-charcoal placeholder:text-cream-faint shadow-[0_2px_12px_-4px_rgba(51,18,0,0.08)] outline-none transition focus:ring-4 focus:ring-ember-core/25";

  return (
    <Event3Shell pills scroll>
      <motion.div
        className="flex w-full max-w-sm flex-col text-center"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : stagger.items } },
        }}
        initial={reduced ? "show" : "hidden"}
        animate="show"
      >
        <div aria-hidden className="h-4" />
        <ModeBar mode={mode} onChange={(m) => { setMode(m); setError(null); setSubmitted(null); }} />

        <motion.p variants={item} className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-ember-core">
          {c.eyebrow}
        </motion.p>

        <motion.h1
          variants={item}
          className="mx-auto mt-3 max-w-sm text-[clamp(1.8rem,4.4dvh,2.15rem)] font-bold leading-[1.07] text-[#171717]"
        >
          <GradientWords text={c.heading} />
        </motion.h1>

        <motion.div variants={item} className="mt-3 flex items-center justify-center">
          <BrainHero className="h-auto max-h-[150px] w-auto" />
        </motion.div>

        <motion.p
          variants={item}
          className="mx-auto mt-3 max-w-sm text-[clamp(0.9375rem,2.2dvh,1.0625rem)] leading-[1.45] text-[#171717]"
        >
          {c.body}
        </motion.p>

        <motion.form variants={item} onSubmit={handleSubmit} className="mt-4 space-y-2.5 text-left">
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

          {mode === "verbatim" ? (
            <div className="space-y-2 pt-0.5">
              <ul className="space-y-2 rounded-xl bg-white/70 p-3">
                {IHH_VERBATIM.clauses.map((clause, i) => (
                  <li key={i} className="text-[11.5px] leading-[1.45] text-secondary">
                    {withLinks(clause)}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] italic leading-[1.4] text-secondary">
                {IHH_VERBATIM.footnote}
              </p>
              <ConsentCheckbox
                checked={agreeAll}
                onChange={(v) => {
                  setAgreeAll(v);
                  if (v) setError(null);
                }}
              >
                <strong>{IHH_VERBATIM.agreeLabel}</strong>
              </ConsentCheckbox>
            </div>
          ) : (
            <div className="space-y-2 pt-0.5">
              <ConsentCheckbox
                checked={required}
                onChange={(v) => {
                  setRequired(v);
                  if (v) setError(null);
                }}
              >
                {withLinks(IHH_RECONCILED.required.label)}
              </ConsentCheckbox>
              {IHH_RECONCILED.optional.map((o) => (
                <ConsentCheckbox
                  key={o.id}
                  checked={Boolean(optional[o.id])}
                  onChange={(v) => setOptional((prev) => ({ ...prev, [o.id]: v }))}
                >
                  {o.label}
                  {"note" in o && o.note ? (
                    <em className="mt-0.5 block text-[10.5px] not-italic text-ember-core">
                      ⚠ {o.note}
                    </em>
                  ) : null}
                </ConsentCheckbox>
              ))}
              <p className="text-[11px] leading-[1.4] text-secondary">
                {withLinks(IHH_RECONCILED.withdrawal)}
              </p>
            </div>
          )}

          {error && (
            <p className="text-[13px] font-medium text-error" role="alert">
              {error}
            </p>
          )}
          {submitted && (
            <p className="rounded-lg bg-white/80 p-2.5 text-[12px] font-semibold leading-[1.4] text-charcoal" role="status">
              Preview only — nothing was submitted.
              <span className="mt-1 block font-normal text-secondary">{submitted}</span>
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

        <div aria-hidden className="h-8" />
      </motion.div>
    </Event3Shell>
  );
}
