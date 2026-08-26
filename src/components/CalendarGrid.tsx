"use client";

import { useEffect, useMemo, useState } from "react";
import {
  monthGrid,
  nextMonths,
  openDaysOfMonth,
  type Day,
} from "@/lib/calendar";
import { SHOP, WEEKDAY, formatPeriod, periodOfMonth } from "@/data/shop";
import { t, type L10n, type Locale } from "@/i18n/locale";
import { Yukiwa } from "./Motifs";

const COPY = {
  open: { ja: "営業", en: "Open" },
  regular: { ja: "定休", en: "Closed" },
  annual: { ja: "特別休", en: "Holiday" },
  openDays: { ja: "営業日", en: "open days" },
  legend: { ja: "しるしの見かた", en: "Key" },
  snow: {
    ja: "大雪の日は臨時に休みます。冬期の遠出は、前の日の天気を見てからお決めください。",
    en: "We close without notice on heavy-snow days. In winter, please check the forecast before making the trip.",
  },
} satisfies Record<string, L10n>;

function monthLabel(year: number, month: number, locale: Locale): string {
  if (locale === "ja") return `${year} 年 ${month} 月`;
  const name = new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "long",
  });
  return `${name} ${year}`;
}

function DayCell({ day, locale }: { day: Day | null; locale: Locale }) {
  if (!day) return <td className="p-0" />;

  const tone =
    day.state === "open"
      ? "text-kinari"
      : day.state === "annual"
        ? "text-yuki/60"
        : "text-usuzumi/45";

  const label =
    day.state === "annual" && day.reason
      ? `${day.day} — ${t(day.reason, locale)}`
      : `${day.day} — ${t(COPY[day.state], locale)}`;

  return (
    <td className="p-0.5">
      <span
        title={label}
        className={`relative flex aspect-square items-center justify-center rounded-sm border text-[0.78rem] ${tone} ${
          day.state === "open"
            ? "border-hari bg-andon/10"
            : "border-transparent"
        }`}
      >
        <span aria-hidden="true">{day.day}</span>
        <span className="sr-only">{label}</span>
        {day.state === "annual" && (
          <span
            aria-hidden="true"
            className="absolute bottom-0.5 h-px w-2.5 bg-yuki/60"
          />
        )}
      </span>
    </td>
  );
}

function Month({
  year,
  month,
  locale,
}: {
  year: number;
  month: number;
  locale: Locale;
}) {
  const weeks = useMemo(() => monthGrid(year, month), [year, month]);
  const period = periodOfMonth(month);
  const open = openDaysOfMonth(year, month);
  const winter = month === 12 || month <= 3;

  return (
    <section
      aria-labelledby={`m-${year}-${month}`}
      className="washi flex flex-col rounded-sm p-5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3
          id={`m-${year}-${month}`}
          className="flex items-center gap-2 font-mincho text-lg tracking-[0.08em] text-kinari"
        >
          {winter && <Yukiwa className="h-4 w-4 text-yuki/70" />}
          {monthLabel(year, month, locale)}
        </h3>
        <p className="text-xs text-sobacha">
          {open} {t(COPY.openDays, locale)}
        </p>
      </div>

      <table className="mt-4 w-full table-fixed border-collapse">
        <caption className="sr-only">
          {monthLabel(year, month, locale)} — {formatPeriod(period, locale)}
        </caption>
        <thead>
          <tr>
            {WEEKDAY[locale].map((w, i) => (
              <th
                key={w}
                scope="col"
                className={`pb-2 text-[0.68rem] font-normal ${
                  i === 0 ? "text-sobacha" : "text-usuzumi"
                }`}
              >
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => (
                <DayCell key={j} day={day} locale={locale} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-auto pt-3 text-[0.7rem] leading-relaxed text-usuzumi">
        {formatPeriod(period, locale)}
        {locale === "ja" ? " ・ " : " · "}
        {t(period.note, locale)}
      </p>
    </section>
  );
}

/**
 * 営業日のカレンダー。
 *
 * 静的書き出しなのでサーバが知る「今」はビルドした月しかない。
 * 初期値をビルド月にして HTML に焼き(JS が無くても三か月ぶん読める)、
 * 実際の月がずれていたときだけマウント後に差し替える。
 * 初回の描画はサーバと同じ値なので、ハイドレーションのずれは起きない。
 */
export function CalendarGrid({
  buildYear,
  buildMonth,
  locale,
}: {
  buildYear: number;
  buildMonth: number;
  locale: Locale;
}) {
  const [{ year, month }, setNow] = useState({
    year: buildYear,
    month: buildMonth,
  });

  useEffect(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    if (y !== buildYear || m !== buildMonth) setNow({ year: y, month: m });
  }, [buildYear, buildMonth]);

  const months = nextMonths(year, month, 3);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {months.map((m) => (
          <Month
            key={`${m.year}-${m.month}`}
            year={m.year}
            month={m.month}
            locale={locale}
          />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-usuzumi">
        <span className="tracking-[0.2em] text-sobacha">
          {t(COPY.legend, locale)}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-sm border border-hari bg-andon/10" />
          {t(COPY.open, locale)}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-sm border border-transparent text-center text-usuzumi/45">
            —
          </span>
          {t(COPY.regular, locale)}
        </span>
        <span className="flex items-center gap-2">
          <span className="flex h-4 w-4 items-end justify-center">
            <span className="h-px w-2.5 bg-yuki/60" />
          </span>
          {t(COPY.annual, locale)}
          <span className="text-usuzumi/70">
            (
            {SHOP.annualClosures
              .map((c) => t(c.reason, locale))
              .join(locale === "ja" ? "・" : ", ")}
            )
          </span>
        </span>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-kinari/80">
        {t(COPY.snow, locale)}
      </p>
    </>
  );
}
