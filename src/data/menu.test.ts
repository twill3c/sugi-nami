import { describe, expect, it } from "vitest";
import {
  ALLERGENS,
  MENU,
  menuOfMonth,
  menuWithout,
  seasonOfMonth,
  type Allergen,
} from "./menu";

describe("お品書きのデータ", () => {
  it("id が重複しない", () => {
    const ids = MENU.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("価格は正の整数(円・税込)", () => {
    for (const m of MENU) {
      expect(Number.isInteger(m.price), m.name).toBe(true);
      expect(m.price, m.name).toBeGreaterThan(0);
    }
  });

  it("アレルゲンは既知の語だけを使い、重複しない", () => {
    for (const m of MENU) {
      for (const a of m.allergens) {
        expect(ALLERGENS).toContain(a);
      }
      expect(new Set(m.allergens).size, m.name).toBe(m.allergens.length);
    }
  });

  it("そばは全品共通なので個別のアレルゲン欄に書かない", () => {
    // 「そば」を個別に書き始めると、書き忘れた品が安全に見えてしまう。
    // 店全体の注意書き一本に寄せる、という設計をテストで固定する。
    for (const m of MENU) {
      expect(m.allergens as readonly string[], m.name).not.toContain("そば");
    }
  });

  it("説明文は空でなく、名前をなぞるだけになっていない", () => {
    for (const m of MENU) {
      expect(m.description.length, m.name).toBeGreaterThan(20);
      expect(m.description, m.name).not.toBe(m.name);
    }
  });

  it("どの季節にも季節の菓子が最低ひとつある", () => {
    for (const season of ["春", "夏", "秋", "冬"] as const) {
      expect(
        MENU.filter((m) => m.season === season).length,
        season,
      ).toBeGreaterThan(0);
    }
  });
});

describe("seasonOfMonth", () => {
  it("12 月から 2 月は冬(年をまたいでも切れない)", () => {
    expect(seasonOfMonth(12)).toBe("冬");
    expect(seasonOfMonth(1)).toBe("冬");
    expect(seasonOfMonth(2)).toBe("冬");
  });

  it("1 から 12 のすべての月が季節に割り当たる", () => {
    for (let m = 1; m <= 12; m++) {
      expect(["春", "夏", "秋", "冬"], `${m} 月`).toContain(seasonOfMonth(m));
    }
  });
});

describe("menuOfMonth", () => {
  it("通年の品はどの月にも並ぶ", () => {
    const alwaysOn = MENU.filter((m) => m.season === "通年");
    for (let month = 1; month <= 12; month++) {
      const served = menuOfMonth(month).map((m) => m.id);
      for (const m of alwaysOn) {
        expect(served, `${month} 月に ${m.name}`).toContain(m.id);
      }
    }
  });

  it("よその季節の菓子は並ばない", () => {
    const july = menuOfMonth(7);
    expect(july.map((m) => m.id)).not.toContain("yukimi-dango");
    expect(july.map((m) => m.id)).toContain("sobacha-mizuyokan");
  });
});

describe("menuWithout", () => {
  it("除いたアレルゲンを含む品が一つも残らない", () => {
    for (const a of ALLERGENS) {
      for (const item of menuWithout([a])) {
        expect(item.allergens, `${a} を除いたのに ${item.name}`).not.toContain(
          a,
        );
      }
    }
  });

  it("複数を同時に除ける", () => {
    const excluded: Allergen[] = ["卵", "乳"];
    for (const item of menuWithout(excluded)) {
      expect(item.allergens).not.toContain("卵");
      expect(item.allergens).not.toContain("乳");
    }
  });

  it("何も除かなければ全品が残る", () => {
    expect(menuWithout([]).length).toBe(MENU.length);
  });
});
