import type { Metadata } from "next";
import { SiloamPolicy } from "./SiloamPolicy";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Privacy Policy | Reaction Time Challenge",
  description:
    "Bagaimana Gray Matter Solutions mengumpulkan, menggunakan, dan melindungi data pribadi pada Siloam Neuroscience Summit, berdasarkan UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.",
};

/**
 * /siloamneurosciencesummit/privacy-policy - the policy behind the consent
 * row on the summit's landing.
 *
 * The one document on this site NOT written against Singapore's PDPA. This
 * event runs in Indonesia, so its policy is written against UU No. 27 Tahun
 * 2022 tentang Pelindungan Data Pribadi, in Bahasa Indonesia and English; the
 * text is in config/privacyPolicyIndonesia.ts, and the note at the top of that
 * file explains which parts of the UU PDP each section exists to answer.
 *
 * It opens in Indonesian, and the client component beside this one carries the
 * toggle - the page itself stays a server component so the document is still
 * in the HTML for anyone reading it without JavaScript.
 */
export default function SiloamPrivacyPolicyPage() {
  return <SiloamPolicy />;
}
