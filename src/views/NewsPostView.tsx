import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd, Shell } from "@/components/Shell";
import { GrainRule } from "@/components/Motifs";
import { findPost, formatDate, neighbours } from "@/data/news";
import { SHOP } from "@/data/shop";
import { SITE_URL, alternates } from "@/lib/jsonld";
import { localePath, t, type L10n, type Locale } from "@/i18n/locale";

const COPY = {
  eyebrow: { ja: "お知らせ", en: "News" },
  back: { ja: "お知らせの一覧へ", en: "All news" },
  newer: { ja: "新しい記事", en: "Newer" },
  older: { ja: "古い記事", en: "Older" },
} satisfies Record<string, L10n>;

export function postMetadata(slug: string, locale: Locale): Metadata {
  const post = findPost(slug);
  if (!post) return {};
  return {
    title: t(post.title, locale),
    description: t(post.summary, locale),
    alternates: alternates(localePath(`/news/${slug}`, locale)),
    openGraph: {
      type: "article",
      publishedTime: post.date,
      title: t(post.title, locale),
      description: t(post.summary, locale),
    },
  };
}

/** 記事の構造化データ。日付と見出しは news.ts の一つの出所から取る */
function articleJsonLd(slug: string, locale: Locale) {
  const post = findPost(slug)!;
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: t(post.title, locale),
    description: t(post.summary, locale),
    datePublished: post.date,
    inLanguage: locale === "ja" ? "ja-JP" : "en",
    url: `${SITE_URL}${localePath(`/news/${slug}`, locale)}`,
    publisher: { "@type": "Organization", name: SHOP.name[locale] },
    // 架空の店の架空のお知らせであることを、ここでも明示しておく
    disambiguatingDescription: SHOP.fictionNotice[locale],
  };
}

export async function NewsPostView({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const post = findPost(slug);
  if (!post) notFound();

  // 本文は MDX。ビルド時に解決されるので、実行時の組み立ては出荷されない
  const { default: Body } = await post.body[locale]();
  const { newer, older } = neighbours(slug);

  return (
    <Shell locale={locale}>
      <JsonLd data={articleJsonLd(slug, locale)} />

      <article className="mx-auto max-w-2xl px-5 py-20">
        <header>
          <p className="text-xs tracking-[0.3em] text-sobacha">
            {t(COPY.eyebrow, locale)}
          </p>
          <p className="mt-4 text-sm text-usuzumi">
            <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
          </p>
          <h1 className="mt-2 font-mincho text-3xl leading-snug tracking-[0.06em] text-kinari">
            {t(post.title, locale)}
          </h1>
        </header>

        <div className="mt-10">
          <Body />
        </div>

        <GrainRule className="my-14" />

        <nav
          aria-label={t(COPY.eyebrow, locale)}
          className="flex flex-wrap items-start justify-between gap-6"
        >
          <div className="min-w-0">
            {newer && (
              <>
                <p className="text-[0.7rem] tracking-[0.2em] text-sobacha">
                  {t(COPY.newer, locale)}
                </p>
                <Link
                  href={localePath(`/news/${newer.slug}`, locale)}
                  className="mt-1 block text-sm text-andon hover:underline"
                >
                  {t(newer.title, locale)}
                </Link>
              </>
            )}
          </div>

          <div className="min-w-0 sm:text-right">
            {older && (
              <>
                <p className="text-[0.7rem] tracking-[0.2em] text-sobacha">
                  {t(COPY.older, locale)}
                </p>
                <Link
                  href={localePath(`/news/${older.slug}`, locale)}
                  className="mt-1 block text-sm text-andon hover:underline"
                >
                  {t(older.title, locale)}
                </Link>
              </>
            )}
          </div>
        </nav>

        <p className="mt-12">
          <Link
            href={localePath("/news", locale)}
            className="text-sm text-usuzumi hover:text-andon"
          >
            ← {t(COPY.back, locale)}
          </Link>
        </p>
      </article>
    </Shell>
  );
}
