import {
  SHOP,
  WEEKDAY_SCHEMA,
  type OpeningPeriod,
} from "@/data/shop";
import { MENU, SEASON_ORDER, type MenuItem } from "@/data/menu";

export const SITE_URL = "https://sugi-nami.vercel.app";

/**
 * schema.org の構造化データ。営業時間もお品書きも
 * data/ の定数から組み立てるので、本文と食い違うことがない。
 */

function openingHoursSpecification(period: OpeningPeriod) {
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: period.days.map((d) => WEEKDAY_SCHEMA[d]),
    opens: period.opens,
    closes: period.closes,
    name: period.label,
  };
}

function menuItem(item: MenuItem) {
  return {
    "@type": "MenuItem",
    name: item.name,
    description: item.description,
    offers: {
      "@type": "Offer",
      price: item.price,
      priceCurrency: "JPY",
    },
    // そば粉は全品共通。個別品目には「そば以外」を並べる
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "アレルゲン",
        value: ["そば", ...item.allergens].join("・"),
      },
    ],
  };
}

function menuSections() {
  return SEASON_ORDER.map((season) => ({
    "@type": "MenuSection",
    name: season,
    hasMenuItem: MENU.filter((m) => m.season === season).map(menuItem),
  })).filter((s) => s.hasMenuItem.length > 0);
}

export function cafeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${SITE_URL}/#shop`,
    name: SHOP.name,
    alternateName: SHOP.nameEn,
    slogan: SHOP.tagline,
    // 架空の店であることを構造化データの側にも書いておく。
    // 検索結果から実在店として拾われることを避けるための明示。
    disambiguatingDescription: SHOP.fictionNotice,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: SHOP.address.region,
      addressLocality: SHOP.address.locality,
    },
    servesCuisine: "そば菓子",
    priceRange: "¥¥",
    openingHoursSpecification: SHOP.openingPeriods.map(
      openingHoursSpecification,
    ),
    hasMenu: {
      "@type": "Menu",
      name: "お品書き",
      hasMenuSection: menuSections(),
    },
  };
}

export function breadcrumbJsonLd(
  trail: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  };
}
