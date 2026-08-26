import { describe, expect, it } from "vitest";
import { PLAN_AFTER, PLAN_BEFORE, STORY } from "./story";
import { SHOP } from "./shop";
import { LOCALES } from "@/i18n/locale";

describe("年表", () => {
  it("年が古い順に並ぶ", () => {
    const years = STORY.map((e) => e.year);
    expect([...years].sort((a, b) => a - b)).toEqual(years);
  });

  it("同じ年が二度出てこない", () => {
    const years = STORY.map((e) => e.year);
    expect(new Set(years).size).toBe(years.length);
  });

  it("最初の出来事は建った年、最後は店を開けた年", () => {
    // 年表と shop.ts が別々の年を持ってしまうのを防ぐ
    expect(STORY[0].year).toBe(SHOP.building.builtYear);
    expect(STORY[STORY.length - 1].year).toBe(SHOP.founded);
  });

  it("空き家だった期間が年表のなかにある", () => {
    // 「人が住まなくなる」から「直す」までが空白であることが、この店の話の芯
    const empty = STORY.filter((e) => !e.inhabited);
    expect(empty.length).toBeGreaterThan(0);
    const first = STORY.findIndex((e) => !e.inhabited);
    const last = STORY.map((e) => e.inhabited).lastIndexOf(false);
    // 空き家の期間は連続していて、途中に居住年が挟まらない
    for (let i = first; i <= last; i++) {
      expect(STORY[i].inhabited, `${STORY[i].year}`).toBe(false);
    }
  });

  it("すべての出来事が両言語ぶんある", () => {
    for (const e of STORY) {
      for (const field of ["title", "body"] as const) {
        for (const locale of LOCALES) {
          expect(e[field][locale].trim().length, `${e.year}.${field}.${locale}`)
            .toBeGreaterThan(0);
        }
        expect(e[field].en, `${e.year}.${field}`).not.toMatch(/[぀-ヿ一-龯]/);
      }
    }
  });
});

describe("間取り", () => {
  it("改修の前後で部屋の区切りが動いていない", () => {
    // 「用途だけが変わって、間取りは変えていない」がこの改修の要点。
    // 図が勝手に部屋を動かしてしまうと話と食い違う
    expect(PLAN_AFTER.length).toBe(PLAN_BEFORE.length);
    for (const [i, floor] of PLAN_BEFORE.entries()) {
      const after = PLAN_AFTER[i];
      expect(after.floor.ja).toBe(floor.floor.ja);
      expect(after.rooms.length, floor.floor.ja).toBe(floor.rooms.length);
      for (const [j, room] of floor.rooms.entries()) {
        const a = after.rooms[j];
        expect([a.x, a.y, a.w, a.h], `${floor.floor.ja} の ${j} 番目`).toEqual([
          room.x,
          room.y,
          room.w,
          room.h,
        ]);
      }
    }
  });

  it("用途が変わった部屋は名前も変わっている", () => {
    for (const [i, floor] of PLAN_BEFORE.entries()) {
      for (const [j, room] of floor.rooms.entries()) {
        const a = PLAN_AFTER[i].rooms[j];
        if (room.changed) {
          expect(a.label.ja, `${room.label.ja}`).not.toBe(room.label.ja);
        } else {
          expect(a.label.ja).toBe(room.label.ja);
        }
      }
    }
  });

  it("部屋が図の枠(0-100)からはみ出さない", () => {
    for (const plan of [PLAN_BEFORE, PLAN_AFTER]) {
      for (const floor of plan) {
        for (const r of floor.rooms) {
          expect(r.x).toBeGreaterThanOrEqual(0);
          expect(r.y).toBeGreaterThanOrEqual(0);
          expect(r.x + r.w, r.label.ja).toBeLessThanOrEqual(100);
          expect(r.y + r.h, r.label.ja).toBeLessThanOrEqual(100);
        }
      }
    }
  });

  it("同じ階のなかで部屋が重ならない", () => {
    for (const plan of [PLAN_BEFORE, PLAN_AFTER]) {
      for (const floor of plan) {
        for (let i = 0; i < floor.rooms.length; i++) {
          for (let j = i + 1; j < floor.rooms.length; j++) {
            const a = floor.rooms[i];
            const b = floor.rooms[j];
            const overlap =
              a.x < b.x + b.w &&
              b.x < a.x + a.w &&
              a.y < b.y + b.h &&
              b.y < a.y + a.h;
            expect(overlap, `${a.label.ja} と ${b.label.ja}`).toBe(false);
          }
        }
      }
    }
  });
});
