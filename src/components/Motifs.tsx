/**
 * 図像はすべて SVG で組む。写真素材を一枚も持たない代わりに、
 * そばの実・杉並木・雪輪という三つの形を使いまわして意匠にする。
 *
 * 形は乱数を使わず式から決める。静的書き出しと再描画で必ず同じ絵になり、
 * ハイドレーションのずれも起きない。
 */

type SvgProps = { className?: string };

/** そばの実。三稜の実を正面から見た三角形。箇条書きの点や区切りに使う */
export function SobaGrain({ className }: SvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 2.5 L21.5 19.5 L2.5 19.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M12 2.5 L12 19.5 M12 11 L4.6 17.8 M12 11 L19.4 17.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.6"
      />
    </svg>
  );
}

/** そばの花。五弁の小花が房になって咲く。見出しの脇の添え */
export function SobaFlower({ className }: SvgProps) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {petals.map((deg) => (
        <ellipse
          key={deg}
          cx="24"
          cy="14.5"
          rx="4.6"
          ry="7.4"
          fill="currentColor"
          opacity="0.85"
          transform={`rotate(${deg} 24 24)`}
        />
      ))}
      <circle cx="24" cy="24" r="3.1" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

/**
 * 奥社の杉並木。奥へ行くほど細く、中央の参道に寄る幹を並べる。
 * 幅は奥行きに比例して細くし、中央からの距離は幅の 0.72 乗で縮める
 * (遠近法の見えに合わせた指数。等比で縮めると奥が詰まりすぎる)。
 *
 * 幹は背景より明るい色で描く。背景より暗くすると、光を強めても
 * 面がつぶれて並木に見えない。
 */
export function SugiGrove({ className }: SvgProps) {
  const trunks = Array.from({ length: 11 }, (_, i) => {
    const depth = i / 10; // 0 = 手前, 1 = 奥
    const scale = 1 - depth * 0.86;
    // 一番手前の幹は枠の外(offset > 100)に出す。そうしないと左右に黒が残る
    const offset = 104 * Math.pow(scale, 0.8);
    const width = 13 * scale + 1.4;
    return { offset, width, opacity: 0.28 + scale * 0.52 };
  });

  return (
    <svg
      viewBox="0 0 200 120"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="grove-light" cx="50%" cy="58%" r="48%">
          <stop offset="0%" stopColor="var(--color-andon)" stopOpacity="0.42" />
          <stop offset="55%" stopColor="var(--color-sobacha)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--color-sumi)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="grove-canopy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b0807" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--color-sumi)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="grove-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-hari)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--color-sumi)" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* 幹。中央の参道をあけて左右に対称に立てる */}
      {trunks.map((t, i) =>
        [-1, 1].map((side) => (
          <rect
            key={`${i}-${side}`}
            x={100 + side * t.offset - (side < 0 ? t.width : 0)}
            y={0}
            width={t.width}
            height={120}
            fill="#3d2e21"
            opacity={t.opacity}
          />
        )),
      )}

      {/* 参道の奥から差す光。幹の上に重ねて、奥ほど白く飛ばす */}
      <rect width="200" height="120" fill="url(#grove-light)" />

      {/* 上端は枝葉、下端は地面。どちらも沈めて幹の切り口を隠す */}
      <rect width="200" height="46" fill="url(#grove-canopy)" />

      {/* 足元を沈めて、幹が地面から生えて見えるようにする */}
      <rect y="88" width="200" height="32" fill="url(#grove-floor)" />
    </svg>
  );
}

/** 雪輪をひとつ。冬の季節見出しや罫の中心に置く */
export function Yukiwa({ className }: SvgProps) {
  const arms = [0, 60, 120, 180, 240, 300];
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth="1.1" fill="none">
        {arms.map((deg) => (
          <g key={deg} transform={`rotate(${deg} 20 20)`}>
            <path d="M20 20 L20 5.5" />
            <path d="M20 9.5 L16.6 6.4 M20 9.5 L23.4 6.4" strokeWidth="0.9" />
          </g>
        ))}
        <circle cx="20" cy="20" r="2.2" strokeWidth="0.9" />
      </g>
    </svg>
  );
}

/** そばの実を中央に置いた罫。節の区切りに使う */
export function GrainRule({ className }: SvgProps) {
  return (
    <div
      className={`flex items-center gap-4 text-hari ${className ?? ""}`}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-hari" />
      <SobaGrain className="h-4 w-4 text-sobacha" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-hari" />
    </div>
  );
}

/**
 * 改装した養蚕農家の切妻。二階の蚕室に窓が並ぶのが養蚕農家の特徴なので、
 * そこだけは形に残す。
 */
export function Kominka({ className }: SvgProps) {
  return (
    <svg
      viewBox="0 0 200 120"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      >
        {/* 茅葺きを落とした切妻屋根 */}
        <path d="M14 52 L100 12 L186 52" strokeWidth="2.2" />
        <path d="M26 52 L26 108 L174 108 L174 52" />
        {/* 二階 — 蚕室の窓の列 */}
        {[52, 76, 100, 124].map((x) => (
          <rect key={x} x={x} y={58} width="16" height="14" />
        ))}
        {/* 一階 — 土間の入口と障子 */}
        <rect x="86" y="80" width="28" height="28" />
        <path d="M100 80 L100 108" strokeWidth="1" opacity="0.7" />
        <rect x="40" y="82" width="34" height="20" />
        <rect x="126" y="82" width="34" height="20" />
        <path d="M40 92 L74 92 M126 92 L160 92" strokeWidth="0.8" opacity="0.6" />
        {/* 地面 */}
        <path d="M8 108 L192 108" strokeWidth="1" opacity="0.5" />
      </g>
    </svg>
  );
}
