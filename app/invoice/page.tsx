import type { Metadata } from "next";
import { InvoiceSuccessClient } from "./InvoiceSuccessClient";

export const metadata: Metadata = {
  title: "Purchase Confirmed | Gray Matter Solutions",
  description:
    "Complete your ReCOGnAIze teleconsult booking with Dr Odelia Koh at Prologue The Lifestyle Medical Clinic.",
};

export default function InvoicePage() {
  return <InvoiceSuccessClient />;
}
