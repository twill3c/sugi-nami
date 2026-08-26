import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { CalendarGrid } from "@/components/CalendarGrid";
import { GrainRule } from "@/components/Motifs";
import { SHOP, formatPeriod } from "@/data/shop";
import { alternates } from "@/lib/jsonld";
import { localePath, t, type L10n, type Locale } from "@/i18n/locale";

// ビルドした年月。カレンダーの初期値になる(クライアント側で実際の月に直る)
const NOW = new Date();
const BUILD_YEAR = NOW.getFullYear();
const BUILD_MONTH = NOW.getMonth() + 1;

const COPY = {
  eyebrow: { ja: "営業日", en: "Opening days" },
  title: { ja: "開いている日", en: "The days we are open" },
  lede: {
    ja: "今月から三か月ぶんを出しています。曜日の定休と、毎年おなじ日に取る休みを重ねたものです。",
    en: "Three months from the current one. This is the weekly pattern with the fixed annual closures laid over it.",
  },
  rules: { ja: "休みの決まり", en: "How the closures work" },
  weekly: { ja: "曜日の定休", en: "Weekly" },
  annual: { ja: "毎年の休み", en: "Every year" },
  annualNote: {
    ja: "年をまたぐ休みも一つの区間として扱っています。",
    en: "A closure that runs across New Year is handled as one span.",
  },
  toAccess: { ja: "道のりを見る →", en: "How to get here →" },
  toMenu: { ja: "お品書きを見る →", en: "See the menu →" },
} satisfies Record<string, L10n>;

export function calendarMetadata(locale: Locale): Metadata {
  return {
    title: t(COPY.eyebrow, locale),
    description:
      locale === "ja"
        ? "今月から三か月ぶんの営業日。曜日の定休、冬期の短縮、年末年始と品替えの休みを重ねて表示します。"
        : "Opening days for the next three months: the weekly pattern, the shorter winter hours, and the fixed annual closures.",
    alternates: alternates(localePath("/calendar", locale)),
  };
}

export function CalendarView({ locale }: { locale: Locale }) {
  return (
    <Shell locale={locale}>
      <div className="mx-auto max-w-5xl px-5 py-20">
        <header className="max-w-3xl">
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

        <div className="mt-14">
          <CalendarGrid
            buildYear={BUILD_YEAR}
            buildMonth={BUILD_MONTH}
            locale={locale}
          />
        </div>

        <GrainRule className="my-16" />

        <section aria-labelledby="rules-heading" className="max-w-3xl">
          <h2
            id="rules-heading"
            className="font-mincho text-xl tracking-[0.15em] text-kinari"
          >
            {t(COPY.rules, locale)}
          </h2>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div className="border-l border-hari pl-5">
              <h3 className="text-xs tracking-[0.2em] text-sobacha">
                {t(COPY.weekly, locale)}
              </h3>
              <ul className="mt-3 space-y-3 text-sm">
                {SHOP.openingPeriods.map((p) => (
                  <li key={p.label.ja}>
                    <span className="text-kinari">
                      {formatPeriod(p, locale)}
                    </span>
                    <br />
                    <span className="text-xs text-usuzumi">
                      {t(p.label, locale)} ・ {t(p.note, locale)}
                    </span>
                  </li>
                ))}
                <li className="text-xs text-usuzumi">
                  {t(SHOP.closedNote, locale)}
                </li>
              </ul>
            </div>

            <div className="border-l border-hari pl-5">
              <h3 className="text-xs tracking-[0.2em] text-sobacha">
                {t(COPY.annual, locale)}
              </h3>
              <ul className="mt-3 space-y-3 text-sm">
                {SHOP.annualClosures.map((c) => (
                  <li key={c.reason.ja}>
                    <span className="text-kinari">
                      {c.from.month}/{c.from.day} – {c.to.month}/{c.to.day}
                    </span>
                    <br />
                    <span className="text-xs text-usuzumi">
                      {t(c.reason, locale)}
                    </span>
                  </li>
                ))}
                <li className="text-xs text-usuzumi">
                  {t(COPY.annualNote, locale)}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <p className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
          <Link
            href={localePath("/access", locale)}
            className="text-sm text-andon hover:underline"
          >
            {t(COPY.toAccess, locale)}
          </Link>
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
