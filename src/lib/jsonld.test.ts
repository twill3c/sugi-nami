import { describe, expect, it } from "vitest";
import { breadcrumbJsonLd, cafeJsonLd } from "./jsonld";
import { MENU } from "@/data/menu";
import { SHOP, formatPeriod, periodOfMonth } from "@/data/shop";

const ld = cafeJsonLd();

describe("構造化データ", () => {
  it("CafeOrCoffeeShop として組み立つ", () => {
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("CafeOrCoffeeShop");
    expect(ld.name).toBe(SHOP.name);
  });

  it("架空である旨を構造化データ側にも書いている", () => {
    expect(ld.disambiguatingDescription).toContain("架空");
  });

  it("番地・電話番号を出力しない(実在の連絡先と誤認させない)", () => {
    const serialized = JSON.stringify(ld);
    expect(serialized).not.toContain("telephone");
    expect(serialized).not.toContain("streetAddress");
  });

  it("営業時間は shop.ts の期間と同数・同内容", () => {
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
    const listed = ld.hasMenu.hasMenuSection.flatMap((s) =>
      s.hasMenuItem.map((i) => i.name),
    );
    expect(listed.length).toBe(MENU.length);
    expect(new Set(listed).size).toBe(MENU.length);
    for (const m of MENU) {
      expect(listed, m.name).toContain(m.name);
    }
  });

  it("どの品のアレルゲン表記にも「そば」が入る", () => {
    for (const section of ld.hasMenu.hasMenuSection) {
      for (const item of section.hasMenuItem) {
        const allergen = item.additionalProperty[0].value;
        expect(allergen, item.name).toContain("そば");
      }
    }
  });
});

describe("パンくず", () => {
  it("position が 1 から順に振られ、絶対 URL になる", () => {
    const bc = breadcrumbJsonLd([
      { name: "杉なみ", path: "/" },
      { name: "お品書き", path: "/menu" },
    ]);
    expect(bc.itemListElement.map((e) => e.position)).toEqual([1, 2]);
    for (const e of bc.itemListElement) {
      expect(e.item.startsWith("https://")).toBe(true);
    }
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
      const hits = SHOP.openingPeriods.filter((p) => p.months?.includes(m));
      expect(hits.length, `${m} 月`).toBe(1);
    }
  });

  it("表示は日曜が末尾に来る並びになる", () => {
    // 曜日番号のまま並べると日曜が先頭に来る。表示順の意図をテストで固定する。
    const winter = SHOP.openingPeriods.find((p) => p.months?.includes(1));
    expect(winter).toBeDefined();
    expect(formatPeriod(winter!)).toBe("金・土・日 11:00–16:00");
  });
});
