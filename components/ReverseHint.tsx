"use client";
import { useState } from "react";
import { reversePrice, formatYen } from "@/lib/calc";

type Props = {
  cost: number;
  shipping: number;
  feeRate: number;
  fixedCost: number;
  extraFee: number;
};

export default function ReverseHint({ cost, shipping, feeRate, fixedCost, extraFee }: Props) {
  const [target, setTarget] = useState("30");
  const t = Number(target) || 0;
  const price = reversePrice({
    cost,
    shipping,
    feeRate,
    fixedCost,
    extraFee,
    targetMarginPct: t,
  });
  const ok = Number.isFinite(price) && cost > 0;

  return (
    <div className="rounded-2xl bg-ink-50 p-4 border border-ink-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
          目標利益率から逆算
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <input
            inputMode="numeric"
            value={target}
            onChange={(e) => setTarget(e.target.value.replace(/[^\d]/g, ""))}
            className="w-14 h-10 px-2 rounded-xl bg-white border border-ink-100 text-[16px] font-semibold tabular text-center outline-none focus:border-ink-900 focus:shadow-ring transition"
          />
          <span className="text-[13px] font-semibold text-ink-700">%</span>
        </div>
        <span className="text-ink-300">→</span>
        <div className="flex-1 text-right">
          <div className="text-[11px] text-ink-500">推奨販売価格</div>
          <div
            className={`tabular text-[20px] font-semibold leading-none ${
              ok ? "text-ink-900" : "text-ink-300"
            }`}
          >
            {ok ? formatYen(price) : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
