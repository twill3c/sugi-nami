import type { L10n, Locale } from "@/i18n/locale";

/**
 * お品書き。価格・アレルゲンの単一の出所。
 * 「すべての菓子にそば粉が入っている」ことが店の前提なので、
 * そばは個別表示ではなく店全体の注意書きとして扱い、
 * ここでは「そば以外に何が入るか」を持つ。
 */

/** 表示・絞り込みの対象にする特定原材料。そばは全品共通なので含めない */
export const ALLERGENS = [
  "egg",
  "milk",
  "wheat",
  "walnut",
  "soy",
  "sesame",
] as const;
export type Allergen = (typeof ALLERGENS)[number];

export const ALLERGEN_LABEL: Record<Allergen, L10n> = {
  egg: { ja: "卵", en: "egg" },
  milk: { ja: "乳", en: "milk" },
  wheat: { ja: "小麦", en: "wheat" },
  walnut: { ja: "くるみ", en: "walnut" },
  soy: { ja: "大豆", en: "soy" },
  sesame: { ja: "ごま", en: "sesame" },
};

/** そば。全品に入るので絞り込みには出さないが、表記には必ず出す */
export const BUCKWHEAT: L10n = { ja: "そば粉", en: "buckwheat" };

export const SEASONS = [
  "all",
  "spring",
  "summer",
  "autumn",
  "winter",
] as const;
export type Season = (typeof SEASONS)[number];

export const SEASON_LABEL: Record<Season, L10n> = {
  all: { ja: "通年", en: "All year" },
  spring: { ja: "春", en: "Spring" },
  summer: { ja: "夏", en: "Summer" },
  autumn: { ja: "秋", en: "Autumn" },
  winter: { ja: "冬", en: "Winter" },
};

export type MenuItem = {
  id: string;
  name: L10n;
  /** 日本語はふりがな、英語はローマ字 */
  reading: L10n;
  /** 一皿の説明。売り文句ではなく、何が起きている菓子なのかを書く */
  description: L10n;
  /** 円・税込 */
  price: number;
  season: Season;
  /** そば以外のアレルゲン */
  allergens: Allergen[];
  takeout: boolean;
};

