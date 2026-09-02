"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { springs, stagger } from "@/lib/motion";
import { Event3Shell } from "@/components/screens/event3/Event3Shell";
import { ctaPrimaryClass } from "@/components/screens/event3/ui";

interface Event6ConsentProps {
  onSubmit: (accepted: boolean[]) => void;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

/**
 * Consent row: the same hidden-input + drawn-box pattern as the landing, at
 * the larger size this page uses (the copy is long, so the box sits at the top
 * of the first line rather than centred).
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
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={[
          "mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border transition",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-ember-core/40 peer-focus-visible:ring-offset-1",
          checked
            ? "border-transparent bg-gradient-to-br from-ember-core to-ember-bright"
            : "border-[#e0c9ba] bg-white",
        ].join(" ")}
      >
        {checked && (
          <svg
            viewBox="0 0 12 12"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 6.4 4.8 8.7 9.5 3.7" />
          </svg>
        )}
      </span>
      <span className="text-[11.5px] leading-[1.62] text-secondary">
        {children}
      </span>
    </label>
  );
}

/** Splits copy on {link} so the partner's link renders inline where designed. */
function ConsentText({
  text,
  link,
}: {
  text: string;
  link?: { label: string; href: string };
}) {
  if (!link) return <>{text}</>;
  const [before, after = ""] = text.split("{link}");
  return (
    <>
      {before}
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-from-font underline-offset-2 hover:opacity-75"
      >
        {link.label}
      </a>
      {after}
    </>
  );
}

/**
 * Event6 partner consent page (Figma "Option 2" / Consent): sits between the
 * landing and the instructions. The landing keeps its own two consents; this
 * page carries the partner's three, the first of which gates the CTA.
 */
export function Event6Consent({ onSubmit }: Event6ConsentProps) {
  const c = COPY.screens.event6.consent;
  const reduced = useReducedMotion();
  const [accepted, setAccepted] = useState<boolean[]>(
    () => c.items.map(() => false),
  );
  const [error, setError] = useState<string | null>(null);

  const toggle = (index: number, value: boolean) => {
    setAccepted((prev) => prev.map((v, i) => (i === index ? value : v)));
    if (value) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = c.items.some((entry, i) => entry.required && !accepted[i]);
    if (missing) {
      setError(c.requiredError);
      return;
    }
    onSubmit(accepted);
  };

  return (
    <Event3Shell pills navyPills>
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

        <motion.div
          variants={item}
          className="flex items-center justify-center gap-5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gms-ntu-logo.png"
            alt="Gray Matter Solutions, a spin-off from Nanyang Technological University, Singapore"
            className="h-[clamp(24px,3.5dvh,29px)] w-auto"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ihh-logo.png"
            alt="IHH Healthcare"
            className="h-[clamp(32px,4.7dvh,40px)] w-auto"
          />
        </motion.div>

        <div aria-hidden className="h-[2.4dvh] min-h-0 shrink" />

        <motion.h1
          variants={item}
          className="text-[clamp(26px,4.3dvh,34.4px)] font-bold leading-[1.07] text-[#171717]"
        >
          {c.heading}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-2.5 text-[clamp(13px,1.9dvh,14.5px)] leading-[1.38] text-[#171717]"
        >
          {c.body}
        </motion.p>

        <motion.p
          variants={item}
          className="mt-4 text-[clamp(10.5px,1.5dvh,12px)] font-bold uppercase tracking-[0.22em] text-ember-core"
        >
          {c.eyebrow}
        </motion.p>

        <form
          onSubmit={handleSubmit}
          className="mt-[3.4dvh] flex min-h-0 flex-1 flex-col text-left"
        >
          {/* The rows take the space that is left and scroll inside it, so the
              CTA is always reachable without the copy running under it. */}
          <motion.div
            variants={item}
            className="flex min-h-0 flex-1 flex-col gap-[1.7dvh] overflow-y-auto pb-2"
          >
            {c.items.map((entry, i) => (
              <ConsentCheckbox
                key={entry.text.slice(0, 32)}
                checked={accepted[i]}
                onChange={(v) => toggle(i, v)}
              >
                <ConsentText text={entry.text} link={entry.link} />
              </ConsentCheckbox>
            ))}

            <p className="pt-[0.6dvh] text-[10px] leading-[1.7] text-secondary">
              <ConsentText text={c.footnote.text} link={c.footnote.link} />
            </p>
          </motion.div>

          {error && (
            <p role="alert" className="pb-2 text-center text-xs text-error">
              {error}
            </p>
          )}

          <motion.button
            variants={item}
            type="submit"
            whileTap={{ scale: 0.97 }}
            className={`${ctaPrimaryClass} mt-[1.8dvh] shrink-0`}
          >
            {c.cta}
          </motion.button>
        </form>

        <div aria-hidden className="h-[2dvh] min-h-0 shrink" />
      </motion.div>
    </Event3Shell>
  );
}
