import { ImageResponse } from "next/og";
import { SHOP } from "@/data/shop";
import { loadJapaneseFont } from "@/lib/og-font";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = `${SHOP.name} — ${SHOP.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 静的書き出しではビルド時に一度だけ焼く
export const dynamic = "force-static";

// 杉並木。手前から奥へ細くしながら左右に立てる(トップの図と同じ式)
const TRUNKS = Array.from({ length: 9 }, (_, i) => {
  const depth = i / 8;
  const scale = 1 - depth * 0.84;
  return {
    offset: 580 * Math.pow(scale, 0.8),
    width: 96 * scale + 10,
    opacity: 0.3 + scale * 0.55,
  };
});

export default async function Image() {
  const text = `${SHOP.name}${SHOP.tagline}長野県戸隠`;
  const font = await loadJapaneseFont("Shippori Mincho B1", 500, text);

  // Satori はフォントが一枚も無いと落ちるので、取得に失敗したときのために
  // 欧文だけの部分集合をリポジトリに置いてある(7.7KB)。
  // ビルド時にネットワークが無くても OG 画像は出る。欧文の版になるだけ。
  const fallback = await readFile(
    path.join(process.cwd(), "src/assets/shippori-latin.woff"),
  );

  const heading = font ? SHOP.name : SHOP.nameEn;
  const sub = font ? SHOP.tagline : "Togakushi, Nagano";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          backgroundColor: "#14100e",
          padding: "72px 88px",
        }}
      >
        {/* 参道の奥から差す光。Satori は放射グラデーションの再現が弱いので線形で置く */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(20,16,14,0) 18%, rgba(226,161,63,0.30) 42%, rgba(20,16,14,0) 62%)",
            display: "flex",
          }}
        />

        {TRUNKS.map((t, i) =>
          [-1, 1].map((side) => (
            <div
              key={`${i}-${side}`}
              style={{
                position: "absolute",
                top: 0,
                left: 600 + side * t.offset - (side < 0 ? t.width : 0),
                width: t.width,
                height: 630,
                backgroundColor: "#3d2e21",
                opacity: t.opacity,
                display: "flex",
              }}
            />
          )),
        )}

        {/* 天蓋 — 上端を沈めて、幹が枝葉に消えていくように見せる */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 150,
            background:
              "linear-gradient(to bottom, rgba(11,8,7,0.92), rgba(20,16,14,0))",
            display: "flex",
          }}
        />

        {/* 足元を沈める */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 250,
            background:
              "linear-gradient(to bottom, rgba(20,16,14,0), rgba(20,16,14,0.96) 55%, rgba(20,16,14,0.98))",
            display: "flex",
          }}
        />

        <div
          style={{ position: "relative", display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: 10,
              color: "#c08a4e",
              display: "flex",
            }}
          >
            {font ? "長野県戸隠" : "TOGAKUSHI"}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 96,
              letterSpacing: 8,
              color: "#efe5d6",
              display: "flex",
            }}
          >
            {heading}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 38,
              letterSpacing: 6,
              color: "#e2a13f",
              display: "flex",
            }}
          >
            {sub}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Shippori Mincho B1",
          data: font ?? (fallback.buffer as ArrayBuffer),
          weight: 500 as const,
          style: "normal" as const,
        },
      ],
    },
  );
}
