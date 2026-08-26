import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { RouteMap } from "@/components/RouteMap";
import { GrainRule, Yukiwa } from "@/components/Motifs";
import { SHOP, formatPeriod } from "@/data/shop";
import { alternates } from "@/lib/jsonld";
import { localePath, t, type L10n, type Locale } from "@/i18n/locale";

const COPY = {
  eyebrow: { ja: "道のり", en: "Getting here" },
  title: {
    ja: "杉並木の、いちばん奥",
    en: "The far end of the cedar avenue",
  },
  lede: {
    ja: "中社の鳥居から参道を上り、杉並木に入って七分ほど歩いた右手です。",
    en: "Up the approach from the Chūsha torii, into the cedar avenue, and seven minutes along on the right.",
  },
  how: { ja: "行き方", en: "Ways to come" },
  hours: { ja: "営業", en: "Hours" },
  period: { ja: "期間", en: "Season" },
  daysTime: { ja: "曜日と時間", en: "Days and hours" },
  memo: { ja: "おぼえ書き", en: "Notes" },
  hoursCaption: {
    ja: "期間ごとの営業曜日と時間",
    en: "Days and hours by season",
  },
  building: { ja: "建物のこと", en: "About the building" },
  buildingBody: {
    ja: "敷居が高く、廊下に段差があります。お足元の悪い方はお声がけください、一階の座敷にご案内します。",
    en: "The thresholds are high and there are steps in the corridor. If stairs are difficult, please say so and we will seat you in the ground-floor tatami room.",
  },
  toCalendar: {
    ja: "どの日に開いているかは、営業日のページで →",
    en: "Which days we are open →",
  },
  toStory: {
    ja: "この建物の来歴 →",
    en: "The history of this building →",
  },
} satisfies Record<string, L10n>;

function seatsLine(locale: Locale): string {
  return locale === "ja"
    ? `${t(SHOP.closedNote, locale)}。席は ${SHOP.seats} 席、日曜と祝日は混みあいます。`
    : `${t(SHOP.closedNote, locale)}. There are ${SHOP.seats} seats; Sundays and public holidays are busy.`;
}

export function accessMetadata(locale: Locale): Metadata {
  return {
    title: t(COPY.eyebrow, locale),
    description:
      locale === "ja"
        ? "JR 長野駅からバスで約 1 時間、戸隠中社から杉並木ぞいに徒歩 7 分。冬期の道路と営業時間について。"
        : "About an hour by bus from JR Nagano Station, then seven minutes on foot from Togakushi Chūsha. Includes the winter road and opening hours.",
    alternates: alternates(localePath("/access", locale)),
  };
}

export function AccessView({ locale }: { locale: Locale }) {
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
            {t(SHOP.address.region, locale)}
            {locale === "en" ? ", " : ""}
            {t(SHOP.address.locality, locale)}
            {locale === "ja" ? "・" : " — "}
            {t(SHOP.address.detail, locale)}
            {locale === "ja" ? "。" : ". "}
            {t(COPY.lede, locale)}
          </p>
        </header>

        <RouteMap className="mx-auto mt-12 max-w-xl" locale={locale} />

        <GrainRule className="my-14" />

        <section aria-labelledby="how" className="space-y-8">
          <h2
            id="how"
            className="font-mincho text-xl tracking-[0.15em] text-kinari"
          >
            {t(COPY.how, locale)}
          </h2>
          {SHOP.access.map((a) => (
            <div key={a.title.ja} className="border-l border-hari pl-5">
              <h3 className="flex items-center gap-2 font-mincho text-base text-andon">
                {a.title.ja.includes("冬") && (
                  <Yukiwa className="h-4 w-4 text-yuki" />
                )}
                {t(a.title, locale)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-kinari/85">
                {t(a.body, locale)}
              </p>
            </div>
          ))}
        </section>

        <GrainRule className="my-14" />

        <section aria-labelledby="hours">
          <h2
            id="hours"
            className="font-mincho text-xl tracking-[0.15em] text-kinari"
          >
            {t(COPY.hours, locale)}
          </h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-sm">
              <caption className="sr-only">
                {t(COPY.hoursCaption, locale)}
              </caption>
              <thead>
                <tr className="border-b border-hari text-left text-xs tracking-widest text-sobacha">
                  <th scope="col" className="py-3 pr-4 font-normal">
                    {t(COPY.period, locale)}
                  </th>
                  <th scope="col" className="py-3 pr-4 font-normal">
                    {t(COPY.daysTime, locale)}
                  </th>
                  <th scope="col" className="py-3 font-normal">
                    {t(COPY.memo, locale)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {SHOP.openingPeriods.map((p) => (
                  <tr
                    key={p.label.ja}
                    className="border-b border-hari/60 align-top"
                  >
                    <th
                      scope="row"
                      className="py-4 pr-4 text-left font-normal text-kinari"
                    >
                      {t(p.label, locale)}
                    </th>
                    <td className="py-4 pr-4 text-kinari/85">
                      {formatPeriod(p, locale)}
                    </td>
                    <td className="py-4 text-xs text-usuzumi">
                      {t(p.note, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-sm text-usuzumi">{seatsLine(locale)}</p>
          <p className="mt-4">
            <Link
              href={localePath("/calendar", locale)}
              className="text-sm text-andon hover:underline"
            >
              {t(COPY.toCalendar, locale)}
            </Link>
          </p>
        </section>

        <GrainRule className="my-14" />

        <section aria-labelledby="building">
          <h2
            id="building"
            className="font-mincho text-xl tracking-[0.15em] text-kinari"
          >
            {t(COPY.building, locale)}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-kinari/85">
            {locale === "ja"
              ? `${SHOP.building.builtYear} 年に建った${t(SHOP.building.kind, locale)}です。${t(SHOP.building.note, locale)}。`
              : `A ${t(SHOP.building.kind, locale)} built in ${SHOP.building.builtYear}, where ${t(SHOP.building.note, locale)}.`}{" "}
            {t(COPY.buildingBody, locale)}
          </p>
          <p className="mt-6">
            <Link
              href={localePath("/story", locale)}
              className="text-sm text-andon hover:underline"
            >
              {t(COPY.toStory, locale)}
            </Link>
          </p>
        </section>
      </div>
    </Shell>
  );
}
