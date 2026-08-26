import type { Locale } from "@/i18n/locale";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * ページの外枠。root layout ではなくここに置いているのは、
 * layout が locale を知らないため(静的書き出しでは経路を読めない)。
 * 各ページが自分の locale を渡す。
 */
export function Shell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* キーボードとスクリーンリーダのための本文への近道 */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-andon focus:px-4 focus:py-2 focus:text-sumi"
      >
        {locale === "ja" ? "本文へ移動" : "Skip to content"}
      </a>
      <Header locale={locale} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer locale={locale} />
    </>
  );
}

/** 構造化データをページに埋める */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
