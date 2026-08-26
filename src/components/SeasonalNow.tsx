"use client";

import { useEffect, useState } from "react";
import {
  SEASON_LABEL,
  formatAllergens,
  formatPrice,
  menuOfMonth,
  seasonOfMonth,
} from "@/data/menu";
import { t, type L10n, type Locale } from "@/i18n/locale";
import { SobaGrain } from "./Motifs";

const COPY = {
  staples: {
    ja: "通年でお出しするもの",
    en: "On the list all year",
  },
} satisfies Record<string, L10n>;

function heading(month: number, locale: Locale): string {
  if (locale === "ja") return `${month} 月の菓子`;
  const name = new Date(2000, month - 1, 1).toLocaleString("en-US", {
    month: "long",
  });
  return `Sweets for ${name}`;
}

/**
 * 「今月の菓子」。
 *
 * 静的書き出しなので、サーバ側で分かる「今」はビルドした月しかない。
 * そこで初期値をビルド月にして HTML に焼き(JS が無くても読める)、
 * 実際の月がずれていたときだけマウント後に差し替える。
 * 初回の描画がサーバと同じ値なので、ハイドレーションのずれは起きない。
 */
export function SeasonalNow({
  buildMonth,
  locale,
}: {
  buildMonth: number;
  locale: Locale;
}) {
  const [month, setMonth] = useState(buildMonth);

  useEffect(() => {
    const now = new Date().getMonth() + 1;
    if (now !== buildMonth) setMonth(now);
  }, [buildMonth]);

  const season = seasonOfMonth(month);
  const served = menuOfMonth(month);
  const seasonal = served.filter((m) => m.season !== "all");
  const staples = served.filter((m) => m.season === "all");

  return (
    <section aria-labelledby="now-heading" className="mx-auto max-w-5xl px-5">
      <div className="flex items-baseline gap-4">
        <h2
          id="now-heading"
          className="font-mincho text-2xl tracking-[0.1em] text-kinari"
        >
          {heading(month, locale)}
        </h2>
        <span className="text-sm tracking-[0.2em] text-sobacha">
          {t(SEASON_LABEL[season], locale)}
        </span>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {seasonal.map((item) => (
          <article
            key={item.id}
            className="washi rounded-sm p-6 transition-colors hover:border-sobacha"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-mincho text-xl text-andon">
                  {t(item.name, locale)}
                </h3>
                <p className="mt-1 text-xs tracking-widest text-usuzumi">
                  {t(item.reading, locale)}
                </p>
              </div>
              <p className="shrink-0 text-sm text-kinari">
                {formatPrice(item.price, locale)}
              </p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-kinari/85">
              {t(item.description, locale)}
            </p>
            <p className="mt-4 text-xs text-usuzumi">
              {formatAllergens(item, locale)}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-xs tracking-[0.2em] text-sobacha">
          {t(COPY.staples, locale)}
        </h3>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-usuzumi">
          {staples.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              <SobaGrain className="h-3 w-3 text-sobacha/60" />
              <span className="text-kinari/90">{t(item.name, locale)}</span>
              <span className="text-xs">
                {formatPrice(item.price, locale)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
