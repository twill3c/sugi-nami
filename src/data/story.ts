import type { L10n } from "@/i18n/locale";
import { SHOP } from "./shop";

/**
 * 古民家の来歴。
 *
 * 建った年と店を開けた年は shop.ts が持っているので、ここでは重ねて書かない。
 * 年表の両端がその二つと一致することは story.test.ts が確かめる。
 */

export type StoryEvent = {
  year: number;
  title: L10n;
  body: L10n;
  /** 家に人がいた期間かどうか。年表の帯の濃さに使う */
  inhabited: boolean;
};

export const STORY: StoryEvent[] = [
  {
    year: SHOP.building.builtYear,
    title: { ja: "建つ", en: "Built" },
    body: {
      ja: "蚕を飼うための家として建った。二階の南側をぜんぶ蚕室にあて、窓を横一列に並べてある。人の住みごこちより、蚕の風通しが先に決まった家。",
      en: "Put up as a house for silkworms. The whole south side of the upper floor was given over to the worms, with windows in a single row for the draught. The airflow was settled before anyone's comfort was.",
    },
    inhabited: true,
  },
  {
    year: 1935,
    title: { ja: "いちばん忙しい頃", en: "The busiest years" },
    body: {
      ja: "戸隠の斜面はどこも桑畑だった。この家では年に四度、蚕を掃き立てていた。一階の土間で桑を刻む音が、夜通し続いたという。",
      en: "Every slope in Togakushi was under mulberry. This house raised four broods a year. They say the sound of mulberry being chopped on the earth floor went on all night.",
    },
    inhabited: true,
  },
  {
    year: 1958,
    title: { ja: "蚕をやめる", en: "The worms stop" },
    body: {
      ja: "化学繊維に押されて生糸の値が落ち、養蚕をやめた。二階は物置になり、蚕室の窓は板でふさがれた。",
      en: "Synthetic fibre pushed the price of raw silk down, and the family gave up sericulture. The upper floor became storage and the silkworm windows were boarded over.",
    },
    inhabited: true,
  },
  {
    year: 1974,
    title: { ja: "人が住まなくなる", en: "The house empties" },
    body: {
      ja: "最後の住人が里に下りた。以後四十年あまり、屋根に雪が落ちるままになる。",
      en: "The last resident moved down to the valley. For the next forty-odd years the snow was left to land on the roof as it liked.",
    },
    inhabited: false,
  },
  {
    year: 2016,
    title: { ja: "見つける", en: "Found" },
    body: {
      ja: "屋根は北側が半分抜け、床は踏むと沈んだ。それでも梁は無事だった。松の梁は、太い一本が家の端から端まで通っている。",
      en: "Half the north roof was gone and the floor gave underfoot. The beams, though, were sound — one thick pine beam runs the whole length of the house, end to end.",
    },
    inhabited: false,
  },
  {
    year: 2018,
    title: { ja: "直す", en: "Repaired" },
    body: {
      ja: "屋根と床を新しくし、梁と柱と土間はそのまま残した。板でふさがれていた蚕室の窓を開け直したら、二階が明るくなった。ここを客席にすると決めたのはそのとき。",
      en: "New roof, new floors; the beams, the pillars and the earth floor left as they were. When the boarded silkworm windows were opened again, the upper floor filled with light. That was when it was decided the seats would go there.",
    },
    inhabited: false,
  },
  {
    year: SHOP.founded,
    title: { ja: "開ける", en: "Opened" },
    body: {
      ja: "そば粉の菓子だけを出す店として開けた。麺は出さない。戸隠でそばを名乗って麺を出さないのは物好きだと言われたが、粉のうまさは甘いもののほうがよく分かる。",
      en: "Opened as a shop that serves only buckwheat sweets. No noodles. Calling yourself buckwheat in Togakushi and serving no noodles is thought eccentric — but the flour is easier to taste in something sweet.",
    },
    inhabited: true,
  },
];

/** 間取りの一室 */
export type Room = {
  /** 図の中の位置(0-100 の座標系) */
  x: number;
  y: number;
  w: number;
  h: number;
  label: L10n;
  /** 改修で用途が変わった部屋を目立たせる */
  changed: boolean;
};

/** 改修前 — 一階と二階を一枚に並べる */
export const PLAN_BEFORE: { floor: L10n; rooms: Room[] }[] = [
  {
    floor: { ja: "二階", en: "Upper floor" },
    rooms: [
      {
        x: 2,
        y: 2,
        w: 96,
        h: 40,
        label: { ja: "蚕室", en: "Silkworm room" },
        changed: true,
      },
    ],
  },
  {
    floor: { ja: "一階", en: "Ground floor" },
    rooms: [
      {
        x: 2,
        y: 2,
        w: 34,
        h: 40,
        label: { ja: "土間", en: "Earth floor" },
        changed: true,
      },
      {
        x: 38,
        y: 2,
        w: 34,
        h: 40,
        label: { ja: "座敷", en: "Tatami room" },
        changed: true,
      },
      {
        x: 74,
        y: 2,
        w: 24,
        h: 40,
        label: { ja: "納戸", en: "Store" },
        changed: false,
      },
    ],
  },
];

/** 改修後 — 部屋の区切りは動かしていない。用途だけが変わる */
export const PLAN_AFTER: { floor: L10n; rooms: Room[] }[] = [
  {
    floor: { ja: "二階", en: "Upper floor" },
    rooms: [
      {
        x: 2,
        y: 2,
        w: 96,
        h: 40,
        label: { ja: "客席", en: "Dining room" },
        changed: true,
      },
    ],
  },
  {
    floor: { ja: "一階", en: "Ground floor" },
    rooms: [
      {
        x: 2,
        y: 2,
        w: 34,
        h: 40,
        label: { ja: "厨房", en: "Kitchen" },
        changed: true,
      },
      {
        x: 38,
        y: 2,
        w: 34,
        h: 40,
        label: { ja: "座敷(客席)", en: "Tatami seating" },
        changed: true,
      },
      {
        x: 74,
        y: 2,
        w: 24,
        h: 40,
        label: { ja: "納戸", en: "Store" },
        changed: false,
      },
    ],
  },
];
