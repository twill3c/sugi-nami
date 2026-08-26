import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { NEWS, findPost, formatDate, neighbours, sortedNews } from "./news";
import { LOCALES } from "@/i18n/locale";

const CONTENT_DIR = path.resolve(__dirname, "../../content/news");

describe("お知らせのデータ", () => {
  it("slug が重複しない", () => {
    const slugs = NEWS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("slug は経路に使える形(小文字と英数字とハイフン)", () => {
    for (const p of NEWS) {
      expect(p.slug, p.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("日付が YYYY-MM-DD で、実在する日", () => {
    for (const p of NEWS) {
      expect(p.date, p.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const [y, m, d] = p.date.split("-").map(Number);
      const parsed = new Date(y, m - 1, d);
      expect(parsed.getFullYear(), p.slug).toBe(y);
      expect(parsed.getMonth() + 1, p.slug).toBe(m);
      expect(parsed.getDate(), p.slug).toBe(d);
    }
  });

  it("すべての記事が両言語ぶんの見出しと要約を持つ", () => {
    for (const p of NEWS) {
      for (const field of ["title", "summary"] as const) {
        for (const locale of LOCALES) {
          expect(p[field][locale].trim().length, `${p.slug}.${field}.${locale}`)
            .toBeGreaterThan(0);
        }
        expect(p[field].en, `${p.slug}.${field}`).not.toMatch(/[぀-ヿ一-龯]/);
      }
    }
  });
});

describe("本文のファイル", () => {
  it("記事ごと・言語ごとに mdx がある", () => {
    const files = readdirSync(CONTENT_DIR);
    for (const p of NEWS) {
      for (const locale of LOCALES) {
        const expected = `${p.date}-${p.slug}.${locale}.mdx`;
        expect(files, expected).toContain(expected);
      }
    }
  });

  it("置いてある mdx に、一覧に載っていないものが無い", () => {
    // 消し忘れの原稿が本番に混ざるのを防ぐ
    const listed = NEWS.flatMap((p) =>
      LOCALES.map((l) => `${p.date}-${p.slug}.${l}.mdx`),
    );
    const orphans = readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".mdx"))
      .filter((f) => !listed.includes(f));
    expect(orphans).toEqual([]);
  });

  it("本文が空でなく、見出しを一つ以上持つ", () => {
    for (const p of NEWS) {
      for (const locale of LOCALES) {
        const file = path.join(CONTENT_DIR, `${p.date}-${p.slug}.${locale}.mdx`);
        const text = readFileSync(file, "utf8");
        expect(text.trim().length, file).toBeGreaterThan(200);
        expect(text, file).toMatch(/^## /m);
      }
    }
  });

  it("英語の本文に日本語が残っていない", () => {
    for (const p of NEWS) {
      const file = path.join(CONTENT_DIR, `${p.date}-${p.slug}.en.mdx`);
      expect(readFileSync(file, "utf8"), file).not.toMatch(/[぀-ヿ一-龯]/);
    }
  });

  it("本文内のリンクが、その言語の経路を指している", () => {
    // 日本語の記事から /en/... へ、英語の記事から日本語の経路へ飛ばさない
    for (const p of NEWS) {
      const ja = readFileSync(
        path.join(CONTENT_DIR, `${p.date}-${p.slug}.ja.mdx`),
        "utf8",
      );
      for (const [, href] of ja.matchAll(/\]\((\/[^)]*)\)/g)) {
        expect(href.startsWith("/en"), `ja の ${p.slug} → ${href}`).toBe(false);
      }
      const en = readFileSync(
        path.join(CONTENT_DIR, `${p.date}-${p.slug}.en.mdx`),
        "utf8",
      );
      for (const [, href] of en.matchAll(/\]\((\/[^)]*)\)/g)) {
        expect(href.startsWith("/en"), `en の ${p.slug} → ${href}`).toBe(true);
      }
    }
  });
});

describe("並べ替えと前後", () => {
  it("新しい順に並ぶ", () => {
    const dates = sortedNews().map((p) => p.date);
    expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates);
  });

  it("いちばん新しい記事に「新しいほう」は無い", () => {
    const newest = sortedNews()[0];
    expect(neighbours(newest.slug).newer).toBeUndefined();
    expect(neighbours(newest.slug).older?.slug).toBe(sortedNews()[1].slug);
  });

  it("いちばん古い記事に「古いほう」は無い", () => {
    const list = sortedNews();
    const oldest = list[list.length - 1];
    expect(neighbours(oldest.slug).older).toBeUndefined();
  });

  it("前後をたどると全記事を一度ずつ通る", () => {
    const list = sortedNews();
    let cur = list[0];
    const walked = [cur.slug];
    for (;;) {
      const next = neighbours(cur.slug).older;
      if (!next) break;
      walked.push(next.slug);
      cur = next;
    }
    expect(walked).toEqual(list.map((p) => p.slug));
  });

  it("知らない slug では前後とも空になる", () => {
    expect(neighbours("nai-kiji")).toEqual({});
    expect(findPost("nai-kiji")).toBeUndefined();
  });
});

describe("日付の表示", () => {
  it("言語ごとの書き方になる", () => {
    expect(formatDate("2026-08-20", "ja")).toBe("2026 年 8 月 20 日");
    expect(formatDate("2026-08-20", "en")).toBe("20 August 2026");
  });

  it("一桁の月日でゼロ埋めが残らない(日本語)", () => {
    expect(formatDate("2026-02-01", "ja")).toBe("2026 年 2 月 1 日");
  });
});
