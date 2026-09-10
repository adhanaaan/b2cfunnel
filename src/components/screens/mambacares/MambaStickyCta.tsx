"use client";

import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "@/config/copy";
import { ease } from "@/lib/motion";
import { ShareIcon } from "@/components/screens/event3/icons";
import { DonateLink, donateButtonClass, shareButtonClass } from "./ui";

/**
 * The bar pinned to the bottom of the screen for the whole report (Figma
 * 775:17670, which sets it to Fixed): share on the left, donate on the right.
 *
 * Retry lives in the header's top corner, as on /phkl, so this bar is only
 * ever about the campaign. It slides up once the header has landed and then
 * stays. Every section below it ends on enough bottom padding to clear it.
 */
export function MambaStickyCta({
  share,
}: {
  share: { share: () => void; sharing: boolean; note: string | null };
}) {
  const c = COPY.screens.mambacares.report.sticky;
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-40"
      initial={reduced ? false : { y: 96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: ease.out, delay: reduced ? 0 : 0.7 }}
    >
      <div className="border-t border-[#f2ddce]/80 bg-[#fff8f3]/92 shadow-[0_-14px_36px_-24px_rgba(90,40,10,0.45)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-lg items-center gap-2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
          <button
            type="button"
            onClick={share.share}
            disabled={share.sharing}
            className={`${shareButtonClass} basis-1/3`}
          >
            <ShareIcon className="h-[22px] w-[22px]" />
            {c.share}
          </button>
          <DonateLink
            placement="sticky"
            className={`${donateButtonClass} basis-2/3 whitespace-nowrap`}
          >
            {c.donate}
          </DonateLink>
        </div>
      </div>
    </motion.div>
  );
}
