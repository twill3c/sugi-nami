import type { NextConfig } from "next";

// 静的エクスポート。サーバ関数を持たないので Vercel 上で Function 実行は発生しない。
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
