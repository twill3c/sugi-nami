import { STORY } from "@/data/story";
import { t, type Locale } from "@/i18n/locale";

/**
 * 家の年表。
 *
 * 出来事のあいだの年数を縦の余白に反映させる。
 * 等間隔に並べると「四十年ほど誰も住まなかった」という、この家の話の芯が
 * 図から消えてしまう。空き家の期間は帯の色を落として、長さで見せる。
 */

const MIN_GAP = 2.5; // rem。年が近い出来事どうしが重ならないための下限
const MAX_GAP = 11; // rem。空白が長くなりすぎて読めなくならないための上限

export function Timeline({ locale }: { locale: Locale }) {
  const span = STORY[STORY.length - 1].year - STORY[0].year;

  return (
    <ol className="relative">
      {STORY.map((e, i) => {
        const prev = STORY[i - 1];
        const gapYears = prev ? e.year - prev.year : 0;
        // 年数を rem に写す。上限と下限で挟んで、極端に潰れも伸びもしないようにする
        const gap = prev
          ? Math.min(MAX_GAP, Math.max(MIN_GAP, (gapYears / span) * 26))
          : 0;
        // 直前が空き家なら、そのあいだの帯を薄くする
        const quiet = prev ? !prev.inhabited : false;

        return (
          <li
            key={e.year}
            className="relative pl-8"
            style={{ marginTop: `${gap}rem` }}
          >
            {/* 出来事どうしをつなぐ縦の帯。この li の上端から上へ伸ばす */}
            {prev && (
              <span
                aria-hidden="true"
                className={`absolute left-[0.31rem] w-px ${
                  quiet ? "bg-hari/50" : "bg-hari"
                }`}
                style={{ top: `-${gap}rem`, height: `calc(${gap}rem + 0.5rem)` }}
              />
            )}

            {/* 節。空き家の期間に入る出来事は中を抜く */}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1.5 h-2.5 w-2.5 rotate-45 border ${
                e.inhabited
                  ? "border-andon bg-andon"
                  : "border-usuzumi bg-transparent"
              }`}
            />

            {/* 空いた年数を帯の脇に添える。長さの理由が読めるようにする */}
            {prev && gapYears >= 15 && (
              <span
                className="absolute left-8 text-[0.68rem] tracking-widest text-usuzumi/70"
                style={{ top: `-${gap / 2 + 0.4}rem` }}
              >
                {locale === "ja"
                  ? `${gapYears} 年`
                  : `${gapYears} years`}
              </span>
            )}

            <p className="font-mincho text-2xl tracking-[0.08em] text-sobacha">
              {e.year}
            </p>
            <h3 className="mt-1 font-mincho text-lg text-andon">
              {t(e.title, locale)}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-kinari/85">
              {t(e.body, locale)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
