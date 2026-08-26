import Link from "next/link";
import type { Metadata } from "next";
import { SHOP, formatPeriod, periodOfMonth } from "@/data/shop";
import { SeasonalNow } from "@/components/SeasonalNow";
import {
  GrainRule,
  Kominka,
  SobaFlower,
  SugiGrove,
} from "@/components/Motifs";
import { JsonLd, Shell } from "@/components/Shell";
import { alternates, cafeJsonLd } from "@/lib/jsonld";
import { localePath, t, type L10n, type Locale } from "@/i18n/locale";

// ビルドした月。「今月の菓子」の初期値になる(クライアント側で実際の月に直る)
const BUILD_MONTH = new Date().getMonth() + 1;
const AGE = new Date().getFullYear() - SHOP.building.builtYear;

const COPY = {
  lede: {
    ja: "麺は出しません。石臼で挽いたそば粉で、菓子だけを作っています。杉並木を抜けて、いちばん奥の一軒です。",
    en: "We serve no noodles. Everything here is made from stone-milled buckwheat flour, and all of it is sweet. Walk to the far end of the cedar avenue; ours is the last house.",
  },
  seeMenu: { ja: "お品書きを見る", en: "See the menu" },
  getting: { ja: "道のり", en: "Getting here" },
  about: { ja: "この店のこと", en: "About the shop" },
  accessBrief: { ja: "道のり", en: "Getting here" },
  accessMore: {
    ja: "冬の道のことも含めて、くわしく →",
    en: "More, including the winter road →",
  },
  storyLink: {
    ja: "この家が建ってからの 120 年 →",
    en: "The hundred and twenty years of this house →",
  },
  calendarLink: {
    ja: "今月と来月の営業日 →",
    en: "Opening days, this month and next →",
  },
} satisfies Record<string, L10n>;

const PILLARS: { title: L10n; body: L10n }[] = [
  {
    title: {
      ja: `築 ${AGE} 年の養蚕農家`,
      en: `A ${AGE}-year-old silkworm farmhouse`,
    },
    body: {
      ja: "二階は蚕を飼っていた部屋です。窓が横に並ぶのは風を通すため。梁と柱はそのまま残し、床だけを張りかえて客席にしました。天井が高いので、夏でも涼しい。",
      en: "The upper floor is where the silkworms were kept. The row of windows is there for the draught. We left the beams and pillars and relaid only the floor. The ceiling is high, so it stays cool even in summer.",
    },
  },
  {
    title: { ja: "戸隠在来のそば粉", en: "Togakushi's native buckwheat" },
    body: {
      ja: "標高千二百メートル、昼と夜の寒暖差が実を締めます。石臼で挽いたものを、その日の分だけ。粉は挽いた翌日から香りが落ちるので、作り置きをしません。",
      en: "At twelve hundred metres, the gap between day and night temperatures tightens the grain. We mill on a stone quern, only what the day needs. Flour starts losing its scent the day after milling, so nothing is made ahead.",
    },
  },
  {
    title: { ja: "そばで、甘いもの", en: "Buckwheat, on the sweet side" },
    body: {
      ja: "そば粉は本来、甘いものによく合います。灰汁が少なく、小麦より香りが立つ。当店は麺を出しません。そば粉の菓子だけで一年を組み立てています。",
      en: "Buckwheat belongs in sweet things. It carries less bitterness than people expect, and more scent than wheat. We serve no noodles; the whole year is built out of buckwheat sweets.",
    },
  },
];

export function homeMetadata(locale: Locale): Metadata {
  const path = localePath("/", locale);
  return {
    title: `${t(SHOP.name, locale)} — ${t(SHOP.tagline, locale)}`,
    description:
      locale === "ja"
        ? `長野県戸隠、築 ${AGE} 年の養蚕農家を改装した、そば粉の菓子だけを出す店。${t(SHOP.fictionNotice, locale)}`
        : `A shop in Togakushi, Nagano, in a ${AGE}-year-old silkworm farmhouse, serving nothing but buckwheat sweets. ${t(SHOP.fictionNotice, locale)}`,
    alternates: alternates(path),
  };
}

