import Link from "next/link";
import { SHOP, formatPeriod } from "@/data/shop";
import { localePath, t, type L10n, type Locale } from "@/i18n/locale";
import { GrainRule } from "./Motifs";

const COPY = {
  hours: { ja: "営業", en: "Hours" },
  guide: { ja: "案内", en: "Pages" },
  menu: { ja: "お品書き", en: "Menu" },
  soba: { ja: "そば粉", en: "The flour" },
  story: { ja: "家のこと", en: "The house" },
  calendar: { ja: "営業日", en: "Opening days" },
  access: { ja: "道のり", en: "Getting here" },
  news: { ja: "お知らせ", en: "News" },
} satisfies Record<string, L10n>;

/** フリート共通規約の 5 項目。並びが規約そのものなので、順序を変えない。 */
const FLEET_LINKS = [
  { label: "MIT License", href: "https://github.com/twill3c/sugi-nami/blob/main/LICENSE" },
  { label: "GitHub", href: "https://github.com/twill3c/sugi-nami" },
  {
    label: "杉なみの見て回り方",
    href: "https://claude.ai/code/artifact/b09c5bd5-4b9a-428d-a3ec-3e408fd85169",
  },
  {
    label: "杉なみ 設計図",
    href: "https://claude.ai/code/artifact/39e2ebd7-39ba-4412-8277-645b18a5037e",
  },
  { label: "App Menu", href: "https://app-menu-amber.vercel.app" },
] as const;

export function Footer({ locale }: { locale: Locale }) {
  const links = [
    { href: "/menu", label: COPY.menu },
    { href: "/soba", label: COPY.soba },
    { href: "/story", label: COPY.story },
    { href: "/calendar", label: COPY.calendar },
    { href: "/access", label: COPY.access },
    { href: "/news", label: COPY.news },
  ];

  return (
    <footer className="mt-24 border-t border-hari bg-tsuchi/40">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-mincho text-base tracking-[0.14em] text-kinari">
              {t(SHOP.name, locale)}
            </p>
            <p className="mt-2 text-sm text-usuzumi">
              {t(SHOP.address.region, locale)}
              {locale === "en" ? ", " : ""}
              {t(SHOP.address.locality, locale)}
              <br />
              {t(SHOP.address.detail, locale)}
            </p>
          </div>

          <div>
            <h2 className="text-xs tracking-[0.2em] text-sobacha">
              {t(COPY.hours, locale)}
            </h2>
            <ul className="mt-2 space-y-1 text-sm text-usuzumi">
              {SHOP.openingPeriods.map((p) => (
                <li key={p.label.ja}>
                  <span className="text-kinari">
                    {formatPeriod(p, locale)}
                  </span>
                  <br />
                  <span className="text-xs">{t(p.label, locale)}</span>
                </li>
              ))}
              <li className="pt-1 text-xs">{t(SHOP.closedNote, locale)}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs tracking-[0.2em] text-sobacha">
              {t(COPY.guide, locale)}
            </h2>
            <ul className="mt-2 space-y-1 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={localePath(l.href, locale)}
                    className="text-usuzumi hover:text-andon"
                  >
                    {t(l.label, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <GrainRule className="my-8" />

        {/*
          架空店舗であることの明示。ポートフォリオ作品なので、
          実在の店と誤認されないことを装飾より優先して常時出す。
        */}
        <p
          role="note"
          className="rounded border border-hari bg-sumi/60 px-4 py-3 text-xs leading-relaxed text-usuzumi"
        >
          {t(SHOP.fictionNotice, locale)}
          {locale === "en" ? " " : ""}
          {t(SHOP.contact.note, locale)}
        </p>

      </div>

      {/*
        フリート共通規約のフッタ(MIT / GitHub / 見て回り方 / 設計図 / App Menu・下部固定)。
        店の案内とは別の層なので、上の footer の中には混ぜず独立した帯として置く。

        ブランドサイト三作(senoto-mori / hoshihata / sugi-nami)は senoto-mori の
        書きっぷりに揃える —— 規約の 5 項目を先に置き、架空である旨をその下の
        一行として続ける。断りは装飾ではなく、どのページから入った人にも必ず届かせる。
        逃げの余白は globals.css の body padding-bottom が持つ。
      */}
      <div className="fleet-footer">
        {FLEET_LINKS.map((l, i) => (
          <span key={l.href}>
            {i > 0 && <span aria-hidden="true">・</span>}{" "}
            <a href={l.href} target="_blank" rel="noopener">
              {l.label}
            </a>
          </span>
        ))}
        <p className="fleet-footer__fiction">{t(SHOP.fictionNotice, locale)}</p>
      </div>
    </footer>
  );
}
