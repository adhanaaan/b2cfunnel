"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { ArenaShell } from "@/components/ui/ArenaShell";
import { springs, stagger } from "@/lib/motion";

interface Event2SplashProps {
  onSubmit: (name: string, email: string) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Serif hero with the word "brain" set italic in ember, when present. */
function HeroHeading({ text }: { text: string }) {
  const i = text.toLowerCase().indexOf("brain");
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <em className="italic text-ember-hot">{text.slice(i, i + 5)}</em>
      {text.slice(i + 5)}
    </>
  );
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

/**
 * Event2 landing: the "lantern at night" hook. Centered column, serif hero
 * over a breathing ember glow, single name+email capture (the leaderboard key
 * and the results address in one).
 */
export function Event2Splash({ onSubmit }: Event2SplashProps) {
  const c = COPY.screens.event2.splash;
  const reduced = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
    onSubmit(name.trim(), email.trim());
  };

  const inputClass =
    "w-full rounded-xl border border-night-stroke bg-night-raised px-5 py-4 text-base text-cream placeholder:text-cream-faint outline-none transition focus:border-ember-core focus:ring-4 focus:ring-ember-core/20";

  return (
    <ArenaShell>
      <motion.div
        className="relative flex min-h-[85dvh] flex-col justify-center text-center"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : stagger.items } },
        }}
        initial={reduced ? "show" : "hidden"}
        animate="show"
      >
        {/* The lantern: a pre-blurred ember orb breathing behind the hero. */}
        <div
          aria-hidden
          className="animate-glow-pulse pointer-events-none absolute left-1/2 top-[16%] -z-10 h-56 w-56 -translate-x-1/2 rounded-full bg-ember-core/30 blur-3xl"
          style={{ ["--glow-duration" as string]: "7s" }}
        />

        <motion.div variants={item} className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gms-logo.png"
            alt="Gray Matter Solutions"
            className="h-8 w-auto brightness-0 invert opacity-90"
          />
        </motion.div>

        <motion.p
          variants={item}
          className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-ember-core"
        >
          {c.eyebrow}
        </motion.p>

        <motion.h1
          variants={item}
          className="mx-auto mt-3 max-w-sm font-serif text-[2.75rem] font-semibold leading-[1.05] text-cream"
        >
          <HeroHeading text={c.heading} />
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-4 max-w-sm text-lg leading-relaxed text-cream-dim"
        >
          {c.body}
        </motion.p>

        <motion.form variants={item} onSubmit={handleSubmit} className="mt-8 space-y-3 text-left">
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
          {error && (
            <p className="text-sm font-medium text-[#ffb4a4]" role="alert">
              {error}
            </p>
          )}
          <motion.button
            type="submit"
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={springs.pop}
            className="animate-glow-pulse w-full rounded-xl bg-gradient-to-r from-ember-core to-ember-bright px-6 py-4 text-lg font-extrabold text-[#2a1006] shadow-[0_12px_40px_-8px_rgba(247,117,40,0.55)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-hot"
            style={{
              ["--glow-min" as string]: "1",
              ["--glow-max" as string]: "1",
            }}
          >
            {c.cta} →
          </motion.button>
        </motion.form>

        <motion.p variants={item} className="mt-4 text-sm leading-relaxed text-cream-faint">
          {c.emailNote}
        </motion.p>
      </motion.div>
    </ArenaShell>
  );
}
