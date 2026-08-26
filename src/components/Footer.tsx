import Link from "next/link";
import { SHOP, formatPeriod } from "@/data/shop";
import { GrainRule } from "./Motifs";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-hari bg-tsuchi/40">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-mincho text-base tracking-[0.14em] text-kinari">
              {SHOP.name}
            </p>
            <p className="mt-2 text-sm text-usuzumi">
              {SHOP.address.region}
              {SHOP.address.locality}
              <br />
              {SHOP.address.detail}
            </p>
          </div>

          <div>
            <h2 className="text-xs tracking-[0.2em] text-sobacha">営業</h2>
            <ul className="mt-2 space-y-1 text-sm text-usuzumi">
              {SHOP.openingPeriods.map((p) => (
                <li key={p.label}>
                  <span className="text-kinari">{formatPeriod(p)}</span>
                  <br />
                  <span className="text-xs">{p.label}</span>
                </li>
              ))}
              <li className="pt-1 text-xs">{SHOP.closedNote}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs tracking-[0.2em] text-sobacha">案内</h2>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link href="/menu" className="text-usuzumi hover:text-andon">
                  お品書き
                </Link>
              </li>
              <li>
                <Link href="/access" className="text-usuzumi hover:text-andon">
                  道のり
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <GrainRule className="my-8" />

        {/*
          架空店舗であることの明示。ポートフォリオ作品なので、
          実在の店と誤認されないことを装飾より優先して常時出す。
        */}
        <p
          role="note"
          className="rounded border border-hari bg-sumi/60 px-4 py-3 text-xs leading-relaxed text-usuzumi"
        >
          {SHOP.fictionNotice}
          {SHOP.contact.note}
        </p>

        <p className="mt-6 text-[0.7rem] tracking-wider text-usuzumi/70">
          MIT License © 2026 坂田哲朗
        </p>
      </div>
    </footer>
  );
}
