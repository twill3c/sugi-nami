"use client";

import { useMemo, useState } from "react";
import {
  ALLERGENS,
  ALLERGEN_LABEL,
  MENU,
  SEASON_LABEL,
  SEASON_ORDER,
  formatAllergens,
  formatPrice,
  menuWithout,
  type Allergen,
} from "@/data/menu";
import { t, type L10n, type Locale } from "@/i18n/locale";
import { Yukiwa } from "./Motifs";

const COPY = {
  exclude: { ja: "苦手なものを外す", en: "Leave something out" },
  ingredients: { ja: "原材料", en: "Contains" },
  takeout: { ja: "持ち帰り可", en: "To take away" },
  none: {
    ja: "選んだ条件に合う菓子がありません。",
    en: "Nothing on the list matches what you left out.",
  },
} satisfies Record<string, L10n>;

function status(
  excluded: Allergen[],
  shown: number,
  locale: Locale,
): string {
  if (excluded.length === 0) {
    return locale === "ja"
      ? `${MENU.length} 品すべてを表示しています。`
      : `Showing all ${MENU.length} items.`;
  }
  const names = excluded.map((a) => ALLERGEN_LABEL[a][locale]);
  const hidden = MENU.length - shown;
  return locale === "ja"
    ? `${names.join("・")}を除いて ${shown} 品。${hidden} 品を隠しています。`
    : `Without ${names.join(", ")}: ${shown} items. ${hidden} hidden.`;
}

/**
 * お品書き。絞り込みは「除く」方向にだけ効かせる。
 *
 * 何も選んでいない状態が全品表示なので、JS が動かなくても
 * サーバが描いた全品の HTML がそのまま正しいお品書きになる。
 */
export function MenuList({ locale }: { locale: Locale }) {
  const [excluded, setExcluded] = useState<Allergen[]>([]);

  const shown = useMemo(() => menuWithout(excluded), [excluded]);

  function toggle(a: Allergen) {
    setExcluded((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  }

  return (
    <>
      <fieldset className="no-print washi rounded-sm p-5">
        <legend className="px-2 text-xs tracking-[0.2em] text-sobacha">
          {t(COPY.exclude, locale)}
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {ALLERGENS.map((a) => {
            const on = excluded.includes(a);
            return (
              <label
                key={a}
                className={`cursor-pointer rounded-sm border px-3 py-1.5 text-sm transition-colors ${
                  on
                    ? "border-andon bg-andon/15 text-andon"
                    : "border-hari text-usuzumi hover:border-sobacha hover:text-kinari"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={on}
                  onChange={() => toggle(a)}
                />
                {on ? "− " : ""}
                {t(ALLERGEN_LABEL[a], locale)}
              </label>
            );
          })}
        </div>

        {/* 絞り込みの結果は視覚だけでなく読み上げにも届ける */}
        <p aria-live="polite" className="mt-4 text-xs text-usuzumi">
          {status(excluded, shown.length, locale)}
        </p>
      </fieldset>

      {SEASON_ORDER.map((season) => {
        const items = shown.filter((m) => m.season === season);
        if (items.length === 0) return null;
        return (
          <section
            key={season}
            aria-labelledby={`season-${season}`}
            className="mt-16 first:mt-10"
          >
            <div className="flex items-center gap-3">
              {season === "winter" && <Yukiwa className="h-5 w-5 text-yuki" />}
              <h2
                id={`season-${season}`}
                className="font-mincho text-xl tracking-[0.2em] text-sobacha"
              >
                {t(SEASON_LABEL[season], locale)}
              </h2>
              <span className="h-px flex-1 bg-hari" />
            </div>

            <dl className="mt-6 divide-y divide-hari/70">
              {items.map((item) => (
                <div key={item.id} className="grid gap-2 py-6 sm:grid-cols-3">
                  <dt className="sm:col-span-1">
                    <span className="font-mincho text-lg text-kinari">
                      {t(item.name, locale)}
                    </span>
                    <span className="mt-1 block text-xs tracking-widest text-usuzumi">
                      {t(item.reading, locale)}
                    </span>
                    <span className="mt-2 block text-sm text-andon">
                      {formatPrice(item.price, locale)}
                    </span>
                  </dt>
                  <dd className="sm:col-span-2">
                    <p className="text-sm leading-relaxed text-kinari/85">
                      {t(item.description, locale)}
                    </p>
                    <p className="mt-3 text-xs text-usuzumi">
                      <span className="text-sobacha">
                        {t(COPY.ingredients, locale)}
                      </span>{" "}
                      {formatAllergens(item, locale)}
                      {item.takeout && (
                        <span className="ml-3 rounded-sm border border-hari px-2 py-0.5">
                          {t(COPY.takeout, locale)}
                        </span>
                      )}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}

      {shown.length === 0 && (
        <p className="mt-16 text-center text-sm text-usuzumi">
          {t(COPY.none, locale)}
        </p>
      )}
    </>
  );
}
