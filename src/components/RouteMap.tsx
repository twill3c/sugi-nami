/**
 * 道のりの略図。
 *
 * 架空の店なので実地図にピンは立てない。代わりに、
 * 「長野駅 → バス → 中社 → 杉並木 → 店」という順序だけを図にする。
 * 図が読めない環境のために、同じ内容を <figcaption> の文章でも持つ。
 */

const STOPS = [
  { x: 26, label: "JR 長野駅", sub: "善光寺口 7 番" },
  { x: 90, label: "戸隠中社", sub: "バス 約 60 分" },
  { x: 154, label: "杉なみ", sub: "杉並木を 徒歩 7 分" },
];

export function RouteMap({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <svg
        viewBox="0 0 180 96"
        className="w-full"
        role="img"
        aria-label="長野駅からバスで戸隠中社、そこから杉並木ぞいに徒歩 7 分で店に着く道のりの略図"
      >
        {/* 道 — 山道なので直線にしない */}
        <path
          d="M26 62 C 48 62, 56 38, 90 38 S 132 62, 154 62"
          fill="none"
          stroke="var(--color-hari)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* 徒歩の区間だけ破線で重ねる */}
        <path
          d="M90 38 C 124 38, 132 62, 154 62"
          fill="none"
          stroke="var(--color-sobacha)"
          strokeWidth="1.6"
          strokeDasharray="3 4"
          strokeLinecap="round"
        />

        {/* 杉並木 — 徒歩区間の脇に立てる */}
        {[104, 116, 128, 140].map((x, i) => (
          <path
            key={x}
            d={`M${x} ${40 + i * 4} l0 -11`}
            stroke="var(--color-koke)"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity={0.75}
          />
        ))}

        {STOPS.map((s, i) => (
          <g key={s.label}>
            <circle
              cx={s.x}
              cy={i === 1 ? 38 : 62}
              r={i === 2 ? 5 : 3.6}
              fill={i === 2 ? "var(--color-andon)" : "var(--color-sumi)"}
              stroke={i === 2 ? "var(--color-andon)" : "var(--color-sobacha)"}
              strokeWidth="1.6"
            />
            <text
              x={s.x}
              y={i === 1 ? 26 : 78}
              textAnchor="middle"
              fill="var(--color-kinari)"
              fontSize="7"
            >
              {s.label}
            </text>
            <text
              x={s.x}
              y={i === 1 ? 18 : 87}
              textAnchor="middle"
              fill="var(--color-usuzumi)"
              fontSize="5"
            >
              {s.sub}
            </text>
          </g>
        ))}
      </svg>

      <figcaption className="mt-4 text-xs leading-relaxed text-usuzumi">
        実線がバス、破線が徒歩の区間です。緑の線は杉並木。
        架空の店舗のため、地図上の正確な位置は示していません。
      </figcaption>
    </figure>
  );
}
