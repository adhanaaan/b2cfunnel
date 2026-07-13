import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
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
    <html
      lang="en-GB"
      className={`${jakarta.variable} ${figtree.variable} ${cormorant.variable}`}
    >
      <body className="min-h-screen bg-surface font-sans text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
