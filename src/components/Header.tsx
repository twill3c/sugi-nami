import Link from "next/link";
import { SHOP } from "@/data/shop";
import {
  LOCALE_LABEL,
  localePath,
  otherLocale,
  t,
  type Locale,
} from "@/i18n/locale";
import type { L10n } from "@/i18n/locale";
import { SobaGrain } from "./Motifs";

const NAV: { href: string; label: L10n }[] = [
  { href: "/menu", label: { ja: "お品書き", en: "Menu" } },
  { href: "/soba", label: { ja: "そば粉", en: "The flour" } },
  { href: "/story", label: { ja: "家のこと", en: "The house" } },
  { href: "/calendar", label: { ja: "営業日", en: "Opening days" } },
  { href: "/access", label: { ja: "道のり", en: "Getting here" } },
  { href: "/news", label: { ja: "お知らせ", en: "News" } },
];

export function Header({ locale }: { locale: Locale }) {
  const other = otherLocale(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-hari bg-sumi/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <Link
          href={localePath("/", locale)}
          className="group flex shrink-0 items-baseline gap-2.5"
        >
          <SobaGrain className="h-4 w-4 shrink-0 self-center text-sobacha transition-colors group-hover:text-andon" />
          <span className="font-mincho text-lg tracking-[0.14em] text-kinari">
            {t(SHOP.shortName, locale)}
          </span>
          <span className="hidden text-[0.68rem] tracking-[0.2em] text-usuzumi sm:inline">
            {t(SHOP.kind, locale)}
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-1">
          {/*
            項目が 6 つあるので、狭い画面では横に流す(折り返すと看板を押し下げる)。
            右端をぼかして「まだ先がある」ことを見せる。開閉式にしないのは、
            開いたままページが変わる状態を持ちたくないため。
          */}
          <div className="relative min-w-0">
            <nav
              aria-label={locale === "ja" ? "サイト内" : "Site"}
              className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <ul className="flex items-center whitespace-nowrap">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={localePath(n.href, locale)}
                      className="block rounded px-2.5 py-2 text-[0.82rem] text-usuzumi transition-colors hover:text-andon sm:px-3 sm:text-sm"
                    >
                      {t(n.label, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-sumi to-transparent lg:hidden"
            />
          </div>

          {/*
            言語の切り替え。root layout が言語ごとに分かれているので
            ここは通常のリンク(ページ遷移)になる。hreflang を添えて、
            リンク先の言語を機械にも人にも同じだけ伝える。
          */}
          <Link
            href={localePath("/", other)}
            hrefLang={other}
            lang={other}
            className="ml-1 rounded-sm border border-hari px-2.5 py-1.5 text-[0.72rem] tracking-wider text-usuzumi transition-colors hover:border-sobacha hover:text-kinari"
          >
            {LOCALE_LABEL[other]}
          </Link>
        </div>
      </div>
    </header>
  );
}
