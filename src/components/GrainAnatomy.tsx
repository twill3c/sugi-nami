import { GRAIN_LAYERS, type Flour } from "@/data/soba";
import { t, type Locale } from "@/i18n/locale";

/**
 * そばの実の断面。
 *
 * 実は三稜なので、断面も三角で描く(丸で描くと米や麦の絵になってしまう)。
 * 層は配列の順に外から内へ重ねる。順が崩れると内側が隠れるので、
 * soba.test.ts が大きさの単調減少を確かめている。
 */

/**
 * 中心 (0,0)・大きさ r の正三角形。頂点を上に向ける。
 * SVG は下が +y なので sin の符号を反転させる —— 反転を忘れると
 * 逆さの三角になり、ヘッダのそばの実(SobaGrain)と向きが食い違う。
 */
function triangle(r: number): string {
  const pts = [90, 210, 330].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return [r * Math.cos(rad), -r * Math.sin(rad)] as const;
  });
  return `M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ")} Z`;
}

export function GrainCrossSection({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const R = 44;

  return (
    <figure className={className}>
      <svg
        viewBox="-100 -60 200 120"
        className="w-full"
        role="img"
        aria-label={
          locale === "ja"
            ? `そばの実の断面。外側から${GRAIN_LAYERS.map((l) => l.name.ja).join("、")}の順に重なっている`
            : `A cross-section of a buckwheat grain: ${GRAIN_LAYERS.map((l) => l.name.en).join(", ")}, from the outside in.`
        }
      >
        {GRAIN_LAYERS.map((layer, i) => (
          <path
            key={layer.id}
            d={triangle(R * layer.scale)}
            fill={layer.color}
            stroke="var(--color-sumi)"
            strokeWidth="0.8"
            strokeLinejoin="round"
            opacity={i === 0 ? 1 : 0.95}
          />
        ))}

        {/* 引き出し線。層の名前を左右に振り分ける */}
        {GRAIN_LAYERS.map((layer, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          const y = -34 + i * 24;
          const anchorX = side * R * layer.scale * 0.55;
          return (
            <g key={`${layer.id}-label`}>
              <path
                d={`M ${anchorX} ${y * 0.35} L ${side * 56} ${y}`}
                stroke="var(--color-hari)"
                strokeWidth="0.7"
                fill="none"
              />
              <circle
                cx={anchorX}
                cy={y * 0.35}
                r="1.4"
                fill="var(--color-sobacha)"
              />
              <text
                x={side * 58}
                y={y + 2}
                textAnchor={side < 0 ? "end" : "start"}
                fontSize="7"
                fill="var(--color-kinari)"
              >
                {t(layer.name, locale)}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="sr-only">
        {locale === "ja"
          ? "そばの実の断面図"
          : "Cross-section of a buckwheat grain"}
      </figcaption>
    </figure>
  );
}

/**
 * 挽き分けの図。実のどのあたりから出た粉かを、断面の上で塗り分ける。
 * 取れ高を持たない挽きぐるみは、殻の内側を全部塗る。
 */
export function MillingDiagram({
  flour,
  locale,
}: {
  flour: Flour;
  locale: Locale;
}) {
  const R = 30;
  // 一番粉は中心、三番粉は外側。取れ高の順ではなく、層の並びに合わせて塗る
  const bandByFlour: Record<string, [number, number]> = {
    ichiban: [0, 0.4],
    niban: [0.4, 0.62],
    sanban: [0.62, 0.82],
    hikigurumi: [0, 0.82],
  };
  const [inner, outer] = bandByFlour[flour.id] ?? [0, 0.82];

  return (
    <svg
      viewBox="-36 -36 72 72"
      className="h-16 w-16 shrink-0"
      role="img"
      aria-label={
        locale === "ja"
          ? `${flour.name.ja}が出るのは${flour.from.ja}`
          : `${flour.name.en} comes from ${flour.from.en}`
      }
    >
      {/* この粉が出る帯。外側の三角を塗り、内側を背景色でくり抜く */}
      <path
        d={triangle(R * outer)}
        fill={flour.color}
        opacity="0.85"
        strokeLinejoin="round"
      />
      {inner > 0 && (
        <path
          d={triangle(R * inner)}
          fill="var(--color-tsuchi)"
          strokeLinejoin="round"
        />
      )}
      {/* 実の輪郭。塗りに隠れないよう最後に重ねる */}
      <path
        d={triangle(R)}
        fill="none"
        stroke="var(--color-hari)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
