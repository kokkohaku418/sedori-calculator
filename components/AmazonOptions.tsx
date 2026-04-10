"use client";
import { AMAZON_CATEGORIES } from "@/lib/amazon";

type Props = {
  category: string;
  onCategory: (id: string) => void;
  fba: boolean;
  onFba: (b: boolean) => void;
  weight: string;
  onWeight: (v: string) => void;
  longest: string;
  onLongest: (v: string) => void;
};

export default function AmazonOptions({
  category,
  onCategory,
  fba,
  onFba,
  weight,
  onWeight,
  longest,
  onLongest,
}: Props) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-4 space-y-4 animate-rise">
      <label className="block">
        <span className="block text-[12px] font-semibold text-ink-500 mb-1.5 uppercase tracking-[0.06em]">
          Amazon カテゴリ
        </span>
        <select
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          className="w-full h-[52px] px-4 rounded-2xl bg-white border border-ink-100 text-[15px] font-semibold text-ink-900 outline-none focus:border-ink-900 focus:shadow-ring transition"
        >
          {AMAZON_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}（{c.rate}%）
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center justify-between gap-3 px-1 cursor-pointer select-none">
        <span className="text-[13px] font-semibold text-ink-700">FBA を利用</span>
        <button
          type="button"
          role="switch"
          aria-checked={fba}
          onClick={() => onFba(!fba)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            fba ? "bg-ink-900" : "bg-ink-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              fba ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </label>

      {fba && (
        <div className="grid grid-cols-2 gap-3 animate-rise">
          <label className="block">
            <span className="block text-[11px] font-semibold text-ink-500 mb-1 uppercase tracking-wider">
              重量(g)
            </span>
            <input
              inputMode="numeric"
              value={weight}
              onChange={(e) => onWeight(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="例: 500"
              className="w-full h-12 px-3 rounded-xl bg-white border border-ink-100 text-[15px] font-semibold tabular outline-none focus:border-ink-900 focus:shadow-ring transition"
            />
          </label>
          <label className="block">
            <span className="block text-[11px] font-semibold text-ink-500 mb-1 uppercase tracking-wider">
              長辺(cm)
            </span>
            <input
              inputMode="numeric"
              value={longest}
              onChange={(e) => onLongest(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="例: 30"
              className="w-full h-12 px-3 rounded-xl bg-white border border-ink-100 text-[15px] font-semibold tabular outline-none focus:border-ink-900 focus:shadow-ring transition"
            />
          </label>
        </div>
      )}
    </div>
  );
}
