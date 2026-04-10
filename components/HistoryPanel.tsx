"use client";
import { type HistoryEntry } from "@/lib/useHistory";
import { getPlatform } from "@/lib/platforms";
import { formatYen, formatPercent, type Verdict } from "@/lib/calc";
import VerdictBadge from "./VerdictBadge";

type Props = {
  items: HistoryEntry[];
  stats: { total: number; ok: number; warn: number; ng: number };
  onLoad: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
};

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "たった今";
  if (m < 60) return `${m}分前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}時間前`;
  const d = Math.floor(h / 24);
  return `${d}日前`;
}

export default function HistoryPanel({ items, stats, onLoad, onRemove, onClear }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl2 bg-white shadow-card p-8 text-center">
        <div className="text-[40px] mb-2">📋</div>
        <div className="text-[14px] font-semibold text-ink-700">履歴はまだありません</div>
        <p className="mt-2 text-[12px] text-ink-500 leading-relaxed">
          計算したら結果カードの「履歴に保存」を押すと、ここに最大 50 件まで残ります。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <StatChip label="OK" value={stats.ok} tone="emerald" />
        <StatChip label="微妙" value={stats.warn} tone="amber" />
        <StatChip label="NG" value={stats.ng} tone="red" />
      </div>

      <div className="rounded-xl2 bg-white shadow-card overflow-hidden">
        <div className="max-h-[460px] overflow-y-auto divide-y divide-ink-100">
          {items.map((it) => {
            const platform = getPlatform(it.platform);
            return (
              <div
                key={it.id}
                className="flex items-center gap-3 p-4 hover:bg-ink-50 transition-colors group"
              >
                <button
                  type="button"
                  onClick={() => onLoad(it)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <VerdictBadge verdict={it.verdict as Verdict} size="sm" />
                    <span className="text-[11px] font-semibold text-ink-500">
                      {platform.shortName}
                    </span>
                    <span className="text-[11px] text-ink-300">{timeAgo(it.createdAt)}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`tabular text-[16px] font-semibold ${
                        it.profit >= 0 ? "text-ink-900" : "text-red-500"
                      }`}
                    >
                      {formatYen(it.profit)}
                    </span>
                    <span className="text-[11px] text-ink-500 tabular">
                      {formatPercent(it.marginRate)}
                    </span>
                    <span className="text-[11px] text-ink-300 tabular ml-auto">
                      {formatYen(it.cost)} → {formatYen(it.price)}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(it.id)}
                  aria-label="削除"
                  className="opacity-0 group-hover:opacity-100 text-ink-300 hover:text-red-500 transition w-7 h-7 rounded-full flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="w-full h-10 rounded-xl text-[12px] font-semibold text-ink-500 hover:text-red-500 transition"
      >
        履歴をすべて削除
      </button>
    </div>
  );
}

function StatChip({ label, value, tone }: { label: string; value: number; tone: "emerald" | "amber" | "red" }) {
  const cls =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700"
      : "bg-red-50 text-red-600";
  return (
    <div className={`rounded-xl px-3 py-2 ${cls}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{label}</div>
      <div className="text-[18px] font-semibold tabular leading-none mt-1">{value}</div>
    </div>
  );
}
