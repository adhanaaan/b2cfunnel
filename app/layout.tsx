import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brain Health Score | Gray Matter Solutions",
  description:
    "A free, 3-minute educational quiz that estimates your brain health profile and shows what's driving it.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={jakarta.variable}>
      <body className="min-h-screen bg-surface font-sans text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
