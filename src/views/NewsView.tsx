import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { GrainRule, SobaGrain } from "@/components/Motifs";
import { formatDate, sortedNews } from "@/data/news";
import { alternates } from "@/lib/jsonld";
import { localePath, t, type L10n, type Locale } from "@/i18n/locale";

const COPY = {
  eyebrow: { ja: "お知らせ", en: "News" },
  title: { ja: "その日のこと", en: "What happened that day" },
  lede: {
    ja: "菓子が変わったこと、雪で休んだこと、うまくいかなかったこと。店の側の都合を、そのまま書いています。",
    en: "A sweet changed, the snow closed us, something did not work. These are the shop's own reasons, written as they were.",
  },
  read: { ja: "読む →", en: "Read →" },
} satisfies Record<string, L10n>;

export function newsMetadata(locale: Locale): Metadata {
  return {
    title: t(COPY.eyebrow, locale),
    description: t(COPY.lede, locale),
    alternates: alternates(localePath("/news", locale)),
  };
}

export function NewsView({ locale }: { locale: Locale }) {
  const posts = sortedNews();

  return (
    <Shell locale={locale}>
      <div className="mx-auto max-w-3xl px-5 py-20">
        <header>
          <p className="text-xs tracking-[0.3em] text-sobacha">
            {t(COPY.eyebrow, locale)}
          </p>
          <h1 className="mt-4 font-mincho text-3xl sm:text-4xl tracking-[0.1em] text-kinari">
            {t(COPY.title, locale)}
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-usuzumi">
            {t(COPY.lede, locale)}
          </p>
        </header>

        <GrainRule className="my-14" />

        <ol className="divide-y divide-hari/70">
          {posts.map((post) => (
            <li key={post.slug} className="py-8 first:pt-0">
              <article>
                <p className="flex items-center gap-2 text-xs tracking-wider text-sobacha">
                  <SobaGrain className="h-3 w-3 text-sobacha/60" />
                  <time dateTime={post.date}>
                    {formatDate(post.date, locale)}
                  </time>
                </p>
                <h2 className="mt-3 font-mincho text-xl leading-snug text-kinari">
                  <Link
                    href={localePath(`/news/${post.slug}`, locale)}
                    className="transition-colors hover:text-andon"
                  >
                    {t(post.title, locale)}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-kinari/80">
                  {t(post.summary, locale)}
                </p>
                <p className="mt-4">
                  <Link
                    href={localePath(`/news/${post.slug}`, locale)}
                    className="text-sm text-andon hover:underline"
                  >
                    {t(COPY.read, locale)}
                  </Link>
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </Shell>
  );
}
