import type { Metadata } from "next";
import { MenuList } from "@/components/MenuList";
import { GrainRule } from "@/components/Motifs";
import { Shell } from "@/components/Shell";
import { SHOP } from "@/data/shop";
import { alternates } from "@/lib/jsonld";
import { localePath, t, type L10n, type Locale } from "@/i18n/locale";

const COPY = {
  eyebrow: { ja: "お品書き", en: "Menu" },
  title: { ja: "そば粉の菓子", en: "Sweets made of buckwheat" },
  lede: {
    ja: "価格は税込です。菓子はその日に挽いた粉で作るため、数がなくなり次第おしまいになります。",
    en: "Prices include tax. Everything is made with flour milled that morning, so when a day's batch is gone, it is gone.",
  },
  warningTitle: {
    ja: "当店の菓子は、飲みものを含めてすべてそばを使用しています",
    en: "Everything we serve, drinks included, contains buckwheat",
  },
  warningBody: {
    ja: "そば粉を使わない品はご用意がありません。厨房も共通です。そばアレルギーのある方はご来店をお控えください。そば以外に気になるものがある方は、下の絞り込みをお使いください。",
    en: "There is no buckwheat-free item on the list, and one kitchen makes all of it. If you have a buckwheat allergy, please do not visit. If something else is a problem for you, use the filter below.",
  },
  footnote: {
    ja: "表示しているのは、特定原材料のうち当店の菓子に使うものだけです。",
    en: "Only the allergens that actually appear in our sweets are listed here.",
  },
} satisfies Record<string, L10n>;

export function menuMetadata(locale: Locale): Metadata {
  return {
    title: t(COPY.eyebrow, locale),
    description:
      locale === "ja"
        ? "そばがき善哉、杉なみ最中、そば粉のガレット。戸隠在来のそば粉で作る通年の菓子と、季節ごとに入れかわる菓子のお品書き。"
        : "Sobagaki zenzai, Suginami monaka, buckwheat galette. The year-round list and the sweets that change with the season.",
    alternates: alternates(localePath("/menu", locale)),
  };
}

export function MenuView({ locale }: { locale: Locale }) {
  return (
    <Shell locale={locale}>
      <div className="mx-auto max-w-3xl px-5 py-20">
        <header>
          <p className="text-xs tracking-[0.3em] text-sobacha">
            {t(COPY.eyebrow, locale)}
          </p>
          <h1 className="mt-4 font-mincho text-4xl tracking-[0.1em] text-kinari">
            {t(COPY.title, locale)}
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-usuzumi">
            {t(COPY.lede, locale)}
          </p>
        </header>

        {/*
          そばアレルギーの注意。全品にそば粉が入る店なので、
          品ごとの小さな表記ではなく、お品書きの先頭で一度だけ強く出す。
        */}
        <div
          role="note"
          aria-labelledby="soba-warning"
          className="mt-10 rounded-sm border-l-2 border-andon bg-andon/10 px-5 py-4"
        >
          <p
            id="soba-warning"
            className="font-mincho text-base tracking-wide text-andon"
          >
            {t(COPY.warningTitle, locale)}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-kinari/85">
            {t(COPY.warningBody, locale)}
          </p>
        </div>

        <div className="mt-10">
          <MenuList locale={locale} />
        </div>

        <GrainRule className="my-14" />

        <p className="text-xs leading-relaxed text-usuzumi">
          {t(COPY.footnote, locale)}
          {locale === "en" ? " " : ""}
          {t(SHOP.contact.note, locale)}
        </p>
      </div>
    </Shell>
  );
}
