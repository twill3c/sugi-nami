import type { L10n, Locale } from "@/i18n/locale";

/**
 * 店の情報の単一の出所(single source of truth)。
 * ヘッダの営業時間・アクセスページ・営業日カレンダー・構造化データは
 * すべてこのファイルだけを読む。同じことを何箇所にも書かない。
 */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const WEEKDAY: Record<Locale, readonly string[]> = {
  ja: ["日", "月", "火", "水", "木", "金", "土"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

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
  label: L10n;
  /** 営業する曜日 */
  days: Weekday[];
  /** "HH:MM" 24 時間表記 */
  opens: string;
  closes: string;
  /** この期間が有効な月(1-12) */
  months: number[];
  note: L10n;
};

/**
 * 毎年おなじ日に取る休み。西暦を持たないので、年が変わっても古びない。
 * `from` から `to` まで(両端を含む)。年をまたぐ区間も書ける。
 */
export type AnnualClosure = {
  from: { month: number; day: number };
  to: { month: number; day: number };
  reason: L10n;
};

export const SHOP = {
  /** 店名を変えるならここだけ。表示は全ページこの定数を経由する */
  name: {
    ja: "そば菓子 杉なみ",
    en: "Suginami — Buckwheat Confectionery",
  } satisfies L10n,
  /** ヘッダの看板など、短く出したいとき */
  shortName: { ja: "杉なみ", en: "Suginami" } satisfies L10n,
  kind: { ja: "そば菓子", en: "Buckwheat sweets" } satisfies L10n,
  tagline: {
    ja: "そば粉を、甘いほうへ。",
    en: "Buckwheat, turned sweet.",
  } satisfies L10n,
  /**
   * 架空の店であることの明示。全ページのフッタに出す。
   * ポートフォリオ作品であり、実在する店舗ではない。
   */
  fictionNotice: {
    ja: "このサイトはポートフォリオ用に制作した架空の店舗の Web サイトです。実在する店舗・住所・連絡先ではありません。",
    en: "This site is a portfolio piece for a shop that does not exist. The shop, its address and its contact details are all fictional.",
  } satisfies L10n,
  founded: 2019,
  building: {
    builtYear: 1904,
    kind: { ja: "養蚕農家", en: "silkworm farmhouse" } satisfies L10n,
    note: {
      ja: "二階の蚕室を客席に、一階の土間を厨房にあてている",
      en: "the second-floor silkworm room is now the dining room, and the earth-floored ground floor is the kitchen",
    } satisfies L10n,
  },
  /** 架空の所在地。番地は置かず、地図にピンも立てない */
  address: {
    region: { ja: "長野県", en: "Nagano Prefecture" } satisfies L10n,
    locality: {
      ja: "長野市戸隠",
      en: "Togakushi",
    } satisfies L10n,
    detail: {
      ja: "中社の門前(架空)",
      en: "by the gate of Chūsha shrine (fictional)",
    } satisfies L10n,
  },
  access: [
    {
      title: { ja: "バスで", en: "By bus" } satisfies L10n,
      body: {
        ja: "JR 長野駅 善光寺口 7 番のりばから、アルピコ交通「戸隠高原行」で約 1 時間。「戸隠中社」下車、杉並木ぞいに徒歩 7 分。",
        en: "From stop 7 at the Zenkōji exit of JR Nagano Station, take the Alpico bus for Togakushi Kōgen, about one hour. Get off at Togakushi Chūsha and walk seven minutes along the cedar avenue.",
      } satisfies L10n,
    },
    {
      title: { ja: "車で", en: "By car" } satisfies L10n,
      body: {
        ja: "上信越自動車道 長野 IC からおよそ 50 分。県道 36 号(バードライン)経由。駐車場は 6 台。",
        en: "About 50 minutes from the Nagano interchange on the Jōshin-etsu Expressway, by prefectural route 36 (the Bird Line). Parking for six cars.",
      } satisfies L10n,
    },
    {
      title: {
        ja: "冬の道について",
        en: "About the winter road",
      } satisfies L10n,
      body: {
        ja: "12 月から 3 月は路面が凍ります。冬用タイヤかチェーンをご用意ください。大雪の日は臨時に休むことがあります。",
        en: "From December to March the road ices over. Please come on winter tyres or with chains. On heavy-snow days we may close without notice.",
      } satisfies L10n,
    },
  ],
  openingPeriods: [
    {
      label: {
        ja: "通常期(4 月〜11 月)",
        en: "Regular season (April–November)",
      },
      days: [1, 5, 6, 0] as Weekday[],
      opens: "10:00",
      closes: "17:00",
      months: [4, 5, 6, 7, 8, 9, 10, 11],
      note: {
        ja: "菓子がなくなり次第、早じまいします",
        en: "We close early once the day's sweets are gone",
      },
    },
    {
      label: {
        ja: "冬期(12 月〜3 月)",
        en: "Winter (December–March)",
      },
      days: [5, 6, 0] as Weekday[],
      opens: "11:00",
      closes: "16:00",
      months: [12, 1, 2, 3],
      note: {
        ja: "大雪の日は休みます",
        en: "We close on heavy-snow days",
      },
    },
  ] satisfies OpeningPeriod[],
  closedNote: {
    ja: "火・水・木は定休(冬期は月曜も休み)",
    en: "Closed Tuesday, Wednesday and Thursday (and Mondays in winter)",
  } satisfies L10n,
  /** 毎年おなじ日に取る休み */
  annualClosures: [
    {
      from: { month: 12, day: 29 },
      to: { month: 1, day: 3 },
      reason: { ja: "年末年始", en: "New Year holiday" },
    },
    {
      from: { month: 3, day: 30 },
      to: { month: 4, day: 2 },
      reason: { ja: "品替えの休み", en: "Closed to change the menu" },
    },
  ] satisfies AnnualClosure[],
  seats: 18,
  /** 架空の連絡先。実在番号を避けるため、番号もフォームも持たない */
  contact: {
    note: {
      ja: "架空店舗のため、電話番号・予約フォームは設けていません。",
      en: "As the shop is fictional, there is no telephone number and no booking form.",
    } satisfies L10n,
  },
} as const;

/** 月(1-12)からその月に適用される営業期間を返す */
export function periodOfMonth(month: number): OpeningPeriod {
  const found = SHOP.openingPeriods.find((p) => p.months.includes(month));
  if (!found) {
    throw new Error(`営業期間が定義されていない月です: ${month}`);
  }
  return found;
}

/** 曜日の並び順。日曜を末尾に置く(0 始まりのまま並べると日曜が先頭に来てしまう) */
const DISPLAY_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

/** 「金・土・日 11:00–16:00」のような一行表記を組み立てる */
export function formatPeriod(period: OpeningPeriod, locale: Locale): string {
  const names = WEEKDAY[locale];
  const days = [...period.days]
    .sort((a, b) => DISPLAY_ORDER.indexOf(a) - DISPLAY_ORDER.indexOf(b))
    .map((d) => names[d]);
  const joined = locale === "ja" ? days.join("・") : days.join(", ");
  return `${joined} ${period.opens}–${period.closes}`;
}
