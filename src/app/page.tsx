import Link from "next/link";
import { SHOP, formatPeriod, periodOfMonth } from "@/data/shop";
import { SeasonalNow } from "@/components/SeasonalNow";
import { GrainRule, Kominka, SobaFlower, SugiGrove } from "@/components/Motifs";

// ビルドした月。「今月の菓子」の初期値になる(クライアント側で実際の月に直る)
const BUILD_MONTH = new Date().getMonth() + 1;

const AGE = new Date().getFullYear() - SHOP.building.builtYear;

const PILLARS = [
  {
    title: `築 ${AGE} 年の養蚕農家`,
    body: "二階は蚕を飼っていた部屋です。窓が横に並ぶのは風を通すため。梁と柱はそのまま残し、床だけを張りかえて客席にしました。天井が高いので、夏でも涼しい。",
  },
  {
    title: "戸隠在来のそば粉",
    body: "標高千二百メートル、昼と夜の寒暖差が実を締めます。石臼で挽いたものを、その日の分だけ。粉は挽いた翌日から香りが落ちるので、作り置きをしません。",
  },
  {
    title: "そばで、甘いもの",
    body: "そば粉は本来、甘いものによく合います。灰汁が少なく、小麦より香りが立つ。当店は麺を出しません。そば粉の菓子だけで一年を組み立てています。",
  },
];

export default function Home() {
  const period = periodOfMonth(BUILD_MONTH);

  return (
    <>
      {/* 表 — 奥社の杉並木を背に、店名だけを置く */}
      <section className="relative overflow-hidden border-b border-hari">
        <SugiGrove className="absolute inset-0 h-full w-full opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-sumi/15 via-sumi/45 to-sumi" />

        <div className="relative mx-auto flex min-h-[74svh] max-w-5xl flex-col justify-end px-5 pb-16 pt-28">
          <p className="text-xs tracking-[0.35em] text-sobacha">
            長野県戸隠 ・ 中社の門前
          </p>
          <h1 className="mt-5 font-mincho text-5xl leading-tight tracking-[0.12em] text-kinari sm:text-6xl">
            そば菓子
            <br className="sm:hidden" />
            <span className="text-andon"> 杉なみ</span>
          </h1>
          <p className="mt-6 max-w-md font-mincho text-xl tracking-[0.08em] text-kinari/90">
            {SHOP.tagline}
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-usuzumi">
            麺は出しません。石臼で挽いたそば粉で、菓子だけを作っています。
            杉並木を抜けて、いちばん奥の一軒です。
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/menu"
              className="rounded-sm border border-andon px-6 py-3 text-sm tracking-[0.15em] text-andon transition-colors hover:bg-andon hover:text-sumi"
            >
              お品書きを見る
            </Link>
            <Link
              href="/access"
              className="rounded-sm border border-hari px-6 py-3 text-sm tracking-[0.15em] text-usuzumi transition-colors hover:border-sobacha hover:text-kinari"
            >
              道のり
            </Link>
          </div>

          <p className="mt-8 text-xs text-usuzumi">
            <span className="text-kinari">{formatPeriod(period)}</span>
            <span className="mx-2 text-hari">|</span>
            {period.label} ・ {SHOP.closedNote}
          </p>
        </div>
      </section>

      <div className="py-20">
        <SeasonalNow buildMonth={BUILD_MONTH} />
      </div>

      <GrainRule className="mx-auto max-w-5xl px-5" />

      {/* 店のこと — 三本の柱 */}
      <section
        aria-labelledby="about-heading"
        className="mx-auto max-w-5xl px-5 py-20"
      >
        <div className="flex items-center gap-3">
          <SobaFlower className="h-5 w-5 text-koke" />
          <h2
            id="about-heading"
            className="font-mincho text-2xl tracking-[0.1em] text-kinari"
          >
            この店のこと
          </h2>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <dl className="space-y-8">
            {PILLARS.map((p) => (
              <div key={p.title} className="border-l border-hari pl-5">
                <dt className="font-mincho text-lg text-andon">{p.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-kinari/85">
                  {p.body}
                </dd>
              </div>
            ))}
          </dl>

          <Kominka className="mx-auto w-full max-w-xs text-hari md:w-72" />
        </div>
      </section>

      {/* 道のりの要約 */}
      <section
        aria-labelledby="access-brief"
        className="mx-auto max-w-5xl px-5 pb-4"
      >
        <div className="washi rounded-sm p-8">
          <h2
            id="access-brief"
            className="font-mincho text-xl tracking-[0.1em] text-kinari"
          >
            道のり
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-kinari/85">
            {SHOP.access[0].body}
          </p>
          <Link
            href="/access"
            className="mt-6 inline-block text-sm text-andon hover:underline"
          >
            冬の道のことも含めて、くわしく →
          </Link>
        </div>
      </section>
    </>
  );
}
