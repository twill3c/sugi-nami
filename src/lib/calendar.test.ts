import { describe, expect, it } from "vitest";
import {
  dayState,
  daysInMonth,
  matchesClosure,
  monthGrid,
  nextMonths,
  openDaysOfMonth,
} from "./calendar";
import { SHOP, periodOfMonth } from "@/data/shop";

describe("毎年の休みの区間", () => {
  const newYear = SHOP.annualClosures.find(
    (c) => c.from.month === 12 && c.from.day === 29,
  )!;

  it("年をまたぐ区間が両側でつながる", () => {
    // 12/29 → 1/3 は from > to なので、素朴な範囲比較では一日も当たらない
    expect(matchesClosure(newYear, 12, 29)).toBe(true);
    expect(matchesClosure(newYear, 12, 31)).toBe(true);
    expect(matchesClosure(newYear, 1, 1)).toBe(true);
    expect(matchesClosure(newYear, 1, 3)).toBe(true);
  });

  it("区間の外は当たらない", () => {
    expect(matchesClosure(newYear, 12, 28)).toBe(false);
    expect(matchesClosure(newYear, 1, 4)).toBe(false);
    expect(matchesClosure(newYear, 7, 1)).toBe(false);
  });

  it("年をまたがない区間は素直に当たる", () => {
    const swap = SHOP.annualClosures.find((c) => c.from.month === 3)!;
    expect(matchesClosure(swap, 3, 29)).toBe(false);
    expect(matchesClosure(swap, 3, 30)).toBe(true);
    expect(matchesClosure(swap, 4, 2)).toBe(true);
    expect(matchesClosure(swap, 4, 3)).toBe(false);
  });
});

describe("日ごとの状態", () => {
  it("定休の曜日は開かない", () => {
    // 2026 年 7 月 1 日は水曜。通常期の営業曜日に水は入っていない
    const d = dayState(2026, 7, 1);
    expect(d.weekday).toBe(3);
    expect(d.state).toBe("regular");
  });

  it("営業曜日は開く", () => {
    // 2026 年 7 月 3 日は金曜
    const d = dayState(2026, 7, 3);
    expect(d.weekday).toBe(5);
    expect(d.state).toBe("open");
  });

  it("冬期は月曜も閉まる(通常期は開く)", () => {
    // 2026 年 6 月 1 日と 2027 年 2 月 1 日は、どちらも月曜
    expect(dayState(2026, 6, 1).weekday).toBe(1);
    expect(dayState(2026, 6, 1).state).toBe("open");
    expect(dayState(2027, 2, 1).weekday).toBe(1);
    expect(dayState(2027, 2, 1).state).toBe("regular");
  });

  it("毎年の休みは営業曜日より優先される", () => {
    // 2027 年 1 月 1 日は金曜。冬期の営業曜日だが年末年始で閉まる
    const d = dayState(2027, 1, 1);
    expect(d.weekday).toBe(5);
    expect(d.state).toBe("annual");
    expect(d.reason?.ja).toBe("年末年始");
  });

  it("どの日もかならず三つの状態のどれかになる", () => {
    for (let m = 1; m <= 12; m++) {
      for (let d = 1; d <= daysInMonth(2026, m); d++) {
        expect(["open", "regular", "annual"], `${m}/${d}`).toContain(
          dayState(2026, m, d).state,
        );
      }
    }
  });

  it("開いている日の曜日は、その月の営業曜日に必ず含まれる", () => {
    for (let m = 1; m <= 12; m++) {
      const allowed = periodOfMonth(m).days;
      for (let d = 1; d <= daysInMonth(2026, m); d++) {
        const day = dayState(2026, m, d);
        if (day.state === "open") {
          expect(allowed, `${m}/${d}`).toContain(day.weekday);
        }
      }
    }
  });
});

describe("日数", () => {
  it("うるう年の 2 月は 29 日", () => {
    expect(daysInMonth(2028, 2)).toBe(29);
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2100, 2)).toBe(28); // 100 の倍数は平年
  });
});

describe("升目", () => {
  it("すべての週がちょうど 7 枠", () => {
    for (let m = 1; m <= 12; m++) {
      for (const week of monthGrid(2026, m)) {
        expect(week.length, `${m} 月`).toBe(7);
      }
    }
  });

  it("枠の日付は 1 から月末まで、抜けも重複もない", () => {
    for (let m = 1; m <= 12; m++) {
      const days = monthGrid(2026, m)
        .flat()
        .filter((c) => c !== null)
        .map((c) => c!.day);
      expect(days, `${m} 月`).toEqual(
        Array.from({ length: daysInMonth(2026, m) }, (_, i) => i + 1),
      );
    }
  });

  it("枠の位置と曜日が合う(日曜はじまり)", () => {
    for (const week of monthGrid(2026, 8)) {
      week.forEach((cell, i) => {
        if (cell) expect(cell.weekday).toBe(i);
      });
    }
  });

  it("前後の月から日付を借りてこない", () => {
    // 借りると隣の月の休みを今月の休みとして数えてしまう。はみ出しは null にする
    for (let m = 1; m <= 12; m++) {
      const cells = monthGrid(2026, m).flat();
      for (const c of cells) {
        if (c) expect([c.year, c.month], `${m} 月`).toEqual([2026, m]);
      }
      // 先頭の空き枠の数は、1 日の曜日と一致する
      const lead = cells.findIndex((c) => c !== null);
      expect(lead, `${m} 月`).toBe(new Date(2026, m - 1, 1).getDay());
    }
  });
});

describe("月をまたぐ", () => {
  it("年をまたいで数えられる", () => {
    expect(nextMonths(2026, 11, 3)).toEqual([
      { year: 2026, month: 11 },
      { year: 2026, month: 12 },
      { year: 2027, month: 1 },
    ]);
  });

  it("12 月から 12 か月先まで正しく進む", () => {
    const got = nextMonths(2026, 12, 13);
    expect(got[0]).toEqual({ year: 2026, month: 12 });
    expect(got[12]).toEqual({ year: 2027, month: 12 });
  });
});

describe("営業日数", () => {
  it("どの月も少なくとも数日は開いている", () => {
    for (let m = 1; m <= 12; m++) {
      expect(openDaysOfMonth(2026, m), `${m} 月`).toBeGreaterThan(3);
    }
  });

  it("冬期のほうが営業日数が少ない", () => {
    // 冬は月曜も休むので、同じ日数の月なら必ず少なくなる
    const july = openDaysOfMonth(2026, 7); // 31 日・通常期
    const january = openDaysOfMonth(2027, 1); // 31 日・冬期
    expect(january).toBeLessThan(july);
  });
});
