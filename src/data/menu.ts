/**
 * お品書き。価格・アレルゲンの単一の出所。
 * 「すべての菓子にそば粉が入っている」ことが店の前提なので、
 * そばは個別表示ではなく店全体の注意書きとして扱い、
 * ここでは「そば以外に何が入るか」を持つ。
 */

/** 表示・絞り込みの対象にする特定原材料。そばは全品共通なので含めない */
export const ALLERGENS = ["卵", "乳", "小麦", "くるみ", "大豆", "ごま"] as const;
export type Allergen = (typeof ALLERGENS)[number];

export type Season = "通年" | "春" | "夏" | "秋" | "冬";

export type MenuItem = {
  id: string;
  name: string;
  reading: string;
  /** 一皿の説明。売り文句ではなく、何が起きている菓子なのかを書く */
  description: string;
  /** 円・税込 */
  price: number;
  season: Season;
  /** そば以外のアレルゲン */
  allergens: Allergen[];
  /** 持ち帰りができるか */
  takeout: boolean;
};

export const MENU: MenuItem[] = [
  {
    id: "sobagaki-zenzai",
    name: "そばがき善哉",
    reading: "そばがきぜんざい",
    description:
      "挽きたてのそば粉を湯だけで練り、粒あんに浮かべる。甘さは控えめで、そばの香りが立ちのぼるうちに召し上がってください。",
    price: 880,
    season: "通年",
    allergens: ["大豆"],
    takeout: false,
  },
  {
    id: "suginami-monaka",
    name: "杉なみ最中",
    reading: "すぎなみもなか",
    description:
      "そば餡を挟んだ最中。皮は杉並木を模した細い筋入り。餡にそば粉を三割ほど混ぜてあるので、後口が重くならない。",
    price: 320,
    season: "通年",
    allergens: ["大豆"],
    takeout: true,
  },
  {
    id: "soba-galette",
    name: "そば粉のガレット",
    reading: "そばこのガレット",
    description:
      "戸隠在来種のそば粉を水と塩だけで一晩ねかせて焼く。季節の山菜と信州味噌のクリームを添えて。",
    price: 1280,
    season: "通年",
    allergens: ["卵", "乳", "大豆"],
    takeout: false,
  },
  {
    id: "sobacha-chiffon",
    name: "そば茶シフォン",
    reading: "そばちゃシフォン",
    description:
      "煎ったそばの実を挽いて生地に混ぜたシフォン。焼き色は濃いが、口に入れると軽い。",
    price: 620,
    season: "通年",
    allergens: ["卵", "乳", "小麦"],
    takeout: true,
  },
  {
    id: "sobanomi-granola",
    name: "そばの実グラノーラ",
    reading: "そばのみグラノーラ",
    description:
      "そばの実をそのまま煎って、そば蜂蜜とくるみで固めたもの。噛むと弾ける食感が残るよう、火を入れすぎない。",
    price: 540,
    season: "通年",
    allergens: ["乳", "くるみ"],
    takeout: true,
  },
  {
    id: "dattan-sobacha",
    name: "韃靼そば茶",
    reading: "だったんそばちゃ",
    description:
      "苦みのある韃靼種を深く煎ったもの。菓子の甘さを流すために置いています。おかわりは無料。",
    price: 480,
    season: "通年",
    allergens: [],
    takeout: false,
  },
  {
    id: "soba-honey-pudding",
    name: "そば蜂蜜のプリン",
    reading: "そばはちみつのプリン",
    description:
      "そばの花から採れた蜂蜜は黒く、癖が強い。それを卵と牛乳でなだめて固めた、当店で一番甘い菓子。",
    price: 620,
    season: "通年",
    allergens: ["卵", "乳"],
    takeout: false,
  },
  {
    id: "yomogi-kusamochi",
    name: "よもぎとそばの草餅",
    reading: "よもぎとそばのくさもち",
    description:
      "戸隠の斜面で摘んだよもぎと、そば粉を半量。春のあいだだけ、蒸したてを出します。",
    price: 460,
    season: "春",
    allergens: ["大豆"],
    takeout: true,
  },
  {
    id: "sakura-dorayaki",
    name: "そば粉の桜どら焼き",
    reading: "そばこのさくらどらやき",
    description:
      "そば粉を三割入れた生地で、桜の葉を刻んだ白餡を挟む。皮の色が濃いので、切ると中の白さが際立ちます。",
    price: 480,
    season: "春",
    allergens: ["卵", "小麦", "大豆"],
    takeout: true,
  },
  {
    id: "sobacha-mizuyokan",
    name: "そば茶の水羊羹",
    reading: "そばちゃのみずようかん",
    description:
      "濃く出したそば茶で炊いた水羊羹。井戸で冷やしてから切り分けます。",
    price: 520,
    season: "夏",
    allergens: ["大豆"],
    takeout: true,
  },
  {
    id: "sobanomi-anmitsu",
    name: "そばの実あんみつ",
    reading: "そばのみあんみつ",
    description:
      "白玉のかわりに、茹でたそばの実を寒天に散らす。噛むたび音がするあんみつです。",
    price: 760,
    season: "夏",
    allergens: ["大豆"],
    takeout: false,
  },
  {
    id: "kuri-soba-yokan",
    name: "栗とそばの蒸し羊羹",
    reading: "くりとそばのむしようかん",
    description:
      "小布施から届く栗を、そば粉の生地で蒸し上げる。新そばの時期と栗の時期が重なる、年に一度の菓子。",
    price: 780,
    season: "秋",
    allergens: ["小麦", "大豆"],
    takeout: true,
  },
  {
    id: "shinsoba-financier",
    name: "新そばのフィナンシェ",
    reading: "しんそばのフィナンシェ",
    description:
      "十月に挽きたての新そば粉で焼く、その年いちどきりの焼き菓子。焦がしバターが香りを立たせます。",
    price: 420,
    season: "秋",
    allergens: ["卵", "乳", "小麦"],
    takeout: true,
  },
  {
    id: "yukimi-dango",
    name: "雪見だんご",
    reading: "ゆきみだんご",
    description:
      "そば粉のだんごを焼いて、きなこと黒蜜で。囲炉裏の炭で炙るので、雪の日にしか出せません。",
    price: 580,
    season: "冬",
    allergens: ["大豆", "ごま"],
    takeout: false,
  },
  {
    id: "sobagaki-shiruko",
    name: "そばがきのお汁粉",
    reading: "そばがきのおしるこ",
    description:
      "冬のあいだだけ、善哉をこし餡の汁粉に変えます。囲炉裏で温めた椀で出すので、最後まで冷めません。",
    price: 820,
    season: "冬",
    allergens: ["大豆"],
    takeout: false,
  },
];

export const SEASON_ORDER: Season[] = ["通年", "春", "夏", "秋", "冬"];

/** 月(1-12)から季節を返す。季節の菓子の出し分けに使う */
export function seasonOfMonth(month: number): Exclude<Season, "通年"> {
  if (month >= 3 && month <= 5) return "春";
  if (month >= 6 && month <= 8) return "夏";
  if (month >= 9 && month <= 11) return "秋";
  return "冬";
}

/** その月に店に並ぶ品(通年 + その季節)を返す */
export function menuOfMonth(month: number): MenuItem[] {
  const season = seasonOfMonth(month);
  return MENU.filter((m) => m.season === "通年" || m.season === season);
}

/** 指定したアレルゲンをひとつも含まない品を返す */
export function menuWithout(excluded: Allergen[]): MenuItem[] {
  return MENU.filter((m) => !m.allergens.some((a) => excluded.includes(a)));
}

export function formatPrice(yen: number): string {
  return `${yen.toLocaleString("ja-JP")} 円`;
}
