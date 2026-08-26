import { SHOP, WEEKDAY_SCHEMA, type OpeningPeriod } from "@/data/shop";
import {
  MENU,
  SEASON_LABEL,
  SEASON_ORDER,
  formatAllergens,
  type MenuItem,
} from "@/data/menu";
import { localePath, type Locale } from "@/i18n/locale";

export const SITE_URL = "https://sugi-nami.vercel.app";

/**
 * schema.org の構造化データ。営業時間もお品書きも
 * data/ の定数から組み立てるので、本文と食い違うことがない。
 */

function openingHoursSpecification(period: OpeningPeriod, locale: Locale) {
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: period.days.map((d) => WEEKDAY_SCHEMA[d]),
    opens: period.opens,
    closes: period.closes,
    name: period.label[locale],
  };
}

function menuItem(item: MenuItem, locale: Locale) {
  return {
    "@type": "MenuItem",
    name: item.name[locale],
    description: item.description[locale],
    offers: {
      "@type": "Offer",
      price: item.price,
      priceCurrency: "JPY",
    },
    // そば粉は全品共通。個別品目には「そば以外」も並べる
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: locale === "ja" ? "アレルゲン" : "Allergens",
        value: formatAllergens(item, locale),
      },
    ],
  };
}

function menuSections(locale: Locale) {
  return SEASON_ORDER.map((season) => ({
    "@type": "MenuSection",
    name: SEASON_LABEL[season][locale],
    hasMenuItem: MENU.filter((m) => m.season === season).map((m) =>
      menuItem(m, locale),
    ),
  })).filter((s) => s.hasMenuItem.length > 0);
}

export function cafeJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${SITE_URL}/#shop`,
    name: SHOP.name[locale],
    slogan: SHOP.tagline[locale],
    // 架空の店であることを構造化データの側にも書いておく。
    // 検索結果から実在店として拾われることを避けるための明示。
    disambiguatingDescription: SHOP.fictionNotice[locale],
    url: `${SITE_URL}${localePath("/", locale)}`,
    inLanguage: locale === "ja" ? "ja-JP" : "en",
    foundingDate: String(SHOP.founded),
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: SHOP.address.region[locale],
      addressLocality: SHOP.address.locality[locale],
    },
    servesCuisine: SHOP.kind[locale],
    priceRange: "¥¥",
    openingHoursSpecification: SHOP.openingPeriods.map((p) =>
      openingHoursSpecification(p, locale),
    ),
    hasMenu: {
      "@type": "Menu",
      name: locale === "ja" ? "お品書き" : "Menu",
      hasMenuSection: menuSections(locale),
    },
  };
}

export function breadcrumbJsonLd(
  trail: { name: string; path: string }[],
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${localePath(t.path, locale)}`,
    })),
  };
}

/** 日本語版と英語版を互いに指す。ページの metadata に渡す */
export function alternates(path: string) {
  return {
    canonical: `${SITE_URL}${path}`,
    languages: {
      ja: `${SITE_URL}${localePath(path.replace(/^\/en/, "") || "/", "ja")}`,
      en: `${SITE_URL}${localePath(path.replace(/^\/en/, "") || "/", "en")}`,
    },
  };
}
