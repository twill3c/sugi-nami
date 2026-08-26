import { describe, expect, it } from "vitest";
import {
  ALLERGENS,
  ALLERGEN_LABEL,
  MENU,
  SEASONS,
  SEASON_LABEL,
  formatAllergens,
  formatPrice,
  menuOfMonth,
  menuWithout,
  seasonOfMonth,
  type Allergen,
} from "./menu";
import { LOCALES } from "@/i18n/locale";

describe("お品書きのデータ", () => {
  it("id が重複しない", () => {
    const ids = MENU.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("価格は正の整数(円・税込)", () => {
    for (const m of MENU) {
      expect(Number.isInteger(m.price), m.name.ja).toBe(true);
      expect(m.price, m.name.ja).toBeGreaterThan(0);
    }
  });

  it("アレルゲンは既知の語だけを使い、重複しない", () => {
    for (const m of MENU) {
      for (const a of m.allergens) {
        expect(ALLERGENS).toContain(a);
      }
      expect(new Set(m.allergens).size, m.name.ja).toBe(m.allergens.length);
    }
  });

  it("そばは全品共通なので個別のアレルゲン欄に持たない", () => {
    // 「そば」を個別に持ち始めると、書き忘れた品が安全に見えてしまう。
    // 店全体の注意書き一本に寄せる、という設計をテストで固定する。
    for (const m of MENU) {
      expect(m.allergens as readonly string[], m.name.ja).not.toContain("soba");
      expect(m.allergens as readonly string[], m.name.ja).not.toContain("そば");
    }
  });

  it("原材料の一行には必ずそばが先頭に来る", () => {
    for (const locale of LOCALES) {
      for (const m of MENU) {
        const line = formatAllergens(m, locale);
        const head = locale === "ja" ? "そば粉" : "buckwheat";
        expect(line.startsWith(head), `${m.name.ja} / ${locale}`).toBe(true);
      }
    }
  });
});

describe("二言語", () => {
  it("すべての品が日本語と英語の両方を持つ", () => {
    for (const m of MENU) {
      for (const field of ["name", "reading", "description"] as const) {
        for (const locale of LOCALES) {
          expect(m[field][locale].trim().length, `${m.id}.${field}.${locale}`)
            .toBeGreaterThan(0);
        }
      }
    }
  });

  it("英語が日本語のまま置かれていない(翻訳の抜け)", () => {
    for (const m of MENU) {
      for (const field of ["name", "description"] as const) {
        expect(m[field].en, `${m.id}.${field}`).not.toBe(m[field].ja);
        // 仮名が残っていたら訳し忘れ
        expect(m[field].en, `${m.id}.${field}`).not.toMatch(
          /[぀-ヿ一-龯]/,
        );
      }
    }
  });

  it("アレルゲンと季節の見出しも両言語ぶんある", () => {
    for (const a of ALLERGENS) {
      for (const locale of LOCALES) {
        expect(ALLERGEN_LABEL[a][locale].length, `${a}.${locale}`)
          .toBeGreaterThan(0);
      }
    }
    for (const s of SEASONS) {
      for (const locale of LOCALES) {
        expect(SEASON_LABEL[s][locale].length, `${s}.${locale}`)
          .toBeGreaterThan(0);
      }
    }
  });

  it("説明文は名前をなぞるだけになっていない", () => {
    for (const m of MENU) {
      expect(m.description.ja.length, m.name.ja).toBeGreaterThan(20);
      expect(m.description.en.length, m.name.ja).toBeGreaterThan(20);
    }
  });

  it("価格は言語ごとの書き方になる", () => {
    expect(formatPrice(1280, "ja")).toBe("1,280 円");
    expect(formatPrice(1280, "en")).toBe("¥1,280");
  });
});

describe("seasonOfMonth", () => {
  it("12 月から 2 月は冬(年をまたいでも切れない)", () => {
    expect(seasonOfMonth(12)).toBe("winter");
    expect(seasonOfMonth(1)).toBe("winter");
    expect(seasonOfMonth(2)).toBe("winter");
  });

  it("1 から 12 のすべての月が季節に割り当たる", () => {
    for (let m = 1; m <= 12; m++) {
      expect(
        ["spring", "summer", "autumn", "winter"],
        `${m} 月`,
      ).toContain(seasonOfMonth(m));
    }
  });

  it("どの季節にも菓子が最低ひとつある", () => {
    for (let m = 1; m <= 12; m++) {
      const season = seasonOfMonth(m);
      expect(
        MENU.filter((x) => x.season === season).length,
        season,
      ).toBeGreaterThan(0);
    }
  });
});

describe("menuOfMonth", () => {
  it("通年の品はどの月にも並ぶ", () => {
    const alwaysOn = MENU.filter((m) => m.season === "all");
    for (let month = 1; month <= 12; month++) {
      const served = menuOfMonth(month).map((m) => m.id);
      for (const m of alwaysOn) {
        expect(served, `${month} 月に ${m.name.ja}`).toContain(m.id);
      }
    }
  });

  it("よその季節の菓子は並ばない", () => {
    const july = menuOfMonth(7).map((m) => m.id);
    expect(july).not.toContain("yukimi-dango");
    expect(july).toContain("sobacha-mizuyokan");
  });
});

describe("menuWithout", () => {
  it("除いたアレルゲンを含む品が一つも残らない", () => {
    for (const a of ALLERGENS) {
      for (const item of menuWithout([a])) {
        expect(item.allergens, `${a} を除いたのに ${item.name.ja}`)
          .not.toContain(a);
      }
    }
  });

  it("複数を同時に除ける", () => {
    const excluded: Allergen[] = ["egg", "milk"];
    for (const item of menuWithout(excluded)) {
      expect(item.allergens).not.toContain("egg");
      expect(item.allergens).not.toContain("milk");
    }
  });

  it("何も除かなければ全品が残る", () => {
    expect(menuWithout([]).length).toBe(MENU.length);
  });
});