export const MENU: MenuItem[] = [
  {
    id: "sobagaki-zenzai",
    name: { ja: "そばがき善哉", en: "Sobagaki in red bean soup" },
    reading: { ja: "そばがきぜんざい", en: "sobagaki zenzai" },
    description: {
      ja: "挽きたてのそば粉を湯だけで練り、粒あんに浮かべる。甘さは控えめで、そばの香りが立ちのぼるうちに召し上がってください。",
      en: "Freshly milled buckwheat, kneaded with nothing but hot water and floated in coarse red bean soup. Barely sweetened — eat it while the buckwheat is still rising off the bowl.",
    },
    price: 880,
    season: "all",
    allergens: ["soy"],
    takeout: false,
  },
  {
    id: "suginami-monaka",
    name: { ja: "杉なみ最中", en: "Suginami monaka" },
    reading: { ja: "すぎなみもなか", en: "suginami monaka" },
    description: {
      ja: "そば餡を挟んだ最中。皮は杉並木を模した細い筋入り。餡にそば粉を三割ほど混ぜてあるので、後口が重くならない。",
      en: "A wafer sandwich of buckwheat bean paste. The shell is scored in thin lines, after the cedar avenue. Three parts in ten of the paste is buckwheat flour, so it never sits heavy.",
    },
    price: 320,
    season: "all",
    allergens: ["soy"],
    takeout: true,
  },
  {
    id: "soba-galette",
    name: { ja: "そば粉のガレット", en: "Buckwheat galette" },
    reading: { ja: "そばこのガレット", en: "sobako no galette" },
    description: {
      ja: "戸隠在来種のそば粉を水と塩だけで一晩ねかせて焼く。季節の山菜と信州味噌のクリームを添えて。",
      en: "Togakushi's native buckwheat, rested overnight with only water and salt, then griddled. Served with the season's mountain vegetables and a Shinshu miso cream.",
    },
    price: 1280,
    season: "all",
    allergens: ["egg", "milk", "soy"],
    takeout: false,
  },
  {
    id: "sobacha-chiffon",
    name: { ja: "そば茶シフォン", en: "Buckwheat tea chiffon" },
    reading: { ja: "そばちゃシフォン", en: "sobacha chiffon" },
    description: {
      ja: "煎ったそばの実を挽いて生地に混ぜたシフォン。焼き色は濃いが、口に入れると軽い。",
      en: "Roasted buckwheat groats, milled straight into the batter. It bakes dark and eats light.",
    },
    price: 620,
    season: "all",
    allergens: ["egg", "milk", "wheat"],
    takeout: true,
  },
  {
    id: "sobanomi-granola",
    name: { ja: "そばの実グラノーラ", en: "Buckwheat groat granola" },
    reading: { ja: "そばのみグラノーラ", en: "sobanomi granola" },
    description: {
      ja: "そばの実をそのまま煎って、そば蜂蜜とくるみで固めたもの。噛むと弾ける食感が残るよう、火を入れすぎない。",
      en: "Whole groats roasted and bound with buckwheat honey and walnuts. Deliberately under-roasted, so they still pop between the teeth.",
    },
    price: 540,
    season: "all",
    allergens: ["milk", "walnut"],
    takeout: true,
  },
  {
    id: "dattan-sobacha",
    name: { ja: "韃靼そば茶", en: "Tartary buckwheat tea" },
    reading: { ja: "だったんそばちゃ", en: "dattan sobacha" },
    description: {
      ja: "苦みのある韃靼種を深く煎ったもの。菓子の甘さを流すために置いています。おかわりは無料。",
      en: "The bitter Tartary variety, roasted dark. It is on the list to wash the sweetness away. Refills are free.",
    },
    price: 480,
    season: "all",
    allergens: [],
    takeout: false,
  },
  {
    id: "soba-honey-pudding",
    name: { ja: "そば蜂蜜のプリン", en: "Buckwheat honey pudding" },
    reading: { ja: "そばはちみつのプリン", en: "soba hachimitsu no purin" },
    description: {
      ja: "そばの花から採れた蜂蜜は黒く、癖が強い。それを卵と牛乳でなだめて固めた、当店で一番甘い菓子。",
      en: "Honey from buckwheat flowers comes out black and difficult. Egg and milk talk it down. The sweetest thing we make.",
    },
    price: 620,
    season: "all",
    allergens: ["egg", "milk"],
    takeout: false,
  },
  {
    id: "yomogi-kusamochi",
    name: { ja: "よもぎとそばの草餅", en: "Mugwort and buckwheat kusamochi" },
    reading: { ja: "よもぎとそばのくさもち", en: "yomogi to soba no kusamochi" },
    description: {
      ja: "戸隠の斜面で摘んだよもぎと、そば粉を半量。春のあいだだけ、蒸したてを出します。",
      en: "Mugwort picked on the Togakushi slopes, half and half with buckwheat flour. Steamed to order, spring only.",
    },
    price: 460,
    season: "spring",
    allergens: ["soy"],
    takeout: true,
  },
  {
    id: "sakura-dorayaki",
    name: { ja: "そば粉の桜どら焼き", en: "Cherry-leaf buckwheat dorayaki" },
    reading: { ja: "そばこのさくらどらやき", en: "sobako no sakura dorayaki" },
    description: {
      ja: "そば粉を三割入れた生地で、桜の葉を刻んだ白餡を挟む。皮の色が濃いので、切ると中の白さが際立ちます。",
      en: "Three parts in ten buckwheat batter, folded around white bean paste cut with chopped cherry leaf. The dark skin makes the filling look whiter still.",
    },
    price: 480,
    season: "spring",
    allergens: ["egg", "wheat", "soy"],
    takeout: true,
  },
  {
    id: "sobacha-mizuyokan",
    name: { ja: "そば茶の水羊羹", en: "Buckwheat tea mizu-yōkan" },
    reading: { ja: "そばちゃのみずようかん", en: "sobacha no mizuyōkan" },
    description: {
      ja: "濃く出したそば茶で炊いた水羊羹。井戸で冷やしてから切り分けます。",
      en: "Water-yōkan simmered in strong buckwheat tea, chilled in the well before it is cut.",
    },
    price: 520,
    season: "summer",
    allergens: ["soy"],
    takeout: true,
  },
  {
    id: "sobanomi-anmitsu",
    name: { ja: "そばの実あんみつ", en: "Buckwheat groat anmitsu" },
    reading: { ja: "そばのみあんみつ", en: "sobanomi anmitsu" },
    description: {
      ja: "白玉のかわりに、茹でたそばの実を寒天に散らす。噛むたび音がするあんみつです。",
      en: "Boiled groats scattered through the agar in place of rice dumplings. An anmitsu that makes a sound when you chew it.",
    },
    price: 760,
    season: "summer",
    allergens: ["soy"],
    takeout: false,
  },
  {
    id: "kuri-soba-yokan",
    name: { ja: "栗とそばの蒸し羊羹", en: "Chestnut and buckwheat steamed yōkan" },
    reading: { ja: "くりとそばのむしようかん", en: "kuri to soba no mushi-yōkan" },
    description: {
      ja: "小布施から届く栗を、そば粉の生地で蒸し上げる。新そばの時期と栗の時期が重なる、年に一度の菓子。",
      en: "Chestnuts sent from Obuse, steamed inside a buckwheat batter. Made once a year, where the new-buckwheat season and the chestnut season overlap.",
    },
    price: 780,
    season: "autumn",
    allergens: ["wheat", "soy"],
    takeout: true,
  },
  {
    id: "shinsoba-financier",
    name: { ja: "新そばのフィナンシェ", en: "New-buckwheat financier" },
    reading: { ja: "しんそばのフィナンシェ", en: "shinsoba no financier" },
    description: {
      ja: "十月に挽きたての新そば粉で焼く、その年いちどきりの焼き菓子。焦がしバターが香りを立たせます。",
      en: "Baked in October from that year's first milling, and only then. Brown butter carries the scent.",
    },
    price: 420,
    season: "autumn",
    allergens: ["egg", "milk", "wheat"],
    takeout: true,
  },
  {
    id: "yukimi-dango",
    name: { ja: "雪見だんご", en: "Snow-viewing dango" },
    reading: { ja: "ゆきみだんご", en: "yukimi dango" },
    description: {
      ja: "そば粉のだんごを焼いて、きなこと黒蜜で。囲炉裏の炭で炙るので、雪の日にしか出せません。",
      en: "Buckwheat dumplings grilled over the hearth charcoal, with roasted soy flour and black syrup. The hearth is only lit on snowy days.",
    },
    price: 580,
    season: "winter",
    allergens: ["soy", "sesame"],
    takeout: false,
  },
  {
    id: "sobagaki-shiruko",
    name: { ja: "そばがきのお汁粉", en: "Sobagaki in smooth bean soup" },
    reading: { ja: "そばがきのおしるこ", en: "sobagaki no shiruko" },
    description: {
      ja: "冬のあいだだけ、善哉をこし餡の汁粉に変えます。囲炉裏で温めた椀で出すので、最後まで冷めません。",
      en: "Through winter the zenzai becomes a shiruko of strained bean paste. Served in a bowl warmed at the hearth, so it stays hot to the last spoon.",
    },
    price: 820,
    season: "winter",
    allergens: ["soy"],
    takeout: false,
  },
];

