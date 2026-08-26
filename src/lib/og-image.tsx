import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { SHOP } from "@/data/shop";
import { loadJapaneseFont } from "./og-font";
import type { Locale } from "@/i18n/locale";

export const OG_SIZE = { width: 1200, height: 630 };

// 杉並木。手前から奥へ細くしながら左右に立てる(サイトの図と同じ式)。
// 一番手前は枠の外に出す。そうしないと左右に黒が残る
const TRUNKS = Array.from({ length: 9 }, (_, i) => {
  const depth = i / 8;
  const scale = 1 - depth * 0.84;
  return {
    offset: 580 * Math.pow(scale, 0.8),
    width: 96 * scale + 10,
    opacity: 0.3 + scale * 0.55,
  };
});

/**
 * OG 画像をビルド時に焼く。日本語版と英語版で文言だけが変わる。
 *
 * Satori は放射グラデーションの再現が弱いので、参道の光は線形で置く。
 * 幹は背景より明るい色で描く(暗い幹を暗い背景に置くと並木に見えない)。
 */
export async function ogImage(locale: Locale) {
  const text = `${SHOP.name[locale]}${SHOP.tagline[locale]}${SHOP.address.region[locale]}${SHOP.address.locality[locale]}`;
  const fetched = locale === "ja" ? await loadJapaneseFont(
    "Shippori Mincho B1",
    500,
    text,
  ) : null;

  // Satori はフォントが一枚も無いと落ちる。欧文の部分集合(ASCII 全部)を
  // リポジトリに置いてあるので、ネットワークが無くても画像は焼ける。
  const fallback = await readFile(
    path.join(process.cwd(), "src/assets/shippori-latin.woff"),
  );
  const font = fetched ?? (fallback.buffer as ArrayBuffer);

  // 日本語のフォントが取れなかったときだけ、欧文の文言に落とす
  const jaOk = locale === "ja" && fetched !== null;
  const region = jaOk
    ? `${SHOP.address.region.ja}${SHOP.address.locality.ja}`
    : locale === "en"
      ? "TOGAKUSHI, NAGANO"
      : "TOGAKUSHI";
  const heading = jaOk ? SHOP.name.ja : SHOP.shortName.en;
  const sub = jaOk ? SHOP.tagline.ja : SHOP.tagline.en;

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
        {/* 参道の奥から差す光 */}
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
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: 10,
              color: "#c08a4e",
              display: "flex",
            }}
          >
            {region}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: jaOk ? 96 : 88,
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
      ...OG_SIZE,
      fonts: [
        {
          name: "Shippori Mincho B1",
          data: font,
          weight: 500 as const,
          style: "normal" as const,
        },
      ],
    },
  );
}
