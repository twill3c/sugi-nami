import type { Metadata } from "next";
import { SHOP, WEEKDAY_JA, formatPeriod } from "@/data/shop";
import { RouteMap } from "@/components/RouteMap";
import { GrainRule, Yukiwa } from "@/components/Motifs";

export const metadata: Metadata = {
  title: "道のり",
  description:
    "JR 長野駅からバスで約 1 時間、戸隠中社から杉並木ぞいに徒歩 7 分。冬期の道路と営業時間について。",
};

export default function AccessPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <header>
        <p className="text-xs tracking-[0.3em] text-sobacha">道のり</p>
        <h1 className="mt-4 font-mincho text-4xl tracking-[0.1em] text-kinari">
          杉並木の、いちばん奥
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-usuzumi">
          {SHOP.address.region}
          {SHOP.address.locality}・{SHOP.address.detail}。
          中社の鳥居から参道を上り、杉並木に入って七分ほど歩いた右手です。
        </p>
      </header>

      <RouteMap className="mx-auto mt-12 max-w-xl" />

      <GrainRule className="my-14" />

      <section aria-labelledby="how" className="space-y-8">
        <h2
          id="how"
          className="font-mincho text-xl tracking-[0.15em] text-kinari"
        >
          行き方
        </h2>
        {SHOP.access.map((a) => (
          <div key={a.title} className="border-l border-hari pl-5">
            <h3 className="flex items-center gap-2 font-mincho text-base text-andon">
              {a.title.includes("冬") && <Yukiwa className="h-4 w-4 text-yuki" />}
              {a.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-kinari/85">
              {a.body}
            </p>
          </div>
        ))}
      </section>

      <GrainRule className="my-14" />

      <section aria-labelledby="hours">
        <h2
          id="hours"
          className="font-mincho text-xl tracking-[0.15em] text-kinari"
        >
          営業
        </h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <caption className="sr-only">期間ごとの営業曜日と時間</caption>
            <thead>
              <tr className="border-b border-hari text-left text-xs tracking-widest text-sobacha">
                <th scope="col" className="py-3 pr-4 font-normal">
                  期間
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">
                  曜日と時間
                </th>
                <th scope="col" className="py-3 font-normal">
                  おぼえ書き
                </th>
              </tr>
            </thead>
            <tbody>
              {SHOP.openingPeriods.map((p) => (
                <tr key={p.label} className="border-b border-hari/60 align-top">
                  <th
                    scope="row"
                    className="py-4 pr-4 text-left font-normal text-kinari"
                  >
                    {p.label}
                  </th>
                  <td className="py-4 pr-4 text-kinari/85">
                    {formatPeriod(p)}
                  </td>
                  <td className="py-4 text-xs text-usuzumi">{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-sm text-usuzumi">
          {SHOP.closedNote}。席は {SHOP.seats} 席、
          {WEEKDAY_JA[0]}曜と祝日は混みあいます。
        </p>
      </section>

      <GrainRule className="my-14" />

      <section aria-labelledby="building">
        <h2
          id="building"
          className="font-mincho text-xl tracking-[0.15em] text-kinari"
        >
          建物のこと
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-kinari/85">
          {SHOP.building.builtYear} 年に建った{SHOP.building.kind}です。
          {SHOP.building.note}。 敷居が高く、廊下に段差があります。
          お足元の悪い方はお声がけください、一階の座敷にご案内します。
        </p>
      </section>
    </div>
  );
}
