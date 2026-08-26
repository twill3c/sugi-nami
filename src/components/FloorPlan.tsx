import { t, type Locale } from "@/i18n/locale";
import type { Room } from "@/data/story";

/**
 * 改修の前後の間取り。
 *
 * 部屋の区切りは前後で一致させてある(story.test.ts が確かめている)。
 * 図で変わって見えるのは名前と色だけ ——「間取りは動かさず、用途だけ変えた」
 * という改修そのものを、図の作りでも守っている。
 */
export function FloorPlan({
  plan,
  locale,
  title,
  tone,
}: {
  plan: { floor: { ja: string; en: string }; rooms: Room[] }[];
  locale: Locale;
  title: string;
  tone: "before" | "after";
}) {
  const stroke = tone === "after" ? "var(--color-andon)" : "var(--color-hari)";
  const changedFill =
    tone === "after" ? "rgb(226 161 63 / 0.12)" : "rgb(192 138 78 / 0.06)";

  return (
    <figure className="washi rounded-sm p-5">
      <figcaption className="font-mincho text-base tracking-wide text-kinari">
        {title}
      </figcaption>

      <div className="mt-4 space-y-3">
        {plan.map((floor) => (
          <div key={floor.floor.ja}>
            <p className="text-[0.7rem] tracking-[0.2em] text-sobacha">
              {t(floor.floor, locale)}
            </p>
            <svg
              viewBox="0 0 100 44"
              className="mt-1 w-full"
              role="img"
              aria-label={`${t(floor.floor, locale)}: ${floor.rooms
                .map((r) => t(r.label, locale))
                .join(locale === "ja" ? "、" : ", ")}`}
            >
              {floor.rooms.map((r) => (
                <g key={r.label.ja}>
                  <rect
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    fill={r.changed ? changedFill : "transparent"}
                    stroke={r.changed ? stroke : "var(--color-hari)"}
                    strokeWidth="0.7"
                  />
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2 + 2.2}
                    textAnchor="middle"
                    fontSize="5.4"
                    fill={
                      r.changed && tone === "after"
                        ? "var(--color-andon)"
                        : "var(--color-kinari)"
                    }
                  >
                    {t(r.label, locale)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        ))}
      </div>
    </figure>
  );
}
