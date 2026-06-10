import Image from "next/image";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { ComplianceFooter } from "@/components/ui/ComplianceFooter";

/** Holding screen shown on /event once the event is paused/ended. */
export function EventEnded() {
  return (
    <ScreenShell>
      <div className="flex min-h-[80vh] flex-col justify-center text-center animate-fade-up">
        <div className="flex items-center justify-center gap-2.5">
          <Image
            src="/gms-logo.png"
            alt="Gray Matter Solutions logo"
            width={442}
            height={366}
            className="h-9 w-auto"
            priority
          />
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Reaction Time Challenge
          </p>
        </div>

        <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
          The challenge has ended
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-secondary">
          Thanks for playing. Come and speak to our team to learn more about
          your brain health and the science behind it.
        </p>

        <p className="mt-8 text-xs text-outline">
          Built with NTU&apos;s Dementia Research Centre.
        </p>
        <ComplianceFooter />
      </div>
    </ScreenShell>
  );
}
