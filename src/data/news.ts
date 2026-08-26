import type { ComponentType } from "react";
import type { L10n, Locale } from "@/i18n/locale";

/**
 * お知らせ。
 *
 * 見出し・日付はここが持ち、本文は content/news/<slug>.<locale>.mdx が持つ。
 * MDX を素材として読むだけで、ページにはしない —— そうしないと
 * 日本語版と英語版の経路を MDX の置き場所に合わせる羽目になる。
 *
 * 本文は動的 import で受ける。静的書き出しのビルド時に解決されるので、
 * 実行時に MDX を組み立てる処理は出荷されない。
 */

type MdxModule = { default: ComponentType };

export type Post = {
  /** 経路になる。ファイル名の日付を除いた部分と揃える */
  slug: string;
  /** YYYY-MM-DD */
  date: string;
  title: L10n;
  /** 一覧に出す一行。本文の書き出しをそのまま切らず、別に書く */
  summary: L10n;
  body: Record<Locale, () => Promise<MdxModule>>;
};

/** 新しい順。並べ替えは sortedNews() が受け持つので、ここでの順は問わない */
export const NEWS: Post[] = [
  {
    slug: "anmitsu",
    date: "2026-08-20",
    title: {
      ja: "そばの実あんみつを始めました",
      en: "The buckwheat groat anmitsu has started",
    },
    summary: {
      ja: "白玉をやめて、茹でたそばの実を寒天に散らしました。噛むところのある夏の菓子です。",
      en: "The rice-flour dumplings are gone; boiled groats go through the agar instead. A summer sweet with something to bite.",
    },
    body: {
      ja: () => import("../../content/news/2026-08-20-anmitsu.ja.mdx"),
      en: () => import("../../content/news/2026-08-20-anmitsu.en.mdx"),
    },
  },
  {
    slug: "ido",
    date: "2026-07-05",
    title: {
      ja: "井戸の水温が下がりません",
      en: "The well is not getting cold",
    },
    summary: {
      ja: "去年より二度高いまま夏に入りました。水羊羹は冷やす速さで舌ざわりが変わります。",
      en: "Two degrees warmer than last year. How fast mizu-yōkan chills changes how it feels in the mouth.",
    },
    body: {
      ja: () => import("../../content/news/2026-07-05-ido.ja.mdx"),
      en: () => import("../../content/news/2026-07-05-ido.en.mdx"),
    },
  },
  {
    slug: "yomogi",
    date: "2026-05-18",
    title: {
      ja: "よもぎの草餅は今週で終わりです",
      en: "The mugwort kusamochi ends this week",
    },
    summary: {
      ja: "よもぎは伸びると硬くなります。今年は八日早い。薄いものを混ぜて日数を伸ばすことはしません。",
      en: "Mugwort toughens as it grows, and it grew early this year. We will not stretch the season by mixing in the thin stuff.",
    },
    body: {
      ja: () => import("../../content/news/2026-05-18-yomogi.ja.mdx"),
      en: () => import("../../content/news/2026-05-18-yomogi.en.mdx"),
    },
  },
  {
    slug: "shinamae",
    date: "2026-04-03",
    title: {
      ja: "品替えの休みが明けました",
      en: "Back from the menu-change break",
    },
    summary: {
      ja: "四日かかるのは、菓子の入れ替えではなくそのあとの試作です。粉が変われば同じ配合でも別のものになります。",
      en: "The four days go on testing, not on swapping. The same recipe is not the same sweet once the flour changes.",
    },
    body: {
      ja: () => import("../../content/news/2026-04-03-shinamae.ja.mdx"),
      en: () => import("../../content/news/2026-04-03-shinamae.en.mdx"),
    },
  },
  {
    slug: "oyuki",
    date: "2026-02-11",
    title: {
      ja: "大雪で三日休みました",
      en: "Closed three days for snow",
    },
    summary: {
      ja: "一晩に六十センチ。雪の日をカレンダーにあらかじめ出せない理由を書きました。",
      en: "Sixty centimetres overnight. Why snow days cannot go on the calendar in advance.",
    },
    body: {
      ja: () => import("../../content/news/2026-02-11-oyuki.ja.mdx"),
      en: () => import("../../content/news/2026-02-11-oyuki.en.mdx"),
    },
  },
];

/** 新しい順に並べて返す。一覧も詳細もこれを通す */
export function sortedNews(): Post[] {
  return [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
}

export function findPost(slug: string): Post | undefined {
  return NEWS.find((p) => p.slug === slug);
}

/** 前後の記事(新しいほうが prev)。詳細ページの行き先に使う */
export function neighbours(slug: string): {
  newer?: Post;
  older?: Post;
} {
  const list = sortedNews();
  const i = list.findIndex((p) => p.slug === slug);
  if (i < 0) return {};
  return { newer: list[i - 1], older: list[i + 1] };
}

export function formatDate(date: string, locale: Locale): string {
  const [y, m, d] = date.split("-").map(Number);
  if (locale === "ja") return `${y} 年 ${m} 月 ${d} 日`;
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
