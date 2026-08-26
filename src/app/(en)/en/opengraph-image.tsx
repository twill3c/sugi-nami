import { SHOP } from "@/data/shop";
import { OG_SIZE, ogImage } from "@/lib/og-image";

export const alt = `${SHOP.name.en} — ${SHOP.tagline.en}`;
export const size = OG_SIZE;
export const contentType = "image/png";

// 静的書き出しではビルド時に一度だけ焼く
export const dynamic = "force-static";

export default function Image() {
  return ogImage("en");
}
