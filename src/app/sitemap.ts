import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/jsonld";
import { LOCALES, localePath } from "@/i18n/locale";

export const dynamic = "force-static";

const PAGES = [
  { path: "/", priority: 1 },
  { path: "/menu", priority: 0.9 },
  { path: "/story", priority: 0.8 },
  { path: "/calendar", priority: 0.8 },
  { path: "/access", priority: 0.7 },
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
