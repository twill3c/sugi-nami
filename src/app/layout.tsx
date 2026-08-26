import type { Metadata } from "next";
import { Shippori_Mincho_B1, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import { SHOP } from "@/data/shop";
import { SITE_URL, cafeJsonLd } from "@/lib/jsonld";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// 見出しの明朝と本文のゴシック。next/font が自前配信するので
// 外部への font リクエストは発生しない。
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
    default: `${SHOP.name} — ${SHOP.tagline}`,
    template: `%s | ${SHOP.name}`,
  },
  description: `長野県戸隠、築 ${new Date().getFullYear() - SHOP.building.builtYear} 年の${SHOP.building.kind}を改装した、そば粉の菓子だけを出す店。${SHOP.fictionNotice}`,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SHOP.name,
    title: `${SHOP.name} — ${SHOP.tagline}`,
    description: "戸隠の古民家で、そば粉の菓子だけを出しています。",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${shippori.variable} ${zen.variable}`}>
      <body className="min-h-dvh flex flex-col antialiased">
        {/* キーボードとスクリーンリーダのための本文への近道 */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-andon focus:text-sumi focus:px-4 focus:py-2 focus:rounded"
        >
          本文へ移動
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          // 構造化データ。data/ の定数から組み立てているので本文と食い違わない
          dangerouslySetInnerHTML={{ __html: JSON.stringify(cafeJsonLd()) }}
        />
      </body>
    </html>
  );
}
