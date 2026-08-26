import type { L10n } from "@/i18n/locale";
import { MENU } from "./menu";

/**
 * そば粉の話。
 *
 * 粉の種類は「実のどこから出た粉か」で決まる。ここではその層と、
 * その粉で作っている菓子(menu.ts の id)を結んでおく。
 * どの菓子がどの粉か、粉を使わない品はどれか —— その対応が抜けないことを
 * soba.test.ts が menu.ts と突き合わせて確かめる。
 */

/** 実の断面の層。外側から順に並べる */
export type GrainLayer = {
  id: string;
  name: L10n;
  /** 断面図での大きさ(外側の三角を 1 とした比) */
  scale: number;
  color: string;
  body: L10n;
};

export const GRAIN_LAYERS: GrainLayer[] = [
  {
    id: "kahi",
    name: { ja: "果皮(そば殻)", en: "Hull" },
    scale: 1,
    color: "#2b2320",
    body: {
      ja: "黒くて硬い外側の殻。挽く前に外します。枕に詰めるのはこれ。",
      en: "The hard black shell. It comes off before milling — this is what buckwheat pillows are stuffed with.",
    },
  },
  {
    id: "shuhi",
    name: { ja: "種皮(甘皮)", en: "Seed coat" },
    scale: 0.82,
    color: "#5c6647",
    body: {
      ja: "緑がかった薄い皮。香りとえぐみの両方がここにあります。",
      en: "A thin greenish coat. Both the scent and the harshness live here.",
    },
  },
  {
    id: "haiga",
    name: { ja: "胚芽", en: "Germ" },
    scale: 0.62,
    color: "#8a8a4e",
    body: {
      ja: "芽になる部分。香りが最も強く、油を含むので傷むのも早い。",
      en: "The part that would have sprouted. It carries the most scent, and the most oil, so it spoils first.",
    },
  },
  {
    id: "hainyu",
    name: { ja: "胚乳", en: "Endosperm" },
    scale: 0.4,
    color: "#e8dcc6",
    body: {
      ja: "中心の白いでんぷん。甘みはありますが、香りはほとんどありません。",
      en: "The white starch at the centre. It is sweet, and almost without scent.",
    },
  },
];

export type Flour = {
  id: string;
  name: L10n;
  reading: L10n;
  /** 実のどこから出るか */
  from: L10n;
  /** 丸抜き 100 に対する取れ高(%)。挽きぐるみは全部なので null */
  yield: number | null;
  color: string;
  body: L10n;
  /** この粉で作っている菓子(menu.ts の id) */
  uses: string[];
};

export const FLOURS: Flour[] = [
  {
    id: "ichiban",
    name: { ja: "一番粉", en: "First flour" },
    reading: { ja: "いちばんこ・更科粉", en: "ichiban-ko (sarashina)" },
    from: { ja: "胚乳の中心", en: "the centre of the endosperm" },
    yield: 20,
    color: "#efe5d6",
    body: {
      ja: "石臼を回して最初に落ちてくる、いちばん白い粉。上品な甘みがあり、香りはほとんどありません。白い餡と合わせても濁らないので、見た目を白く保ちたい菓子に使います。",
      en: "The whitest flour, the first to fall from the quern. Gently sweet and almost scentless. It does not muddy a white bean paste, so it goes into the sweets that need to stay pale.",
    },
    uses: ["suginami-monaka", "sakura-dorayaki", "sobacha-mizuyokan"],
  },
  {
    id: "niban",
    name: { ja: "二番粉", en: "Second flour" },
    reading: { ja: "にばんこ", en: "niban-ko" },
    from: { ja: "胚乳の外側と胚芽", en: "the outer endosperm and the germ" },
    yield: 25,
    color: "#cfc9a4",
    body: {
      ja: "薄く緑がかった粉。香りと甘みの釣り合いがいちばんよく、当店で最もよく使います。そばがきに練るのはこの粉です。",
      en: "A faintly green flour, and the best balance of scent against sweetness. This is the one we use most, and the one we knead into sobagaki.",
    },
    uses: [
      "sobagaki-zenzai",
      "sobagaki-shiruko",
      "yomogi-kusamochi",
      "kuri-soba-yokan",
    ],
  },
  {
    id: "sanban",
    name: { ja: "三番粉", en: "Third flour" },
    reading: { ja: "さんばんこ", en: "sanban-ko" },
    from: { ja: "種皮に近いところ", en: "close to the seed coat" },
    yield: 20,
    color: "#8f8459",
    body: {
      ja: "色が濃く、香りが強く、えぐみも出ます。甘い菓子には強すぎることが多いのですが、塩気や焦げと合わせると釣り合います。",
      en: "Dark, strongly scented, and a little harsh. Usually too much for a sweet on its own — but it comes into balance against salt or char.",
    },
    uses: ["soba-galette", "yukimi-dango"],
  },
  {
    id: "hikigurumi",
    name: { ja: "挽きぐるみ", en: "Whole-grain flour" },
    reading: { ja: "ひきぐるみ・全層粉", en: "hikigurumi" },
    from: { ja: "殻を外した実の全部", en: "the whole hulled grain" },
    yield: null,
    color: "#7d6a4a",
    body: {
      ja: "殻だけ外した実を、分けずに丸ごと挽いたもの。香りが最も立ち、焼き菓子にすると生地が茶色く染まります。挽いた翌日には香りが落ちるので、その日に使い切ります。",
      en: "The hulled grain milled whole, with nothing separated out. It has the most scent of any of them, and it stains a batter brown. The scent is gone by the next day, so a milling is used up the day it is made.",
    },
    uses: ["sobacha-chiffon", "shinsoba-financier"],
  },
];

/**
 * 粉を使わない品。実そのもの・茶・蜂蜜で作るもの。
 * ここに書いておかないと、粉との対応が抜けた品を見つけられない。
 */
export const WITHOUT_FLOUR: string[] = [
  "sobanomi-granola",
  "dattan-sobacha",
  "soba-honey-pudding",
  "sobanomi-anmitsu",
];

/** そば粉と小麦粉の違い。菓子の作り方が変わるところだけ挙げる */
export const VS_WHEAT: { point: L10n; soba: L10n; wheat: L10n }[] = [
  {
    point: { ja: "グルテン", en: "Gluten" },
    soba: { ja: "できない", en: "None" },
    wheat: { ja: "できる", en: "Forms" },
  },
  {
    point: { ja: "生地のまとまり", en: "How a dough holds" },
    soba: {
      ja: "湯で練るか、卵・寒天でつなぐ",
      en: "Kneaded with hot water, or bound with egg or agar",
    },
    wheat: { ja: "こねれば繋がる", en: "Kneading is enough" },
  },
  {
    point: { ja: "香りのもち", en: "How long the scent lasts" },
    soba: { ja: "挽いた翌日には落ちる", en: "Gone by the next day" },
    wheat: { ja: "数週間", en: "Weeks" },
  },
  {
    point: { ja: "焼き色", en: "Colour when baked" },
    soba: { ja: "濃くつく", en: "Dark" },
    wheat: { ja: "淡い", en: "Pale" },
  },
];

/** 粉の id から、その粉で作っている菓子を引く */
export function menuOfFlour(flourId: string) {
  const flour = FLOURS.find((f) => f.id === flourId);
  if (!flour) throw new Error(`知らない粉です: ${flourId}`);
  return flour.uses.map((id) => {
    const item = MENU.find((m) => m.id === id);
    if (!item) throw new Error(`お品書きにない菓子です: ${id}`);
    return item;
  });
}
