/**
 * 店の情報の単一の出所(single source of truth)。
 * ヘッダの営業時間・アクセスページ・構造化データ(JSON-LD)は
 * すべてこのファイルだけを読む。3 箇所に別々の文字列を持たない。
 */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const WEEKDAY_JA = ["日", "月", "火", "水", "木", "金", "土"] as const;

/** schema.org の OpeningHoursSpecification が要求する曜日名 */
export const WEEKDAY_SCHEMA = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type OpeningPeriod = {
  /** 期間の呼び名(サイト上の表示にも使う) */
  label: string;
  /** 営業する曜日 */
  days: Weekday[];
  /** "HH:MM" 24 時間表記 */
  opens: string;
  closes: string;
  /** この期間が有効な月(1-12)。通年なら null */
  months: number[] | null;
  note?: string;
};

export const SHOP = {
  /** 店名を変えるならここだけ。表示は全ページこの定数を経由する */
  name: "そば菓子 杉なみ",
  nameEn: "Suginami — Buckwheat Confectionery",
  reading: "そばがし すぎなみ",
  tagline: "そば粉を、甘いほうへ。",
  /**
   * 架空の店であることの明示。全ページのフッタに出す。
   * ポートフォリオ用の作品であり、実在する店舗ではない。
   */
  fictionNotice:
    "このサイトはポートフォリオ用に制作した架空の店舗の Web サイトです。実在する店舗・住所・連絡先ではありません。",
  founded: 2019,
  /** 改装した古民家の情報 */
  building: {
    builtYear: 1904,
    kind: "養蚕農家",
    note: "二階の蚕室を客席に、一階の土間を厨房にあてている",
  },
  /** 架空の所在地。番地は置かず、地図にピンも立てない */
  address: {
    region: "長野県",
    locality: "長野市戸隠",
    detail: "中社の門前(架空)",
  },
  access: [
    {
      title: "バスで",
      body: "JR 長野駅 善光寺口 7 番のりばから、アルピコ交通「戸隠高原行」で約 1 時間。「戸隠中社」下車、杉並木ぞいに徒歩 7 分。",
    },
    {
      title: "車で",
      body: "上信越自動車道 長野 IC からおよそ 50 分。県道 36 号(バードライン)経由。駐車場は 6 台。",
    },
    {
      title: "冬の道について",
      body: "12 月から 3 月は路面が凍ります。冬用タイヤかチェーンをご用意ください。大雪の日は臨時に休むことがあります。",
    },
  ],
  openingPeriods: [
    {
      label: "通常期(4 月〜11 月)",
      days: [1, 5, 6, 0] as Weekday[],
      opens: "10:00",
      closes: "17:00",
      months: [4, 5, 6, 7, 8, 9, 10, 11],
      note: "菓子がなくなり次第、早じまいします",
    },
    {
      label: "冬期(12 月〜3 月)",
      days: [5, 6, 0] as Weekday[],
      opens: "11:00",
      closes: "16:00",
      months: [12, 1, 2, 3],
      note: "大雪の日は休みます",
    },
  ] satisfies OpeningPeriod[],
  closedNote: "火・水・木は定休(冬期は月曜も休み)",
  seats: 18,
  /** 架空の連絡先。実在番号を避けるため、番号は載せずフォームの体裁も取らない */
  contact: {
    note: "架空店舗のため、電話番号・予約フォームは設けていません。",
  },
} as const;

/** 月(1-12)からその月に適用される営業期間を返す */
export function periodOfMonth(month: number): OpeningPeriod {
  const found = SHOP.openingPeriods.find((p) => p.months?.includes(month));
  if (!found) {
    throw new Error(`営業期間が定義されていない月です: ${month}`);
  }
  return found;
}

/** 曜日の並び順。日曜を末尾に置く(0 始まりのまま並べると日曜が先頭に来てしまう) */
const DISPLAY_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

/** 「金・土・日・月 10:00–17:00」のような一行表記を組み立てる */
export function formatPeriod(period: OpeningPeriod): string {
  const days = [...period.days]
    .sort((a, b) => DISPLAY_ORDER.indexOf(a) - DISPLAY_ORDER.indexOf(b))
    .map((d) => WEEKDAY_JA[d])
    .join("・");
  return `${days} ${period.opens}–${period.closes}`;
}