export function HomeView({ locale }: { locale: Locale }) {
  const period = periodOfMonth(BUILD_MONTH);

  return (
    <Shell locale={locale}>
      <JsonLd data={cafeJsonLd(locale)} />

      {/* 表 — 奥社の杉並木を背に、店名だけを置く */}
      <section className="relative overflow-hidden border-b border-hari">
        <SugiGrove className="absolute inset-0 h-full w-full opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-sumi/15 via-sumi/45 to-sumi" />

        <div className="relative mx-auto flex min-h-[74svh] max-w-5xl flex-col justify-end px-5 pb-16 pt-28">
          <p className="text-xs tracking-[0.35em] text-sobacha">
            {t(SHOP.address.region, locale)}
            {locale === "en" ? ", " : " ・ "}
            {t(SHOP.address.locality, locale)}
          </p>
          <h1 className="mt-5 font-mincho text-5xl leading-tight tracking-[0.12em] text-kinari sm:text-6xl">
            {locale === "ja" ? (
              <>
                そば菓子
                <br className="sm:hidden" />
                <span className="text-andon"> 杉なみ</span>
              </>
            ) : (
              <>
                <span className="text-andon">Suginami</span>
                <br />
                <span className="text-4xl sm:text-5xl">
                  Buckwheat Confectionery
                </span>
              </>
            )}
          </h1>
          <p className="mt-6 max-w-md font-mincho text-xl tracking-[0.08em] text-kinari/90">
            {t(SHOP.tagline, locale)}
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-usuzumi">
            {t(COPY.lede, locale)}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href={localePath("/menu", locale)}
              className="rounded-sm border border-andon px-6 py-3 text-sm tracking-[0.15em] text-andon transition-colors hover:bg-andon hover:text-sumi"
            >
              {t(COPY.seeMenu, locale)}
            </Link>
            <Link
              href={localePath("/access", locale)}
              className="rounded-sm border border-hari px-6 py-3 text-sm tracking-[0.15em] text-usuzumi transition-colors hover:border-sobacha hover:text-kinari"
            >
              {t(COPY.getting, locale)}
            </Link>
          </div>

          <p className="mt-8 text-xs text-usuzumi">
            <span className="text-kinari">{formatPeriod(period, locale)}</span>
            <span className="mx-2 text-hari">|</span>
            {t(period.label, locale)}
            {locale === "ja" ? " ・ " : " · "}
            {t(SHOP.closedNote, locale)}
          </p>
        </div>
      </section>

      <div className="py-20">
        <SeasonalNow buildMonth={BUILD_MONTH} locale={locale} />
        <p className="mx-auto mt-10 max-w-5xl px-5">
          <Link
            href={localePath("/calendar", locale)}
            className="text-sm text-andon hover:underline"
          >
            {t(COPY.calendarLink, locale)}
          </Link>
        </p>
      </div>

      <GrainRule className="mx-auto max-w-5xl px-5" />

      {/* 店のこと — 三本の柱 */}
      <section
        aria-labelledby="about-heading"
        className="mx-auto max-w-5xl px-5 py-20"
      >
        <div className="flex items-center gap-3">
          <SobaFlower className="h-5 w-5 text-koke" />
          <h2
            id="about-heading"
            className="font-mincho text-2xl tracking-[0.1em] text-kinari"
          >
            {t(COPY.about, locale)}
          </h2>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <dl className="space-y-8">
              {PILLARS.map((p) => (
                <div key={p.title.ja} className="border-l border-hari pl-5">
                  <dt className="font-mincho text-lg text-andon">
                    {t(p.title, locale)}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-kinari/85">
                    {t(p.body, locale)}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 pl-5">
              <Link
                href={localePath("/story", locale)}
                className="text-sm text-andon hover:underline"
              >
                {t(COPY.storyLink, locale)}
              </Link>
            </p>
          </div>

          <Kominka className="mx-auto w-full max-w-xs text-hari md:w-72" />
        </div>
      </section>

      {/* 道のりの要約 */}
      <section
        aria-labelledby="access-brief"
        className="mx-auto max-w-5xl px-5 pb-4"
      >
        <div className="washi rounded-sm p-8">
          <h2
            id="access-brief"
            className="font-mincho text-xl tracking-[0.1em] text-kinari"
          >
            {t(COPY.accessBrief, locale)}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-kinari/85">
            {t(SHOP.access[0].body, locale)}
          </p>
          <Link
            href={localePath("/access", locale)}
            className="mt-6 inline-block text-sm text-andon hover:underline"
          >
            {t(COPY.accessMore, locale)}
          </Link>
        </div>
      </section>
    </Shell>
  );
}
