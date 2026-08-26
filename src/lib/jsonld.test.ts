import { describe, expect, it } from "vitest";
import { alternates, breadcrumbJsonLd, cafeJsonLd } from "./jsonld";
import { MENU } from "@/data/menu";
import { SHOP, formatPeriod, periodOfMonth } from "@/data/shop";
import { LOCALES } from "@/i18n/locale";

describe("構造化データ", () => {
  it("両言語で CafeOrCoffeeShop として組み立つ", () => {
    for (const locale of LOCALES) {
      const ld = cafeJsonLd(locale);
      expect(ld["@context"]).toBe("https://schema.org");
      expect(ld["@type"]).toBe("CafeOrCoffeeShop");
      expect(ld.name).toBe(SHOP.name[locale]);
      expect(ld.inLanguage.startsWith(locale)).toBe(true);
    }
  });

  it("架空である旨を構造化データ側にも書いている", () => {
    expect(cafeJsonLd("ja").disambiguatingDescription).toContain("架空");
    expect(cafeJsonLd("en").disambiguatingDescription).toContain(
      "does not exist",
    );
  });

  it("番地・電話番号を出力しない(実在の連絡先と誤認させない)", () => {
    for (const locale of LOCALES) {
      const serialized = JSON.stringify(cafeJsonLd(locale));
      expect(serialized).not.toContain("telephone");
      expect(serialized).not.toContain("streetAddress");
    }
  });

  it("営業時間は shop.ts の期間と同数・同内容", () => {
    const ld = cafeJsonLd("ja");
    expect(ld.openingHoursSpecification.length).toBe(
      SHOP.openingPeriods.length,
    );
    for (const [i, spec] of ld.openingHoursSpecification.entries()) {
      const period = SHOP.openingPeriods[i];
      expect(spec.opens).toBe(period.opens);
      expect(spec.closes).toBe(period.closes);
      expect(spec.dayOfWeek.length).toBe(period.days.length);
    }
  });

  it("お品書きの全品が MenuSection のどこかに一度だけ現れる", () => {
    for (const locale of LOCALES) {
      const listed = cafeJsonLd(locale).hasMenu.hasMenuSection.flatMap((s) =>
        s.hasMenuItem.map((i) => i.name),
      );
      expect(listed.length, locale).toBe(MENU.length);
      expect(new Set(listed).size, locale).toBe(MENU.length);
    }
  });

  it("どの品のアレルゲン表記にもそばが入る", () => {
    for (const [locale, head] of [
      ["ja", "そば"],
      ["en", "buckwheat"],
    ] as const) {
      for (const section of cafeJsonLd(locale).hasMenu.hasMenuSection) {
        for (const item of section.hasMenuItem) {
          expect(item.additionalProperty[0].value, item.name).toContain(head);
        }
      }
    }
  });
});

describe("言語の相互参照", () => {
  it("日本語版と英語版が互いを指す", () => {
    const a = alternates("/menu");
    expect(a.languages.ja).toMatch(/\/menu$/);
    expect(a.languages.en).toMatch(/\/en\/menu$/);
  });

  it("英語のページからでも同じ組を返す(接頭辞を二重に付けない)", () => {
    const a = alternates("/en/menu");
    expect(a.languages.ja).toMatch(/\/menu$/);
    expect(a.languages.en).toMatch(/\/en\/menu$/);
    expect(a.languages.en).not.toMatch(/\/en\/en/);
  });

  it("トップページでも壊れない", () => {
    const a = alternates("/en");
    expect(a.languages.ja).toMatch(/\.app\/$/);
    expect(a.languages.en).toMatch(/\/en$/);
  });
});

describe("パンくず", () => {
  it("position が 1 から順に振られ、絶対 URL になる", () => {
    const bc = breadcrumbJsonLd(
      [
        { name: "杉なみ", path: "/" },
        { name: "お品書き", path: "/menu" },
      ],
      "ja",
    );
    expect(bc.itemListElement.map((e) => e.position)).toEqual([1, 2]);
    for (const e of bc.itemListElement) {
      expect(e.item.startsWith("https://")).toBe(true);
    }
  });

  it("英語のパンくずは /en 配下を指す", () => {
    const bc = breadcrumbJsonLd([{ name: "Menu", path: "/menu" }], "en");
    expect(bc.itemListElement[0].item).toMatch(/\/en\/menu$/);
  });
});

describe("営業期間", () => {
  it("1 から 12 のすべての月がどれかの期間に属する", () => {
    for (let m = 1; m <= 12; m++) {
      expect(() => periodOfMonth(m), `${m} 月`).not.toThrow();
    }
  });

  it("月が二つの期間に重複して属さない", () => {
    for (let m = 1; m <= 12; m++) {
      const hits = SHOP.openingPeriods.filter((p) => p.months.includes(m));
      expect(hits.length, `${m} 月`).toBe(1);
    }
  });

  it("表示は日曜が末尾に来る並びになる", () => {
    // 曜日番号のまま並べると日曜が先頭に来る。表示順の意図をテストで固定する。
    const winter = SHOP.openingPeriods.find((p) => p.months.includes(1))!;
    expect(formatPeriod(winter, "ja")).toBe("金・土・日 11:00–16:00");
    expect(formatPeriod(winter, "en")).toBe("Fri, Sat, Sun 11:00–16:00");
  });
});
