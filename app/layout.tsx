import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dokument-AI · Forstå dine dokumenter på almindeligt dansk",
  description:
    "Upload kontrakter, tilbud, forsikringspapirer eller breve. Få en forklaring på almindeligt dansk, find frister og deadlines, og et resumé på sekunder.",
};

export const viewport: Viewport = {
  themeColor: "#1F6F5C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
