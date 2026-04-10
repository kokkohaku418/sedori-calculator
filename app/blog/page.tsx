import Link from "next/link";
import type { Metadata } from "next";
import { POSTS } from "@/content/posts";

export const metadata: Metadata = {
  title: "ブログ｜せどり利益計算ツール",
  description: "せどり・フリマ販売の手数料・利益計算ノウハウを発信します。",
};

export default function BlogIndex() {
  return (
    <main className="min-h-dvh">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-16">
        <header className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink-500 hover:text-ink-900 transition mb-4"
          >
            ← 計算ツールに戻る
          </Link>
          <h1 className="text-[34px] sm:text-[44px] font-semibold tracking-tight text-ink-900 leading-[1.1]">
            ブログ
          </h1>
          <p className="mt-3 text-[15px] text-ink-500 leading-relaxed">
            せどり・フリマ販売の手数料、利益計算、判断基準についての記事をまとめています。
          </p>
        </header>

        <ul className="space-y-3">
          {POSTS.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="block rounded-xl2 bg-white shadow-card p-6 sm:p-7 hover:shadow-lg transition group"
              >
                <div className="text-[11px] text-ink-300 font-semibold tabular mb-2">
                  {p.date}
                </div>
                <div className="text-[18px] sm:text-[20px] font-semibold text-ink-900 group-hover:underline leading-snug">
                  {p.title}
                </div>
                <p className="mt-2 text-[13px] text-ink-500 leading-relaxed">
                  {p.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
