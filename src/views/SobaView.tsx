import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { GrainCrossSection, MillingDiagram } from "@/components/GrainAnatomy";
import { GrainRule, SobaFlower } from "@/components/Motifs";
import {
  FLOURS,
  GRAIN_LAYERS,
  VS_WHEAT,
  WITHOUT_FLOUR,
  menuOfFlour,
} from "@/data/soba";
import { MENU, formatPrice } from "@/data/menu";
import { alternates } from "@/lib/jsonld";
import { localePath, t, type L10n, type Locale } from "@/i18n/locale";

const COPY = {
  eyebrow: { ja: "そば粉の話", en: "About the flour" },
  title: {
    ja: "一粒を、四つに分ける",
    en: "One grain, split four ways",
  },
  lede: {
    ja: "そば粉には種類があります。品種の違いではなく、一粒の実のどこから出た粉かという違いです。中心に近いほど白く甘く、外に行くほど色と香りが濃くなる。当店では四つに分けて、菓子ごとに使い分けています。",
    en: "There is more than one buckwheat flour, and the difference is not the variety. It is which part of a single grain the flour came from. The closer to the centre, the whiter and sweeter; the further out, the darker and the stronger the scent. We separate four of them and use each for different sweets.",
  },
  anatomy: { ja: "実の断面", en: "Inside one grain" },
  milling: { ja: "四つの粉", en: "The four flours" },
  millingNote: {
    ja: "石臼を回すと、中心の粉から順に落ちてきます。最初に落ちるものが一番粉。番号は品質の順ではなく、落ちてくる順です。",
    en: "Turn the quern and the flour falls in order, from the centre outwards. What falls first is the first flour. The numbers are the order they fall in, not a ranking.",
  },
  yieldLabel: { ja: "取れ高", en: "Yield" },
  wholeYield: { ja: "分けない", en: "not separated" },
  usedIn: { ja: "この粉で作るもの", en: "Made with this flour" },
  noFlour: { ja: "粉を使わないもの", en: "Made without flour" },
  noFlourBody: {
    ja: "実をそのまま煎ったもの、茶にしたもの、花から採れた蜂蜜。挽かずに使う品もあります。",
    en: "Groats roasted whole, groats brewed as tea, honey taken from the flowers. Some of what we serve is never milled at all.",
  },
  vs: { ja: "小麦粉とどう違うか", en: "How it differs from wheat" },
  vsBody: {
    ja: "そば粉でお菓子を作るときに、実際に困るところだけを並べます。",
    en: "Only the differences that actually get in the way when you bake with it.",
  },
  vsSoba: { ja: "そば粉", en: "Buckwheat" },
  vsWheat: { ja: "小麦粉", en: "Wheat" },
  mill: { ja: "石臼のこと", en: "About the quern" },
  millBody: {
    ja: "石臼は一分間に十数回しか回しません。速く回すと摩擦で熱を持ち、熱が香りを飛ばしてしまうからです。その日に使う分だけを、朝に挽きます。挽いた粉は翌日には香りが落ちるので、余っても翌日には回しません。",
    en: "The quern turns only a dozen or so times a minute. Turn it faster and friction heats the stone, and heat takes the scent away. We mill in the morning, only what the day will use. The scent is gone by the next day, so nothing left over is carried forward.",
  },
  toMenu: { ja: "お品書きを見る →", en: "See the menu →" },
} satisfies Record<string, L10n>;

export function sobaMetadata(locale: Locale): Metadata {
  return {
    title: t(COPY.eyebrow, locale),
    description:
      locale === "ja"
        ? "一番粉から挽きぐるみまで、そばの実のどこから出た粉かで四つに分かれます。実の断面と、どの粉でどの菓子を作っているかの対応。"
        : "From the first flour to whole-grain: four flours, each from a different part of one grain. A cross-section, and which sweet is made from which.",
    alternates: alternates(localePath("/soba", locale)),
  };
}

