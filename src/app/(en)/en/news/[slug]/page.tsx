import { NEWS } from "@/data/news";
import { NewsPostView, postMetadata } from "@/views/NewsPostView";

type Params = { params: Promise<{ slug: string }> };

// 静的書き出しなので、記事の経路をビルド時にすべて数え上げる
export function generateStaticParams() {
  return NEWS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  return postMetadata(slug, "en");
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  return <NewsPostView slug={slug} locale="en" />;
}
