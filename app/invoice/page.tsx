import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Purchase Confirmation | Gray Matter Solutions",
  description: "Confirmation for your ReCOGnAIze Brain Health Consult purchase.",
};

export default function InvoicePage() {
  return (
    <main className="min-h-screen bg-white px-6 py-14 text-[#111] sm:px-10 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-normal sm:text-5xl">
          Thanks for your purchase!
        </h1>

        <div className="mt-16 space-y-7 text-lg leading-relaxed sm:text-xl">
          <p>Dear customer,</p>

          <p>
            Thank you for purchasing the ReCOGnAIze Brain Health Consult. Your
            order has been received.
          </p>

          <div>
            <p className="font-semibold">What should I expect next?</p>
            <ul className="mt-3 list-disc space-y-2 pl-8">
              <li>
                <span className="font-semibold">
                  ReCOGnAIze Brain Health Consult
                </span>
              </li>
              <li>
                Our team will contact you shortly to confirm your appointment
                details and share the next steps before your assessment.
              </li>
            </ul>
          </div>

          <p>Gray Matter Solutions</p>
        </div>

        <div className="mt-24 text-center">
          <Link
            href="/quiz"
            className="font-semibold text-primary underline underline-offset-4"
          >
            Back to quiz
          </Link>
        </div>
      </div>
    </main>
  );
}
