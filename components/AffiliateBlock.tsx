"use client";
import type { PlatformId } from "@/lib/platforms";

const SLOTS: Record<
  PlatformId | "default",
  { title: string; desc: string; href: string; cta: string }
> = {
  amazon: {
    title: "Keepa で価格推移をチェック",
    desc: "Amazon の価格・ランキング履歴を確認して仕入れの精度を上げる。",
    href: "https://keepa.com/",
    cta: "Keepa を見る",
  },
  mercari: {
    title: "メルカリ売れ行きリサーチに",
    desc: "売れた価格・回転率を一覧で確認できる外部ツール。",
    href: "https://www.mercari.com/jp/",
    cta: "メルカリを開く",
  },
  rakuma: {
    title: "ラクマで在庫を比較",
    desc: "ラクマの相場と回転率を確認して仕入れ判断に活用。",
    href: "https://fril.jp/",
    cta: "ラクマを開く",
  },
  yahoo: {
    title: "Yahoo!フリマで類似品を確認",
    desc: "同カテゴリの売れ筋・相場をチェック。",
    href: "https://paypayfleamarket.yahoo.co.jp/",
    cta: "Yahoo!フリマを開く",
  },
  default: {
    title: "もっと深く分析する",
    desc: "外部ツールと組み合わせると判断精度が上がります。",
    href: "https://keepa.com/",
    cta: "Keepa を見る",
  },
};

export default function AffiliateBlock({ platform }: { platform: PlatformId }) {
  const slot = SLOTS[platform] ?? SLOTS.default;
  return (
    <a
      href={slot.href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="block rounded-xl2 bg-white border border-ink-100 p-5 hover:border-ink-900 hover:shadow-card transition-all duration-200 group"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-ink-900 text-white flex items-center justify-center text-[18px] font-semibold flex-shrink-0">
          ↗
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold text-ink-300 uppercase tracking-wider">
              関連ツール
            </span>
          </div>
          <div className="text-[14px] font-semibold text-ink-900 group-hover:underline">
            {slot.title}
          </div>
          <div className="text-[12px] text-ink-500 mt-1 leading-relaxed">{slot.desc}</div>
          <div className="text-[12px] font-semibold text-ink-700 mt-2">{slot.cta} →</div>
        </div>
      </div>
    </a>
  );
}