/** 表示の順。通年を先に、そのあと季節をめぐる順に */
export const SEASON_ORDER: Season[] = [
  "all",
  "spring",
  "summer",
  "autumn",
  "winter",
];

/** 月(1-12)から季節を返す。季節の菓子の出し分けに使う */
export function seasonOfMonth(month: number): Exclude<Season, "all"> {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

/** その月に店に並ぶ品(通年 + その季節)を返す */
export function menuOfMonth(month: number): MenuItem[] {
  const season = seasonOfMonth(month);
  return MENU.filter((m) => m.season === "all" || m.season === season);
}

/** 指定したアレルゲンをひとつも含まない品を返す */
export function menuWithout(excluded: Allergen[]): MenuItem[] {
  return MENU.filter((m) => !m.allergens.some((a) => excluded.includes(a)));
}

/** 「そば粉・卵・乳」のような原材料の一行。そばは必ず先頭に来る */
export function formatAllergens(item: MenuItem, locale: Locale): string {
  const names = [
    BUCKWHEAT[locale],
    ...item.allergens.map((a) => ALLERGEN_LABEL[a][locale]),
  ];
  return locale === "ja" ? names.join(" ・ ") : names.join(", ");
}

export function formatPrice(yen: number, locale: Locale): string {
  const n = yen.toLocaleString("en-US");
  return locale === "ja" ? `${n} 円` : `¥${n}`;
}
