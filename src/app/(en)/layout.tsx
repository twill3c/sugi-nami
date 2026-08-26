import type { Metadata } from "next";
import { Shippori_Mincho_B1, Zen_Kaku_Gothic_New } from "next/font/google";
import "../globals.css";
import { SHOP } from "@/data/shop";
import { SITE_URL } from "@/lib/jsonld";

/**
 * 英語版の root layout。日本語版(`app/(ja)/layout.tsx`)と対になる。
 * 違うのは `<html lang>` と metadata の言語だけで、書体も配色も共通。
 */

const shippori = Shippori_Mincho_B1({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-shippori",
});

const zen = Zen_Kaku_Gothic_New({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-zen",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SHOP.name.en} — ${SHOP.tagline.en}`,
    template: `%s | ${SHOP.name.en}`,
  },
  description: SHOP.fictionNotice.en,
  openGraph: {
    type: "website",
    locale: "en",
    alternateLocale: "ja_JP",
    siteName: SHOP.name.en,
  },
  robots: { index: true, follow: true },
};

export default function EnglishLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${shippori.variable} ${zen.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">{children}</body>
    </html>
  );
}
