import type { Metadata } from "next";
import { Shippori_Mincho_B1, Zen_Kaku_Gothic_New } from "next/font/google";
import "../globals.css";
import { SHOP } from "@/data/shop";
import { SITE_URL } from "@/lib/jsonld";

/**
 * 日本語版の root layout。
 *
 * 英語版は `app/(en)/layout.tsx` に別の root layout を持つ。
 * ルートグループで root layout を二つに分けているのは、
 * `<html lang>` をページの言語に合わせて出すため —— 静的書き出しでは
 * layout が経路を読めないので、これ以外に正しい lang を出す手立てがない。
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
    default: `${SHOP.name.ja} — ${SHOP.tagline.ja}`,
    template: `%s | ${SHOP.name.ja}`,
  },
  description: SHOP.fictionNotice.ja,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    alternateLocale: "en",
    siteName: SHOP.name.ja,
  },
  robots: { index: true, follow: true },
};

export default function JapaneseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${shippori.variable} ${zen.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">{children}</body>
    </html>
  );
}
