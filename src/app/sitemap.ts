import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/jsonld";
import { LOCALES, localePath } from "@/i18n/locale";
import { sortedNews } from "@/data/news";

export const dynamic = "force-static";

const PAGES = [
  { path: "/", priority: 1 },
  { path: "/menu", priority: 0.9 },
  { path: "/soba", priority: 0.8 },
  { path: "/story", priority: 0.8 },
  { path: "/calendar", priority: 0.8 },
  { path: "/access", priority: 0.7 },
  { path: "/news", priority: 0.7 },
  // 記事も一件ずつ載せる。増えたぶんが自動で入る
  ...sortedNews().map((p) => ({ path: `/news/${p.slug}`, priority: 0.5 })),
];

/** 日本語と英語の両方を載せ、互いを alternates として指し合う */
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}${localePath(page.path, locale)}`,
      priority: locale === "ja" ? page.priority : page.priority - 0.1,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}${localePath(page.path, l)}`]),
        ),
      },
    })),
  );
}
