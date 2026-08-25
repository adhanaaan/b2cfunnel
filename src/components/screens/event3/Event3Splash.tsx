"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { springs, stagger } from "@/lib/motion";
import { Event3Shell } from "./Event3Shell";
import { BrainHero } from "./BrainHero";
import { GradientWords, ctaPrimaryClass } from "./ui";

interface Event3SplashProps {
  onSubmit: (name: string, email: string) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

/**
 * Event3 landing (Figma "01 Landing"): daylight cream backdrop with the
 * animated yellow pill lines, gradient hero words, the brain hero, nickname
 * + email capture, and the ember CTA. Vertical rhythm is expressed in dvh so
 * it holds the designed proportions on any phone - a height breakpoint would
 * miss real mobile viewports (~700px once the browser chrome is showing).
 */
export function Event3Splash({ onSubmit }: Event3SplashProps) {
  const c = COPY.screens.event3.splash;
  const reduced = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length === 0) {
      setError("Please enter a nickname.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    onSubmit(name.trim(), email.trim());
  };

  const inputClass =
    "h-[clamp(48px,6.8dvh,58px)] w-full rounded-xl bg-white px-5 text-base text-charcoal placeholder:text-cream-faint shadow-[0_2px_12px_-4px_rgba(51,18,0,0.08)] outline-none transition focus:ring-4 focus:ring-ember-core/25";

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
        <motion.p
          variants={item}
          className="mt-[7.5dvh] text-xs font-bold uppercase tracking-[0.22em] text-ember-core"
        >
          {c.eyebrow}
        </motion.p>

        <motion.h1
          variants={item}
          className="mx-auto mt-3 max-w-sm text-[2.15rem] font-bold leading-[1.07] text-[#171717]"
        >
          <GradientWords text={c.heading} />
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-[2dvh] flex min-h-0 flex-1 items-center justify-center"
        >
          <BrainHero className="h-full max-h-[186px] w-auto" />
        </motion.div>

        <motion.p
          variants={item}
          className="mx-auto mt-[3dvh] max-w-sm text-[1.0625rem] leading-[1.5] text-[#171717]"
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
            autoComplete="nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={c.namePlaceholder}
            aria-label="Nickname"
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
          {error && (
            <p className="text-sm font-medium text-error" role="alert">
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
          className="mt-[3.2dvh] flex flex-col items-center gap-2"
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-ember-core">
            {c.poweredBy}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gms-ntu-logo.png"
            alt="Gray Matter Solutions - a spin-off from Nanyang Technological University, Singapore"
            className="h-9 w-auto"
          />
        </motion.div>
      </motion.div>
    </Event3Shell>
  );
}
