import type { L10n } from "@/i18n/locale";
import {
  SHOP,
  periodOfMonth,
  type AnnualClosure,
  type Weekday,
} from "@/data/shop";

/**
 * 営業日の計算。
 *
 * 曜日と期間の規則は shop.ts が持っている。ここはその規則を日付に当てるだけで、
 * 「何曜が休み」をもう一度書かない。年をまたぐ休み(年末年始)があるので、
 * 区間の判定は月日を数値化して比べる。
 */

export type DayState =
  /** 開いている */
  | "open"
  /** 定休(曜日による休み) */
  | "regular"
  /** 毎年の休み(年末年始など) */
  | "annual";

export type Day = {
  year: number;
  month: number;
  day: number;
  weekday: Weekday;
  state: DayState;
  /** annual のときだけ理由が付く */
  reason?: L10n;
};

/** 月日を 1 月 1 日 = 101 のような数にして、区間の比較をしやすくする */
function md(month: number, day: number): number {
  return month * 100 + day;
}

/**
 * 毎年の休みに当たるか。
 * `from > to` の区間(12/29 → 1/3)は年をまたぐので、内と外が入れかわる。
 */
export function matchesClosure(
  c: AnnualClosure,
  month: number,
  day: number,
): boolean {
  const from = md(c.from.month, c.from.day);
  const to = md(c.to.month, c.to.day);
  const x = md(month, day);
  return from <= to ? x >= from && x <= to : x >= from || x <= to;
}

export function dayState(year: number, month: number, day: number): Day {
  const weekday = new Date(year, month - 1, day).getDay() as Weekday;

  const closure = SHOP.annualClosures.find((c) =>
    matchesClosure(c, month, day),
  );
  if (closure) {
    return { year, month, day, weekday, state: "annual", reason: closure.reason };
  }

  const period = periodOfMonth(month);
  const open = period.days.includes(weekday);
  return { year, month, day, weekday, state: open ? "open" : "regular" };
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * カレンダーの升目。日曜はじまりの週の配列を返す。
 * 前後の月にはみ出す枠は null にして、日付を借りてこない
 * (借りると「隣の月の休み」を今月の休みとして数えてしまう)。
 */
export function monthGrid(year: number, month: number): (Day | null)[][] {
  const total = daysInMonth(year, month);
  const lead = new Date(year, month - 1, 1).getDay();

  const cells: (Day | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= total; d++) cells.push(dayState(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/** その月に開けている日数 */
export function openDaysOfMonth(year: number, month: number): number {
  let n = 0;
  for (let d = 1; d <= daysInMonth(year, month); d++) {
    if (dayState(year, month, d).state === "open") n++;
  }
  return n;
}

/** 今月から数えて n か月ぶんの (年, 月) を返す。年またぎを吸収する */
export function nextMonths(
  year: number,
  month: number,
  n: number,
): { year: number; month: number }[] {
  return Array.from({ length: n }, (_, i) => {
    const m0 = month - 1 + i;
    return { year: year + Math.floor(m0 / 12), month: (m0 % 12) + 1 };
  });
}
