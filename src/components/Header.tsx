import Link from "next/link";
import { SHOP } from "@/data/shop";
import { SobaGrain } from "./Motifs";

const NAV = [
  { href: "/menu", label: "お品書き" },
  { href: "/access", label: "道のり" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-hari bg-sumi/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 py-3">
        <Link
          href="/"
          className="group flex items-baseline gap-2.5"
          aria-label={`${SHOP.name} トップページへ`}
        >
          <SobaGrain className="h-4 w-4 shrink-0 self-center text-sobacha transition-colors group-hover:text-andon" />
          <span className="font-mincho text-lg tracking-[0.14em] text-kinari">
            杉なみ
          </span>
          <span className="hidden text-[0.68rem] tracking-[0.2em] text-usuzumi sm:inline">
            そば菓子
          </span>
        </Link>

        <nav aria-label="サイト内">
          <ul className="flex items-center gap-1 text-sm sm:gap-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="block rounded px-3 py-2 text-usuzumi transition-colors hover:text-andon"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
