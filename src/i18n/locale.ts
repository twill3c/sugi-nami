/**
 * 二言語の土台。
 *
 * 文言は data/ の中に {ja, en} の対で持ち、ページは locale を受け取って
 * そこから取り出すだけにする。翻訳を別ファイルの辞書に切り出すと
 * 「日本語だけ直して英語が古いまま」が起きるので、対にして隣に置く。
 */

export const LOCALES = ["ja", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** 日本語と英語の対 */
export type L10n = { ja: string; en: string };

export function t(v: L10n, locale: Locale): string {
  return v[locale];
}

/**
 * 経路をローカライズする。日本語は接頭辞なし(`/menu`)、
 * 英語は `/en` 配下(`/en/menu`)。
 */
export function localePath(p: string, locale: Locale): string {
  if (locale === "ja") return p;
  return p === "/" ? "/en" : `/en${p}`;
}

/** 相手側の言語。言語切り替えのリンクに使う */
export function otherLocale(locale: Locale): Locale {
  return locale === "ja" ? "en" : "ja";
}

export const LOCALE_LABEL: Record<Locale, string> = {
  ja: "日本語",
  en: "English",
};
