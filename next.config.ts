import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// 静的エクスポート。サーバ関数を持たないので Vercel 上で Function 実行は発生しない。
const nextConfig: NextConfig = {
  output: "export",
  // お知らせの本文は content/news/*.mdx を素材として読み込む。
  // MDX 自体をページにはしないので pageExtensions は既定のまま。
  pageExtensions: ["ts", "tsx"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
