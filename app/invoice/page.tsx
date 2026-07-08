import type { Metadata } from "next";
import { InvoiceSuccessClient } from "./InvoiceSuccessClient";

export const metadata: Metadata = {
  title: "Purchase Confirmed | Gray Matter Solutions",
  description:
    "Confirm your ReCOGnAIze Brain Health Consult teleconsult details on WhatsApp.",
};

export default function InvoicePage() {
  return <InvoiceSuccessClient />;
}
