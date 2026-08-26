import type { Metadata } from "next";
import { MenuList } from "@/components/MenuList";
import { GrainRule } from "@/components/Motifs";
import { SHOP } from "@/data/shop";

export const metadata: Metadata = {
  title: "お品書き",
  description:
    "そばがき善哉、杉なみ最中、そば粉のガレット。戸隠在来のそば粉で作る通年の菓子と、季節ごとに入れかわる菓子のお品書き。",
};

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <header>
        <p className="text-xs tracking-[0.3em] text-sobacha">お品書き</p>
        <h1 className="mt-4 font-mincho text-4xl tracking-[0.1em] text-kinari">
          そば粉の菓子
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-usuzumi">
          価格は税込です。菓子はその日に挽いた粉で作るため、
          数がなくなり次第おしまいになります。
        </p>
      </header>

      {/*
        そばアレルギーの注意。全品にそば粉が入る店なので、
        品ごとの小さな表記ではなく、お品書きの先頭で一度だけ強く出す。
      */}
      <div
        role="note"
        aria-labelledby="soba-warning"
        className="mt-10 rounded-sm border-l-2 border-andon bg-andon/10 px-5 py-4"
      >
        <p
          id="soba-warning"
          className="font-mincho text-base tracking-wide text-andon"
        >
          当店の菓子は、飲みものを含めてすべてそばを使用しています
        </p>
        <p className="mt-2 text-sm leading-relaxed text-kinari/85">
          そば粉を使わない品はご用意がありません。厨房も共通です。
          そばアレルギーのある方はご来店をお控えください。
          そば以外に気になるものがある方は、下の絞り込みをお使いください。
        </p>
      </div>

      <div className="mt-10">
        <MenuList />
      </div>

      <GrainRule className="my-14" />

      <p className="text-xs leading-relaxed text-usuzumi">
        表示しているのは、特定原材料のうち当店の菓子に使うものだけです。
        {SHOP.contact.note}
      </p>
    </div>
  );
}
