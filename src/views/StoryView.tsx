import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Timeline } from "@/components/Timeline";
import { FloorPlan } from "@/components/FloorPlan";
import { GrainRule, Kominka } from "@/components/Motifs";
import { PLAN_AFTER, PLAN_BEFORE, STORY } from "@/data/story";
import { SHOP } from "@/data/shop";
import { alternates } from "@/lib/jsonld";
import { localePath, t, type L10n, type Locale } from "@/i18n/locale";

const EMPTY_FROM = STORY.find((e) => !e.inhabited)!.year;
const EMPTY_TO = STORY.filter((e) => !e.inhabited).at(-1)!.year;
const EMPTY_YEARS = EMPTY_TO - EMPTY_FROM;

const COPY = {
  eyebrow: { ja: "家のこと", en: "The house" },
  title: {
    ja: "蚕の家を、菓子の家にする",
    en: "From a house for worms to a house for sweets",
  },
  lede: {
    ja: `この建物は人のために建てられていません。蚕のために建てられ、蚕がいなくなったあと ${EMPTY_YEARS} 年ほど空いていました。いま客席になっているのは、かつて蚕を飼っていた部屋です。`,
    en: `This building was not put up for people. It was put up for silkworms, and after the worms went it stood empty for some ${EMPTY_YEARS} years. The room you sit in now is the room the worms were kept in.`,
  },
  timeline: { ja: "年表", en: "What happened, and when" },
  timelineNote: {
    ja: "節と節のあいだの長さは、実際に空いた年数に比例させています。中を抜いた節は、家に人がいなかった年。",
    en: "The distance between two marks is in proportion to the years that actually passed. Hollow marks are years when nobody lived here.",
  },
  plans: { ja: "間取りは、変えていない", en: "The plan did not change" },
  plansBody: {
    ja: "改修で新しくしたのは屋根と床だけです。柱を一本も抜いていないので、部屋の区切りは建った当時のまま。変わったのは、それぞれの部屋が何をする場所かということだけでした。",
    en: "The repair replaced the roof and the floors, and nothing else. Not one pillar was taken out, so the rooms are divided exactly as they were in 1904. All that changed was what each room is for.",
  },
  before: { ja: "改修前 — 蚕の家", en: "Before — a house for silkworms" },
  after: { ja: "改修後 — 菓子の家", en: "After — a house for sweets" },
  material: { ja: "残したもの", en: "What was kept" },
  toAccess: {
    ja: "実際に来ていただくには →",
    en: "How to actually get here →",
  },
} satisfies Record<string, L10n>;

const KEPT: { title: L10n; body: L10n }[] = [
  {
    title: { ja: "松の梁", en: "The pine beam" },
    body: {
      ja: "太い一本が家の端から端まで通っています。煤で黒いのは、囲炉裏を焚いていた百年ぶんです。洗っていません。",
      en: "One thick beam runs the whole length of the house. It is black with a century of hearth soot, and we have not washed it.",
    },
  },
  {
    title: { ja: "蚕室の窓", en: "The silkworm windows" },
    body: {
      ja: "横一列に並ぶ窓は、蚕に風を通すためのものでした。板でふさがれていたのを開け直しています。二階が明るいのはこの窓のおかげです。",
      en: "The row of windows was there to move air over the worms. They had been boarded up; we opened them again. They are the reason the upper floor is bright.",
    },
  },
  {
    title: { ja: "土間", en: "The earth floor" },
    body: {
      ja: "桑を刻んでいた土間を、そのまま厨房にしています。夏でも足元が冷たいので、餡を炊くのに向いています。",
      en: "The earth floor where mulberry was chopped is now the kitchen. It stays cold underfoot even in August, which suits the boiling of bean paste.",
    },
  },
];

export function storyMetadata(locale: Locale): Metadata {
  return {
    title: t(COPY.eyebrow, locale),
    description:
      locale === "ja"
        ? `${SHOP.building.builtYear} 年に養蚕農家として建ち、${EMPTY_YEARS} 年ほど空き家だった建物を、${SHOP.founded} 年にそば菓子の店として開けるまでの年表。`
        : `Built as a silkworm farmhouse in ${SHOP.building.builtYear}, left empty for some ${EMPTY_YEARS} years, and opened as a buckwheat confectionery in ${SHOP.founded}.`,
    alternates: alternates(localePath("/story", locale)),
  };
}

export function StoryView({ locale }: { locale: Locale }) {
  return (
    <Shell locale={locale}>
      <div className="mx-auto max-w-3xl px-5 py-20">
        <header>
          <p className="text-xs tracking-[0.3em] text-sobacha">
            {t(COPY.eyebrow, locale)}
          </p>
          <h1 className="mt-4 font-mincho text-3xl sm:text-4xl leading-snug tracking-[0.08em] text-kinari">
            {t(COPY.title, locale)}
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-usuzumi">
            {t(COPY.lede, locale)}
          </p>
        </header>

        <Kominka className="mx-auto mt-14 w-full max-w-sm text-hari" />

        <GrainRule className="my-14" />

        <section aria-labelledby="timeline-heading">
          <h2
            id="timeline-heading"
            className="font-mincho text-xl tracking-[0.15em] text-kinari"
          >
            {t(COPY.timeline, locale)}
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-usuzumi">
            {t(COPY.timelineNote, locale)}
          </p>

          <div className="mt-10">
            <Timeline locale={locale} />
          </div>
        </section>

        <GrainRule className="my-16" />

        <section aria-labelledby="plans-heading">
          <h2
            id="plans-heading"
            className="font-mincho text-xl tracking-[0.15em] text-kinari"
          >
            {t(COPY.plans, locale)}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-kinari/85">
            {t(COPY.plansBody, locale)}
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <FloorPlan
              plan={PLAN_BEFORE}
              locale={locale}
              title={t(COPY.before, locale)}
              tone="before"
            />
            <FloorPlan
              plan={PLAN_AFTER}
              locale={locale}
              title={t(COPY.after, locale)}
              tone="after"
            />
          </div>
        </section>

        <GrainRule className="my-16" />

        <section aria-labelledby="kept-heading">
          <h2
            id="kept-heading"
            className="font-mincho text-xl tracking-[0.15em] text-kinari"
          >
            {t(COPY.material, locale)}
          </h2>
          <dl className="mt-8 space-y-8">
            {KEPT.map((k) => (
              <div key={k.title.ja} className="border-l border-hari pl-5">
                <dt className="font-mincho text-lg text-andon">
                  {t(k.title, locale)}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-kinari/85">
                  {t(k.body, locale)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-16">
          <Link
            href={localePath("/access", locale)}
            className="text-sm text-andon hover:underline"
          >
            {t(COPY.toAccess, locale)}
          </Link>
        </p>
      </div>
    </Shell>
  );
}
