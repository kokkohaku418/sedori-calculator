"use client";
import { type CalcResult, formatPercent, formatYen } from "@/lib/calc";
import { useAnimatedNumber } from "@/lib/useAnimatedNumber";

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-ink-50 p-4">
      <div className="text-[11px] font-semibold text-ink-500 mb-1.5 uppercase tracking-wider">
        {label}
      </div>
      <div
        className={`tabular text-[20px] sm:text-[22px] font-semibold leading-none transition-colors duration-300 ${
          accent ?? "text-ink-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default function ResultCard({ result }: { result: CalcResult }) {
  const profit = useAnimatedNumber(result.profit);
  const margin = useAnimatedNumber(result.marginRate);
  const breakEven = useAnimatedNumber(result.breakEvenPrice);
  const fee = useAnimatedNumber(result.feeAmount);

  const positive = result.profit >= 0;
  const state: "idle" | "pos" | "neg" = !result.valid
    ? "idle"
    : positive
    ? "pos"
    : "neg";

  const profitColor =
    state === "idle"
      ? "text-ink-300"
      : state === "pos"
      ? "text-emerald-600"
      : "text-red-500";

  const accentBar =
    state === "pos"
      ? "from-emerald-300 via-emerald-500 to-emerald-300"
      : state === "neg"
      ? "from-red-300 via-red-500 to-red-300"
      : "from-ink-100 via-ink-100 to-ink-100";

  return (
    <div className="relative rounded-xl2 bg-white shadow-card overflow-hidden">
      <div
        className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${accentBar} transition-[background] duration-500`}
      />

      <div className="p-7 sm:p-9">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-semibold text-ink-500 uppercase tracking-[0.08em]">
            利益
          </span>
          {result.valid && (
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors duration-300 ${
                positive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  positive ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              {positive ? "黒字" : "赤字"}
            </span>
          )}
        </div>

        <div
          className={`tabular text-[44px] sm:text-[56px] font-semibold tracking-tight leading-none transition-colors duration-300 ${profitColor}`}
        >
          {formatYen(profit)}
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <Stat
            label="利益率"
            value={formatPercent(margin)}
            accent={profitColor}
          />
          <Stat label="損益分岐" value={formatYen(breakEven)} />
        </div>

        <div className="mt-6 pt-5 border-t border-ink-100">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-ink-500">プラットフォーム手数料</span>
            <span className="tabular font-semibold text-ink-700">
              {formatYen(fee)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
