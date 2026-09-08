"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { firstName } from "@/lib/format";
import { ease, springs, stagger } from "@/lib/motion";
import { Event3Shell } from "@/components/screens/event3/Event3Shell";
import { ctaPrimaryClass } from "@/components/screens/event3/ui";
import { PhklProgressRail } from "./PhklProgressRail";

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.enter },
};

/**
 * The three factor photos (Figma "08 Quiz Intro"), one per caption in the
 * copy. Each file is optional: until it is uploaded to public/images/phkl the
 * tile is a warm gradient under its caption, never a broken image.
 */
const PHOTOS = [
  { src: "/images/phkl/quiz-intro-sleep.png", tone: "from-[#f9d2b8] to-[#f2ad86]" },
  { src: "/images/phkl/quiz-intro-exercise.png", tone: "from-[#fde3a7] to-[#f6ad3c]" },
  { src: "/images/phkl/quiz-intro-diet.png", tone: "from-[#f9d9c4] to-[#ef9f6f]" },
];

function FactorTile({
  src,
  tone,
  label,
}: {
  src: string;
  tone: string;
  label: string;
}) {
  const [ok, setOk] = useState(true);
  return (
    <figure
      className={`relative h-[clamp(78px,11dvh,96px)] min-w-0 flex-1 overflow-hidden rounded-xl bg-gradient-to-br ${tone}`}
    >
      {ok && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          onError={() => setOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <figcaption className="absolute bottom-1.5 left-1.5 rounded-full bg-white/85 px-2 py-0.5 text-[10.5px] font-bold text-charcoal backdrop-blur-[2px]">
        {label}
      </figcaption>
    </figure>
  );
}

/**
 * PHKL quiz primer (Figma "08 Quiz Intro"): the rail on its second stop, and
 * the one idea the quiz rests on - speed is not fixed, and what moves it is
 * about to be asked. Replaces the regatta's optional invite: there is no
 * decline, only Continue.
 */
export function PhklQuizIntro({
  name,
  onContinue,
}: {
  name?: string;
  onContinue: () => void;
}) {
  const c = COPY.screens.phkl.quizIntro;
  const reduced = useReducedMotion();
  const first = firstName(name);
  const heading = first
    ? c.heading.replace("{name}", first)
    : c.headingAnonymous;

  return (
    <Event3Shell pills>
      <motion.div
        className="flex h-full min-h-0 flex-col"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : stagger.items } },
        }}
        initial={reduced ? "show" : "hidden"}
        animate="show"
      >
        <motion.div variants={item} className="pt-1">
          <PhklProgressRail stage="quiz" />
        </motion.div>

        <div className="flex flex-1 flex-col justify-center">
          <motion.h1
            variants={item}
            className="text-balance text-[clamp(1.9rem,4.6dvh,2.15rem)] font-bold leading-[1.07] text-[#171717]"
          >
            {heading}
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-3 text-[clamp(0.9375rem,2.2dvh,1.0625rem)] leading-[1.45] text-secondary"
          >
            {c.body}
          </motion.p>

          <motion.div
            className="-mx-4 mt-[3.5dvh] flex gap-1.5 px-1"
            initial={reduced ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: ease.out, delay: 0.25 }}
            aria-hidden
          >
            {PHOTOS.map((photo, i) => (
              <FactorTile
                key={photo.src}
                src={photo.src}
                tone={photo.tone}
                label={c.factors[i]}
              />
            ))}
          </motion.div>

          <motion.p
            variants={item}
            className="mt-[3.5dvh] text-[clamp(1.0625rem,2.4dvh,1.25rem)] leading-[1.35] text-secondary"
          >
            {c.lead}
          </motion.p>
        </div>

        <motion.div variants={item} className="mt-auto pt-6">
          <motion.button
            type="button"
            onClick={onContinue}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={springs.pop}
            className={ctaPrimaryClass}
          >
            {c.cta} →
          </motion.button>
        </motion.div>
      </motion.div>
    </Event3Shell>
  );
}
