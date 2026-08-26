import { describe, expect, it } from "vitest";
import {
  FLOURS,
  GRAIN_LAYERS,
  VS_WHEAT,
  WITHOUT_FLOUR,
  menuOfFlour,
} from "./soba";
import { MENU } from "./menu";
import { LOCALES } from "@/i18n/locale";

describe("粉とお品書きの対応", () => {
  it("お品書きの全品が、どれかの粉か「粉を使わない品」に必ず割り当たる", () => {
    // 菓子を足したのに粉の話が古いまま、を防ぐ要のテスト。
    // どちらにも入っていない品があれば、ここで落ちる
    const assigned = [...FLOURS.flatMap((f) => f.uses), ...WITHOUT_FLOUR];
    const missing = MENU.filter((m) => !assigned.includes(m.id)).map(
      (m) => m.id,
    );
    expect(missing).toEqual([]);
  });

  it("同じ菓子が二つの粉に割り当たらない", () => {
    const assigned = [...FLOURS.flatMap((f) => f.uses), ...WITHOUT_FLOUR];
    const dup = assigned.filter((id, i) => assigned.indexOf(id) !== i);
    expect(dup).toEqual([]);
  });

  it("存在しない菓子を指していない", () => {
    const ids = MENU.map((m) => m.id);
    for (const f of FLOURS) {
      for (const id of f.uses) {
        expect(ids, `${f.name.ja} が指す ${id}`).toContain(id);
      }
    }
    for (const id of WITHOUT_FLOUR) {
      expect(ids, `粉を使わない品の ${id}`).toContain(id);
    }
  });

  it("どの粉にも菓子が最低ひとつある", () => {
    for (const f of FLOURS) {
      expect(f.uses.length, f.name.ja).toBeGreaterThan(0);
    }
  });

  it("menuOfFlour が実物の菓子を返す", () => {
    for (const f of FLOURS) {
      const items = menuOfFlour(f.id);
      expect(items.length).toBe(f.uses.length);
      for (const item of items) {
        expect(item.name.ja.length).toBeGreaterThan(0);
      }
    }
  });

  it("知らない粉を引いたら落ちる(黙って空を返さない)", () => {
    expect(() => menuOfFlour("goban")).toThrow();
  });
});

describe("粉のデータ", () => {
  it("id が重複しない", () => {
    const ids = FLOURS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("挽き分けの取れ高の合計が 100% を超えない", () => {
    // 一番・二番・三番は同じ一粒を分けたもの。合計が実を超えたら数が嘘になる
    const total = FLOURS.filter((f) => f.yield !== null).reduce(
      (a, f) => a + (f.yield ?? 0),
      0,
    );
    expect(total).toBeGreaterThan(0);
    expect(total).toBeLessThanOrEqual(100);
  });

  it("挽きぐるみだけは取れ高を持たない(分けていないため)", () => {
    const whole = FLOURS.find((f) => f.id === "hikigurumi");
    expect(whole?.yield).toBeNull();
    for (const f of FLOURS.filter((x) => x.id !== "hikigurumi")) {
      expect(f.yield, f.name.ja).toBeGreaterThan(0);
    }
  });

  it("色は 6 桁の 16 進で書かれている", () => {
    for (const f of FLOURS) {
      expect(f.color, f.name.ja).toMatch(/^#[0-9a-f]{6}$/);
    }
    for (const l of GRAIN_LAYERS) {
      expect(l.color, l.name.ja).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});

describe("断面の層", () => {
  it("外側から内側へ、必ず小さくなる順に並ぶ", () => {
    // 図は配列の順に重ねて描くので、順が崩れると内側の層が隠れる
    for (let i = 1; i < GRAIN_LAYERS.length; i++) {
      expect(
        GRAIN_LAYERS[i].scale,
        `${GRAIN_LAYERS[i].name.ja} が ${GRAIN_LAYERS[i - 1].name.ja} より外`,
      ).toBeLessThan(GRAIN_LAYERS[i - 1].scale);
    }
  });

  it("いちばん外の層が 1、いちばん内が 0 より大きい", () => {
    expect(GRAIN_LAYERS[0].scale).toBe(1);
    expect(GRAIN_LAYERS[GRAIN_LAYERS.length - 1].scale).toBeGreaterThan(0);
  });
});

describe("二言語", () => {
  it("粉・層・比較表のすべてが両言語ぶんある", () => {
    for (const f of FLOURS) {
      for (const field of ["name", "reading", "from", "body"] as const) {
        for (const locale of LOCALES) {
          expect(f[field][locale].trim().length, `${f.id}.${field}.${locale}`)
            .toBeGreaterThan(0);
        }
      }
      expect(f.body.en, f.id).not.toMatch(/[぀-ヿ一-龯]/);
    }
    for (const l of GRAIN_LAYERS) {
      expect(l.body.en, l.id).not.toMatch(/[぀-ヿ一-龯]/);
    }
    for (const v of VS_WHEAT) {
      for (const field of ["point", "soba", "wheat"] as const) {
        expect(v[field].en, `${v.point.ja}.${field}`).not.toMatch(
          /[぀-ヿ一-龯]/,
        );
      }
    }
  });
});
