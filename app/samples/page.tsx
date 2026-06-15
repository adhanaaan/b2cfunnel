"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { DoctorAvatar } from "@/components/result/DoctorAvatar";

const DOC = {
  name: "Dr Christopher Tan Ee Chong",
  creds: "MBBS (Singapore), MRCS, GDFM",
  initials: "CT",
  bio: "Upon graduating from the Yong Loo Lin School of Medicine, National University of Singapore, Dr Tan practised in a variety of surgical and medical disciplines at various hospitals in Singapore before entering private practice. He was awarded the Membership of the Royal College of Surgeons (Ireland) and conferred the Graduate Diploma of Family Medicine by the College of Family Physicians Singapore. He has acquired over 12 years of clinical experience in internal medicine, anaesthesia and pain management, ENT, family medicine, health screening, and complementary medicine.",
};

function Label({ n, name }: { n: number; name: string }) {
  return (
    <p className="mb-3 mt-10 text-sm font-bold uppercase tracking-widest text-primary">
      Sample {n} · {name}
    </p>
  );
}

/** Sample 1 — avatar + name beside, full bio below. */
function SampleAvatarFullBio() {
  return (
    <div className="rounded-2xl bg-surface-lowest p-6 shadow-card">
      <p className="text-xs font-bold uppercase tracking-wider text-primary">
        Your teleconsult clinician
      </p>
      <div className="mt-3 flex items-center gap-4">
        <DoctorAvatar initials={DOC.initials} className="h-16 w-16" />
        <div>
          <p className="text-lg font-bold leading-snug text-charcoal">
            {DOC.name}
          </p>
          <p className="text-sm font-semibold text-secondary">{DOC.creds}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-secondary">{DOC.bio}</p>
    </div>
  );
}

/** Sample 2 — centered, premium, creds in a pill. */
function SampleCentered() {
  return (
    <div className="rounded-2xl bg-surface-lowest p-6 text-center shadow-card">
      <DoctorAvatar initials={DOC.initials} className="mx-auto h-20 w-20 text-2xl" />
      <p className="mt-3 text-lg font-bold text-charcoal">{DOC.name}</p>
      <p className="mt-1.5 inline-block rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-primary-onContainer">
        {DOC.creds}
      </p>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-secondary">
        {DOC.bio}
      </p>
    </div>
  );
}

/** Sample 3 — compact header + collapsible "About the doctor". */
function SampleCollapsible() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl bg-surface-lowest p-5 shadow-card">
      <div className="flex items-center gap-3">
        <DoctorAvatar initials={DOC.initials} className="h-12 w-12 text-sm" />
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Your teleconsult clinician
          </p>
          <p className="font-bold leading-snug text-charcoal">{DOC.name}</p>
          <p className="text-sm text-secondary">{DOC.creds}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-3 text-sm font-semibold text-primary"
      >
        {open ? "Hide bio –" : "About the doctor +"}
      </button>
      {open && (
        <p className="mt-2 text-sm leading-relaxed text-secondary">{DOC.bio}</p>
      )}
    </div>
  );
}

/** Sample 4 — slim inline trust strip (creds + one-line summary, no bio dump). */
function SampleSlim() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface-low px-4 py-3">
      <DoctorAvatar initials={DOC.initials} className="h-11 w-11 text-sm" />
      <div className="min-w-0">
        <p className="font-bold leading-snug text-charcoal">{DOC.name}</p>
        <p className="text-sm text-secondary">
          {DOC.creds} · 12+ yrs clinical experience
        </p>
      </div>
    </div>
  );
}

export default function SamplesPage() {
  return (
    <ScreenShell>
      <div className="w-full">
        <h1 className="font-display text-2xl font-extrabold text-charcoal">
          Doctor card — pick a sample
        </h1>
        <p className="mt-1 text-sm text-secondary">
          Preview only. Nothing on the live paywall has changed.
        </p>

        <Label n={1} name="Avatar + full bio" />
        <SampleAvatarFullBio />

        <Label n={2} name="Centered, premium" />
        <SampleCentered />

        <Label n={3} name="Collapsible bio" />
        <SampleCollapsible />

        <Label n={4} name="Slim trust strip" />
        <SampleSlim />

        <p className="mt-10 text-center text-xs text-outline">
          Tell me which number to use and I'll add it to the paywall.
        </p>
      </div>
    </ScreenShell>
  );
}