export function SobaView({ locale }: { locale: Locale }) {
  const withoutFlour = WITHOUT_FLOUR.map(
    (id) => MENU.find((m) => m.id === id)!,
  );

  return (
    <Shell locale={locale}>
      <div className="mx-auto max-w-3xl px-5 py-20">
        <header>
          <p className="text-xs tracking-[0.3em] text-sobacha">
            {t(COPY.eyebrow, locale)}
          </p>
          <h1 className="mt-4 font-mincho text-3xl sm:text-4xl tracking-[0.1em] text-kinari">
            {t(COPY.title, locale)}
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-usuzumi">
            {t(COPY.lede, locale)}
          </p>
        </header>

        <GrainRule className="my-14" />

        <section aria-labelledby="anatomy">
          <h2
            id="anatomy"
            className="font-mincho text-xl tracking-[0.15em] text-kinari"
          >
            {t(COPY.anatomy, locale)}
          </h2>

          <GrainCrossSection locale={locale} className="mx-auto mt-8 max-w-lg" />

          <dl className="mt-8 space-y-5">
            {GRAIN_LAYERS.map((layer) => (
              <div key={layer.id} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: layer.color }}
                />
                <div>
                  <dt className="font-mincho text-base text-andon">
                    {t(layer.name, locale)}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-kinari/85">
                    {t(layer.body, locale)}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        <GrainRule className="my-16" />

        <section aria-labelledby="milling">
          <h2
            id="milling"
            className="font-mincho text-xl tracking-[0.15em] text-kinari"
          >
            {t(COPY.milling, locale)}
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-usuzumi">
            {t(COPY.millingNote, locale)}
          </p>

          <div className="mt-10 space-y-10">
            {FLOURS.map((flour) => (
              <article key={flour.id} className="washi rounded-sm p-6">
                <div className="flex items-start gap-5">
                  <MillingDiagram flour={flour} locale={locale} />
                  <div className="min-w-0">
                    <h3 className="font-mincho text-xl text-andon">
                      {t(flour.name, locale)}
                    </h3>
                    <p className="mt-1 text-xs tracking-wider text-usuzumi">
                      {t(flour.reading, locale)}
                    </p>
                    <p className="mt-2 text-xs text-sobacha">
                      {t(flour.from, locale)}
                      <span className="mx-2 text-hari">|</span>
                      {t(COPY.yieldLabel, locale)}{" "}
                      {flour.yield === null
                        ? t(COPY.wholeYield, locale)
                        : `${flour.yield}%`}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-kinari/85">
                  {t(flour.body, locale)}
                </p>

                <div className="mt-5 border-t border-hari/70 pt-4">
                  <p className="text-[0.7rem] tracking-[0.2em] text-sobacha">
                    {t(COPY.usedIn, locale)}
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    {menuOfFlour(flour.id).map((item) => (
                      <li key={item.id} className="text-kinari/90">
                        {t(item.name, locale)}
                        <span className="ml-2 text-xs text-usuzumi">
                          {formatPrice(item.price, locale)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* 粉を使わない品。ここが無いと、お品書きとの対応に穴があく */}
          <div className="mt-10 border-l border-hari pl-5">
            <h3 className="flex items-center gap-2 font-mincho text-base text-kinari">
              <SobaFlower className="h-4 w-4 text-koke" />
              {t(COPY.noFlour, locale)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-kinari/85">
              {t(COPY.noFlourBody, locale)}
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-usuzumi">
              {withoutFlour.map((item) => (
                <li key={item.id}>{t(item.name, locale)}</li>
              ))}
            </ul>
          </div>
        </section>

        <GrainRule className="my-16" />

        <section aria-labelledby="vs">
          <h2
            id="vs"
            className="font-mincho text-xl tracking-[0.15em] text-kinari"
          >
            {t(COPY.vs, locale)}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-kinari/85">
            {t(COPY.vsBody, locale)}
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-hari text-left text-xs tracking-widest text-sobacha">
                  <th scope="col" className="py-3 pr-4 font-normal" />
                  <th scope="col" className="py-3 pr-4 font-normal">
                    {t(COPY.vsSoba, locale)}
                  </th>
                  <th scope="col" className="py-3 font-normal">
                    {t(COPY.vsWheat, locale)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {VS_WHEAT.map((row) => (
                  <tr
                    key={row.point.ja}
                    className="border-b border-hari/60 align-top"
                  >
                    <th
                      scope="row"
                      className="py-4 pr-4 text-left font-normal text-usuzumi"
                    >
                      {t(row.point, locale)}
                    </th>
                    <td className="py-4 pr-4 text-kinari">
                      {t(row.soba, locale)}
                    </td>
                    <td className="py-4 text-usuzumi">
                      {t(row.wheat, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <GrainRule className="my-16" />

        <section aria-labelledby="mill">
          <h2
            id="mill"
            className="font-mincho text-xl tracking-[0.15em] text-kinari"
          >
            {t(COPY.mill, locale)}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-kinari/85">
            {t(COPY.millBody, locale)}
          </p>
        </section>

        <p className="mt-16">
          <Link
            href={localePath("/menu", locale)}
            className="text-sm text-andon hover:underline"
          >
            {t(COPY.toMenu, locale)}
          </Link>
        </p>
      </div>
    </Shell>
  );
}
